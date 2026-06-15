// Validador de lugarValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoOpcional, textoRequerido } from './camposComunes';

export const crearLugarSchema = z.object({
  nombre: textoRequerido('El nombre es obligatorio'),
  descripcion: textoOpcional(),
  ciudad: textoRequerido('La ciudad es obligatoria'),
  direccion: textoRequerido('La direccion es obligatoria'),
  estado: z.boolean().optional()
});

export const actualizarLugarSchema = crearLugarSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
