// Configura conexionMongo para que el backend use entorno, base de datos o cache de forma centralizada.
import mongoose from 'mongoose';
import { configuracionEntorno } from './configuracionEntorno';

// Conecta MongoDB antes de levantar Express. Si falla, el backend no tiene datos para operar.
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
