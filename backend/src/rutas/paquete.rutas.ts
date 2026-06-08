import { Router } from 'express';
import { PaqueteControlador } from '../controladores/paquete.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';

export const paqueteRutas = Router();

paqueteRutas.use(authMiddleware);
paqueteRutas.get('/', PaqueteControlador.listar);
paqueteRutas.get('/guia/:numeroGuia', PaqueteControlador.obtenerPorGuia);
paqueteRutas.get('/:id', PaqueteControlador.obtener);
paqueteRutas.post('/', PaqueteControlador.crear);
paqueteRutas.put('/:id', PaqueteControlador.actualizar);
paqueteRutas.delete('/:id', PaqueteControlador.eliminar);
