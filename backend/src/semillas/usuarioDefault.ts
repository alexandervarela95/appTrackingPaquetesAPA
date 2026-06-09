import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { conectarMongo } from '../config/conexionMongo';
import { LugarModelo } from '../modelos/lugar.model';
import { UsuarioModelo } from '../modelos/usuario.model';

const correoSistemas = 'sistemas@pajaroazul.local';
const contrasenaSistemas = 'Sistemas*2026';

/**
 * Crea los datos minimos para iniciar una presentacion del sistema.
 *
 * @remarks
 * El proceso es idempotente: usa el correo tecnico como llave unica, no duplica
 * usuarios y siempre guarda la contrasena como hash bcrypt.
 */
const ejecutarSeedUsuarioDefault = async (): Promise<void> => {
  await conectarMongo();

  const fechaActual = new Date();

  const lugarSistemas = await LugarModelo.findOneAndUpdate(
    { nombre: 'Administracion Sistemas' },
    {
      $setOnInsert: {
        nombre: 'Administracion Sistemas',
        descripcion: 'Lugar tecnico para usuario administrador por defecto',
        ciudad: 'San Pedro Sula',
        direccion: 'Almacen Pajaro Azul',
        estado: true,
        fechaCreacion: fechaActual
      },
      $set: {
        fechaActualizacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const contrasenaHash = await bcrypt.hash(contrasenaSistemas, 10);

  await UsuarioModelo.findOneAndUpdate(
    { correo: correoSistemas },
    {
      $set: {
        nombre: 'Sistemas',
        correo: correoSistemas,
        codigoEmpleado: 'SISTEMAS-2026',
        contrasena: contrasenaHash,
        rol: 'administrador',
        lugarAsignadoId: lugarSistemas._id,
        estado: true,
        fechaActualizacion: fechaActual
      },
      $setOnInsert: {
        fechaCreacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log('Usuario default disponible: Sistemas / Sistemas*2026');
};

ejecutarSeedUsuarioDefault()
  .catch((error) => {
    console.error('Error ejecutando seed de usuario default:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
