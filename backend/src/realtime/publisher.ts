import { Server } from 'socket.io';
import { EventoRealtime } from './events';

let servidorSocket: Server | null = null;

export const registrarServidorRealtime = (io: Server): void => {
  servidorSocket = io;
};

export interface RealtimePayload<T = unknown> {
  datos?: T;
  paqueteId?: string;
  numeroGuia?: string;
  rol?: string;
  usuarioId?: string;
}

export class RealtimePublisher {
  public static emitir<T>(evento: EventoRealtime, payload: RealtimePayload<T>): void {
    if (!servidorSocket) {
      return;
    }

    try {
      servidorSocket.emit(evento, payload);

      if (payload.paqueteId) {
        servidorSocket.to(`paquete:${payload.paqueteId}`).emit(evento, payload);
      }

      if (payload.numeroGuia) {
        servidorSocket.to(`guia:${payload.numeroGuia}`).emit(evento, payload);
      }

      if (payload.rol) {
        servidorSocket.to(`rol:${payload.rol}`).emit(evento, payload);
      }

      if (payload.usuarioId) {
        servidorSocket.to(`usuario:${payload.usuarioId}`).emit(evento, payload);
      }
    } catch (error) {
      console.warn('[Realtime] No se pudo emitir evento:', evento, error);
    }
  }
}
