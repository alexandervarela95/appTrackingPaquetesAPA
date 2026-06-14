import { createServer } from 'http';
import { crearApp } from './app';
import { conectarMongo } from './config/conexionMongo';
import { conectarRedis } from './config/conexionRedis';
import { configuracionEntorno } from './config/configuracionEntorno';
import { configurarRealtime } from './realtime/server';
import { cargarEstadosIniciales } from './semillas/estadosSemilla';

// Orden de arranque: base de datos, cache opcional, catalogos base, Express y Socket.IO.
const iniciarServidor = async (): Promise<void> => {
  await conectarMongo();
  await conectarRedis();
  await cargarEstadosIniciales();

  const app = crearApp();
  const servidorHttp = createServer(app);
  configurarRealtime(servidorHttp);

  servidorHttp.listen(configuracionEntorno.puerto, () => {
    console.log(`Servidor backend ejecutandose en http://localhost:${configuracionEntorno.puerto}`);
  });
};

iniciarServidor().catch((error) => {
  console.error('Error iniciando servidor:', error);
  process.exit(1);
});
