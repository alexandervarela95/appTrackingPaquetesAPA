// Modelo de auth user: define la forma de los datos persistidos y sus tipos principales.
export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}
