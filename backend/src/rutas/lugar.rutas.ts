import { Router } from 'express';
import { LugarControlador } from '../controladores/lugar.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const lugarRutas = Router();

lugarRutas.use(authMiddleware);
lugarRutas.get('/', LugarControlador.listar);
lugarRutas.get('/:id', LugarControlador.obtener);
lugarRutas.post('/', autorizarRoles('administrador'), LugarControlador.crear);
lugarRutas.put('/:id', autorizarRoles('administrador'), LugarControlador.actualizar);
lugarRutas.delete('/:id', autorizarRoles('administrador'), LugarControlador.eliminar);
