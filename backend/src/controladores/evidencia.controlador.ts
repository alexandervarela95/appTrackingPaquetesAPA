import { Request, Response, NextFunction } from 'express';
import path from 'path';
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

  public static async subirArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Datos invalidos',
          errores: [{ campo: 'archivo', mensaje: 'El archivo es obligatorio' }]
        });
      }

      const usuario = (req as any).user;
      const evidencia = await EvidenciaServicio.crearEvidenciaConArchivo(req.body, req.file, usuario.id);
      res.status(201).json({ exito: true, mensaje: 'Evidencia subida correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async descargarArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.obtenerEvidenciaPorId(req.params.id);
      if (!evidencia || !evidencia.rutaArchivo) {
        return res.status(404).json({ exito: false, mensaje: 'Archivo de evidencia no encontrado', errores: [] });
      }

      const rutaArchivo = path.resolve(__dirname, '../../', evidencia.rutaArchivo);
      res.sendFile(rutaArchivo);
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
