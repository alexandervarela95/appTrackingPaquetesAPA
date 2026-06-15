// Configura configuracionEntorno para que el backend use entorno, base de datos o cache de forma centralizada.
import dotenv from 'dotenv';
import path from 'path';

// Centralizamos las variables de entorno para que el resto del backend no lea process.env directo.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const jwtSecretConfigurado = process.env.JWT_SECRET;

if (!jwtSecretConfigurado) {
  const mensaje = 'JWT_SECRET no esta configurado. Defina una clave segura antes de ejecutar el backend.';
  if (process.env.NODE_ENV === 'production') {
    throw new Error(mensaje);
  }
  console.warn(`[Config] ${mensaje}`);
}

// Valores locales seguros para desarrollo. En produccion deben venir del entorno.
export const configuracionEntorno = {
  puerto: Number(process.env.PUERTO || process.env.PORT || 4300),
  mongodbUri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/appTrackingPaquetes',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3180',
  jwtSecret: jwtSecretConfigurado || 'secret_jwt_placeholder',
  jwtExpiraEn: process.env.JWT_EXPIRES_IN || '1d',
  entorno: process.env.NODE_ENV || 'development'
};
