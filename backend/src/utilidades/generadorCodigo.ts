/**
 * Genera un numero de guia con prefijo y cifras pseudoaleatorias.
 * @returns codigo unico de guia para paquete.
 */
export const generarNumeroGuia = (): string => {
  const prefijo = 'APA';
  const timestamp = Date.now().toString().slice(-6);
  const aleatorio = Math.floor(Math.random() * 900 + 100).toString();
  return `${prefijo}-${timestamp}-${aleatorio}`;
};
