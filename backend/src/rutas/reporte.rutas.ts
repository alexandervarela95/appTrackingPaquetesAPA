import { Router } from 'express';
import { ReporteControlador } from '../controladores/reporte.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';

export const reporteRutas = Router();

reporteRutas.use(authMiddleware);
reporteRutas.use(autorizarRoles('administrador'));
reporteRutas.get('/paquetes-por-estado', ReporteControlador.paquetesPorEstado);
reporteRutas.get('/incidencias', ReporteControlador.incidencias);
reporteRutas.get('/actividad', ReporteControlador.actividad);
