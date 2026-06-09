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
