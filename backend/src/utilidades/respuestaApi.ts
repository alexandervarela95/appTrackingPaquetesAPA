export interface RespuestaApi<T = unknown> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  errores?: string[];
}

export const respuestaExitosa = <T>(mensaje: string, datos: T): RespuestaApi<T> => ({
  exito: true,
  mensaje,
  datos
});

export const respuestaError = (mensaje: string, errores: string[] = []): RespuestaApi => ({
  exito: false,
  mensaje,
  errores
});
