export const DEPARTAMENTOS_DANE: Record<string, string> = {
  "05": "Antioquia", "08": "Atlántico", "11": "Bogotá D.C.",
  "13": "Bolívar", "15": "Boyacá", "17": "Caldas", "18": "Caquetá",
  "19": "Cauca", "20": "Cesar", "23": "Córdoba", "25": "Cundinamarca",
  "27": "Chocó", "41": "Huila", "44": "La Guajira", "47": "Magdalena",
  "50": "Meta", "52": "Nariño", "54": "Norte de Santander", "63": "Quindío",
  "66": "Risaralda", "68": "Santander", "70": "Sucre", "73": "Tolima",
  "76": "Valle del Cauca", "81": "Arauca", "85": "Casanare", "86": "Putumayo",
  "88": "San Andrés y Providencia", "91": "Amazonas", "94": "Guainía",
  "95": "Guaviare", "97": "Vaupés", "99": "Vichada",
};

// slug normalizado → prefijos DANE de 5 dígitos (dept+municipio)
export const CIUDADES_DANE: Record<string, string[]> = {
  "medellin": ["05001"], "bogota": ["11001"], "cali": ["76001"],
  "barranquilla": ["08001"], "cartagena": ["13001"], "bucaramanga": ["68001"],
  "manizales": ["17001"], "pereira": ["66001"], "ibague": ["73001"],
  "villavicencio": ["50001"], "cucuta": ["54001"], "pasto": ["52001"],
  "monteria": ["23001"], "valledupar": ["20001"], "neiva": ["41001"],
  "riohacha": ["44001"], "sincelejo": ["70001"], "armenia": ["63001"],
  "popayan": ["19001"], "santa marta": ["47001"], "tunja": ["15001"],
  "florencia": ["18001"], "mocoa": ["86001"], "quibdo": ["27001"],
  "leticia": ["91001"], "arauca": ["81001"], "yopal": ["85001"],
  "inirida": ["94001"], "san jose del guaviare": ["95001"],
  "mitu": ["97001"], "puerto carreno": ["99001"],
  "bello": ["05088"], "itagui": ["05360"], "envigado": ["05266"],
  "sabaneta": ["05631"], "copacabana": ["05212"], "girardota": ["05310"],
  "caldas": ["05129"], "la estrella": ["05380"], "rionegro": ["05615"],
  "turbo": ["05837"], "apartado": ["05045"], "caucasia": ["05154"],
  "soacha": ["25754"], "chia": ["25175"], "zipaquira": ["25899"],
  "facatativa": ["25269"], "fusagasuga": ["25307"], "madrid": ["25430"],
  "mosquera": ["25473"], "funza": ["25306"], "girardot": ["25307"],
  "palmira": ["76520"], "buenaventura": ["76109"], "buga": ["76111"],
  "tulua": ["76834"], "floridablanca": ["68276"], "giron": ["68307"],
  "piedecuesta": ["68547"], "barrancabermeja": ["68081"],
  "dosquebradas": ["66170"], "santa rosa de cabal": ["66682"],
  "lorica": ["23417"], "sogamoso": ["15762"], "duitama": ["15244"],
  "chiquinquira": ["15176"], "ocana": ["54498"], "pamplona": ["54518"],
  "tumaco": ["52835"], "ipiales": ["52356"],
  "espinal": ["73268"], "melgar": ["73449"], "honda": ["73349"],
};

export const CIUDADES_DISPLAY: Record<string, string> = {
  "medellin": "Medellín", "bogota": "Bogotá D.C.", "cali": "Cali",
  "barranquilla": "Barranquilla", "cartagena": "Cartagena",
  "bucaramanga": "Bucaramanga", "manizales": "Manizales", "pereira": "Pereira",
  "ibague": "Ibagué", "villavicencio": "Villavicencio", "cucuta": "Cúcuta",
  "pasto": "Pasto", "monteria": "Montería", "valledupar": "Valledupar",
  "neiva": "Neiva", "riohacha": "Riohacha", "sincelejo": "Sincelejo",
  "armenia": "Armenia", "popayan": "Popayán", "santa marta": "Santa Marta",
  "tunja": "Tunja", "florencia": "Florencia", "mocoa": "Mocoa",
  "quibdo": "Quibdó", "leticia": "Leticia", "arauca": "Arauca",
  "yopal": "Yopal", "inirida": "Inírida",
  "san jose del guaviare": "San José del Guaviare",
  "mitu": "Mitú", "puerto carreno": "Puerto Carreño",
  "bello": "Bello", "itagui": "Itagüí", "envigado": "Envigado",
  "sabaneta": "Sabaneta", "copacabana": "Copacabana", "girardota": "Girardota",
  "caldas": "Caldas", "la estrella": "La Estrella", "rionegro": "Rionegro",
  "turbo": "Turbo", "apartado": "Apartadó", "caucasia": "Caucasia",
  "soacha": "Soacha", "chia": "Chía", "zipaquira": "Zipaquirá",
  "facatativa": "Facatativá", "fusagasuga": "Fusagasugá", "madrid": "Madrid",
  "mosquera": "Mosquera", "funza": "Funza", "girardot": "Girardot",
  "palmira": "Palmira", "buenaventura": "Buenaventura", "buga": "Buga",
  "tulua": "Tuluá", "floridablanca": "Floridablanca", "giron": "Girón",
  "piedecuesta": "Piedecuesta", "barrancabermeja": "Barrancabermeja",
  "dosquebradas": "Dosquebradas", "santa rosa de cabal": "Santa Rosa de Cabal",
  "lorica": "Lorica", "sogamoso": "Sogamoso", "duitama": "Duitama",
  "chiquinquira": "Chiquinquirá", "ocana": "Ocaña", "pamplona": "Pamplona",
  "tumaco": "Tumaco", "ipiales": "Ipiales",
  "espinal": "Espinal", "melgar": "Melgar", "honda": "Honda",
};

export function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function buildHierarchy() {
  const deptCities: Record<string, { nombre: string; slug: string; dane_prefixes: string[] }[]> = {};

  for (const [slug, prefixes] of Object.entries(CIUDADES_DANE)) {
    const deptCode = prefixes[0].slice(0, 2);
    const deptName = DEPARTAMENTOS_DANE[deptCode];
    if (!deptName) continue;
    if (!deptCities[deptName]) deptCities[deptName] = [];
    if (!deptCities[deptName].find((c) => c.slug === slug)) {
      deptCities[deptName].push({
        nombre: CIUDADES_DISPLAY[slug] ?? slug,
        slug,
        dane_prefixes: prefixes,
      });
    }
  }

  return Object.entries(deptCities)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([nombre, ciudades]) => ({
      nombre,
      ciudades: ciudades.sort((a, b) => a.nombre.localeCompare(b.nombre)),
    }));
}
