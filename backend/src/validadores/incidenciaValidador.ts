import { z } from 'zod';
import { textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

const estadoIncidenciaSchema = z.enum(['abierta', 'en proceso', 'cerrada'], {
  message: 'El estado de incidencia no es permitido'
});

export const crearIncidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: textoRequerido('El numero de guia es obligatorio'),
  tipoIncidencia: textoRequerido('El tipo de incidencia es obligatorio'),
  descripcion: textoRequerido('La descripcion es obligatoria'),
  estadoIncidencia: estadoIncidenciaSchema.default('abierta'),
  reportadoPorId: objectIdSchema
});

export const actualizarIncidenciaSchema = crearIncidenciaSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
