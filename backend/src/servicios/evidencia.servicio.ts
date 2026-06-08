import { EvidenciaModelo } from '../modelos/evidencia.model';

export class EvidenciaServicio {
  public static async listarEvidencias() {
    return EvidenciaModelo.find().lean();
  }

  public static async obtenerEvidenciaPorId(id: string) {
    return EvidenciaModelo.findById(id).lean();
  }

  public static async crearEvidencia(datos: any) {
    const evidencia = new EvidenciaModelo({
      paqueteId: datos.paqueteId,
      numeroGuia: datos.numeroGuia,
      tipoEvidencia: datos.tipoEvidencia,
      descripcion: datos.descripcion || '',
      rutaArchivo: datos.rutaArchivo || '',
      reportadoPorId: datos.reportadoPorId,
      fechaReporte: datos.fechaReporte || new Date()
    });
    return evidencia.save();
  }

  public static async eliminarEvidencia(id: string) {
    return EvidenciaModelo.findByIdAndDelete(id).lean();
  }
}
