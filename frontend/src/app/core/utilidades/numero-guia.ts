// Utilidad de numero de guia: normaliza y valida el formato secuencial visible en el frontend.
export const PATRON_NUMERO_GUIA = /^APA-\d{6}$/;
export const MENSAJE_FORMATO_GUIA_INVALIDO = 'Formato de guía inválido. Ejemplo: APA-000001';

export const normalizarNumeroGuia = (numeroGuia: string): string => numeroGuia.trim().toUpperCase();

export const esNumeroGuiaValido = (numeroGuia: string): boolean => PATRON_NUMERO_GUIA.test(normalizarNumeroGuia(numeroGuia));
