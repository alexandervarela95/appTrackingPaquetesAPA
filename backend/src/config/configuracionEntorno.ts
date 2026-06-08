import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const configuracionEntorno = {
  puerto: Number(process.env.PUERTO || process.env.PORT || 4000),
  mongodbUri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/appTrackingPaquetes',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:4200',
  jwtSecret: process.env.JWT_SECRET || 'secret_jwt_placeholder',
  jwtExpiraEn: process.env.JWT_EXPIRES_IN || '1d',
  entorno: process.env.NODE_ENV || 'development'
};
