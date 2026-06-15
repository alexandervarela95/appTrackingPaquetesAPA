// Servicio de auth: concentra la regla de negocio y las operaciones de datos reutilizables.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioModelo } from '../modelos/usuario.model';
import { configuracionEntorno } from '../config/configuracionEntorno';

/**
 * Servicio de autenticacion que valida credenciales y genera tokens.
 */
export class AuthServicio {
  public static async iniciarSesion(correo: string, contrasena: string) {
    const usuario = await UsuarioModelo.findOne({ correo: correo.toLowerCase(), estado: true }).lean();

    if (!usuario) {
      throw new Error('Credenciales invalidas');
    }

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) {
      throw new Error('Credenciales invalidas');
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      configuracionEntorno.jwtSecret as jwt.Secret,
      { expiresIn: configuracionEntorno.jwtExpiraEn as jwt.SignOptions['expiresIn'] }
    );

    return { token, usuario: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } };
  }
}
