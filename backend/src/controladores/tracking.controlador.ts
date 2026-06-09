import { Request, Response, NextFunction } from 'express';
import { TrackingServicio } from '../servicios/tracking.servicio';

export class TrackingControlador {
  public static async porPaquete(req: Request, res: Response, next: NextFunction) {
    try {
      const registros = await TrackingServicio.listarTrackingPorPaquete(req.params.paqueteId);
      res.json({ exito: true, mensaje: 'Historial de tracking obtenido', datos: registros });
    } catch (error) {
      next(error);
    }
  }

  public static async porGuia(req: Request, res: Response, next: NextFunction) {
    try {
      const registros = await TrackingServicio.listarTrackingPorGuia(req.params.numeroGuia);
      res.json({ exito: true, mensaje: 'Historial de tracking por guia obtenido', datos: registros });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const registro = await TrackingServicio.crearRegistroTracking(req.body);
      res.status(201).json({ exito: true, mensaje: 'Registro de tracking creado correctamente', datos: registro });
    } catch (error) {
      next(error);
    }
  }
}
