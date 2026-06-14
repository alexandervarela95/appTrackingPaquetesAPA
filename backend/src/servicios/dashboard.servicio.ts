import { EstadoModelo } from '../modelos/estado.model';
import { PaqueteModelo } from '../modelos/paquete.model';
import { IncidenciaModelo } from '../modelos/incidencia.model';
import { EvidenciaModelo } from '../modelos/evidencia.model';
import { obtenerClienteRedis } from '../config/conexionRedis';

const CLAVE_RESUMEN = 'dashboard:resumen';

// Esto alimenta las tarjetas del dashboard con datos reales de MongoDB.
export class DashboardServicio {
  public static async obtenerResumen() {
    const clienteRedis = obtenerClienteRedis();
    const contenidoCache = await clienteRedis.get(CLAVE_RESUMEN);

    if (contenidoCache) {
      // El resumen puede cachearse poquito porque cambia cuando se crean o actualizan paquetes.
      return JSON.parse(contenidoCache);
    }

    const estados = await EstadoModelo.find({ estado: true }).lean();
    const paquetesActivos = await PaqueteModelo.countDocuments({ estado: true });
    const incidenciasAbiertas = await IncidenciaModelo.countDocuments({ estadoIncidencia: 'abierta' });
    const evidenciasRecientes = await EvidenciaModelo.countDocuments();
    const conteoPorEstado = await PaqueteModelo.aggregate([
      { $match: { estado: true } },
      { $group: { _id: '$estadoActualId', total: { $sum: 1 } } }
    ]);

    const resumen = {
      totalEstados: estados.length,
      paquetesActivos,
      incidenciasAbiertas,
      evidenciasRegistradas: evidenciasRecientes,
      paquetesPorEstado: conteoPorEstado
    };

    await clienteRedis.set(CLAVE_RESUMEN, JSON.stringify(resumen), { EX: 20 });

    return resumen;
  }
}
