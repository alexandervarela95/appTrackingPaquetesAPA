import { Router } from 'express';
import { UsuarioControlador } from '../controladores/usuario.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';

export const usuarioRutas = Router();

usuarioRutas.use(authMiddleware);
usuarioRutas.get('/', UsuarioControlador.listar);
usuarioRutas.get('/:id', UsuarioControlador.obtener);
usuarioRutas.post('/', UsuarioControlador.crear);
usuarioRutas.put('/:id', UsuarioControlador.actualizar);
usuarioRutas.delete('/:id', UsuarioControlador.eliminar);
