// Modelo de contador: guarda secuencias atomicas para codigos internos como las guias de paquetes.
import { Schema, model } from 'mongoose';

const contadorSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

export const ContadorModelo = model('Counter', contadorSchema);
