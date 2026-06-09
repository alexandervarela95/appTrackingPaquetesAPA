import { Router } from 'express';
import { PaqueteControlador } from '../controladores/paquete.controlador';

export const paqueteRutas = Router();

paqueteRutas.get('/', PaqueteControlador.listar);
paqueteRutas.get('/guia/:numeroGuia', PaqueteControlador.obtenerPorGuia);
paqueteRutas.get('/:id', PaqueteControlador.obtener);
paqueteRutas.post('/', PaqueteControlador.crear);
paqueteRutas.put('/:id', PaqueteControlador.actualizar);
paqueteRutas.delete('/:id', PaqueteControlador.eliminar);
