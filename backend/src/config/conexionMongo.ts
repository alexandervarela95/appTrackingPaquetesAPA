import mongoose from 'mongoose';
import { configuracionEntorno } from './configuracionEntorno';

/**
 * Inicializa la conexion a MongoDB usando Mongoose.
 * @returns Promise que se resuelve cuando la conexion se establece.
 */
export const conectarMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(configuracionEntorno.mongodbUri, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log('MongoDB conectado en', configuracionEntorno.mongodbUri);
  } catch (error) {
    console.error('Error conectando MongoDB:', error);
    process.exit(1);
  }
};
