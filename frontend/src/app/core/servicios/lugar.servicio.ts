import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lugar } from '../modelos/lugar.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class LugarServicio extends ApiCrudServicio<Lugar> {
  public constructor(http: HttpClient) {
    super(http, '/api/lugares');
  }
}
