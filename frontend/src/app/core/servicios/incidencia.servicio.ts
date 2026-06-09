import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incidencia } from '../modelos/incidencia.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class IncidenciaServicio extends ApiCrudServicio<Incidencia> {
  public constructor(http: HttpClient) {
    super(http, '/api/incidencias');
  }
}
