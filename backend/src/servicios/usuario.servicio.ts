import bcrypt from 'bcryptjs';
import { UsuarioModelo } from '../modelos/usuario.model';

export class UsuarioServicio {
  public static async listarUsuarios() {
    return UsuarioModelo.find({}).select('-contrasena').lean();
  }

  public static async obtenerUsuarioPorId(id: string) {
    return UsuarioModelo.findById(id).select('-contrasena').lean();
  }

  public static async crearUsuario(datos: Partial<any>) {
    const contrasenaEncriptada = await bcrypt.hash(datos.contrasena || '123456', 10);
    const usuario = new UsuarioModelo({
      nombre: datos.nombre,
      correo: datos.correo,
      codigoEmpleado: datos.codigoEmpleado,
      contrasena: contrasenaEncriptada,
      rol: datos.rol,
      lugarAsignadoId: datos.lugarAsignadoId,
      estado: datos.estado !== false
    });
    return usuario.save();
  }

  public static async actualizarUsuario(id: string, datos: Partial<any>) {
    const actualizacion: any = {
      nombre: datos.nombre,
      correo: datos.correo,
      codigoEmpleado: datos.codigoEmpleado,
      rol: datos.rol,
      lugarAsignadoId: datos.lugarAsignadoId,
      estado: datos.estado !== false,
      fechaActualizacion: new Date()
    };

    if (datos.contrasena) {
      actualizacion.contrasena = await bcrypt.hash(datos.contrasena, 10);
    }

    return UsuarioModelo.findByIdAndUpdate(id, actualizacion, { new: true }).select('-contrasena').lean();
  }

  public static async eliminarUsuario(id: string) {
    return UsuarioModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).select('-contrasena').lean();
  }
}
