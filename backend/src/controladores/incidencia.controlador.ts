import { Request, Response, NextFunction } from 'express';
import { IncidenciaServicio } from '../servicios/incidencia.servicio';

export class IncidenciaControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const incidencias = await IncidenciaServicio.listarIncidencias();
      res.json({ exito: true, mensaje: 'Lista de incidencias obtenida', datos: incidencias });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const incidencia = await IncidenciaServicio.obtenerIncidenciaPorId(req.params.id);
      if (!incidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Incidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Incidencia encontrada', datos: incidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const incidencia = await IncidenciaServicio.crearIncidencia(req.body);
      res.status(201).json({ exito: true, mensaje: 'Incidencia creada correctamente', datos: incidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const incidencia = await IncidenciaServicio.actualizarIncidencia(req.params.id, req.body);
      if (!incidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Incidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Incidencia actualizada correctamente', datos: incidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const incidencia = await IncidenciaServicio.eliminarIncidencia(req.params.id);
      if (!incidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Incidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Incidencia eliminada correctamente', datos: incidencia });
    } catch (error) {
      next(error);
    }
  }
}
