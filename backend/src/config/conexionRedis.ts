import { createClient, RedisClientType } from 'redis';
import { configuracionEntorno } from './configuracionEntorno';

let clienteRedis: RedisClientType | null = null;

const clienteRedisNoOp = {
  get: async (_clave: string): Promise<string | null> => null,
  set: async (_clave: string, _valor: string, _opts?: any): Promise<'OK'> => 'OK',
  del: async (_clave: string): Promise<number> => 0
} as unknown as RedisClientType;

/**
 * Crea una instancia global de Redis para caché y datos temporales.
 * Si Redis no está disponible, se mantiene un cliente no operativo.
 */
export const conectarRedis = async (): Promise<void> => {
  try {
    clienteRedis = createClient({
      url: configuracionEntorno.redisUrl,
      socket: {
        reconnectStrategy: () => false
      }
    });

    clienteRedis.on('error', (error) => {
      console.error('Error Redis:', error);
    });

    await clienteRedis.connect();
    console.log('Redis conectado en', configuracionEntorno.redisUrl);
  } catch (error) {
    console.warn('Redis no disponible, cache deshabilitada:', error);

    if (clienteRedis) {
      try {
        await clienteRedis.disconnect();
      } catch {
        // Ignorar errores de limpieza cuando Redis no está disponible.
      }
    }

    clienteRedis = null;
  }
};

/**
 * Obtiene el cliente Redis global o un cliente no operativo si no está conectado.
 */
export const obtenerClienteRedis = (): RedisClientType => {
  return clienteRedis || clienteRedisNoOp;
};
