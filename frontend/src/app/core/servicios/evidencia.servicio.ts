import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evidencia } from '../modelos/evidencia.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class EvidenciaServicio extends ApiCrudServicio<Evidencia> {
  public constructor(http: HttpClient) {
    super(http, '/api/evidencias');
  }
}
