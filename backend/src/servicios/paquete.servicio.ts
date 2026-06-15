// Servicio de paquete: concentra la regla de negocio y las operaciones de datos reutilizables.
import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingServicio } from './tracking.servicio';
import { generarNumeroGuia } from '../utilidades/generarNumeroGuia';
import { EstadoModelo } from '../modelos/estado.model';
import { obtenerClienteRedis } from '../config/conexionRedis';
import { TokenPayload } from '../middlewares/auth.middleware';
import { AccesoPaqueteServicio } from './accesoPaquete.servicio';
import mongoose, { ClientSession } from 'mongoose';
import { ContadorModelo } from '../modelos/contador.model';

const CLAVE_CACHE_GUIA = (numeroGuia: string) => `paquete:guia:${numeroGuia}`;

// Servicio encargado de manejar los paquetes y su trazabilidad inicial.
export class PaqueteServicio {
  public static async listarPaquetes() {
    return PaqueteModelo.find({ estado: true }).lean();
  }

  public static async listarPaquetesPorUsuario(usuario: TokenPayload) {
    return PaqueteModelo.find({ estado: true, ...AccesoPaqueteServicio.construirFiltroPorUsuario(usuario) }).lean();
  }

  public static async obtenerPaquetePorId(id: string) {
    return PaqueteModelo.findById(id).lean();
  }

  public static async obtenerPaquetePorGuia(numeroGuia: string) {
    numeroGuia = numeroGuia.trim().toUpperCase();
    const clienteRedis = obtenerClienteRedis();
    const clave = CLAVE_CACHE_GUIA(numeroGuia);
    const paqueteCache = await clienteRedis.get(clave);

    if (paqueteCache) {
      // La busqueda por guia se consulta mucho, por eso se cachea por pocos segundos.
      return JSON.parse(paqueteCache);
    }

    const paquete = await PaqueteModelo.findOne({ numeroGuia }).lean();
    if (paquete) {
      await clienteRedis.set(clave, JSON.stringify(paquete), { EX: 30 });
    }

    return paquete;
  }

  public static async crearPaquete(datos: any) {
    const estadoInicial = await EstadoModelo.findOne({ nombre: 'Creado', estado: true });
    if (!estadoInicial) {
      throw new Error('Estado inicial Creado no encontrado');
    }
    await this.sincronizarContadorGuias();

    const paqueteGuardado = await this.guardarPaqueteConTracking(datos, estadoInicial);

    const clienteRedis = obtenerClienteRedis();
    await clienteRedis.set(CLAVE_CACHE_GUIA(paqueteGuardado.numeroGuia), JSON.stringify(paqueteGuardado), { EX: 30 });
    await clienteRedis.del('dashboard:resumen');

    return paqueteGuardado;
  }

  public static async crearPaquetesBulk(datos: any) {
    const estadoInicial = await EstadoModelo.findOne({ nombre: 'Creado', estado: true });
    if (!estadoInicial) {
      throw new Error('Estado inicial Creado no encontrado');
    }
    await this.sincronizarContadorGuias();

    const comunes = {
      prioridad: datos.prioridad || 'media',
      estadoActualId: estadoInicial._id,
      lugarOrigenId: datos.lugarOrigenId,
      lugarDestinoId: datos.lugarDestinoId,
      usuarioRemitenteId: datos.usuarioRemitenteId,
      usuarioDestinatarioId: datos.usuarioDestinatarioId,
      motoristaAsignadoId: datos.motoristaAsignadoId,
    };
    const paquetes = datos.paquetes.map((paquete: any) => ({
      ...comunes,
      tipoPaquete: paquete.tipoPaquete,
      descripcion: paquete.descripcion,
      observaciones: [datos.observacionGeneral, paquete.observaciones].filter(Boolean).join(' | '),
    }));

    const clienteRedis = obtenerClienteRedis();
    const limpiarCache = async (creados: any[]) => {
      await clienteRedis.del('dashboard:resumen');
      await Promise.all(creados.map((paquete) => clienteRedis.set(CLAVE_CACHE_GUIA(paquete.numeroGuia), JSON.stringify(paquete), { EX: 30 })));
    };

    const session = await mongoose.startSession();
    try {
      let creados: any[] = [];
      await session.withTransaction(async () => {
        creados = [];
        for (const paquete of paquetes) {
          creados.push(await this.guardarPaqueteConTracking(paquete, estadoInicial, session));
        }
      });
      await limpiarCache(creados);
      return { paquetes: creados, parcial: false };
    } catch (error: any) {
      if (!this.esErrorTransaccionNoSoportada(error)) {
        throw error;
      }

      const creados: any[] = [];
      for (const paquete of paquetes) {
        creados.push(await this.guardarPaqueteConTracking(paquete, estadoInicial));
      }
      await limpiarCache(creados);
      return { paquetes: creados, parcial: false, advertencia: 'MongoDB local no soporta transacciones; se valido el lote antes de guardar.' };
    } finally {
      await session.endSession();
    }
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
      // Si cambia el estado, tambien dejamos registro en tracking para conservar la trazabilidad.
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
      await clienteRedis.del('dashboard:resumen');
    }

    return paqueteActualizado;
  }

  public static async eliminarPaquete(id: string) {
    const paqueteEliminado = await PaqueteModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).lean();
    if (paqueteEliminado) {
      const clienteRedis = obtenerClienteRedis();
      await clienteRedis.del(CLAVE_CACHE_GUIA(paqueteEliminado.numeroGuia));
      await clienteRedis.del('dashboard:resumen');
    }
    return paqueteEliminado;
  }

  private static async guardarPaqueteConTracking(datos: any, estadoInicial: any, session?: ClientSession) {
    let paqueteGuardado: any = null;

    for (let intento = 0; intento < 5; intento += 1) {
      const numeroGuia = await generarNumeroGuia();
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

      try {
        paqueteGuardado = await paquete.save({ session });
        break;
      } catch (error: any) {
        if (error?.code === 11000 && error?.keyPattern?.numeroGuia) {
          continue;
        }
        throw error;
      }
    }

    if (!paqueteGuardado) {
      throw new Error('No se pudo generar una guia unica para el paquete');
    }

    await TrackingServicio.crearRegistroTracking({
      paqueteId: paqueteGuardado._id,
      numeroGuia: paqueteGuardado.numeroGuia,
      estadoId: paqueteGuardado.estadoActualId,
      descripcion: 'Registro inicial del paquete',
      lugarActualId: paqueteGuardado.lugarOrigenId,
      usuarioResponsableId: paqueteGuardado.usuarioRemitenteId
    }, session);

    return paqueteGuardado;
  }

  private static esErrorTransaccionNoSoportada(error: any): boolean {
    const mensaje = String(error?.message || '');
    return mensaje.includes('Transaction numbers are only allowed') || mensaje.includes('replica set member or mongos');
  }

  private static async sincronizarContadorGuias() {
    const ultimoPaquete = await PaqueteModelo.findOne({ numeroGuia: /^APA-\d{6}$/ }).sort({ numeroGuia: -1 }).select('numeroGuia').lean();
    if (!ultimoPaquete?.numeroGuia) {
      return;
    }

    const secuenciaActual = Number(ultimoPaquete.numeroGuia.replace('APA-', ''));
    if (Number.isInteger(secuenciaActual) && secuenciaActual > 0) {
      await ContadorModelo.findOneAndUpdate(
        { _id: 'paquetes' },
        { $max: { seq: secuenciaActual } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }
  }
}
