import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Paquete } from '../modelos/paquete.model';
import { RespuestaApi } from '../modelos/respuesta-api.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class PaqueteServicio extends ApiCrudServicio<Paquete> {
  public constructor(http: HttpClient) {
    super(http, '/api/paquetes');
  }

  public obtenerPorGuia(numeroGuia: string) {
    return this.http
      .get<RespuestaApi<Paquete>>(`/api/paquetes/guia/${encodeURIComponent(numeroGuia)}`)
      .pipe(map((respuesta) => respuesta.datos));
  }
}
