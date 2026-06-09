export interface Evidencia {
  _id?: string;
  id?: string;
  paqueteId: string;
  numeroGuia: string;
  tipoEvidencia: string;
  descripcion?: string;
  rutaArchivo?: string;
  reportadoPorId: string;
  fechaReporte?: string;
}
