import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingServicio } from './tracking.servicio';
import { generarNumeroGuia } from '../utilidades/generarNumeroGuia';
import { EstadoModelo } from '../modelos/estado.model';
import { obtenerClienteRedis } from '../config/conexionRedis';

const CLAVE_CACHE_GUIA = (numeroGuia: string) => `paquete:guia:${numeroGuia}`;

export class PaqueteServicio {
  public static async listarPaquetes() {
    return PaqueteModelo.find({ estado: true }).lean();
  }

  public static async obtenerPaquetePorId(id: string) {
    return PaqueteModelo.findById(id).lean();
  }

  public static async obtenerPaquetePorGuia(numeroGuia: string) {
    const clienteRedis = obtenerClienteRedis();
    const clave = CLAVE_CACHE_GUIA(numeroGuia);
    const paqueteCache = await clienteRedis.get(clave);

    if (paqueteCache) {
      return JSON.parse(paqueteCache);
    }

    const paquete = await PaqueteModelo.findOne({ numeroGuia }).lean();
    if (paquete) {
      await clienteRedis.set(clave, JSON.stringify(paquete), { EX: 30 });
    }

    return paquete;
  }

  public static async crearPaquete(datos: any) {
    let numeroGuia = datos.numeroGuia?.trim();

    if (!numeroGuia) {
      numeroGuia = generarNumeroGuia();
    }

    const estadoInicial = await EstadoModelo.findOne({ nombre: 'Creado', estado: true });
    if (!estadoInicial) {
      throw new Error('Estado inicial Creado no encontrado');
    }

    const paquete = new PaqueteModelo({
      numeroGuia,
      descripcion: datos.descripcion || '',
      tipoPaquete: datos.tipoPaquete,
      prioridad: datos.prioridad || 'media',
      estadoActualId: datos.estadoActualId || estadoInicial._id,
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

    const clienteRedis = obtenerClienteRedis();
    await clienteRedis.set(CLAVE_CACHE_GUIA(paqueteGuardado.numeroGuia), JSON.stringify(paqueteGuardado), { EX: 30 });

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

    if (paqueteActualizado) {
      const clienteRedis = obtenerClienteRedis();
      await clienteRedis.set(CLAVE_CACHE_GUIA(paqueteActualizado.numeroGuia), JSON.stringify(paqueteActualizado), { EX: 30 });
    }

    return paqueteActualizado;
  }

  public static async eliminarPaquete(id: string) {
    const paqueteEliminado = await PaqueteModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).lean();
    if (paqueteEliminado) {
      const clienteRedis = obtenerClienteRedis();
      await clienteRedis.del(CLAVE_CACHE_GUIA(paqueteEliminado.numeroGuia));
    }
    return paqueteEliminado;
  }
}
