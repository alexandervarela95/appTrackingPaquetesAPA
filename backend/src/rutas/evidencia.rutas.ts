import { Router } from 'express';
import { EvidenciaControlador } from '../controladores/evidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { subidaEvidencia } from '../middlewares/subidaArchivoMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { crearEvidenciaSchema, subirEvidenciaSchema } from '../validadores/evidenciaValidador';

export const evidenciaRutas = Router();

evidenciaRutas.use(authMiddleware);
evidenciaRutas.get('/', EvidenciaControlador.listar);
evidenciaRutas.get('/archivo/:id', validarSolicitud(idParamSchema, 'params'), EvidenciaControlador.descargarArchivo);
evidenciaRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), EvidenciaControlador.obtener);
evidenciaRutas.post('/', autorizarRoles('administrador', 'usuario', 'motorista'), validarSolicitud(crearEvidenciaSchema), EvidenciaControlador.crear);
evidenciaRutas.post('/upload', autorizarRoles('administrador', 'usuario', 'motorista'), subidaEvidencia.single('archivo'), validarSolicitud(subirEvidenciaSchema), EvidenciaControlador.subirArchivo);
evidenciaRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), EvidenciaControlador.eliminar);
