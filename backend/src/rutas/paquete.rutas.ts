import { Router } from 'express';
import { PaqueteControlador } from '../controladores/paquete.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { actualizarPaqueteSchema, crearPaqueteSchema } from '../validadores/paqueteValidador';

export const paqueteRutas = Router();

paqueteRutas.use(authMiddleware);
paqueteRutas.get('/', PaqueteControlador.listar);
paqueteRutas.get('/guia/:numeroGuia', PaqueteControlador.obtenerPorGuia);
paqueteRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), PaqueteControlador.obtener);
paqueteRutas.post('/', autorizarRoles('administrador', 'usuario'), validarSolicitud(crearPaqueteSchema), PaqueteControlador.crear);
paqueteRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador', 'motorista'), validarSolicitud(actualizarPaqueteSchema), PaqueteControlador.actualizar);
paqueteRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), PaqueteControlador.eliminar);
