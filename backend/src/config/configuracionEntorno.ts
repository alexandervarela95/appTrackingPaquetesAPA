import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const configuracionEntorno = {
  puerto: Number(process.env.PORT || 3090),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/appTrackingPaquetesAPA',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'secret_jwt_placeholder',
  jwtExpiraEn: process.env.JWT_EXPIRES_IN || '1d',
  entorno: process.env.NODE_ENV || 'development'
};
