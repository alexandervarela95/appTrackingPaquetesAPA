import { Schema, model } from 'mongoose';

/**
 * Modelo de usuario para el sistema de tracking interno.
 * Representa a empleados, motoristas y administradores.
 */
const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    codigoEmpleado: { type: String, required: true, unique: true, trim: true },
    contrasena: { type: String, required: true },
    rol: { type: String, required: true, enum: ['usuario', 'motorista', 'administrador'], default: 'usuario' },
    lugarAsignadoId: { type: Schema.Types.ObjectId, ref: 'Lugar', required: true },
    estado: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

usuarioSchema.index({ correo: 1 }, { unique: true });
usuarioSchema.index({ codigoEmpleado: 1 }, { unique: true });
usuarioSchema.index({ rol: 1 });
usuarioSchema.index({ lugarAsignadoId: 1 });

usuarioSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

export const UsuarioModelo = model('Usuario', usuarioSchema);
