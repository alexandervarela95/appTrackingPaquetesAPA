import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class UsuarioServicio extends ApiCrudServicio<Usuario> {
  public constructor(http: HttpClient) {
    super(http, '/api/usuarios');
  }
}
