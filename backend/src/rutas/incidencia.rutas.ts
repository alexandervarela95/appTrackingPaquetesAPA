import { Router } from 'express';
import { IncidenciaControlador } from '../controladores/incidencia.controlador';

export const incidenciaRutas = Router();

incidenciaRutas.get('/', IncidenciaControlador.listar);
incidenciaRutas.get('/:id', IncidenciaControlador.obtener);
incidenciaRutas.post('/', IncidenciaControlador.crear);
incidenciaRutas.put('/:id', IncidenciaControlador.actualizar);
incidenciaRutas.delete('/:id', IncidenciaControlador.eliminar);
