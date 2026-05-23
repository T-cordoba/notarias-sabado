export interface Notaria {
  nombre: string;
  codigo_dane: string;
  correo: string;
  direccion: string;
  telefono: string;
  horario: string;
  maps_url: string;
  departamento: string;
}

export interface NotariasResponse {
  fecha: string;
  total: number;
  notarias: Notaria[];
}

export interface Ciudad {
  nombre: string;
  slug: string;
  dane_prefixes: string[];
}

export interface Departamento {
  nombre: string;
  ciudades: Ciudad[];
}
