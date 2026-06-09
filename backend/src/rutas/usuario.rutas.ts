import { Router } from 'express';
import { UsuarioControlador } from '../controladores/usuario.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const usuarioRutas = Router();

usuarioRutas.use(authMiddleware);
usuarioRutas.get('/', autorizarRoles('administrador'), UsuarioControlador.listar);
usuarioRutas.get('/:id', autorizarRoles('administrador', 'usuario', 'motorista'), UsuarioControlador.obtener);
usuarioRutas.post('/', autorizarRoles('administrador'), UsuarioControlador.crear);
usuarioRutas.put('/:id', autorizarRoles('administrador'), UsuarioControlador.actualizar);
usuarioRutas.delete('/:id', autorizarRoles('administrador'), UsuarioControlador.eliminar);
