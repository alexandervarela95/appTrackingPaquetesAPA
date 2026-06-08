import { Router } from 'express';
import { TrackingControlador } from '../controladores/tracking.controlador';

export const trackingRutas = Router();

trackingRutas.get('/paquete/:paqueteId', TrackingControlador.porPaquete);
trackingRutas.get('/guia/:numeroGuia', TrackingControlador.porGuia);
trackingRutas.post('/', TrackingControlador.crear);
