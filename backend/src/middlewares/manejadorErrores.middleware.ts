import { Request, Response, NextFunction } from 'express';

export const manejadorErrores = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('[Error API]', error.message, error);
  res.status(500).json({
    exito: false,
    mensaje: error.message || 'Error interno del servidor',
    errores: [error.message]
  });
};
