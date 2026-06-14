import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rutasApi } from './rutas/index.rutas';
import { rutaNoEncontradaMiddleware } from './middlewares/rutaNoEncontrada.middleware';
import { manejadorErrores } from './middlewares/manejadorErrores.middleware';
import { saludRutas } from './rutas/salud.rutas';
import { configuracionEntorno } from './config/configuracionEntorno';

// Arma la app Express con seguridad, CORS y todas las rutas bajo /api.
export const crearApp = (): Application => {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: configuracionEntorno.corsOrigins.split(',').map((origen) => origen.trim()) }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.use('/api/salud', saludRutas);
  app.use('/api', rutasApi);

  app.use(rutaNoEncontradaMiddleware);
  app.use(manejadorErrores);

  return app;
};
