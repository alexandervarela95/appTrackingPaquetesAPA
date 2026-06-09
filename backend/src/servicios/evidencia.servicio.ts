import { EvidenciaModelo } from '../modelos/evidencia.model';
import { PaqueteModelo } from '../modelos/paquete.model';

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

  public static async crearEvidenciaConArchivo(datos: any, archivo: Express.Multer.File, reportadoPorId: string) {
    const paquete = await PaqueteModelo.findOne({ _id: datos.paqueteId, numeroGuia: datos.numeroGuia }).lean();
    if (!paquete) {
      const error = new Error('Paquete no encontrado para la evidencia') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    return this.crearEvidencia({
      paqueteId: datos.paqueteId,
      numeroGuia: datos.numeroGuia,
      tipoEvidencia: datos.tipoEvidencia,
      descripcion: datos.descripcion || '',
      rutaArchivo: `uploads/evidencias/${archivo.filename}`,
      reportadoPorId
    });
  }

  public static async eliminarEvidencia(id: string) {
    return EvidenciaModelo.findByIdAndDelete(id).lean();
  }
}
