// Modelo de estado: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

/**
 * Modelo de estados para el flujo de paquetes.
 */
const estadoSchema = new Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, trim: true, default: '' },
    orden: { type: Number, required: true },
    estado: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

estadoSchema.index({ nombre: 1 }, { unique: true });
estadoSchema.index({ orden: 1 });

estadoSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

export const EstadoModelo = model('Estado', estadoSchema);
