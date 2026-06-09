import { z } from 'zod';

const patronObjectId = /^[a-fA-F0-9]{24}$/;

export const objectIdSchema = z.preprocess(
  (valor) => (valor === undefined || valor === null ? '' : valor),
  z.string().trim().regex(patronObjectId, 'Debe ser un ObjectId valido')
);

export const idParamSchema = z.object({
  id: objectIdSchema
});

export const paqueteIdParamSchema = z.object({
  paqueteId: objectIdSchema
});
