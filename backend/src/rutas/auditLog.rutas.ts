import { Router } from 'express';
import { AuditLogControlador } from '../controladores/auditLog.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const auditLogRutas = Router();

auditLogRutas.use(authMiddleware);
auditLogRutas.get('/', autorizarRoles('administrador'), AuditLogControlador.listar);
