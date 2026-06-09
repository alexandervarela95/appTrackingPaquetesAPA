export interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  correo: string;
  codigoEmpleado: string;
  contrasena?: string;
  rol: 'usuario' | 'motorista' | 'administrador' | string;
  lugarAsignadoId: string;
  estado?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
