import { createClient, RedisClientType } from 'redis';
import { configuracionEntorno } from './configuracionEntorno';

let clienteRedis: RedisClientType | null = null;

/**
 * Crea una instancia global de Redis para caché y datos temporales.
 */
export const conectarRedis = async (): Promise<void> => {
  clienteRedis = createClient({ url: configuracionEntorno.redisUrl });

  clienteRedis.on('error', (error) => {
    console.error('Error Redis:', error);
  });

  await clienteRedis.connect();
  console.log('Redis conectado en', configuracionEntorno.redisUrl);
};

/**
 * Obtiene el cliente Redis global.
 */
export const obtenerClienteRedis = (): RedisClientType => {
  if (!clienteRedis) {
    throw new Error('Cliente Redis no inicializado');
  }
  return clienteRedis;
};
