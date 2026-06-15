// Servicio de reporte: concentra la regla de negocio y las operaciones de datos reutilizables.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RespuestaApi } from '../modelos/respuesta-api.model';

@Injectable({ providedIn: 'root' })
export class ReporteServicio {
  public constructor(private readonly http: HttpClient) {}

  public paquetesPorEstado() {
    return this.http.get<RespuestaApi<Array<{ _id: string; total: number }>>>('/api/reportes/paquetes-por-estado').pipe(map((respuesta) => respuesta.datos || []));
  }

  public incidencias() {
    return this.http.get<RespuestaApi<unknown[]>>('/api/reportes/incidencias').pipe(map((respuesta) => respuesta.datos || []));
  }

  public actividad() {
    return this.http.get<RespuestaApi<unknown[]>>('/api/reportes/actividad').pipe(map((respuesta) => respuesta.datos || []));
  }
}
