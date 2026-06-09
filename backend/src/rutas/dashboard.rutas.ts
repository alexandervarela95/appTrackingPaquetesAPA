import { Router } from 'express';
import { DashboardControlador } from '../controladores/dashboard.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';

export const dashboardRutas = Router();

dashboardRutas.use(authMiddleware);
dashboardRutas.get('/resumen', DashboardControlador.obtenerResumen);
