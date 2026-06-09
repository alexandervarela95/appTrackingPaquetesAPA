import { Router } from 'express';
import { AuthControlador } from '../controladores/auth.controlador';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { loginSchema } from '../validadores/authValidador';

export const authRutas = Router();

authRutas.post('/login', validarSolicitud(loginSchema), AuthControlador.iniciarSesion);
