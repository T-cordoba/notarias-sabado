import * as cheerio from "cheerio";
import { DEPARTAMENTOS_DANE, CIUDADES_DANE, normalize } from "./dane";
import type { Notaria } from "@/types/notaria";

// El portal usa una CA intermedia colombiana no incluida en el bundle de Node.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const URL_PORTAL = "https://www.supernotariado.gov.co/notarias-sabado/";

const HEADERS: Record<string, string> = {
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: URL_PORTAL,
  Origin: "https://www.supernotariado.gov.co",
  Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-CO,es;q=0.9",
};

// Cache en memoria (válido mientras la función serverless esté caliente)
const _cache = new Map<string, { data: Notaria[]; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

const MAPS_RE = /maps\.google\.|google\.com\/maps|goo\.gl\/maps|maps\?q=/i;

// ──────────────────────────────────────────────────────────────
// DOM helpers (usan `any` para los nodos internos de domhandler)
// ──────────────────────────────────────────────────────────────

function fixMojibake(text: string): string {
  // Detecta bytes UTF-8 mal interpretados como latin-1 (ej: "Ã¡" → "á").
  // Solo intenta la corrección si hay caracteres típicos del artefacto (0xC0-0xCF).
  if (!/[\xC0-\xCF]/.test(text)) return text;
  try {
    const bytes = Uint8Array.from(text, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return text; // no era UTF-8 válido, devuelve el original
  }
}

function clean(text: string): string {
  return fixMojibake(text.replace(/\s+/g, " ").trim());
}

/**
 * Recorre los nodos hermanos que siguen a un <b> hasta el próximo <b>.
 * Usa `.next` del nodo DOM directamente para capturar nodos de texto.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textAfterB($: cheerio.CheerioAPI, bEl: any): string {
  const parts: string[] = [];
  let node = bEl.next;
  while (node) {
    if (node.type === "tag" && node.name === "b") break;
    if (node.type === "tag" && node.name !== "br") {
      parts.push($(node).text().trim());
    } else if (node.type === "text") {
      const t = (node.data ?? "").trim();
      if (t) parts.push(t);
    }
    node = node.next;
  }
  return parts.filter(Boolean).join(" ").trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseModal($: cheerio.CheerioAPI, modal: any): Notaria | null {
  const $modal = $(modal);
  const result: Notaria = {
    nombre: "", codigo_dane: "", correo: "", direccion: "",
    telefono: "", horario: "", maps_url: "", departamento: "",
  };

  // DANE desde el id del div  →  id="modal_050010008"
  const id = ($modal.attr("id") ?? "") as string;
  if (id.startsWith("modal_")) result.codigo_dane = id.slice("modal_".length);

  result.nombre = clean($modal.find(".modal-title-govco").first().text());

  if (!result.codigo_dane) {
    const m = $modal.find(".modal-subtitle-govco").first().text().match(/\d{5,12}/);
    if (m) result.codigo_dane = m[0];
  }

  if (result.codigo_dane.length >= 2) {
    result.departamento = DEPARTAMENTOS_DANE[result.codigo_dane.slice(0, 2)] ?? "";
  }

  const body = $modal.find(".modal-text-govco").first();

  // Correo preferido: enlace mailto
  const emailEl = body.find('a[href^="mailto:"]').first();
  if (emailEl.length) result.correo = clean(emailEl.text());

  // Maps — busca en el modal completo (el link está en .modal-footer-govco)
  $modal.find("a").each((_: number, a: any) => {
    const href = ($(a).attr("href") ?? "") as string;
    if (MAPS_RE.test(href)) {
      result.maps_url = href;
      return false; // break
    }
  });

  // Campos etiquetados con <b>Etiqueta:</b>
  body.find("b").each((_: number, bEl: any) => {
    const label = normalize($(bEl).text().trim().replace(/:$/, ""));
    const content = clean(textAfterB($, bEl));
    if (!content) return;

    if (["correo", "email", "mail"].some((w) => label.includes(w))) {
      if (!result.correo) result.correo = content;
    } else if (label.includes("direcc")) {
      result.direccion = content;
    } else if (label.includes("tel") || label.includes("fono")) {
      result.telefono = content;
    } else if (label.includes("horario")) {
      result.horario = content;
    }
  });

  return result.nombre || result.codigo_dane ? result : null;
}

function parseAll(html: string): Notaria[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const notarias: Notaria[] = [];

  $(".container-modal-govco").each((_: number, modal: any) => {
    const data = parseModal($, modal);
    if (!data) return;
    const key = data.codigo_dane || data.nombre;
    if (seen.has(key)) return;
    seen.add(key);
    notarias.push(data);
  });

  return notarias;
}

// ──────────────────────────────────────────────────────────────
// API pública
// ──────────────────────────────────────────────────────────────

export async function scrapeNotarias(fecha: string): Promise<Notaria[]> {
  const cached = _cache.get(fecha);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const res = await fetch(URL_PORTAL, {
    method: "POST",
    headers: HEADERS,
    body: `r=${fecha}`,
  });

  if (!res.ok) throw new Error(`Supernotariado respondió ${res.status}`);

  const data = parseAll(await res.text());
  _cache.set(fecha, { data, ts: Date.now() });
  return data;
}

export function filterByDepartamento(notarias: Notaria[], departamento: string): Notaria[] {
  const norm = normalize(departamento);
  return notarias.filter((n) => normalize(n.departamento) === norm);
}

export function filterByCiudad(notarias: Notaria[], ciudad: string): Notaria[] {
  const prefixes = CIUDADES_DANE[ciudad] ?? [];
  return notarias.filter((n) => {
    if (prefixes.length && n.codigo_dane.length >= 5) {
      return prefixes.some((p) => n.codigo_dane.startsWith(p));
    }
    const pattern = new RegExp(
      `\\b${ciudad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"
    );
    return pattern.test(normalize(n.nombre));
  });
}
