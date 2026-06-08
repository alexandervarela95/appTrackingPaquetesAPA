import { Router } from 'express';
import { IncidenciaControlador } from '../controladores/incidencia.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';

export const incidenciaRutas = Router();

incidenciaRutas.use(authMiddleware);
incidenciaRutas.get('/', IncidenciaControlador.listar);
incidenciaRutas.get('/:id', IncidenciaControlador.obtener);
incidenciaRutas.post('/', IncidenciaControlador.crear);
incidenciaRutas.put('/:id', IncidenciaControlador.actualizar);
incidenciaRutas.delete('/:id', IncidenciaControlador.eliminar);
