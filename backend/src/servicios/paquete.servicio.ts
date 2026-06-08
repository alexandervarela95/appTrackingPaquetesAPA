import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingServicio } from './tracking.servicio';
import { generarNumeroGuia } from '../utilidades/generadorCodigo';
import { EstadoModelo } from '../modelos/estado.model';

export class PaqueteServicio {
  public static async listarPaquetes() {
    return PaqueteModelo.find({ estado: true }).lean();
  }

  public static async obtenerPaquetePorId(id: string) {
    return PaqueteModelo.findById(id).lean();
  }

  public static async obtenerPaquetePorGuia(numeroGuia: string) {
    return PaqueteModelo.findOne({ numeroGuia }).lean();
  }

  public static async crearPaquete(datos: any) {
    const numeroGuia = datos.numeroGuia?.trim() || generarNumeroGuia();
    const estadoInicial = await EstadoModelo.findOne({ nombre: 'Creado', estado: true });

    const paquete = new PaqueteModelo({
      numeroGuia,
      descripcion: datos.descripcion || '',
      tipoPaquete: datos.tipoPaquete,
      prioridad: datos.prioridad || 'media',
      estadoActualId: datos.estadoActualId || estadoInicial?._id,
      lugarOrigenId: datos.lugarOrigenId,
      lugarDestinoId: datos.lugarDestinoId,
      usuarioRemitenteId: datos.usuarioRemitenteId,
      usuarioDestinatarioId: datos.usuarioDestinatarioId,
      motoristaAsignadoId: datos.motoristaAsignadoId,
      observaciones: datos.observaciones || ''
    });

    const paqueteGuardado = await paquete.save();

    await TrackingServicio.crearRegistroTracking({
      paqueteId: paqueteGuardado._id,
      numeroGuia: paqueteGuardado.numeroGuia,
      estadoId: paqueteGuardado.estadoActualId,
      descripcion: 'Registro inicial del paquete',
      lugarActualId: paqueteGuardado.lugarOrigenId,
      usuarioResponsableId: paqueteGuardado.usuarioRemitenteId
    });

    return paqueteGuardado;
  }

  public static async actualizarPaquete(id: string, datos: any) {
    const paqueteAnterior = await PaqueteModelo.findById(id);
    if (!paqueteAnterior) {
      return null;
    }

    const cambios: any = {
      descripcion: datos.descripcion ?? paqueteAnterior.descripcion,
      tipoPaquete: datos.tipoPaquete ?? paqueteAnterior.tipoPaquete,
      prioridad: datos.prioridad ?? paqueteAnterior.prioridad,
      estadoActualId: datos.estadoActualId ?? paqueteAnterior.estadoActualId,
      lugarOrigenId: datos.lugarOrigenId ?? paqueteAnterior.lugarOrigenId,
      lugarDestinoId: datos.lugarDestinoId ?? paqueteAnterior.lugarDestinoId,
      usuarioRemitenteId: datos.usuarioRemitenteId ?? paqueteAnterior.usuarioRemitenteId,
      usuarioDestinatarioId: datos.usuarioDestinatarioId ?? paqueteAnterior.usuarioDestinatarioId,
      motoristaAsignadoId: datos.motoristaAsignadoId ?? paqueteAnterior.motoristaAsignadoId,
      observaciones: datos.observaciones ?? paqueteAnterior.observaciones,
      estado: datos.estado !== undefined ? datos.estado : paqueteAnterior.estado,
      fechaActualizacion: new Date()
    };

    const paqueteActualizado = await PaqueteModelo.findByIdAndUpdate(id, cambios, { new: true }).lean();

    if (paqueteActualizado && datos.estadoActualId && datos.estadoActualId.toString() !== paqueteAnterior.estadoActualId.toString()) {
      await TrackingServicio.crearRegistroTracking({
        paqueteId: paqueteActualizado._id,
        numeroGuia: paqueteActualizado.numeroGuia,
        estadoId: paqueteActualizado.estadoActualId,
        descripcion: datos.descripcion || 'Actualizacion de estado del paquete',
        lugarActualId: paqueteActualizado.lugarDestinoId,
        usuarioResponsableId: datos.usuarioResponsableId
      });
    }

    return paqueteActualizado;
  }

  public static async eliminarPaquete(id: string) {
    return PaqueteModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).lean();
  }
}
