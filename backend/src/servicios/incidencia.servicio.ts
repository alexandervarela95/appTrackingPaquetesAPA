// Servicio de incidencia: concentra la regla de negocio y las operaciones de datos reutilizables.
import { IncidenciaModelo } from '../modelos/incidencia.model';

// Servicio de incidencias. Guarda problemas reales asociados a una guia.
export class IncidenciaServicio {
  public static async listarIncidencias() {
    return IncidenciaModelo.find().lean();
  }

  public static async obtenerIncidenciaPorId(id: string) {
    return IncidenciaModelo.findById(id).lean();
  }

  public static async crearIncidencia(datos: any) {
    // Por defecto una incidencia nace abierta para que aparezca como pendiente en dashboard.
    const incidencia = new IncidenciaModelo({
      paqueteId: datos.paqueteId,
      numeroGuia: datos.numeroGuia,
      tipoIncidencia: datos.tipoIncidencia,
      descripcion: datos.descripcion || '',
      estadoIncidencia: datos.estadoIncidencia || 'abierta',
      reportadoPorId: datos.reportadoPorId,
      fechaReporte: datos.fechaReporte || new Date(),
      fechaCierre: datos.fechaCierre
    });
    return incidencia.save();
  }

  public static async actualizarIncidencia(id: string, datos: any) {
    return IncidenciaModelo.findByIdAndUpdate(
      id,
      {
        tipoIncidencia: datos.tipoIncidencia,
        descripcion: datos.descripcion,
        estadoIncidencia: datos.estadoIncidencia,
        fechaCierre: datos.fechaCierre,
      },
      { new: true }
    ).lean();
  }

  public static async eliminarIncidencia(id: string) {
    return IncidenciaModelo.findByIdAndDelete(id).lean();
  }
}
