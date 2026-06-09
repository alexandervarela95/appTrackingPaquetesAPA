import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estado } from '../modelos/estado.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class EstadoServicio extends ApiCrudServicio<Estado> {
  public constructor(http: HttpClient) {
    super(http, '/api/estados');
  }
}
