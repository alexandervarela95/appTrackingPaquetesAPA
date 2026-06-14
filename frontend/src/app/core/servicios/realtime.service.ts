import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export type EstadoRealtime = 'desconectado' | 'conectando' | 'conectado' | 'reconectando' | 'error';

export interface EventoRealtime<T = unknown> {
  datos?: T;
  paqueteId?: string;
  numeroGuia?: string;
}

@Injectable({ providedIn: 'root' })
// Servicio de Socket.IO. Mantiene una sola conexion y reparte eventos como observables.
export class RealtimeService {
  private socket?: Socket;
  private readonly estadoSubject = new BehaviorSubject<EstadoRealtime>('desconectado');
  private readonly eventos = new Map<string, Subject<EventoRealtime>>();

  public readonly estado$ = this.estadoSubject.asObservable();

  public constructor(
    private readonly zone: NgZone,
  ) {}

  public conectar(): void {
    const token = localStorage.getItem('apa-token');
    if (!token || this.socket?.connected) {
      return;
    }

    this.estadoSubject.next('conectando');
    // Se conecta al mismo host del frontend; el proxy local manda /socket.io al backend.
    this.socket = io('/', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => this.zone.run(() => this.estadoSubject.next('conectado')));
    this.socket.io.on('reconnect_attempt', () => this.zone.run(() => this.estadoSubject.next('reconectando')));
    this.socket.on('disconnect', () => this.zone.run(() => this.estadoSubject.next('desconectado')));
    this.socket.on('connect_error', () => this.zone.run(() => this.estadoSubject.next('error')));

    [
      'dashboard:updated',
      'package:created',
      'package:updated',
      'package:status-changed',
      'tracking:created',
      'incident:created',
      'incident:updated',
      'evidence:uploaded',
      'catalog:updated',
      'audit:created',
    ].forEach((evento) => {
      this.socket?.on(evento, (payload: EventoRealtime) => {
        this.zone.run(() => this.obtenerSubject(evento).next(payload));
      });
    });
  }

  public desconectar(): void {
    this.socket?.disconnect();
    this.socket = undefined;
    this.estadoSubject.next('desconectado');
  }

  public escuchar<T = unknown>(evento: string): Observable<EventoRealtime<T>> {
    // Los componentes no necesitan saber si el socket ya estaba conectado.
    this.conectar();
    return this.obtenerSubject(evento).asObservable() as Observable<EventoRealtime<T>>;
  }

  public unirseAPaquete(paqueteId: string): void {
    this.conectar();
    this.socket?.emit('package:join', paqueteId);
  }

  public unirseAGuia(numeroGuia: string): void {
    this.conectar();
    this.socket?.emit('guide:join', numeroGuia);
  }

  private obtenerSubject(evento: string): Subject<EventoRealtime> {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, new Subject<EventoRealtime>());
    }
    return this.eventos.get(evento)!;
  }
}
