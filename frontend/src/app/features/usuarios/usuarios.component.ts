import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lugar } from '../../core/modelos/lugar.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Administracion de colaboradores</span>
          <h1>Usuarios</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()"><i class="pi pi-refresh"></i></button>
      </header>

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarUsuario()">
          <h2>Nuevo usuario</h2>
          <div class="field-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" name="nombre" [(ngModel)]="formulario.nombre" required />
          </div>
          <div class="field-group">
            <label for="correo">Correo</label>
            <input id="correo" name="correo" [(ngModel)]="formulario.correo" required />
          </div>
          <div class="form-row">
            <div class="field-group">
              <label for="codigoEmpleado">Codigo empleado</label>
              <input id="codigoEmpleado" name="codigoEmpleado" [(ngModel)]="formulario.codigoEmpleado" required />
            </div>
            <div class="field-group">
              <label for="rol">Rol</label>
              <select id="rol" name="rol" [(ngModel)]="formulario.rol">
                <option value="usuario">Usuario</option>
                <option value="motorista">Motorista</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>
          <div class="field-group">
            <label for="lugarAsignadoId">Lugar asignado</label>
            <select id="lugarAsignadoId" name="lugarAsignadoId" [(ngModel)]="formulario.lugarAsignadoId" required>
              <option value="">Seleccionar</option>
              @for (lugar of lugares; track obtenerId(lugar)) {
                <option [value]="obtenerId(lugar)">{{ lugar.nombre }}</option>
              }
            </select>
          </div>
          <div class="field-group">
            <label for="contrasena">Contrasena inicial</label>
            <input id="contrasena" name="contrasena" type="password" [(ngModel)]="formulario.contrasena" placeholder="123456 por defecto" />
          </div>
          <button class="button-primary" type="submit"><i class="pi pi-save"></i>Guardar</button>
        </form>

        <article class="table-panel">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (usuario of usuarios; track obtenerId(usuario)) {
                <tr>
                  <td>{{ usuario.nombre }}</td>
                  <td>{{ usuario.correo }}</td>
                  <td><span class="badge">{{ usuario.rol }}</span></td>
                  <td>{{ usuario.estado === false ? 'Inactivo' : 'Activo' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Desactivar" (click)="eliminarUsuario(usuario)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Sin usuarios registrados.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class UsuariosComponent implements OnInit {
  protected usuarios: Usuario[] = [];
  protected lugares: Lugar[] = [];
  protected formulario: Partial<Usuario> = this.crearFormularioVacio();

  public constructor(
    private readonly usuarioServicio: UsuarioServicio,
    private readonly lugarServicio: LugarServicio,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
  }

  protected cargarDatos(): void {
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios));
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
  }

  protected guardarUsuario(): void {
    this.usuarioServicio.crear(this.formulario).subscribe(() => {
      this.formulario = this.crearFormularioVacio();
      this.cargarDatos();
    });
  }

  protected eliminarUsuario(usuario: Usuario): void {
    this.usuarioServicio.eliminar(this.obtenerId(usuario)).subscribe(() => this.cargarDatos());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Usuario> {
    return { nombre: '', correo: '', codigoEmpleado: '', contrasena: '', rol: 'usuario', lugarAsignadoId: '', estado: true };
  }
}
