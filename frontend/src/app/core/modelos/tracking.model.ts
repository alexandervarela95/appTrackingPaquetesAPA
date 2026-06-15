// Modelo de tracking: define la forma de los datos persistidos y sus tipos principales.
export interface Tracking {
  _id?: string;
  id?: string;
  paqueteId: string;
  numeroGuia: string;
  estadoId: string;
  descripcion?: string;
  lugarActualId?: string;
  usuarioResponsableId?: string;
  fechaEvento?: string;
  fechaCreacion?: string;
}
