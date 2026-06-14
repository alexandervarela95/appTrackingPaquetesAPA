import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { configuracionEntorno } from '../config/configuracionEntorno';
import { TokenPayload } from '../middlewares/auth.middleware';
import { registrarServidorRealtime } from './publisher';

// Configura Socket.IO para avisar cambios de paquetes, tracking, incidencias y dashboard.
export const configurarRealtime = (servidorHttp: Server): SocketServer => {
  const io = new SocketServer(servidorHttp, {
    cors: {
      origin: configuracionEntorno.corsOrigins.split(',').map((origen) => origen.trim()),
      credentials: true,
    },
  });

  const pubClient = createClient({ url: configuracionEntorno.redisUrl });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('Socket.IO Redis adapter conectado');
    })
    .catch((error) => {
      // En local Redis puede estar apagado; Socket.IO sigue funcionando con el adapter normal.
      console.warn('Socket.IO Redis adapter no disponible, usando adapter local:', error);
      pubClient.disconnect().catch(() => undefined);
      subClient.disconnect().catch(() => undefined);
    });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      next(new Error('Token requerido para tiempo real'));
      return;
    }

    try {
      // El socket usa el mismo JWT del API para no abrir otro mecanismo de login.
      const usuario = jwt.verify(token, configuracionEntorno.jwtSecret) as TokenPayload;
      socket.data.usuario = usuario;
      next();
    } catch {
      next(new Error('Token de tiempo real no valido'));
    }
  });

  io.on('connection', (socket) => {
    const usuario = socket.data.usuario as TokenPayload;
    socket.join(`usuario:${usuario.id}`);
    socket.join(`rol:${usuario.rol}`);

    socket.on('package:join', (paqueteId: string) => {
      // Rooms por paquete y guia para mandar eventos solo a pantallas interesadas.
      if (paqueteId) {
        socket.join(`paquete:${paqueteId}`);
      }
    });

    socket.on('guide:join', (numeroGuia: string) => {
      if (numeroGuia) {
        socket.join(`guia:${numeroGuia}`);
      }
    });
  });

  registrarServidorRealtime(io);
  return io;
};
