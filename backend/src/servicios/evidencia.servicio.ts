import { EvidenciaModelo } from '../modelos/evidencia.model';
import { PaqueteModelo } from '../modelos/paquete.model';
import { TokenPayload } from '../middlewares/auth.middleware';
import { AccesoPaqueteServicio } from './accesoPaquete.servicio';
import { storageEvidencias } from './storage.servicio';

// Servicio de evidencias. Une el archivo o comprobante con la guia del paquete.
export class EvidenciaServicio {
  public static async listarEvidencias() {
    return EvidenciaModelo.find().lean();
  }

  public static async listarEvidenciasPorUsuario(usuario: TokenPayload) {
    if (usuario.rol === 'administrador') {
      return this.listarEvidencias();
    }

    // Si no es admin, primero buscamos sus paquetes y luego sus evidencias.
    const paquetes = await PaqueteModelo.find(AccesoPaqueteServicio.construirFiltroPorUsuario(usuario)).select('_id').lean();
    return EvidenciaModelo.find({ paqueteId: { $in: paquetes.map((paquete) => paquete._id) } }).lean();
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
    // Antes de guardar el archivo como evidencia, confirmamos que la guia y el paquete coincidan.
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
      rutaArchivo: storageEvidencias.resolverRutaRelativa(archivo.filename),
      reportadoPorId
    });
  }

  public static async eliminarEvidencia(id: string) {
    return EvidenciaModelo.findByIdAndDelete(id).lean();
  }
}
