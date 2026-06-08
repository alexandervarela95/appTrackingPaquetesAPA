import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { configuracionEntorno } from '../config/configuracionEntorno';

export interface TokenPayload {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
    res.status(401).json({ exito: false, mensaje: 'Token no proporcionado', errores: [] });
    return;
  }

  const token = autorizacion.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, configuracionEntorno.jwtSecret) as TokenPayload;
    (req as any).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ exito: false, mensaje: 'Token invalido o expirado', errores: [] });
  }
};
