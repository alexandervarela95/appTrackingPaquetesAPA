import { Request, Response, NextFunction } from 'express';
import { AuthServicio } from '../servicios/auth.servicio';

export class AuthControlador {
  public static async iniciarSesion(req: Request, res: Response, next: NextFunction) {
    try {
      const { correo, contrasena } = req.body;
      if (!correo || !contrasena) {
        return res.status(400).json({ exito: false, mensaje: 'Correo y contrasena son obligatorios', errores: [] });
      }

      const datos = await AuthServicio.iniciarSesion(correo, contrasena);
      res.json({ exito: true, mensaje: 'Inicio de sesion exitoso', datos });
    } catch (error) {
      next(error);
    }
  }
}
