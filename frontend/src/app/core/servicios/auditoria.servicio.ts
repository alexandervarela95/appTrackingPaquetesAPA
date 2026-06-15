// Servicio de auditoria: concentra la regla de negocio y las operaciones de datos reutilizables.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RespuestaApi } from '../modelos/respuesta-api.model';

export interface AuditLog {
  _id?: string;
  usuarioId?: string;
  rol?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  descripcion: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaServicio {
  public constructor(private readonly http: HttpClient) {}

  public listar() {
    return this.http.get<RespuestaApi<{ datos: AuditLog[] }>>('/api/auditoria').pipe(map((respuesta) => respuesta.datos.datos || []));
  }
}
