// Rutas de salud: conecta endpoints, validaciones, seguridad y controlador correspondiente.
import { Router } from 'express';
import { SaludControlador } from '../controladores/salud.controlador';

export const saludRutas = Router();

saludRutas.get('/', SaludControlador.verificar);
