// Controlador de estado: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
import { Request, Response, NextFunction } from 'express';
import { EstadoServicio } from '../servicios/estado.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';

export class EstadoControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const estados = await EstadoServicio.listarEstados();
      res.json({ exito: true, mensaje: 'Lista de estados obtenida', datos: estados });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const estado = await EstadoServicio.obtenerEstadoPorId(req.params.id);
      if (!estado) {
        return res.status(404).json({ exito: false, mensaje: 'Estado no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Estado encontrado', datos: estado });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const estado = await EstadoServicio.crearEstado(req.body);
      await AuditLogServicio.registrar({ req, accion: 'estado.creado', entidad: 'Estado', entidadId: String(estado._id), descripcion: `Estado ${estado.nombre} creado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'estados' } });
      res.status(201).json({ exito: true, mensaje: 'Estado creado correctamente', datos: estado });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const estado = await EstadoServicio.actualizarEstado(req.params.id, req.body);
      if (!estado) {
        return res.status(404).json({ exito: false, mensaje: 'Estado no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({ req, accion: 'estado.actualizado', entidad: 'Estado', entidadId: String(estado._id), descripcion: `Estado ${estado.nombre} actualizado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'estados' } });
      res.json({ exito: true, mensaje: 'Estado actualizado correctamente', datos: estado });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const estado = await EstadoServicio.eliminarEstado(req.params.id);
      if (!estado) {
        return res.status(404).json({ exito: false, mensaje: 'Estado no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({ req, accion: 'estado.desactivado', entidad: 'Estado', entidadId: String(estado._id), descripcion: `Estado ${estado.nombre} desactivado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'estados' } });
      res.json({ exito: true, mensaje: 'Estado desactivado correctamente', datos: estado });
    } catch (error) {
      next(error);
    }
  }
}
