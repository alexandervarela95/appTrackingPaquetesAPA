// Validador de incidenciaValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoRequerido } from './camposComunes';
import { numeroGuiaSchema, objectIdSchema } from './mongoIdValidador';

const estadoIncidenciaSchema = z.enum(['abierta', 'en proceso', 'cerrada'], {
  message: 'El estado de incidencia no es permitido'
});

export const crearIncidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: numeroGuiaSchema,
  tipoIncidencia: textoRequerido('El tipo de incidencia es obligatorio'),
  descripcion: textoRequerido('La descripcion es obligatoria'),
  estadoIncidencia: estadoIncidenciaSchema.default('abierta'),
  reportadoPorId: objectIdSchema
});

export const actualizarIncidenciaSchema = crearIncidenciaSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
