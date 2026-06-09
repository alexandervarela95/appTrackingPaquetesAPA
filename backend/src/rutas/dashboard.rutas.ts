import { Router } from 'express';
import { DashboardControlador } from '../controladores/dashboard.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const dashboardRutas = Router();

dashboardRutas.use(authMiddleware);
dashboardRutas.get('/resumen', autorizarRoles('administrador'), DashboardControlador.obtenerResumen);
