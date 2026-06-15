// Validador de trackingValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoRequerido } from './camposComunes';
import { numeroGuiaSchema, objectIdSchema } from './mongoIdValidador';

export const crearTrackingSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: numeroGuiaSchema,
  estadoId: objectIdSchema,
  descripcion: textoRequerido('La descripcion es obligatoria'),
  lugarActualId: objectIdSchema.optional(),
  usuarioResponsableId: objectIdSchema.optional()
});
