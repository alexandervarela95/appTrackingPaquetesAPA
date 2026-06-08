import { TrackingModelo } from '../modelos/tracking.model';

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
    return TrackingModelo.find({ paqueteId }).sort({ fechaEvento: 1 }).lean();
  }

  public static async listarTrackingPorGuia(numeroGuia: string) {
    return TrackingModelo.find({ numeroGuia }).sort({ fechaEvento: 1 }).lean();
  }
}
