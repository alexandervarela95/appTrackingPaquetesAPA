import request from 'supertest';
import { crearApp } from '../app';

describe('GET /api/salud', () => {
  it('responde estado OK sin autenticacion', async () => {
    const respuesta = await request(crearApp()).get('/api/salud');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.exito).toBe(true);
    expect(respuesta.body.datos.estado).toBe('OK');
  });
});
