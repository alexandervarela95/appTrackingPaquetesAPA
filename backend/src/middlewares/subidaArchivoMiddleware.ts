// Middleware de subidaArchivoMiddleware: aplica una regla transversal antes de que la peticion llegue al controlador.
import path from 'path';
import multer from 'multer';

const extensionesPermitidas = new Set(['.jpg', '.jpeg', '.png', '.pdf']);
const carpetaEvidencias = path.resolve(__dirname, '../../uploads/evidencias');

// Se guarda la evidencia en disco local para la demo del proyecto.
const almacenamientoEvidencias = multer.diskStorage({
  destination: carpetaEvidencias,
  filename: (_req, archivo, callback) => {
    const extension = path.extname(archivo.originalname).toLowerCase();
    const nombreSeguro = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, nombreSeguro);
  }
});

export const subidaEvidencia = multer({
  storage: almacenamientoEvidencias,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, archivo, callback) => {
    // Dejamos una lista corta de formatos para evitar subir ejecutables o archivos raros.
    const extension = path.extname(archivo.originalname).toLowerCase();
    if (!extensionesPermitidas.has(extension)) {
      callback(new Error('Solo se permiten archivos jpg, jpeg, png o pdf'));
      return;
    }
    callback(null, true);
  }
});
