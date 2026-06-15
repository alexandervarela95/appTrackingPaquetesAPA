// Servicio de dashboard: concentra la regla de negocio y las operaciones de datos reutilizables.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DashboardResumen } from '../modelos/dashboard.model';
import { RespuestaApi } from '../modelos/respuesta-api.model';

@Injectable({ providedIn: 'root' })
export class DashboardServicio {
  public constructor(private readonly http: HttpClient) {}

  public obtenerResumen() {
    return this.http.get<RespuestaApi<DashboardResumen>>('/api/dashboard/resumen').pipe(map((respuesta) => respuesta.datos));
  }
}
