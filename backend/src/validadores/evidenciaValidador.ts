import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

export const crearEvidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: textoRequerido('El numero de guia es obligatorio'),
  tipoEvidencia: textoRequerido('El tipo de evidencia es obligatorio'),
  descripcion: textoOpcional(),
  rutaArchivo: textoOpcional(),
  reportadoPorId: objectIdSchema
});

export const subirEvidenciaSchema = z.object({
  paqueteId: objectIdSchema,
  numeroGuia: textoRequerido('El numero de guia es obligatorio'),
  tipoEvidencia: textoRequerido('El tipo de evidencia es obligatorio'),
  descripcion: textoOpcional()
});
