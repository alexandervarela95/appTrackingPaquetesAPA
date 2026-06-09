import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

const prioridadSchema = z.enum(['baja', 'media', 'alta'], {
  message: 'La prioridad no es permitida'
});

export const crearPaqueteSchema = z.object({
  numeroGuia: textoOpcional(),
  descripcion: textoRequerido('La descripcion es obligatoria'),
  tipoPaquete: textoRequerido('El tipo de paquete es obligatorio'),
  prioridad: prioridadSchema.default('media'),
  estadoActualId: objectIdSchema.optional(),
  lugarOrigenId: objectIdSchema,
  lugarDestinoId: objectIdSchema,
  usuarioRemitenteId: objectIdSchema,
  usuarioDestinatarioId: objectIdSchema,
  motoristaAsignadoId: objectIdSchema.optional(),
  observaciones: textoOpcional(),
  usuarioResponsableId: objectIdSchema.optional()
});

export const actualizarPaqueteSchema = crearPaqueteSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
