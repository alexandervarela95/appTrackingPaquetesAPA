// Servicio de reporte: concentra la regla de negocio y las operaciones de datos reutilizables.
import { IncidenciaModelo } from '../modelos/incidencia.model';
import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingModelo } from '../modelos/tracking.model';

interface FiltrosReporte {
  fechaInicio?: string;
  fechaFin?: string;
  estadoId?: string;
  lugarOrigenId?: string;
  lugarDestinoId?: string;
  motoristaId?: string;
  prioridad?: string;
  estadoIncidencia?: string;
}

// Arma filtros de fecha reutilizables para no repetir la misma condicion en cada reporte.
const filtroFechas = (campo: string, filtros: FiltrosReporte): Record<string, unknown> => {
  if (!filtros.fechaInicio && !filtros.fechaFin) return {};
  return {
    [campo]: {
      ...(filtros.fechaInicio ? { $gte: new Date(filtros.fechaInicio) } : {}),
      ...(filtros.fechaFin ? { $lte: new Date(filtros.fechaFin) } : {}),
    },
  };
};

// Reportes simples para administracion. Salen de MongoDB y respetan filtros opcionales.
export class ReporteServicio {
  public static async paquetesPorEstado(filtros: FiltrosReporte) {
    // Agrupamos por estado para mostrar cuantos paquetes hay en cada etapa.
    return PaqueteModelo.aggregate([
      {
        $match: {
          estado: true,
          ...(filtros.estadoId ? { estadoActualId: filtros.estadoId } : {}),
          ...(filtros.lugarOrigenId ? { lugarOrigenId: filtros.lugarOrigenId } : {}),
          ...(filtros.lugarDestinoId ? { lugarDestinoId: filtros.lugarDestinoId } : {}),
          ...(filtros.motoristaId ? { motoristaAsignadoId: filtros.motoristaId } : {}),
          ...(filtros.prioridad ? { prioridad: filtros.prioridad } : {}),
          ...filtroFechas('fechaCreacion', filtros),
        },
      },
      { $group: { _id: '$estadoActualId', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
  }

  public static async incidencias(filtros: FiltrosReporte) {
    return IncidenciaModelo.find({
      ...(filtros.estadoIncidencia ? { estadoIncidencia: filtros.estadoIncidencia } : {}),
      ...filtroFechas('fechaReporte', filtros),
    }).sort({ fechaReporte: -1 }).lean();
  }

  public static async actividad(filtros: FiltrosReporte) {
    return TrackingModelo.find(filtroFechas('fechaEvento', filtros)).sort({ fechaEvento: -1 }).limit(100).lean();
  }
}
