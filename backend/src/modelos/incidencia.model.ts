// Modelo de incidencia: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

// Modelo de problemas reportados sobre un paquete.
// Sirve para saber que guia requiere investigacion o seguimiento.
const incidenciaSchema = new Schema(
  {
    paqueteId: { type: Schema.Types.ObjectId, ref: 'Paquete', required: true },
    numeroGuia: { type: String, required: true, trim: true, uppercase: true, match: /^APA-\d{6}$/ },
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
