// Modelo de evidencia: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

// Modelo de comprobantes ligados a una guia: fotos, PDFs o documentos de respaldo.
const evidenciaSchema = new Schema(
  {
    paqueteId: { type: Schema.Types.ObjectId, ref: 'Paquete', required: true },
    numeroGuia: { type: String, required: true, trim: true, uppercase: true, match: /^APA-\d{6}$/ },
    tipoEvidencia: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true, default: '' },
    rutaArchivo: { type: String, trim: true, default: '' },
    reportadoPorId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaReporte: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

evidenciaSchema.index({ paqueteId: 1 });
evidenciaSchema.index({ numeroGuia: 1 });
evidenciaSchema.index({ tipoEvidencia: 1 });
evidenciaSchema.index({ fechaReporte: 1 });

export const EvidenciaModelo = model('Evidencia', evidenciaSchema);
