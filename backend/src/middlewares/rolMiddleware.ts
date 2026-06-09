import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from './auth.middleware';

/**
 * Autoriza acceso a rutas segun los roles incluidos en el JWT.
 *
 * @remarks
 * Se usa despues de `authMiddleware`; si no hay usuario autenticado o el rol
 * no esta permitido, responde de forma uniforme sin ejecutar el controlador.
 */
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
