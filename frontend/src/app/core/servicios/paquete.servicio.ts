// Servicio de paquete: concentra la regla de negocio y las operaciones de datos reutilizables.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Paquete } from '../modelos/paquete.model';
import { RespuestaApi } from '../modelos/respuesta-api.model';
import { ApiCrudServicio } from './api-crud.servicio';

export interface PaqueteBulkItem {
  tipoPaquete: string;
  descripcion: string;
  observaciones?: string;
}

export interface PaqueteBulkPayload {
  lugarOrigenId: string;
  lugarDestinoId: string;
  usuarioRemitenteId: string;
  usuarioDestinatarioId: string;
  motoristaAsignadoId?: string;
  prioridad: string;
  observacionGeneral?: string;
  paquetes: PaqueteBulkItem[];
}

export interface PaqueteBulkRespuesta {
  paquetes: Paquete[];
  parcial: boolean;
  advertencia?: string;
}

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

  public crearBulk(datos: PaqueteBulkPayload) {
    return this.http.post<RespuestaApi<PaqueteBulkRespuesta>>('/api/paquetes/bulk', datos).pipe(map((respuesta) => respuesta.datos));
  }
}
