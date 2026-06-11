export const EventosRealtime = {
  DashboardActualizado: 'dashboard:updated',
  PaqueteCreado: 'package:created',
  PaqueteActualizado: 'package:updated',
  EstadoPaqueteCambiado: 'package:status-changed',
  TrackingCreado: 'tracking:created',
  IncidenciaCreada: 'incident:created',
  IncidenciaActualizada: 'incident:updated',
  EvidenciaSubida: 'evidence:uploaded',
  CatalogoActualizado: 'catalog:updated',
  AuditoriaRegistrada: 'audit:created',
} as const;

export type EventoRealtime = (typeof EventosRealtime)[keyof typeof EventosRealtime];
