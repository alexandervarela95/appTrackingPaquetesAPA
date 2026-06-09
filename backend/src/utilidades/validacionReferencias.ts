import { LugarModelo } from '../modelos/lugar.model';
import { UsuarioModelo } from '../modelos/usuario.model';
import { EstadoModelo } from '../modelos/estado.model';

interface ValidarReferenciasOptions {
  lugarOrigenId?: string;
  lugarDestinoId?: string;
  usuarioRemitenteId?: string;
  usuarioDestinatarioId?: string;
  motoristaAsignadoId?: string;
  estadoActualId?: string;
}

/**
 * Valida que las referencias de ids existan en las colecciones correspondientes.
 * @param opciones IDs a validar.
 * @returns Error con mensaje si falta alguna referencia.
 */
export const validarReferenciasPaquete = async (opciones: ValidarReferenciasOptions): Promise<string[]> => {
  const errores: string[] = [];

  if (opciones.lugarOrigenId) {
    const lugarOrigen = await LugarModelo.findById(opciones.lugarOrigenId).lean();
    if (!lugarOrigen) {
      errores.push('Lugar de origen no encontrado');
    }
  }

  if (opciones.lugarDestinoId) {
    const lugarDestino = await LugarModelo.findById(opciones.lugarDestinoId).lean();
    if (!lugarDestino) {
      errores.push('Lugar de destino no encontrado');
    }
  }

  if (opciones.usuarioRemitenteId) {
    const remitente = await UsuarioModelo.findById(opciones.usuarioRemitenteId).lean();
    if (!remitente) {
      errores.push('Usuario remitente no encontrado');
    }
  }

  if (opciones.usuarioDestinatarioId) {
    const destinatario = await UsuarioModelo.findById(opciones.usuarioDestinatarioId).lean();
    if (!destinatario) {
      errores.push('Usuario destinatario no encontrado');
    }
  }

  if (opciones.motoristaAsignadoId) {
    const motorista = await UsuarioModelo.findById(opciones.motoristaAsignadoId).lean();
    if (!motorista) {
      errores.push('Motorista asignado no encontrado');
    }
  }

  if (opciones.estadoActualId) {
    const estadoActual = await EstadoModelo.findById(opciones.estadoActualId).lean();
    if (!estadoActual) {
      errores.push('Estado actual no encontrado');
    }
  }

  return errores;
};
