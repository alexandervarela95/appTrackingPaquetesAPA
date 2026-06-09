import { z } from 'zod';
import { textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

export const crearTrackingSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: textoRequerido('El numero de guia es obligatorio'),
  estadoId: objectIdSchema,
  descripcion: textoRequerido('La descripcion es obligatoria'),
  lugarActualId: objectIdSchema.optional(),
  usuarioResponsableId: objectIdSchema.optional()
});
