import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from './auth.middleware';

// Se usa despues del authMiddleware para cortar rutas que no son del rol del usuario.
export const autorizarRoles = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = (req as any).user as TokenPayload | undefined;

    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({
        exito: false,
        mensaje: 'No tiene permisos para realizar esta accion',
        errores: []
      });
      return;
    }

    next();
  };
};
