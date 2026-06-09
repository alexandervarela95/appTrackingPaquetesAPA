import crypto from 'crypto';

/**
 * Genera un numero de guia interno unico para paquetes.
 */
export const generarNumeroGuia = (): string => {
  const prefijo = 'APA';
  const tiempo = Date.now().toString(36).toUpperCase();
  const aleatorio = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefijo}-${tiempo}-${aleatorio}`;
};
