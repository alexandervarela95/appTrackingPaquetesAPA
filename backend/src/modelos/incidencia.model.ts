import { Schema, model } from 'mongoose';

/**
 * Modelo de incidencias para eventos que requieren investigacion o seguimiento.
 */
const incidenciaSchema = new Schema(
  {
    paqueteId: { type: Schema.Types.ObjectId, ref: 'Paquete', required: true },
    numeroGuia: { type: String, required: true, trim: true },
    tipoIncidencia: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true, default: '' },
    estadoIncidencia: { type: String, required: true, enum: ['abierta', 'en proceso', 'cerrada'], default: 'abierta' },
    reportadoPorId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaReporte: { type: Date, default: Date.now },
    fechaCierre: { type: Date }
  },
  { versionKey: false }
);

incidenciaSchema.index({ paqueteId: 1 });
incidenciaSchema.index({ numeroGuia: 1 });
incidenciaSchema.index({ estadoIncidencia: 1 });
incidenciaSchema.index({ fechaReporte: 1 });

export const IncidenciaModelo = model('Incidencia', incidenciaSchema);
