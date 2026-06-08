import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rutasApi } from './rutas/index.rutas';
import { rutaNoEncontradaMiddleware } from './middlewares/rutaNoEncontrada.middleware';
import { manejadorErrores } from './middlewares/manejadorErrores.middleware';
import { saludRutas } from './rutas/salud.rutas';
import { configuracionEntorno } from './config/configuracionEntorno';

/**
 * Configura la aplicacion Express con middlewares generales y rutas.
 */
export const crearApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: configuracionEntorno.corsOrigins.split(',').map((origen) => origen.trim()) }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.use('/api/salud', saludRutas);
  app.use('/api', rutasApi);

  app.use(rutaNoEncontradaMiddleware);
  app.use(manejadorErrores);

  return app;
};
