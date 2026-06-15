// Servicio de lugar: concentra la regla de negocio y las operaciones de datos reutilizables.
import { LugarModelo } from '../modelos/lugar.model';

export class LugarServicio {
  public static async listarLugares() {
    return LugarModelo.find().lean();
  }

  public static async obtenerLugarPorId(id: string) {
    return LugarModelo.findById(id).lean();
  }

  public static async crearLugar(datos: any) {
    const lugar = new LugarModelo({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      ciudad: datos.ciudad,
      direccion: datos.direccion,
      estado: datos.estado !== false
    });
    return lugar.save();
  }

  public static async actualizarLugar(id: string, datos: any) {
    return LugarModelo.findByIdAndUpdate(
      id,
      {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        ciudad: datos.ciudad,
        direccion: datos.direccion,
        estado: datos.estado !== false,
        fechaActualizacion: new Date()
      },
      { new: true }
    ).lean();
  }

  public static async eliminarLugar(id: string) {
    return LugarModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).lean();
  }
}
