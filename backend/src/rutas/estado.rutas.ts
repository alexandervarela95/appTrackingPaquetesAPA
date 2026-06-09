import { Router } from 'express';
import { EstadoControlador } from '../controladores/estado.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const estadoRutas = Router();

estadoRutas.use(authMiddleware);
estadoRutas.get('/', EstadoControlador.listar);
estadoRutas.get('/:id', EstadoControlador.obtener);
estadoRutas.post('/', autorizarRoles('administrador'), EstadoControlador.crear);
estadoRutas.put('/:id', autorizarRoles('administrador'), EstadoControlador.actualizar);
estadoRutas.delete('/:id', autorizarRoles('administrador'), EstadoControlador.eliminar);
