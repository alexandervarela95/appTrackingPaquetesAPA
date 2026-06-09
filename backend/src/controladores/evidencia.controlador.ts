import { Request, Response, NextFunction } from 'express';
import { EvidenciaServicio } from '../servicios/evidencia.servicio';

export class EvidenciaControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencias = await EvidenciaServicio.listarEvidencias();
      res.json({ exito: true, mensaje: 'Lista de evidencias obtenida', datos: evidencias });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.obtenerEvidenciaPorId(req.params.id);
      if (!evidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Evidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Evidencia encontrada', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.crearEvidencia(req.body);
      res.status(201).json({ exito: true, mensaje: 'Evidencia creada correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.eliminarEvidencia(req.params.id);
      if (!evidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Evidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Evidencia eliminada correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }
}
