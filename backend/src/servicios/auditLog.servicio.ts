import { Request } from 'express';
import { AuditLogModelo } from '../modelos/auditLog.model';
import { TokenPayload } from '../middlewares/auth.middleware';
import { RealtimePublisher } from '../realtime/publisher';
import { EventosRealtime } from '../realtime/events';

export interface RegistrarAuditoriaParams {
  req?: Request;
  accion: string;
  entidad: string;
  entidadId?: string;
  descripcion: string;
  metadata?: Record<string, unknown>;
}

export class AuditLogServicio {
  public static async registrar(params: RegistrarAuditoriaParams): Promise<void> {
    try {
      const usuario = params.req ? ((params.req as unknown as { user?: TokenPayload }).user) : undefined;
      const registro = await AuditLogModelo.create({
        usuarioId: usuario?.id,
        rol: usuario?.rol,
        accion: params.accion,
        entidad: params.entidad,
        entidadId: params.entidadId,
        descripcion: params.descripcion,
        ip: params.req?.ip,
        userAgent: params.req?.headers['user-agent'],
        metadata: params.metadata || {},
      });

      RealtimePublisher.emitir(EventosRealtime.AuditoriaRegistrada, { datos: registro, rol: 'administrador' });
    } catch (error) {
      console.warn('[Auditoria] No se pudo registrar la accion:', params.accion, error);
    }
  }

  public static async listar(filtros: {
    entidad?: string;
    accion?: string;
    usuarioId?: string;
    fechaInicio?: string;
    fechaFin?: string;
    pagina?: number;
    limite?: number;
  }) {
    const pagina = Math.max(Number(filtros.pagina || 1), 1);
    const limite = Math.min(Math.max(Number(filtros.limite || 20), 1), 100);
    const consulta: Record<string, unknown> = {};

    if (filtros.entidad) consulta.entidad = filtros.entidad;
    if (filtros.accion) consulta.accion = filtros.accion;
    if (filtros.usuarioId) consulta.usuarioId = filtros.usuarioId;
    if (filtros.fechaInicio || filtros.fechaFin) {
      consulta.fecha = {
        ...(filtros.fechaInicio ? { $gte: new Date(filtros.fechaInicio) } : {}),
        ...(filtros.fechaFin ? { $lte: new Date(filtros.fechaFin) } : {}),
      };
    }

    const [datos, total] = await Promise.all([
      AuditLogModelo.find(consulta).sort({ fecha: -1 }).skip((pagina - 1) * limite).limit(limite).lean(),
      AuditLogModelo.countDocuments(consulta),
    ]);

    return { datos, paginacion: { pagina, limite, total, paginas: Math.ceil(total / limite) } };
  }
}
