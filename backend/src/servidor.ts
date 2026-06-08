import { crearApp } from './app';
import { conectarMongo } from './config/conexionMongo';
import { conectarRedis } from './config/conexionRedis';
import { configuracionEntorno } from './config/configuracionEntorno';
import { cargarDatosIniciales } from './semillas/datosIniciales';

const iniciarServidor = async (): Promise<void> => {
  await conectarMongo();
  await conectarRedis();
  await cargarDatosIniciales();

  const app = crearApp();
  app.listen(configuracionEntorno.puerto, () => {
    console.log(`Servidor backend ejecutandose en http://localhost:${configuracionEntorno.puerto}`);
  });
};

iniciarServidor().catch((error) => {
  console.error('Error iniciando servidor:', error);
  process.exit(1);
});
