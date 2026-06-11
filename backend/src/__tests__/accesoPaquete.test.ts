import { AccesoPaqueteServicio } from '../servicios/accesoPaquete.servicio';
import { TokenPayload } from '../middlewares/auth.middleware';

describe('AccesoPaqueteServicio', () => {
  it('permite al administrador consultar sin filtro adicional', () => {
    const usuario: TokenPayload = {
      id: '507f1f77bcf86cd799439011',
      nombre: 'Admin',
      correo: 'admin@pajaroazul.local',
      rol: 'administrador',
    };

    expect(AccesoPaqueteServicio.construirFiltroPorUsuario(usuario)).toEqual({});
  });

  it('limita al motorista a paquetes asignados', () => {
    const usuario: TokenPayload = {
      id: '507f1f77bcf86cd799439012',
      nombre: 'Motorista',
      correo: 'motorista@pajaroazul.local',
      rol: 'motorista',
    };

    expect(AccesoPaqueteServicio.construirFiltroPorUsuario(usuario)).toEqual({ motoristaAsignadoId: usuario.id });
  });

  it('limita al usuario a paquetes donde participa como remitente o destinatario', () => {
    const usuario: TokenPayload = {
      id: '507f1f77bcf86cd799439013',
      nombre: 'Usuario',
      correo: 'usuario@pajaroazul.local',
      rol: 'usuario',
    };

    expect(AccesoPaqueteServicio.construirFiltroPorUsuario(usuario)).toEqual({
      $or: [{ usuarioRemitenteId: usuario.id }, { usuarioDestinatarioId: usuario.id }],
    });
  });
});
