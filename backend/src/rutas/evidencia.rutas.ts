import { Router } from 'express';
import { EvidenciaControlador } from '../controladores/evidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { crearEvidenciaSchema } from '../validadores/evidenciaValidador';

export const evidenciaRutas = Router();

evidenciaRutas.use(authMiddleware);
evidenciaRutas.get('/', EvidenciaControlador.listar);
evidenciaRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), EvidenciaControlador.obtener);
evidenciaRutas.post('/', autorizarRoles('administrador', 'usuario', 'motorista'), validarSolicitud(crearEvidenciaSchema), EvidenciaControlador.crear);
evidenciaRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), EvidenciaControlador.eliminar);
