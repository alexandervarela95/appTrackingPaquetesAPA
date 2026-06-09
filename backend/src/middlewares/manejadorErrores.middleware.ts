import { Request, Response, NextFunction } from 'express';
import { configuracionEntorno } from '../config/configuracionEntorno';

export const manejadorErrores = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const esProduccion = configuracionEntorno.entorno === 'production';
  const mensaje = esProduccion ? 'Error interno del servidor' : error.message || 'Error interno del servidor';

  console.error('[Error API]', error.message, esProduccion ? '' : error);
  res.status(500).json({
    exito: false,
    mensaje,
    errores: esProduccion ? [] : [error.message]
  });
};
