// Modelo de dashboard: define la forma de los datos persistidos y sus tipos principales.
export interface DashboardResumen {
  totalEstados: number;
  paquetesActivos: number;
  incidenciasAbiertas: number;
  evidenciasRegistradas: number;
  paquetesPorEstado: Array<{ _id: string; total: number }>;
}
