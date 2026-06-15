// Controlador de auth: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
import { Request, Response, NextFunction } from 'express';
import { AuthServicio } from '../servicios/auth.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';

export class AuthControlador {
  public static async iniciarSesion(req: Request, res: Response, next: NextFunction) {
    try {
      const { correo, contrasena } = req.body;
      if (!correo || !contrasena) {
        return res.status(400).json({ exito: false, mensaje: 'Correo y contrasena son obligatorios', errores: [] });
      }

      const datos = await AuthServicio.iniciarSesion(correo, contrasena);
      await AuditLogServicio.registrar({
        req,
        accion: 'auth.login.exitoso',
        entidad: 'Auth',
        entidadId: String(datos.usuario.id),
        descripcion: `Login exitoso de ${datos.usuario.correo}`,
      });
      res.json({ exito: true, mensaje: 'Inicio de sesion exitoso', datos });
    } catch (error) {
      await AuditLogServicio.registrar({
        req,
        accion: 'auth.login.fallido',
        entidad: 'Auth',
        descripcion: `Login fallido para ${req.body?.correo || 'correo no informado'}`,
      });
      next(error);
    }
  }
}
