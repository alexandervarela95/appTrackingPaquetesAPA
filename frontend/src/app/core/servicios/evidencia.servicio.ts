import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../modelos/evidencia.model';
import { RespuestaApi } from '../modelos/respuesta-api.model';
import { ApiCrudServicio } from './api-crud.servicio';

@Injectable({ providedIn: 'root' })
export class EvidenciaServicio extends ApiCrudServicio<Evidencia> {
  public constructor(http: HttpClient) {
    super(http, '/api/evidencias');
  }

  public subirEvidencia(datos: {
    paqueteId: string;
    numeroGuia: string;
    tipoEvidencia: string;
    descripcion?: string;
    archivo: File;
  }): Observable<Evidencia> {
    const formulario = new FormData();
    formulario.append('paqueteId', datos.paqueteId);
    formulario.append('numeroGuia', datos.numeroGuia);
    formulario.append('tipoEvidencia', datos.tipoEvidencia);
    formulario.append('descripcion', datos.descripcion || '');
    formulario.append('archivo', datos.archivo);

    return this.http.post<RespuestaApi<Evidencia>>('/api/evidencias/upload', formulario).pipe(map((respuesta) => respuesta.datos));
  }

  public descargarArchivo(id: string): Observable<Blob> {
    return this.http.get(`/api/evidencias/archivo/${id}`, { responseType: 'blob' });
  }
}
