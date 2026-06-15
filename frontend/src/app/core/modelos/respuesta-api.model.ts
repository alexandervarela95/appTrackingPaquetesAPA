// Modelo de respuesta api: define la forma de los datos persistidos y sus tipos principales.
export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}
