import { Router } from 'express';
import { PaqueteControlador } from '../controladores/paquete.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const paqueteRutas = Router();

paqueteRutas.use(authMiddleware);
paqueteRutas.get('/', PaqueteControlador.listar);
paqueteRutas.get('/guia/:numeroGuia', PaqueteControlador.obtenerPorGuia);
paqueteRutas.get('/:id', PaqueteControlador.obtener);
paqueteRutas.post('/', autorizarRoles('administrador', 'usuario'), PaqueteControlador.crear);
paqueteRutas.put('/:id', autorizarRoles('administrador', 'motorista'), PaqueteControlador.actualizar);
paqueteRutas.delete('/:id', autorizarRoles('administrador'), PaqueteControlador.eliminar);
