import jwt from 'jsonwebtoken';
import request from 'supertest';
import { crearApp } from '../app';
import { configuracionEntorno } from '../config/configuracionEntorno';

// Token local para probar rutas protegidas sin depender del login ni de MongoDB.
const crearTokenAdmin = () =>
  jwt.sign(
    {
      id: '507f1f77bcf86cd799439011',
      nombre: 'Admin Test',
      correo: 'admin.test@pajaroazul.local',
      rol: 'administrador'
    },
    configuracionEntorno.jwtSecret
  );

describe('Validaciones de paquetes', () => {
  it('rechaza crear paquete con datos incompletos', async () => {
    const respuesta = await request(crearApp())
      .post('/api/paquetes')
      .set('Authorization', `Bearer ${crearTokenAdmin()}`)
      .send({ tipoPaquete: 'Documento' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
    expect(respuesta.body.errores.some((error: { campo: string }) => error.campo === 'descripcion')).toBe(true);
  });

  it('rechaza ObjectId invalido antes de consultar MongoDB', async () => {
    const respuesta = await request(crearApp())
      .get('/api/paquetes/no-es-id')
      .set('Authorization', `Bearer ${crearTokenAdmin()}`);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
    expect(respuesta.body.errores[0].campo).toBe('id');
  });
});
