import { Router } from 'express';
import { UsuarioControlador } from '../controladores/usuario.controlador';

export const usuarioRutas = Router();

usuarioRutas.get('/', UsuarioControlador.listar);
usuarioRutas.get('/:id', UsuarioControlador.obtener);
usuarioRutas.post('/', UsuarioControlador.crear);
usuarioRutas.put('/:id', UsuarioControlador.actualizar);
usuarioRutas.delete('/:id', UsuarioControlador.eliminar);
