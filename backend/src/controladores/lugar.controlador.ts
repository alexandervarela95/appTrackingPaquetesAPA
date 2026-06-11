import { Request, Response, NextFunction } from 'express';
import { LugarServicio } from '../servicios/lugar.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';

export class LugarControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const lugares = await LugarServicio.listarLugares();
      res.json({ exito: true, mensaje: 'Lista de lugares obtenida', datos: lugares });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const lugar = await LugarServicio.obtenerLugarPorId(req.params.id);
      if (!lugar) {
        return res.status(404).json({ exito: false, mensaje: 'Lugar no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Lugar encontrado', datos: lugar });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const lugar = await LugarServicio.crearLugar(req.body);
      await AuditLogServicio.registrar({ req, accion: 'lugar.creado', entidad: 'Lugar', entidadId: String(lugar._id), descripcion: `Lugar ${lugar.nombre} creado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'lugares' } });
      res.status(201).json({ exito: true, mensaje: 'Lugar creado correctamente', datos: lugar });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const lugar = await LugarServicio.actualizarLugar(req.params.id, req.body);
      if (!lugar) {
        return res.status(404).json({ exito: false, mensaje: 'Lugar no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({ req, accion: 'lugar.actualizado', entidad: 'Lugar', entidadId: String(lugar._id), descripcion: `Lugar ${lugar.nombre} actualizado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'lugares' } });
      res.json({ exito: true, mensaje: 'Lugar actualizado correctamente', datos: lugar });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const lugar = await LugarServicio.eliminarLugar(req.params.id);
      if (!lugar) {
        return res.status(404).json({ exito: false, mensaje: 'Lugar no encontrado', errores: [] });
      }
      await AuditLogServicio.registrar({ req, accion: 'lugar.desactivado', entidad: 'Lugar', entidadId: String(lugar._id), descripcion: `Lugar ${lugar.nombre} desactivado` });
      RealtimePublisher.emitir(EventosRealtime.CatalogoActualizado, { datos: { catalogo: 'lugares' } });
      res.json({ exito: true, mensaje: 'Lugar desactivado correctamente', datos: lugar });
    } catch (error) {
      next(error);
    }
  }
}
