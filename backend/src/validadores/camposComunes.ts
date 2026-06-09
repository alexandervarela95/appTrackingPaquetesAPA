import { z } from 'zod';

export const textoRequerido = (mensaje: string) =>
  z.preprocess((valor) => (valor === undefined || valor === null ? '' : valor), z.string().trim().min(1, mensaje));

export const textoOpcional = () => z.string().trim().optional();
