import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    exito: false,
    mensaje: 'Demasiados intentos de inicio de sesion. Intente nuevamente en unos minutos.',
    errores: []
  }
});
