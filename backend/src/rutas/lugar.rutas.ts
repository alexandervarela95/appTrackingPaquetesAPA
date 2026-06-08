import { Router } from 'express';
import { LugarControlador } from '../controladores/lugar.controlador';

export const lugarRutas = Router();

lugarRutas.get('/', LugarControlador.listar);
lugarRutas.get('/:id', LugarControlador.obtener);
lugarRutas.post('/', LugarControlador.crear);
lugarRutas.put('/:id', LugarControlador.actualizar);
lugarRutas.delete('/:id', LugarControlador.eliminar);
