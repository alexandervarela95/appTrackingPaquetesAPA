// Modelo de incidencia: define la forma de los datos persistidos y sus tipos principales.
export interface Incidencia {
  _id?: string;
  id?: string;
  paqueteId: string;
  numeroGuia: string;
  tipoIncidencia: string;
  descripcion?: string;
  estadoIncidencia: 'abierta' | 'en proceso' | 'cerrada' | string;
  reportadoPorId: string;
  fechaReporte?: string;
  fechaCierre?: string;
}
