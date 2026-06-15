// Modelo de paquete: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

/**
 * Modelo de paquete para registrar envios internos y su trazabilidad.
 */
const paqueteSchema = new Schema(
  {
    numeroGuia: { type: String, required: true, unique: true, trim: true, uppercase: true, match: /^APA-\d{6}$/ },
    descripcion: { type: String, trim: true, default: '' },
    tipoPaquete: { type: String, required: true, trim: true },
    prioridad: { type: String, required: true, enum: ['baja', 'media', 'alta'], default: 'media' },
    estadoActualId: { type: Schema.Types.ObjectId, ref: 'Estado', required: true },
    lugarOrigenId: { type: Schema.Types.ObjectId, ref: 'Lugar', required: true },
    lugarDestinoId: { type: Schema.Types.ObjectId, ref: 'Lugar', required: true },
    usuarioRemitenteId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioDestinatarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    motoristaAsignadoId: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    observaciones: { type: String, trim: true, default: '' },
    estado: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

paqueteSchema.index({ numeroGuia: 1 }, { unique: true });
paqueteSchema.index({ estadoActualId: 1 });
paqueteSchema.index({ lugarOrigenId: 1 });
paqueteSchema.index({ lugarDestinoId: 1 });
paqueteSchema.index({ usuarioRemitenteId: 1 });
paqueteSchema.index({ usuarioDestinatarioId: 1 });
paqueteSchema.index({ motoristaAsignadoId: 1 });
paqueteSchema.index({ fechaCreacion: 1 });

paqueteSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

export const PaqueteModelo = model('Paquete', paqueteSchema);
