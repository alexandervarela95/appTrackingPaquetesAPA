// Controlador de auditLog: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
import { Request, Response, NextFunction } from 'express';
import { AuditLogServicio } from '../servicios/auditLog.servicio';

export class AuditLogControlador {
  public static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await AuditLogServicio.listar({
        entidad: req.query.entidad as string,
        accion: req.query.accion as string,
        usuarioId: req.query.usuarioId as string,
        fechaInicio: req.query.fechaInicio as string,
        fechaFin: req.query.fechaFin as string,
        pagina: Number(req.query.pagina || 1),
        limite: Number(req.query.limite || 20),
      });
      res.json({ exito: true, mensaje: 'Auditoria obtenida', datos: resultado });
    } catch (error) {
      next(error);
    }
  }
}
