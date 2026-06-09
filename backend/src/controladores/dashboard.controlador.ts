import { Request, Response, NextFunction } from 'express';
import { DashboardServicio } from '../servicios/dashboard.servicio';

export class DashboardControlador {
  public static async obtenerResumen(req: Request, res: Response, next: NextFunction) {
    try {
      const resumen = await DashboardServicio.obtenerResumen();
      res.json({ exito: true, mensaje: 'Resumen del dashboard obtenido', datos: resumen });
    } catch (error) {
      next(error);
    }
  }
}
