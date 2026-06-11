import { Schema, model } from 'mongoose';

const auditLogSchema = new Schema(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    rol: { type: String, trim: true },
    accion: { type: String, required: true, trim: true, index: true },
    entidad: { type: String, required: true, trim: true, index: true },
    entidadId: { type: String, trim: true, index: true },
    descripcion: { type: String, required: true, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    fecha: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

auditLogSchema.index({ entidad: 1, accion: 1, fecha: -1 });
auditLogSchema.index({ usuarioId: 1, fecha: -1 });

export const AuditLogModelo = model('AuditLog', auditLogSchema);
