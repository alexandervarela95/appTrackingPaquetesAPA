import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

type OrigenValidacion = 'body' | 'params' | 'query';

const formatearErrores = (error: ZodError) => {
  return error.issues.map((detalle) => ({
    campo: detalle.path.join('.') || 'general',
    mensaje: detalle.message
  }));
};

/**
 * Valida entradas HTTP con Zod y responde errores uniformes antes de ejecutar
 * controladores o consultas a base de datos.
 */
export const validarSolicitud = (schema: ZodTypeAny, origen: OrigenValidacion = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req[origen]);

    if (!resultado.success) {
      res.status(400).json({
        exito: false,
        mensaje: 'Datos invalidos',
        errores: formatearErrores(resultado.error)
      });
      return;
    }

    req[origen] = resultado.data;
    next();
  };
};
