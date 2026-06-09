import { z } from 'zod';
import { textoRequerido } from './camposComunes';
import { objectIdSchema } from './mongoIdValidador';

const rolSchema = z.enum(['usuario', 'motorista', 'administrador'], {
  message: 'El rol no es permitido'
});

export const crearUsuarioSchema = z.object({
  nombre: textoRequerido('El nombre es obligatorio'),
  correo: textoRequerido('El correo es obligatorio').pipe(z.string().email('El correo debe ser valido')),
  codigoEmpleado: textoRequerido('El codigo de empleado es obligatorio'),
  contrasena: z.string().trim().min(6, 'La contrasena debe tener al menos 6 caracteres').optional(),
  rol: rolSchema,
  lugarAsignadoId: objectIdSchema,
  estado: z.boolean().optional()
});

export const actualizarUsuarioSchema = crearUsuarioSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});
