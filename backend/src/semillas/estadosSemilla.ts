import { EstadoModelo } from '../modelos/estado.model';

/**
 * Carga los estados iniciales requeridos para el flujo de tracking.
 */
export const cargarEstadosIniciales = async (): Promise<void> => {
  const estadosIniciales = [
    { nombre: 'Creado', descripcion: 'El paquete ha sido registrado', orden: 1 },
    { nombre: 'Asignado a motorista', descripcion: 'El paquete fue asignado a un motorista', orden: 2 },
    { nombre: 'En transito', descripcion: 'El paquete esta en desplazamiento', orden: 3 },
    { nombre: 'Recibido pendiente confirmacion usuario final', descripcion: 'El paquete fue entregado y espera confirmacion', orden: 4 },
    { nombre: 'Recibido usuario final', descripcion: 'El paquete fue confirmado por el destinatario', orden: 5 },
    { nombre: 'Extraviado', descripcion: 'El paquete se considera extraviado', orden: 6 }
  ];

  for (const estado of estadosIniciales) {
    await EstadoModelo.updateOne(
      { nombre: estado.nombre },
      {
        $setOnInsert: {
          ...estado,
          estado: true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        }
      },
      { upsert: true }
    );
  }
};
