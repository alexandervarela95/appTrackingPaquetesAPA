/**
 * Contrato uniforme usado por todos los endpoints del backend.
 */
export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}
