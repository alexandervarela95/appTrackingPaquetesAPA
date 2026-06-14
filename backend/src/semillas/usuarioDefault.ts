import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { conectarMongo } from '../config/conexionMongo';
import { EstadoModelo } from '../modelos/estado.model';
import { IncidenciaModelo } from '../modelos/incidencia.model';
import { LugarModelo } from '../modelos/lugar.model';
import { PaqueteModelo } from '../modelos/paquete.model';
import { TrackingModelo } from '../modelos/tracking.model';
import { UsuarioModelo } from '../modelos/usuario.model';

const correoSistemas = 'sistemas@pajaroazul.com';
const contrasenaSistemas = 'Sistemas*2026';
const numeroGuiaDemo = 'APA-DEMO-2026';

// Catalogo base de estados para que el sistema pueda operar desde la primera ejecucion.
const estadosDemo = [
  { nombre: 'Creado', descripcion: 'El paquete ha sido registrado', orden: 1 },
  { nombre: 'Asignado a motorista', descripcion: 'El paquete fue asignado a un motorista', orden: 2 },
  { nombre: 'En transito', descripcion: 'El paquete esta en desplazamiento', orden: 3 },
  { nombre: 'Recibido pendiente confirmacion usuario final', descripcion: 'El paquete fue entregado y espera confirmacion', orden: 4 },
  { nombre: 'Recibido usuario final', descripcion: 'El paquete fue confirmado por el destinatario', orden: 5 },
  { nombre: 'Extraviado', descripcion: 'El paquete se considera extraviado', orden: 6 }
];

// Crea datos demo para presentar el sistema sin cargar todo a mano.
// Es idempotente: se puede correr varias veces sin duplicar los registros principales.
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
  const lugarContabilidad = await asegurarLugarDemo('Contabilidad', 'Departamento de contabilidad APA', 'San Pedro Sula', 'Oficina Contabilidad APA', fechaActual);
  const lugarRrhh = await asegurarLugarDemo('Recursos Humanos', 'Departamento de recursos humanos APA', 'San Pedro Sula', 'Oficina RRHH APA', fechaActual);
  const lugarMarketing = await asegurarLugarDemo('Marketing', 'Departamento de marketing APA', 'San Pedro Sula', 'Oficina Marketing APA', fechaActual);
  const lugarCompras = await asegurarLugarDemo('Compras', 'Departamento de compras APA', 'San Pedro Sula', 'Oficina Compras APA', fechaActual);
  const lugarVentas = await asegurarLugarDemo('Ventas', 'Departamento de ventas APA', 'San Pedro Sula', 'Oficina Ventas APA', fechaActual);
  await asegurarLugarDemo('Tegucigalpa', 'Sucursal demo Tegucigalpa', 'Tegucigalpa', 'Sucursal APA Tegucigalpa', fechaActual);
  await asegurarLugarDemo('El Progreso', 'Sucursal demo El Progreso', 'El Progreso', 'Sucursal APA El Progreso', fechaActual);

  const contrasenaHash = await bcrypt.hash(contrasenaSistemas, 10);

  // Usuario principal para entrar a la demo local.
  await UsuarioModelo.findOneAndUpdate(
    { correo: correoSistemas },
    {
      $set: {
        nombre: 'Gixel Varela',
        correo: correoSistemas,
        codigoEmpleado: '0504',
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

  const usuariosDemo = [
    { nombre: 'Daniela Castro', correo: 'daniela.castro@pajaroazul.com', codigoEmpleado: 'CON-1001', rol: 'usuario', lugarAsignadoId: lugarContabilidad._id },
    { nombre: 'Roberto Aguilar', correo: 'roberto.aguilar@pajaroazul.com', codigoEmpleado: 'RRHH-1002', rol: 'usuario', lugarAsignadoId: lugarRrhh._id },
    { nombre: 'Valeria Torres', correo: 'valeria.torres@pajaroazul.com', codigoEmpleado: 'MKT-1003', rol: 'usuario', lugarAsignadoId: lugarMarketing._id },
    { nombre: 'Elena Rivera', correo: 'elena.rivera@pajaroazul.com', codigoEmpleado: 'COM-1004', rol: 'usuario', lugarAsignadoId: lugarCompras._id },
    { nombre: 'Jose Martinez', correo: 'jose.martinez@pajaroazul.com', codigoEmpleado: 'VEN-1005', rol: 'usuario', lugarAsignadoId: lugarVentas._id }
  ];

  const motoristasDemo = [
    { nombre: 'Miguel Hernandez', correo: 'miguel.hernandez@pajaroazul.com', codigoEmpleado: 'MOT-2001', rol: 'motorista', lugarAsignadoId: lugarBodega._id },
    { nombre: 'Jorge Ramirez', correo: 'jorge.ramirez@pajaroazul.com', codigoEmpleado: 'MOT-2002', rol: 'motorista', lugarAsignadoId: lugarBodega._id },
    { nombre: 'Luis Mejia', correo: 'luis.mejia@pajaroazul.com', codigoEmpleado: 'MOT-2003', rol: 'motorista', lugarAsignadoId: lugarBodega._id },
    { nombre: 'Kevin Alvarado', correo: 'kevin.alvarado@pajaroazul.com', codigoEmpleado: 'MOT-2004', rol: 'motorista', lugarAsignadoId: lugarBodega._id },
    { nombre: 'Oscar Pineda', correo: 'oscar.pineda@pajaroazul.com', codigoEmpleado: 'MOT-2005', rol: 'motorista', lugarAsignadoId: lugarBodega._id }
  ];

  const usuariosCreados = await Promise.all(
    usuariosDemo.map((usuario) =>
      asegurarUsuarioDemo(usuario.nombre, usuario.correo, usuario.codigoEmpleado, usuario.rol, usuario.lugarAsignadoId, fechaActual)
    )
  );
  const motoristasCreados = await Promise.all(
    motoristasDemo.map((usuario) =>
      asegurarUsuarioDemo(usuario.nombre, usuario.correo, usuario.codigoEmpleado, usuario.rol, usuario.lugarAsignadoId, fechaActual)
    )
  );

  const remitenteDemo = usuariosCreados[0];
  const destinatarioDemo = usuariosCreados[2];
  const motoristaDemo = motoristasCreados[0];

  // Limpieza de usuarios viejos de demos anteriores para no mezclar credenciales.
  await UsuarioModelo.deleteMany({
    correo: {
      $in: [
        'sistemas@pajaroazul.local',
        'remitente.demo@pajaroazul.local',
        'destinatario.demo@pajaroazul.local',
        'motorista.demo@pajaroazul.local',
        'carlos.mendoza@pajaroazul.com',
        'andrea.lopez@pajaroazul.com'
      ]
    }
  });

  const estadoCreado = await EstadoModelo.findOne({ nombre: 'Creado' });
  const estadoTransito = await EstadoModelo.findOne({ nombre: 'En transito' });
  if (!estadoCreado || !estadoTransito) {
    throw new Error('Estados demo requeridos no encontrados');
  }

  // El paquete demo deja lista una guia con tracking e incidencia para la defensa.
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
