import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../modelos/respuesta-api.model';

// Servicio base para CRUD simples. Evita repetir las mismas llamadas HTTP en cada catalogo.
export abstract class ApiCrudServicio<T> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly rutaBase: string,
  ) {}

  public listar(): Observable<T[]> {
    return this.http.get<RespuestaApi<T[]>>(this.rutaBase).pipe(map((respuesta) => respuesta.datos || []));
  }

  public obtenerPorId(id: string): Observable<T> {
    return this.http.get<RespuestaApi<T>>(`${this.rutaBase}/${id}`).pipe(map((respuesta) => respuesta.datos));
  }

  public crear(datos: Partial<T>): Observable<T> {
    return this.http.post<RespuestaApi<T>>(this.rutaBase, datos).pipe(map((respuesta) => respuesta.datos));
  }

  public actualizar(id: string, datos: Partial<T>): Observable<T> {
    return this.http.put<RespuestaApi<T>>(`${this.rutaBase}/${id}`, datos).pipe(map((respuesta) => respuesta.datos));
  }

  public eliminar(id: string): Observable<T> {
    return this.http.delete<RespuestaApi<T>>(`${this.rutaBase}/${id}`).pipe(map((respuesta) => respuesta.datos));
  }
}
