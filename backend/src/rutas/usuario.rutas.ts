import { Router } from 'express';
import { UsuarioControlador } from '../controladores/usuario.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { idParamSchema } from '../validadores/mongoIdValidador';
import { actualizarUsuarioSchema, crearUsuarioSchema } from '../validadores/usuarioValidador';

export const usuarioRutas = Router();

usuarioRutas.use(authMiddleware);
usuarioRutas.get('/', autorizarRoles('administrador'), UsuarioControlador.listar);
usuarioRutas.get('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador', 'usuario', 'motorista'), UsuarioControlador.obtener);
usuarioRutas.post('/', autorizarRoles('administrador'), validarSolicitud(crearUsuarioSchema), UsuarioControlador.crear);
usuarioRutas.put('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), validarSolicitud(actualizarUsuarioSchema), UsuarioControlador.actualizar);
usuarioRutas.delete('/:id', validarSolicitud(idParamSchema, 'params'), autorizarRoles('administrador'), UsuarioControlador.eliminar);
