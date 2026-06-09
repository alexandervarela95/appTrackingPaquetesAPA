import { Router } from 'express';
import { EstadoControlador } from '../controladores/estado.controlador';

export const estadoRutas = Router();

estadoRutas.get('/', EstadoControlador.listar);
estadoRutas.get('/:id', EstadoControlador.obtener);
estadoRutas.post('/', EstadoControlador.crear);
estadoRutas.put('/:id', EstadoControlador.actualizar);
estadoRutas.delete('/:id', EstadoControlador.eliminar);
