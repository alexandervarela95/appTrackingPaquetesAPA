// Datos semilla de datosIniciales: prepara informacion inicial necesaria para usar el sistema.
import bcrypt from 'bcryptjs';
import { LugarModelo } from '../modelos/lugar.model';
import { EstadoModelo } from '../modelos/estado.model';
import { UsuarioModelo } from '../modelos/usuario.model';

/**
 * Carga los datos iniciales de estados, lugar y usuario administrador.
 */
export const cargarDatosIniciales = async (): Promise<void> => {
  const estadosIniciales = [
    { nombre: 'Creado', descripcion: 'El paquete ha sido registrado', orden: 1 },
    { nombre: 'Asignado a motorista', descripcion: 'El paquete fue asignado a un motorista', orden: 2 },
    { nombre: 'En transito', descripcion: 'El paquete esta en desplazamiento', orden: 3 },
    { nombre: 'Recibido pendiente confirmacion usuario final', descripcion: 'El paquete fue entregado y espera confirmacion', orden: 4 },
    { nombre: 'Recibido usuario final', descripcion: 'El paquete fue confirmado por el destinatario', orden: 5 },
    { nombre: 'Extraviado', descripcion: 'El paquete se considera extraviado', orden: 6 }
  ];

  for (const estado of estadosIniciales) {
    await EstadoModelo.updateOne({ nombre: estado.nombre }, { $setOnInsert: { ...estado, estado: true, fechaCreacion: new Date(), fechaActualizacion: new Date() } }, { upsert: true });
  }

  const lugarExistente = await LugarModelo.findOne({ nombre: 'Central APA' }).lean();
  const lugarId = lugarExistente?._id || (await new LugarModelo({ nombre: 'Central APA', descripcion: 'Sucursal principal de Almacen Pájaro Azul', ciudad: 'Ciudad Central', direccion: 'Avenida Principal 123', estado: true }).save())._id;

  const usuarioAdmin = await UsuarioModelo.findOne({ correo: 'admin@apa.local' }).lean();
  if (!usuarioAdmin) {
    const contrasenaEncriptada = await bcrypt.hash('Admin123!', 10);
    await new UsuarioModelo({
      nombre: 'Administrador APA',
      correo: 'admin@apa.local',
      codigoEmpleado: 'ADMIN001',
      contrasena: contrasenaEncriptada,
      rol: 'administrador',
      lugarAsignadoId: lugarId,
      estado: true
    }).save();
  }
};
