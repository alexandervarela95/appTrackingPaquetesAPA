// Prueba automatizada que valida el flujo de paquete y evita regresiones en backend.
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { crearApp } from '../app';
import { configuracionEntorno } from '../config/configuracionEntorno';
import { ContadorModelo } from '../modelos/contador.model';
import { formatearNumeroGuia, generarNumeroGuia, PATRON_NUMERO_GUIA } from '../utilidades/generarNumeroGuia';

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
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formatea la primera guia como APA-000001', () => {
    expect(formatearNumeroGuia(1)).toBe('APA-000001');
  });

  it('formatea la segunda guia como APA-000002 y cumple el patron', () => {
    const primera = formatearNumeroGuia(1);
    const segunda = formatearNumeroGuia(2);

    expect(segunda).toBe('APA-000002');
    expect(primera).not.toBe(segunda);
    expect(PATRON_NUMERO_GUIA.test(segunda)).toBe(true);
  });

  it('genera guias secuenciales desde el contador atomico', async () => {
    jest
      .spyOn(ContadorModelo, 'findOneAndUpdate')
      .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue({ seq: 1 }) } as any)
      .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue({ seq: 2 }) } as any);

    await expect(generarNumeroGuia()).resolves.toBe('APA-000001');
    await expect(generarNumeroGuia()).resolves.toBe('APA-000002');
  });

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

  it('rechaza busqueda por guia con formato viejo', async () => {
    const respuesta = await request(crearApp())
      .get('/api/paquetes/guia/APA-MQDT0PT1-0ED4CD')
      .set('Authorization', `Bearer ${crearTokenAdmin()}`);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
    expect(respuesta.body.errores[0].mensaje).toBe('Formato de guia invalido. Ejemplo: APA-000001');
  });

  it('rechaza consolidacion con lista vacia antes de guardar', async () => {
    const respuesta = await request(crearApp())
      .post('/api/paquetes/bulk')
      .set('Authorization', `Bearer ${crearTokenAdmin()}`)
      .send({
        lugarOrigenId: '507f1f77bcf86cd799439021',
        lugarDestinoId: '507f1f77bcf86cd799439022',
        usuarioRemitenteId: '507f1f77bcf86cd799439023',
        usuarioDestinatarioId: '507f1f77bcf86cd799439024',
        prioridad: 'media',
        paquetes: [],
      });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
    expect(respuesta.body.errores.some((error: { campo: string }) => error.campo === 'paquetes')).toBe(true);
  });

  it('rechaza consolidacion con mas de 50 paquetes', async () => {
    const paquetes = Array.from({ length: 51 }, (_, indice) => ({
      tipoPaquete: 'Documento',
      descripcion: `Documento ${indice + 1}`,
    }));

    const respuesta = await request(crearApp())
      .post('/api/paquetes/bulk')
      .set('Authorization', `Bearer ${crearTokenAdmin()}`)
      .send({
        lugarOrigenId: '507f1f77bcf86cd799439021',
        lugarDestinoId: '507f1f77bcf86cd799439022',
        usuarioRemitenteId: '507f1f77bcf86cd799439023',
        usuarioDestinatarioId: '507f1f77bcf86cd799439024',
        prioridad: 'media',
        paquetes,
      });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('Datos invalidos');
  });
});
