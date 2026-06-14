import { TrackingModelo } from '../modelos/tracking.model';

// Servicio del historial del paquete. Cada registro cuenta que paso, donde y quien lo hizo.
export class TrackingServicio {
  public static async crearRegistroTracking(datos: any) {
    const registro = new TrackingModelo({
      paqueteId: datos.paqueteId,
      numeroGuia: datos.numeroGuia,
      estadoId: datos.estadoId,
      descripcion: datos.descripcion || '',
      lugarActualId: datos.lugarActualId,
      usuarioResponsableId: datos.usuarioResponsableId,
      fechaEvento: datos.fechaEvento || new Date()
    });
    return registro.save();
  }

  public static async listarTrackingPorPaquete(paqueteId: string) {
    // El historial se ordena de antiguo a reciente para dibujar una linea de tiempo clara.
    return TrackingModelo.find({ paqueteId }).sort({ fechaEvento: 1 }).lean();
  }

  public static async listarTrackingPorGuia(numeroGuia: string) {
    return TrackingModelo.find({ numeroGuia }).sort({ fechaEvento: 1 }).lean();
  }
}
