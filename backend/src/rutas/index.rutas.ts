import { Router } from 'express';
import { authRutas } from './auth.rutas';
import { usuarioRutas } from './usuario.rutas';
import { lugarRutas } from './lugar.rutas';
import { estadoRutas } from './estado.rutas';
import { paqueteRutas } from './paquete.rutas';
import { trackingRutas } from './tracking.rutas';
import { incidenciaRutas } from './incidencia.rutas';
import { evidenciaRutas } from './evidencia.rutas';
import { dashboardRutas } from './dashboard.rutas';

export const rutasApi = Router();

rutasApi.use('/auth', authRutas);
rutasApi.use('/usuarios', usuarioRutas);
rutasApi.use('/lugares', lugarRutas);
rutasApi.use('/estados', estadoRutas);
rutasApi.use('/paquetes', paqueteRutas);
rutasApi.use('/tracking', trackingRutas);
rutasApi.use('/incidencias', incidenciaRutas);
rutasApi.use('/evidencias', evidenciaRutas);
rutasApi.use('/dashboard', dashboardRutas);
