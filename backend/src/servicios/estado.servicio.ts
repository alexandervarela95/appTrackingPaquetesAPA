import { EstadoModelo } from '../modelos/estado.model';

export class EstadoServicio {
  public static async listarEstados() {
    return EstadoModelo.find().lean();
  }

  public static async obtenerEstadoPorId(id: string) {
    return EstadoModelo.findById(id).lean();
  }

  public static async crearEstado(datos: any) {
    const estado = new EstadoModelo({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      orden: datos.orden,
      estado: datos.estado !== false
    });
    return estado.save();
  }

  public static async actualizarEstado(id: string, datos: any) {
    return EstadoModelo.findByIdAndUpdate(
      id,
      {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        orden: datos.orden,
        estado: datos.estado !== false,
        fechaActualizacion: new Date()
      },
      { new: true }
    ).lean();
  }

  public static async eliminarEstado(id: string) {
    return EstadoModelo.findByIdAndUpdate(id, { estado: false, fechaActualizacion: new Date() }, { new: true }).lean();
  }
}
