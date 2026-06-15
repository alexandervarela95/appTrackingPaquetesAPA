// Validador de mongoIdValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
import { z } from 'zod';

const patronObjectId = /^[a-fA-F0-9]{24}$/;
const patronNumeroGuia = /^APA-\d{6}$/;

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

export const numeroGuiaSchema = z.preprocess(
  (valor) => (valor === undefined || valor === null ? '' : String(valor).trim().toUpperCase()),
  z.string().regex(patronNumeroGuia, 'Formato de guia invalido. Ejemplo: APA-000001')
);

export const numeroGuiaParamSchema = z.object({
  numeroGuia: numeroGuiaSchema
});
