import { Router } from 'express';
import { LugarControlador } from '../controladores/lugar.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { actualizarLugarSchema, crearLugarSchema } from '../validadores/lugarValidador';

export const lugarRutas = Router();

lugarRutas.use(authMiddleware);
lugarRutas.get('/', LugarControlador.listar);
lugarRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), LugarControlador.obtener);
lugarRutas.post('/', autorizarRoles('administrador'), validarSolicitud(crearLugarSchema), LugarControlador.crear);
lugarRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), validarSolicitud(actualizarLugarSchema), LugarControlador.actualizar);
lugarRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), LugarControlador.eliminar);
