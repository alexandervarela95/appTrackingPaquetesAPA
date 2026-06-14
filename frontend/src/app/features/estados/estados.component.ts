import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '../../core/modelos/estado.model';
import { EstadoServicio } from '../../core/servicios/estado.servicio';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Avance del paquete</span>
          <h1>Estados del paquete</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarEstados()"><i class="pi pi-refresh"></i></button>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando estados del paquete...</p>
      }

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarEstado()">
          <h2>Nuevo estado del paquete</h2>
          <div class="field-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" name="nombre" [(ngModel)]="formulario.nombre" required />
          </div>
          <div class="field-group">
            <label for="orden">Orden</label>
            <input id="orden" name="orden" type="number" [(ngModel)]="formulario.orden" required />
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
                <th>Orden</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Disponibilidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (estado of estados; track obtenerId(estado)) {
                <tr>
                  <td>{{ estado.orden }}</td>
                  <td><span class="badge success">{{ estado.nombre }}</span></td>
                  <td>{{ estado.descripcion }}</td>
                  <td>{{ estado.estado === false ? 'Inactivo' : 'Activo' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Desactivar" (click)="eliminarEstado(estado)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Todavia no hay estados para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class EstadosComponent implements OnInit {
  protected estados: Estado[] = [];
  protected formulario: Partial<Estado> = this.crearFormularioVacio();
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;
  protected guardando = false;

  public constructor(private readonly estadoServicio: EstadoServicio) {}

  public ngOnInit(): void {
    this.cargarEstados();
  }

  protected cargarEstados(): void {
    this.cargando = true;
    this.estadoServicio.listar().subscribe({
      next: (estados) => {
        this.estados = estados.sort((a, b) => a.orden - b.orden);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No se pudieron cargar los estados. Intenta de nuevo.');
      },
    });
  }

  protected guardarEstado(): void {
    this.guardando = true;
    this.estadoServicio.crear(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Estado guardado correctamente.';
        this.hayError = false;
        this.formulario = this.crearFormularioVacio();
        this.cargarEstados();
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudo guardar el estado. Intenta de nuevo.');
      },
    });
  }

  protected eliminarEstado(estado: Estado): void {
    if (!confirm('Desea desactivar este estado?')) {
      return;
    }
    this.estadoServicio.eliminar(this.obtenerId(estado)).subscribe(() => this.cargarEstados());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Estado> {
    return { nombre: '', descripcion: '', orden: 1, estado: true };
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
