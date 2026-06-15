// Rutas de paquete: conecta endpoints, validaciones, seguridad y controlador correspondiente.
import { Router } from 'express';
import { PaqueteControlador } from '../controladores/paquete.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema, numeroGuiaParamSchema } from '../validadores/mongoIdValidador';
import { actualizarPaqueteSchema, crearPaqueteSchema, crearPaquetesBulkSchema } from '../validadores/paqueteValidador';

export const paqueteRutas = Router();

paqueteRutas.use(authMiddleware);
paqueteRutas.get('/', PaqueteControlador.listar);
paqueteRutas.get('/guia/:numeroGuia', validarSolicitud(numeroGuiaParamSchema, 'params'), PaqueteControlador.obtenerPorGuia);
paqueteRutas.post('/bulk', autorizarRoles('administrador', 'usuario'), validarSolicitud(crearPaquetesBulkSchema), PaqueteControlador.crearBulk);
paqueteRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), PaqueteControlador.obtener);
paqueteRutas.post('/', autorizarRoles('administrador', 'usuario'), validarSolicitud(crearPaqueteSchema), PaqueteControlador.crear);
paqueteRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador', 'motorista'), validarSolicitud(actualizarPaqueteSchema), PaqueteControlador.actualizar);
paqueteRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), PaqueteControlador.eliminar);
