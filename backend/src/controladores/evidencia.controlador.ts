import { Request, Response, NextFunction } from 'express';
import { EvidenciaServicio } from '../servicios/evidencia.servicio';
import { TokenPayload } from '../middlewares/auth.middleware';
import { AccesoPaqueteServicio } from '../servicios/accesoPaquete.servicio';
import { AuditLogServicio } from '../servicios/auditLog.servicio';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';
import { storageEvidencias } from '../servicios/storage.servicio';

export class EvidenciaControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const evidencias = await EvidenciaServicio.listarEvidenciasPorUsuario(usuario);
      res.json({ exito: true, mensaje: 'Lista de evidencias obtenida', datos: evidencias });
    } catch (error) {
      next(error);
    }
  }

  public static async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.obtenerEvidenciaPorId(req.params.id);
      if (!evidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Evidencia no encontrada', errores: [] });
      }
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const tieneAcceso = await AccesoPaqueteServicio.usuarioPuedeVerPaquete(usuario, String(evidencia.paqueteId));
      if (!tieneAcceso) {
        return res.status(403).json({ exito: false, mensaje: 'No tiene acceso a esta evidencia', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Evidencia encontrada', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.crearEvidencia(req.body);
      await AuditLogServicio.registrar({
        req,
        accion: 'evidencia.creada',
        entidad: 'Evidencia',
        entidadId: String(evidencia._id),
        descripcion: `Evidencia registrada para guia ${evidencia.numeroGuia}`,
      });
      RealtimePublisher.emitir(EventosRealtime.EvidenciaSubida, {
        datos: evidencia,
        paqueteId: String(evidencia.paqueteId),
        numeroGuia: evidencia.numeroGuia,
      });
      res.status(201).json({ exito: true, mensaje: 'Evidencia creada correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async subirArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Datos invalidos',
          errores: [{ campo: 'archivo', mensaje: 'El archivo es obligatorio' }]
        });
      }

      const usuario = (req as any).user;
      const evidencia = await EvidenciaServicio.crearEvidenciaConArchivo(req.body, req.file, usuario.id);
      await AuditLogServicio.registrar({
        req,
        accion: 'evidencia.subida',
        entidad: 'Evidencia',
        entidadId: String(evidencia._id),
        descripcion: `Archivo de evidencia subido para guia ${evidencia.numeroGuia}`,
      });
      RealtimePublisher.emitir(EventosRealtime.EvidenciaSubida, {
        datos: evidencia,
        paqueteId: String(evidencia.paqueteId),
        numeroGuia: evidencia.numeroGuia,
      });
      res.status(201).json({ exito: true, mensaje: 'Evidencia subida correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }

  public static async descargarArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.obtenerEvidenciaPorId(req.params.id);
      if (!evidencia || !evidencia.rutaArchivo) {
        return res.status(404).json({ exito: false, mensaje: 'Archivo de evidencia no encontrado', errores: [] });
      }
      const usuario = (req as unknown as { user: TokenPayload }).user;
      const tieneAcceso = await AccesoPaqueteServicio.usuarioPuedeVerPaquete(usuario, String(evidencia.paqueteId));
      if (!tieneAcceso) {
        return res.status(403).json({ exito: false, mensaje: 'No tiene acceso al archivo de evidencia', errores: [] });
      }

      const rutaArchivo = storageEvidencias.resolverRutaAbsoluta(evidencia.rutaArchivo);
      res.sendFile(rutaArchivo);
    } catch (error) {
      next(error);
    }
  }

  public static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const evidencia = await EvidenciaServicio.eliminarEvidencia(req.params.id);
      if (!evidencia) {
        return res.status(404).json({ exito: false, mensaje: 'Evidencia no encontrada', errores: [] });
      }
      res.json({ exito: true, mensaje: 'Evidencia eliminada correctamente', datos: evidencia });
    } catch (error) {
      next(error);
    }
  }
}
