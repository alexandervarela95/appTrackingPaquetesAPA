export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}
