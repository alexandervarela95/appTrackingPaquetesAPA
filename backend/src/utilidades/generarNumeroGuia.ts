// Utilidad de generarNumeroGuia: obtiene la siguiente guia secuencial desde MongoDB.
import { ContadorModelo } from '../modelos/contador.model';

/**
 * Genera una guia con formato APA-000001 usando un incremento atomico en MongoDB.
 */
export const PATRON_NUMERO_GUIA = /^APA-\d{6}$/;

export const formatearNumeroGuia = (seq: number): string => {
  if (!Number.isInteger(seq) || seq < 1 || seq > 999999) {
    throw new Error('Secuencia de guia fuera de rango');
  }

  return `APA-${String(seq).padStart(6, '0')}`;
};

export const normalizarNumeroGuia = (numeroGuia: string): string => numeroGuia.trim().toUpperCase();

export const generarNumeroGuia = async (): Promise<string> => {
  const contador = await ContadorModelo.findOneAndUpdate(
    { _id: 'paquetes' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return formatearNumeroGuia(contador.seq);
};
