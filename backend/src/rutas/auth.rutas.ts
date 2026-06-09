import { Router } from 'express';
import { AuthControlador } from '../controladores/auth.controlador';

export const authRutas = Router();

authRutas.post('/login', AuthControlador.iniciarSesion);
