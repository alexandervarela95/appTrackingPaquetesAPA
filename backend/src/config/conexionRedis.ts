import { createClient, RedisClientType } from 'redis';
import { configuracionEntorno } from './configuracionEntorno';

let clienteRedis: RedisClientType | null = null;

// Cliente de respaldo para que el codigo de cache no tenga que preguntar si Redis existe.
const clienteRedisNoOp = {
  get: async (_clave: string): Promise<string | null> => null,
  set: async (_clave: string, _valor: string, _opts?: any): Promise<'OK'> => 'OK',
  del: async (_clave: string): Promise<number> => 0
} as unknown as RedisClientType;

// Ojo: Redis ayuda con cache y tiempo real, pero no debe tumbar el backend en local.
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

// El resto del sistema usa esta funcion y recibe Redis real o un fallback silencioso.
export const obtenerClienteRedis = (): RedisClientType => {
  return clienteRedis || clienteRedisNoOp;
};
