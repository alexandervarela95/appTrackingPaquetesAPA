import { PaqueteModelo } from '../modelos/paquete.model';
import { TokenPayload } from '../middlewares/auth.middleware';

export class AccesoPaqueteServicio {
  public static construirFiltroPorUsuario(usuario: TokenPayload): Record<string, unknown> {
    if (usuario.rol === 'administrador') {
      return {};
    }

    if (usuario.rol === 'motorista') {
      return { motoristaAsignadoId: usuario.id };
    }

    return {
      $or: [
        { usuarioRemitenteId: usuario.id },
        { usuarioDestinatarioId: usuario.id },
      ],
    };
  }

  public static async usuarioPuedeVerPaquete(usuario: TokenPayload, paqueteId: string): Promise<boolean> {
    const paquete = await PaqueteModelo.findById(paqueteId).select('_id usuarioRemitenteId usuarioDestinatarioId motoristaAsignadoId').lean();
    if (!paquete) {
      return false;
    }

    if (usuario.rol === 'administrador') {
      return true;
    }

    const idUsuario = String(usuario.id);
    return [
      paquete.usuarioRemitenteId,
      paquete.usuarioDestinatarioId,
      paquete.motoristaAsignadoId,
    ].some((valor) => String(valor || '') === idUsuario);
  }

  public static async usuarioPuedeGestionarTracking(usuario: TokenPayload, paqueteId: string): Promise<boolean> {
    if (usuario.rol === 'administrador') {
      return true;
    }

    if (usuario.rol !== 'motorista') {
      return false;
    }

    const paquete = await PaqueteModelo.findById(paqueteId).select('motoristaAsignadoId').lean();
    return String(paquete?.motoristaAsignadoId || '') === String(usuario.id);
  }
}
