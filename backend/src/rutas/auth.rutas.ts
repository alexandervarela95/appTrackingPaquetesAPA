// Rutas de auth: conecta endpoints, validaciones, seguridad y controlador correspondiente.
import { Router } from 'express';
import { AuthControlador } from '../controladores/auth.controlador';
import { loginRateLimit } from '../middlewares/rateLimitMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { loginSchema } from '../validadores/authValidador';

export const authRutas = Router();

authRutas.post('/login', loginRateLimit, validarSolicitud(loginSchema), AuthControlador.iniciarSesion);
