import { Router } from 'express';
import { TrackingControlador } from '../controladores/tracking.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';

export const trackingRutas = Router();

trackingRutas.use(authMiddleware);
trackingRutas.get('/paquete/:paqueteId', TrackingControlador.porPaquete);
trackingRutas.get('/guia/:numeroGuia', TrackingControlador.porGuia);
trackingRutas.post('/', TrackingControlador.crear);
