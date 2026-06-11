import path from 'path';

export interface StorageProvider {
  resolverRutaRelativa(nombreArchivo: string): string;
  resolverRutaAbsoluta(rutaRelativa: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private readonly raizUploads = path.resolve(__dirname, '../../uploads');

  public resolverRutaRelativa(nombreArchivo: string): string {
    return `uploads/evidencias/${path.basename(nombreArchivo)}`;
  }

  public resolverRutaAbsoluta(rutaRelativa: string): string {
    const rutaAbsoluta = path.resolve(__dirname, '../../', rutaRelativa);
    if (!rutaAbsoluta.startsWith(this.raizUploads)) {
      const error = new Error('Ruta de archivo no permitida') as Error & { status?: number };
      error.status = 403;
      throw error;
    }
    return rutaAbsoluta;
  }
}

export const storageEvidencias = new LocalStorageProvider();
