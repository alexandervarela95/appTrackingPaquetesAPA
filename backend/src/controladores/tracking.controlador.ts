// Controlador de tracking: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
import { Request, Response, NextFunction } from 'express';
import { TrackingServicio } from '../servicios/tracking.servicio';
import { TokenPayload } from '../middlewares/auth.middleware';
import { AccesoPaqueteServicio } from '../servicios/accesoPaquete.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';

export class TrackingControlador {
  public static async porPaquete(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const tieneAcceso = await AccesoPaqueteServicio.usuarioPuedeVerPaquete(usuario, req.params.paqueteId);
      if (!tieneAcceso) {
        return res.status(403).json({ exito: false, mensaje: 'No tiene acceso al tracking de este paquete', errores: [] });
      }
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
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const puedeGestionar = await AccesoPaqueteServicio.usuarioPuedeGestionarTracking(usuario, req.body.paqueteId);
      if (!puedeGestionar) {
        return res.status(403).json({ exito: false, mensaje: 'No puede registrar tracking en paquetes no asignados', errores: [] });
      }
      const registro = await TrackingServicio.crearRegistroTracking(req.body);
      await AuditLogServicio.registrar({
        req,
        accion: 'tracking.creado',
        entidad: 'Tracking',
        entidadId: String(registro._id),
        descripcion: `Tracking creado para guia ${registro.numeroGuia}`,
        metadata: { paqueteId: String(registro.paqueteId) },
      });
      RealtimePublisher.emitir(EventosRealtime.TrackingCreado, {
        datos: registro,
        paqueteId: String(registro.paqueteId),
        numeroGuia: registro.numeroGuia,
      });
      RealtimePublisher.emitir(EventosRealtime.DashboardActualizado, {});
      res.status(201).json({ exito: true, mensaje: 'Registro de tracking creado correctamente', datos: registro });
    } catch (error) {
      next(error);
    }
  }
}
