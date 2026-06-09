import { Router } from 'express';
import { EvidenciaControlador } from '../controladores/evidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const evidenciaRutas = Router();

evidenciaRutas.use(authMiddleware);
evidenciaRutas.get('/', EvidenciaControlador.listar);
evidenciaRutas.get('/:id', EvidenciaControlador.obtener);
evidenciaRutas.post('/', autorizarRoles('administrador', 'usuario', 'motorista'), EvidenciaControlador.crear);
evidenciaRutas.delete('/:id', autorizarRoles('administrador'), EvidenciaControlador.eliminar);
