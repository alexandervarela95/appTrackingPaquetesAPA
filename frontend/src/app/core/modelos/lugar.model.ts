// Modelo de lugar: define la forma de los datos persistidos y sus tipos principales.
export interface Lugar {
  _id?: string;
  id?: string;
  nombre: string;
  descripcion?: string;
  ciudad: string;
  direccion: string;
  estado?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
