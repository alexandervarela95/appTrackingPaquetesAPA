import { Router } from 'express';
import { IncidenciaControlador } from '../controladores/incidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { actualizarIncidenciaSchema, crearIncidenciaSchema } from '../validadores/incidenciaValidador';

export const incidenciaRutas = Router();

incidenciaRutas.use(authMiddleware);
incidenciaRutas.get('/', autorizarRoles('administrador'), IncidenciaControlador.listar);
incidenciaRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador', 'usuario', 'motorista'), IncidenciaControlador.obtener);
incidenciaRutas.post('/', autorizarRoles('administrador', 'usuario', 'motorista'), validarSolicitud(crearIncidenciaSchema), IncidenciaControlador.crear);
incidenciaRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), validarSolicitud(actualizarIncidenciaSchema), IncidenciaControlador.actualizar);
incidenciaRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), IncidenciaControlador.eliminar);
