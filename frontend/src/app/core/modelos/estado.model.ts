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
