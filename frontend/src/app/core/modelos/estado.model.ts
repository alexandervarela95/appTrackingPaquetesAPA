// Modelo de estado: define la forma de los datos persistidos y sus tipos principales.
export interface Estado {
  _id?: string;
  id?: string;
  nombre: string;
  descripcion?: string;
  orden: number;
  estado?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
