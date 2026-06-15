// Validador de evidenciaValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';
import { numeroGuiaSchema, objectIdSchema } from './mongoIdValidador';

export const crearEvidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: numeroGuiaSchema,
  tipoEvidencia: textoRequerido('El tipo de evidencia es obligatorio'),
  descripcion: textoOpcional(),
  rutaArchivo: textoOpcional(),
  reportadoPorId: objectIdSchema
});

export const subirEvidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: numeroGuiaSchema,
  tipoEvidencia: textoRequerido('El tipo de evidencia es obligatorio'),
  descripcion: textoOpcional()
});
