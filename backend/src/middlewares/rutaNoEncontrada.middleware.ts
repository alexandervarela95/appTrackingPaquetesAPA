// Middleware de rutaNoEncontrada: aplica una regla transversal antes de que la peticion llegue al controlador.
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para rutas no encontradas.
 */
export const rutaNoEncontradaMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    errores: []
  });
};
