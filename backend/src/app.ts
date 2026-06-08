import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rutasApi } from './rutas/index.rutas';
import { manejadorErrores } from './middlewares/manejadorErrores.middleware';

/**
 * Configura la aplicacion Express con middlewares generales y rutas.
 */
export const crearApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.use('/api', rutasApi);

  app.get('/api/salud', (req: Request, res: Response) => {
    res.json({
      exito: true,
      mensaje: 'API de tracking de envios operativa',
      datos: { servicio: 'salud', hora: new Date().toISOString() }
    });
  });

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      exito: false,
      mensaje: 'Recurso no encontrado',
      errores: []
    });
  });

  app.use(manejadorErrores);

  return app;
};
