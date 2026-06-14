import { Request, Response, NextFunction } from 'express';
import { PaqueteServicio } from '../servicios/paquete.servicio';
import { validarReferenciasPaquete } from '../utilidades/validacionReferencias';
import { TokenPayload } from '../middlewares/auth.middleware';
import { AccesoPaqueteServicio } from '../servicios/accesoPaquete.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';

// Controlador HTTP de paquetes. Aqui se conectan permisos, validaciones, auditoria y tiempo real.
export class PaqueteControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const paquetes = await PaqueteServicio.listarPaquetesPorUsuario(usuario);
      res.json({ exito: true, mensaje: 'Lista de paquetes obtenida', datos: paquetes });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.obtenerPaquetePorId(req.params.id);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const tieneAcceso = await AccesoPaqueteServicio.usuarioPuedeVerPaquete(usuario, req.params.id);
      if (!tieneAcceso) {
        return res.status(403).json({ exito: false, mensaje: 'No tiene acceso a este paquete', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete encontrado', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async obtenerPorGuia(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.obtenerPaquetePorGuia(req.params.numeroGuia);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado por guia', errores: [] });
      }
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const tieneAcceso = await AccesoPaqueteServicio.usuarioPuedeVerPaquete(usuario, String(paquete._id));
      if (!tieneAcceso) {
        return res.status(403).json({ exito: false, mensaje: 'No tiene acceso a este paquete', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete encontrado por guia', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      // Validamos referencias para no guardar paquetes apuntando a usuarios, lugares o estados inexistentes.
      const errores = await validarReferenciasPaquete(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ exito: false, mensaje: 'Referencias invalidas para paquete', errores });
      }

      const paquete = await PaqueteServicio.crearPaquete(req.body);
      // Cada accion importante queda en auditoria para defender la trazabilidad del sistema.
      await AuditLogServicio.registrar({
        req,
        accion: 'paquete.creado',
        entidad: 'Paquete',
        entidadId: String(paquete._id),
        descripcion: `Paquete ${paquete.numeroGuia} creado`,
      });
      RealtimePublisher.emitir(EventosRealtime.PaqueteCreado, {
        datos: paquete,
        paqueteId: String(paquete._id),
        numeroGuia: paquete.numeroGuia,
      });
      RealtimePublisher.emitir(EventosRealtime.DashboardActualizado, {});
      res.status(201).json({ exito: true, mensaje: 'Paquete creado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const errores = await validarReferenciasPaquete(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ exito: false, mensaje: 'Referencias invalidas para paquete', errores });
      }

      const usuario = (req as unknown as { user: TokenPayload }).user;
      if (usuario.rol === 'motorista') {
        // El motorista solo puede modificar paquetes que realmente tiene asignados.
        const puedeGestionar = await AccesoPaqueteServicio.usuarioPuedeGestionarTracking(usuario, req.params.id);
        if (!puedeGestionar) {
          return res.status(403).json({ exito: false, mensaje: 'No puede modificar paquetes no asignados', errores: [] });
        }
      }

      const paquete = await PaqueteServicio.actualizarPaquete(req.params.id, req.body);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({
        req,
        accion: 'paquete.actualizado',
        entidad: 'Paquete',
        entidadId: String(paquete._id),
        descripcion: `Paquete ${paquete.numeroGuia} actualizado`,
      });
      RealtimePublisher.emitir(EventosRealtime.PaqueteActualizado, {
        datos: paquete,
        paqueteId: String(paquete._id),
        numeroGuia: paquete.numeroGuia,
      });
      if (req.body.estadoActualId) {
        RealtimePublisher.emitir(EventosRealtime.EstadoPaqueteCambiado, {
          datos: paquete,
          paqueteId: String(paquete._id),
          numeroGuia: paquete.numeroGuia,
        });
      }
      RealtimePublisher.emitir(EventosRealtime.DashboardActualizado, {});
      res.json({ exito: true, mensaje: 'Paquete actualizado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.eliminarPaquete(req.params.id);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({
        req,
        accion: 'paquete.desactivado',
        entidad: 'Paquete',
        entidadId: String(paquete._id),
        descripcion: `Paquete ${paquete.numeroGuia} desactivado`,
      });
      RealtimePublisher.emitir(EventosRealtime.PaqueteActualizado, {
        datos: paquete,
        paqueteId: String(paquete._id),
        numeroGuia: paquete.numeroGuia,
      });
      RealtimePublisher.emitir(EventosRealtime.DashboardActualizado, {});
      res.json({ exito: true, mensaje: 'Paquete desactivado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }
}
