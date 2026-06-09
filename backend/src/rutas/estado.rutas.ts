import { Router } from 'express';
import { EstadoControlador } from '../controladores/estado.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { actualizarEstadoSchema, crearEstadoSchema } from '../validadores/estadoValidador';

export const estadoRutas = Router();

estadoRutas.use(authMiddleware);
estadoRutas.get('/', EstadoControlador.listar);
estadoRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), EstadoControlador.obtener);
estadoRutas.post('/', autorizarRoles('administrador'), validarSolicitud(crearEstadoSchema), EstadoControlador.crear);
estadoRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), validarSolicitud(actualizarEstadoSchema), EstadoControlador.actualizar);
estadoRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), EstadoControlador.eliminar);
