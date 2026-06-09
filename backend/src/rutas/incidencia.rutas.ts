import { Router } from 'express';
import { IncidenciaControlador } from '../controladores/incidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const incidenciaRutas = Router();

incidenciaRutas.use(authMiddleware);
incidenciaRutas.get('/', autorizarRoles('administrador'), IncidenciaControlador.listar);
incidenciaRutas.get('/:id', autorizarRoles('administrador', 'usuario', 'motorista'), IncidenciaControlador.obtener);
incidenciaRutas.post('/', autorizarRoles('administrador', 'usuario', 'motorista'), IncidenciaControlador.crear);
incidenciaRutas.put('/:id', autorizarRoles('administrador'), IncidenciaControlador.actualizar);
incidenciaRutas.delete('/:id', autorizarRoles('administrador'), IncidenciaControlador.eliminar);
