import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';

export const crearEstadoSchema = z.object({
  nombre: textoRequerido('El nombre es obligatorio'),
  descripcion: textoOpcional(),
  orden: z.coerce.number().int('El orden debe ser numerico').positive('El orden debe ser mayor que cero'),
  estado: z.boolean().optional()
});

export const actualizarEstadoSchema = crearEstadoSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
