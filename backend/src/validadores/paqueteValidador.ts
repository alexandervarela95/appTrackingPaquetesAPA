// Validador de paqueteValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

const prioridadSchema = z.enum(['baja', 'media', 'alta'], {
  message: 'La prioridad no es permitida'
});

// Validacion del paquete antes de tocar MongoDB. Las referencias deben venir como ObjectId.
export const crearPaqueteSchema = z.object({
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

const paqueteConsolidadoSchema = z.object({
  tipoPaquete: textoRequerido('El tipo de paquete es obligatorio'),
  descripcion: textoRequerido('La descripcion es obligatoria'),
  observaciones: textoOpcional()
});

export const crearPaquetesBulkSchema = z.object({
  lugarOrigenId: objectIdSchema,
  lugarDestinoId: objectIdSchema,
  usuarioRemitenteId: objectIdSchema,
  usuarioDestinatarioId: objectIdSchema,
  motoristaAsignadoId: objectIdSchema.optional(),
  prioridad: prioridadSchema.default('media'),
  observacionGeneral: textoOpcional(),
  paquetes: z.array(paqueteConsolidadoSchema).min(1, 'Debe agregar al menos un paquete').max(50, 'Solo se permiten hasta 50 paquetes por lote')
});

// En actualizaciones aceptamos campos parciales, pero no dejamos pasar un body vacio.
export const actualizarPaqueteSchema = crearPaqueteSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
