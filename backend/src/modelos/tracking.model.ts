// Modelo de tracking: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

/**
 * Modelo de tracking para guardar el historial de estados de cada paquete.
 */
const trackingSchema = new Schema(
  {
    paqueteId: { type: Schema.Types.ObjectId, ref: 'Paquete', required: true },
    numeroGuia: { type: String, required: true, trim: true, uppercase: true, match: /^APA-\d{6}$/ },
    estadoId: { type: Schema.Types.ObjectId, ref: 'Estado', required: true },
    descripcion: { type: String, trim: true, default: '' },
    lugarActualId: { type: Schema.Types.ObjectId, ref: 'Lugar' },
    usuarioResponsableId: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaEvento: { type: Date, required: true, default: Date.now },
    fechaCreacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

trackingSchema.index({ paqueteId: 1 });
trackingSchema.index({ numeroGuia: 1 });
trackingSchema.index({ estadoId: 1 });
trackingSchema.index({ fechaEvento: 1 });

export const TrackingModelo = model('Tracking', trackingSchema);
