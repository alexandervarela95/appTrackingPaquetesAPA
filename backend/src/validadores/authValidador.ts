import { z } from 'zod';
import { textoRequerido } from './camposComunes';

export const loginSchema = z.object({
  correo: textoRequerido('El correo es obligatorio').pipe(z.string().email('El correo debe ser valido')),
  contrasena: textoRequerido('La contrasena es obligatoria')
});
