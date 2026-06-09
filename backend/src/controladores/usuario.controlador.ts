import { Request, Response, NextFunction } from 'express';
import { UsuarioServicio } from '../servicios/usuario.servicio';

export class UsuarioControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await UsuarioServicio.listarUsuarios();
      res.json({ exito: true, mensaje: 'Lista de usuarios obtenida', datos: usuarios });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuarioServicio.obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Usuario encontrado', datos: usuario });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuarioServicio.crearUsuario(req.body);
      res.status(201).json({ exito: true, mensaje: 'Usuario creado correctamente', datos: usuario });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuarioServicio.actualizarUsuario(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Usuario actualizado correctamente', datos: usuario });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuarioServicio.eliminarUsuario(req.params.id);
      if (!usuario) {
        return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Usuario desactivado correctamente', datos: usuario });
    } catch (error) {
      next(error);
    }
  }
}
