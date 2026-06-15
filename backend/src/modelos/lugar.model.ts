// Modelo de lugar: define la forma de los datos persistidos y sus tipos principales.
import { Schema, model } from 'mongoose';

/**
 * Modelo de lugares para sucursales, bodegas y departamentos.
 */
const lugarSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true, default: '' },
    estado: { type: Boolean, default: true },
    ciudad: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

lugarSchema.index({ nombre: 1 });
lugarSchema.index({ ciudad: 1 });
lugarSchema.index({ estado: 1 });

lugarSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

export const LugarModelo = model('Lugar', lugarSchema);
