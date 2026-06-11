import { Request, Response, NextFunction } from 'express';
import { ReporteServicio } from '../servicios/reporte.servicio';

const filtrosDesdeQuery = (req: Request) => ({
  fechaInicio: req.query.fechaInicio as string,
  fechaFin: req.query.fechaFin as string,
  estadoId: req.query.estadoId as string,
  lugarOrigenId: req.query.lugarOrigenId as string,
  lugarDestinoId: req.query.lugarDestinoId as string,
  motoristaId: req.query.motoristaId as string,
  prioridad: req.query.prioridad as string,
  estadoIncidencia: req.query.estadoIncidencia as string,
});

export class ReporteControlador {
  public static async paquetesPorEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const datos = await ReporteServicio.paquetesPorEstado(filtrosDesdeQuery(req));
      res.json({ exito: true, mensaje: 'Reporte de paquetes por estado obtenido', datos });
    } catch (error) {
      next(error);
    }
  }

  public static async incidencias(req: Request, res: Response, next: NextFunction) {
    try {
      const datos = await ReporteServicio.incidencias(filtrosDesdeQuery(req));
      res.json({ exito: true, mensaje: 'Reporte de incidencias obtenido', datos });
    } catch (error) {
      next(error);
    }
  }

  public static async actividad(req: Request, res: Response, next: NextFunction) {
    try {
      const datos = await ReporteServicio.actividad(filtrosDesdeQuery(req));
      res.json({ exito: true, mensaje: 'Reporte de actividad obtenido', datos });
    } catch (error) {
      next(error);
    }
  }
}
