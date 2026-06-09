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
          <h1>Lugares</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarLugares()"><i class="pi pi-refresh"></i></button>
      </header>

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarLugar()">
          <h2>Nuevo lugar</h2>
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
          <button class="button-primary" type="submit"><i class="pi pi-save"></i>Guardar</button>
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
                  <td colspan="5">Sin lugares registrados.</td>
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

  public constructor(private readonly lugarServicio: LugarServicio) {}

  public ngOnInit(): void {
    this.cargarLugares();
  }

  protected cargarLugares(): void {
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
  }

  protected guardarLugar(): void {
    this.lugarServicio.crear(this.formulario).subscribe(() => {
      this.formulario = this.crearFormularioVacio();
      this.cargarLugares();
    });
  }

  protected eliminarLugar(lugar: Lugar): void {
    this.lugarServicio.eliminar(this.obtenerId(lugar)).subscribe(() => this.cargarLugares());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Lugar> {
    return { nombre: '', descripcion: '', ciudad: '', direccion: '', estado: true };
  }
}
