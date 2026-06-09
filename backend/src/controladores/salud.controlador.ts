import { Request, Response } from 'express';

/**
 * Controlador para la ruta de verificacion de estado del servicio.
 */
export class SaludControlador {
  public static verificar(req: Request, res: Response): void {
    res.json({
      exito: true,
      mensaje: 'Servicio de salud operando correctamente',
      datos: { estado: 'OK', fecha: new Date().toISOString() }
    });
  }
}
