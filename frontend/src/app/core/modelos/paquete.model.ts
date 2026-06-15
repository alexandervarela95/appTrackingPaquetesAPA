// Modelo de paquete: define la forma de los datos persistidos y sus tipos principales.
export interface Paquete {
  _id?: string;
  id?: string;
  numeroGuia: string;
  descripcion?: string;
  tipoPaquete: string;
  prioridad: string;
  estadoActualId: string;
  lugarOrigenId: string;
  lugarDestinoId: string;
  usuarioRemitenteId: string;
  usuarioDestinatarioId: string;
  motoristaAsignadoId?: string;
  observaciones?: string;
  estado?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
