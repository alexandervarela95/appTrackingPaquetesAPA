import { Router } from 'express';
import { TrackingControlador } from '../controladores/tracking.controlador';
import { authMiddleware } from '../middlewares/auth.middleware';
import { autorizarRoles } from '../middlewares/rolMiddleware';
import { validarSolicitud } from '../middlewares/validacionMiddleware';
import { paqueteIdParamSchema } from '../validadores/mongoIdValidador';
import { crearTrackingSchema } from '../validadores/trackingValidador';

export const trackingRutas = Router();

trackingRutas.use(authMiddleware);
trackingRutas.get('/paquete/:paqueteId', validarSolicitud(paqueteIdParamSchema, 'params'), TrackingControlador.porPaquete);
trackingRutas.get('/guia/:numeroGuia', TrackingControlador.porGuia);
trackingRutas.post('/', autorizarRoles('administrador', 'motorista'), validarSolicitud(crearTrackingSchema), TrackingControlador.crear);
