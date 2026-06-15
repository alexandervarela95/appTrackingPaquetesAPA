// Validador de authValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';
import { textoRequerido } from './camposComunes';

// Login solo recibe correo y contrasena. El rol sale del usuario guardado en MongoDB.
export const loginSchema = z.object({
  correo: textoRequerido('El correo es obligatorio').pipe(z.string().email('El correo debe ser valido')),
  contrasena: textoRequerido('La contrasena es obligatoria')
});
