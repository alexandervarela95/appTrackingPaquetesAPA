import request from 'supertest';
import { crearApp } from '../app';

describe('POST /api/auth/login', () => {
  it('rechaza credenciales incompletas con error de validacion', async () => {
    const respuesta = await request(crearApp()).post('/api/auth/login').send({ correo: 'correo-invalido' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.exito).toBe(false);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
    expect(respuesta.body.errores.length).toBeGreaterThan(0);
  });
});
