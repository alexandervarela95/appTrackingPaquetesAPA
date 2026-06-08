import { Request, Response, NextFunction } from 'express';
import { PaqueteServicio } from '../servicios/paquete.servicio';
import { validarReferenciasPaquete } from '../utilidades/validacionReferencias';

export class PaqueteControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const paquetes = await PaqueteServicio.listarPaquetes();
      res.json({ exito: true, mensaje: 'Lista de paquetes obtenida', datos: paquetes });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.obtenerPaquetePorId(req.params.id);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete encontrado', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async obtenerPorGuia(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.obtenerPaquetePorGuia(req.params.numeroGuia);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado por guia', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete encontrado por guia', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const errores = await validarReferenciasPaquete(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ exito: false, mensaje: 'Referencias invalidas para paquete', errores });
      }

      const paquete = await PaqueteServicio.crearPaquete(req.body);
      res.status(201).json({ exito: true, mensaje: 'Paquete creado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const errores = await validarReferenciasPaquete(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ exito: false, mensaje: 'Referencias invalidas para paquete', errores });
      }

      const paquete = await PaqueteServicio.actualizarPaquete(req.params.id, req.body);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete actualizado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const paquete = await PaqueteServicio.eliminarPaquete(req.params.id);
      if (!paquete) {
        return res.status(404).json({ exito: false, mensaje: 'Paquete no encontrado', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Paquete desactivado correctamente', datos: paquete });
    } catch (error) {
      next(error);
    }
  }
}
