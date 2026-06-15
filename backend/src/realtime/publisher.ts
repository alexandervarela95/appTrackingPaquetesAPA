// Soporte de tiempo real para publicar eventos de publisher hacia clientes conectados.
import { Server } from 'socket.io';
import { EventoRealtime } from './events';

let servidorSocket: Server | null = null;

// Guardamos la instancia de Socket.IO para emitir desde servicios o controladores.
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
      // Emitimos global y tambien por rooms cuando el payload trae paquete, guia, rol o usuario.
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
