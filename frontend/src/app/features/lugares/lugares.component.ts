// Pantalla de lugares: maneja datos, acciones de usuario y estado visual de la vista.
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lugar } from '../../core/modelos/lugar.model';
import { LugarServicio } from '../../core/servicios/lugar.servicio';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Sucursales y departamentos</span>
          <h1>Ubicaciones</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarLugares()"><i class="pi pi-refresh"></i></button>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando ubicaciones...</p>
      }

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarLugar()">
          <h2>Nueva ubicacion</h2>
          <div class="field-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" name="nombre" [(ngModel)]="formulario.nombre" required />
          </div>
          <div class="field-group">
            <label for="ciudad">Ciudad</label>
            <input id="ciudad" name="ciudad" [(ngModel)]="formulario.ciudad" required />
          </div>
          <div class="field-group">
            <label for="direccion">Direccion</label>
            <input id="direccion" name="direccion" [(ngModel)]="formulario.direccion" required />
          </div>
          <div class="field-group">
            <label for="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion"></textarea>
          </div>
          <button class="button-primary" type="submit" [disabled]="guardando">
            <i class="pi pi-save"></i>{{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </form>

        <article class="table-panel">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Direccion</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (lugar of lugares; track obtenerId(lugar)) {
                <tr>
                  <td>{{ lugar.nombre }}</td>
                  <td>{{ lugar.ciudad }}</td>
                  <td>{{ lugar.direccion }}</td>
                  <td>{{ lugar.estado === false ? 'Inactivo' : 'Activo' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Desactivar" (click)="eliminarLugar(lugar)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Todavia no hay ubicaciones para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class LugaresComponent implements OnInit {
  protected lugares: Lugar[] = [];
  protected formulario: Partial<Lugar> = this.crearFormularioVacio();
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;
  protected guardando = false;

  public constructor(private readonly lugarServicio: LugarServicio) {}

  public ngOnInit(): void {
    this.cargarLugares();
  }

  protected cargarLugares(): void {
    this.cargando = true;
    this.lugarServicio.listar().subscribe({
      next: (lugares) => {
        this.lugares = lugares;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No se pudieron cargar las ubicaciones. Intenta de nuevo.');
      },
    });
  }

  protected guardarLugar(): void {
    this.guardando = true;
    this.lugarServicio.crear(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Ubicacion guardada correctamente.';
        this.hayError = false;
        this.formulario = this.crearFormularioVacio();
        this.cargarLugares();
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudo guardar la ubicacion. Intenta de nuevo.');
      },
    });
  }

  protected eliminarLugar(lugar: Lugar): void {
    if (!confirm('Desea desactivar esta ubicacion?')) {
      return;
    }
    this.lugarServicio.eliminar(this.obtenerId(lugar)).subscribe(() => this.cargarLugares());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Lugar> {
    return { nombre: '', descripcion: '', ciudad: '', direccion: '', estado: true };
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
