import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { configuracionEntorno } from '../config/configuracionEntorno';
import { TokenPayload } from '../middlewares/auth.middleware';
import { registrarServidorRealtime } from './publisher';

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
