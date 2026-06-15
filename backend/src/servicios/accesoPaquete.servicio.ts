// Servicio de accesoPaquete: concentra la regla de negocio y las operaciones de datos reutilizables.
import { PaqueteModelo } from '../modelos/paquete.model';
import { TokenPayload } from '../middlewares/auth.middleware';

// Reglas de acceso a paquetes. Mantenerlas juntas evita repetir filtros en cada controlador.
export class AccesoPaqueteServicio {
  public static construirFiltroPorUsuario(usuario: TokenPayload): Record<string, unknown> {
    if (usuario.rol === 'administrador') {
      return {};
    }

    if (usuario.rol === 'motorista') {
      // El motorista solo ve los paquetes que le fueron asignados.
      return { motoristaAsignadoId: usuario.id };
    }

    // Un usuario normal solo ve envios donde participa como remitente o destinatario.
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

    // Para cambiar tracking, el motorista debe estar asignado al paquete.
    const paquete = await PaqueteModelo.findById(paqueteId).select('motoristaAsignadoId').lean();
    return String(paquete?.motoristaAsignadoId || '') === String(usuario.id);
  }
}
