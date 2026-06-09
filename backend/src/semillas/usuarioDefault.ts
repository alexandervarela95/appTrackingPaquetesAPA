import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { conectarMongo } from '../config/conexionMongo';
import { EstadoModelo } from '../modelos/estado.model';
import { IncidenciaModelo } from '../modelos/incidencia.model';
import { LugarModelo } from '../modelos/lugar.model';
import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingModelo } from '../modelos/tracking.model';
import { UsuarioModelo } from '../modelos/usuario.model';

const correoSistemas = 'sistemas@pajaroazul.local';
const contrasenaSistemas = 'Sistemas*2026';
const numeroGuiaDemo = 'APA-DEMO-2026';

const estadosDemo = [
  { nombre: 'Creado', descripcion: 'El paquete ha sido registrado', orden: 1 },
  { nombre: 'Asignado a motorista', descripcion: 'El paquete fue asignado a un motorista', orden: 2 },
  { nombre: 'En transito', descripcion: 'El paquete esta en desplazamiento', orden: 3 },
  { nombre: 'Recibido pendiente confirmacion usuario final', descripcion: 'El paquete fue entregado y espera confirmacion', orden: 4 },
  { nombre: 'Recibido usuario final', descripcion: 'El paquete fue confirmado por el destinatario', orden: 5 },
  { nombre: 'Extraviado', descripcion: 'El paquete se considera extraviado', orden: 6 }
];

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

  for (const estado of estadosDemo) {
    await EstadoModelo.findOneAndUpdate(
      { nombre: estado.nombre },
      {
        $setOnInsert: {
          ...estado,
          estado: true,
          fechaCreacion: fechaActual
        },
        $set: {
          fechaActualizacion: fechaActual
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

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

  const lugarSps = await asegurarLugarDemo('Sistemas SPS', 'Sucursal demo para sistemas', 'San Pedro Sula', 'Oficina Sistemas SPS', fechaActual);
  const lugarBodega = await asegurarLugarDemo('Bodega Central', 'Bodega principal de paquetes internos', 'San Pedro Sula', 'Bodega Central APA', fechaActual);
  const lugarCeiba = await asegurarLugarDemo('Tienda La Ceiba', 'Sucursal destino demo', 'La Ceiba', 'Sucursal APA La Ceiba', fechaActual);
  await asegurarLugarDemo('Tegucigalpa', 'Sucursal demo Tegucigalpa', 'Tegucigalpa', 'Sucursal APA Tegucigalpa', fechaActual);
  await asegurarLugarDemo('El Progreso', 'Sucursal demo El Progreso', 'El Progreso', 'Sucursal APA El Progreso', fechaActual);

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

  const remitenteDemo = await asegurarUsuarioDemo('Usuario Remitente Demo', 'remitente.demo@pajaroazul.local', 'REM-DEMO', 'usuario', lugarSps._id, fechaActual);
  const destinatarioDemo = await asegurarUsuarioDemo('Usuario Destinatario Demo', 'destinatario.demo@pajaroazul.local', 'DES-DEMO', 'usuario', lugarCeiba._id, fechaActual);
  const motoristaDemo = await asegurarUsuarioDemo('Motorista Demo', 'motorista.demo@pajaroazul.local', 'MOT-DEMO', 'motorista', lugarBodega._id, fechaActual);

  const estadoCreado = await EstadoModelo.findOne({ nombre: 'Creado' });
  const estadoTransito = await EstadoModelo.findOne({ nombre: 'En transito' });
  if (!estadoCreado || !estadoTransito) {
    throw new Error('Estados demo requeridos no encontrados');
  }

  const paqueteDemo = await PaqueteModelo.findOneAndUpdate(
    { numeroGuia: numeroGuiaDemo },
    {
      $set: {
        descripcion: 'Envio demo de prueba',
        tipoPaquete: 'Documento',
        prioridad: 'media',
        estadoActualId: estadoTransito._id,
        lugarOrigenId: lugarSps._id,
        lugarDestinoId: lugarCeiba._id,
        usuarioRemitenteId: remitenteDemo._id,
        usuarioDestinatarioId: destinatarioDemo._id,
        motoristaAsignadoId: motoristaDemo._id,
        observaciones: 'Paquete creado por seed demo idempotente',
        estado: true,
        fechaActualizacion: fechaActual
      },
      $setOnInsert: {
        numeroGuia: numeroGuiaDemo,
        fechaCreacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await asegurarTrackingDemo(paqueteDemo._id, numeroGuiaDemo, estadoCreado._id, 'Tracking inicial demo', lugarSps._id, remitenteDemo._id, fechaActual);
  await asegurarTrackingDemo(paqueteDemo._id, numeroGuiaDemo, estadoTransito._id, 'Paquete demo en transito', lugarBodega._id, motoristaDemo._id, fechaActual);

  await IncidenciaModelo.findOneAndUpdate(
    { paqueteId: paqueteDemo._id, tipoIncidencia: 'Incidencia demo' },
    {
      $set: {
        paqueteId: paqueteDemo._id,
        numeroGuia: numeroGuiaDemo,
        tipoIncidencia: 'Incidencia demo',
        descripcion: 'Incidencia de prueba asociada al paquete demo',
        estadoIncidencia: 'abierta',
        reportadoPorId: remitenteDemo._id,
        fechaReporte: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log('Datos demo disponibles: Sistemas / Sistemas*2026, lugares y usuarios demo');
};

const asegurarLugarDemo = async (nombre: string, descripcion: string, ciudad: string, direccion: string, fechaActual: Date) => {
  return LugarModelo.findOneAndUpdate(
    { nombre },
    {
      $setOnInsert: {
        nombre,
        descripcion,
        ciudad,
        direccion,
        estado: true,
        fechaCreacion: fechaActual
      },
      $set: {
        fechaActualizacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const asegurarUsuarioDemo = async (nombre: string, correo: string, codigoEmpleado: string, rol: string, lugarAsignadoId: any, fechaActual: Date) => {
  const contrasenaHash = await bcrypt.hash('Demo*2026', 10);

  return UsuarioModelo.findOneAndUpdate(
    { correo },
    {
      $set: {
        nombre,
        correo,
        codigoEmpleado,
        rol,
        lugarAsignadoId,
        estado: true,
        fechaActualizacion: fechaActual
      },
      $setOnInsert: {
        contrasena: contrasenaHash,
        fechaCreacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const asegurarTrackingDemo = async (
  paqueteId: any,
  numeroGuia: string,
  estadoId: any,
  descripcion: string,
  lugarActualId: any,
  usuarioResponsableId: any,
  fechaActual: Date
) => {
  return TrackingModelo.findOneAndUpdate(
    { paqueteId, descripcion },
    {
      $set: {
        paqueteId,
        numeroGuia,
        estadoId,
        descripcion,
        lugarActualId,
        usuarioResponsableId,
        fechaEvento: fechaActual
      },
      $setOnInsert: {
        fechaCreacion: fechaActual
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

ejecutarSeedUsuarioDefault()
  .catch((error) => {
    console.error('Error ejecutando seed de usuario default:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
