import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RespuestaApi } from '../modelos/respuesta-api.model';
import { Tracking } from '../modelos/tracking.model';

@Injectable({ providedIn: 'root' })
export class TrackingServicio {
  public constructor(private readonly http: HttpClient) {}

  public listarPorPaquete(paqueteId: string) {
    return this.http
      .get<RespuestaApi<Tracking[]>>(`/api/tracking/paquete/${paqueteId}`)
      .pipe(map((respuesta) => respuesta.datos || []));
  }

  public listarPorGuia(numeroGuia: string) {
    return this.http
      .get<RespuestaApi<Tracking[]>>(`/api/tracking/guia/${encodeURIComponent(numeroGuia)}`)
      .pipe(map((respuesta) => respuesta.datos || []));
  }

  public crear(datos: Partial<Tracking>) {
    return this.http.post<RespuestaApi<Tracking>>('/api/tracking', datos).pipe(map((respuesta) => respuesta.datos));
  }
}
