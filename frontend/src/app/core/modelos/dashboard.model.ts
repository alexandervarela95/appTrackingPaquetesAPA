export interface DashboardResumen {
  totalEstados: number;
  paquetesActivos: number;
  incidenciasAbiertas: number;
  evidenciasRegistradas: number;
  paquetesPorEstado: Array<{ _id: string; total: number }>;
}
