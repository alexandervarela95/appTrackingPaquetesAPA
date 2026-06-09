import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Incidencia } from '../../core/modelos/incidencia.model';
import { IncidenciaServicio } from '../../core/servicios/incidencia.servicio';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Gestion de problemas logisticos</span>
          <h1>Incidencias</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarIncidencias()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarIncidencia()">
          <h2>Nueva incidencia</h2>
          <div class="field-group">
            <label for="paqueteId">Paquete ID</label>
            <input id="paqueteId" name="paqueteId" [(ngModel)]="formulario.paqueteId" required />
          </div>
          <div class="field-group">
            <label for="numeroGuia">Numero guia</label>
            <input id="numeroGuia" name="numeroGuia" [(ngModel)]="formulario.numeroGuia" required />
          </div>
          <div class="field-group">
            <label for="tipoIncidencia">Tipo</label>
            <input id="tipoIncidencia" name="tipoIncidencia" [(ngModel)]="formulario.tipoIncidencia" required placeholder="Retraso, dano, extravio" />
          </div>
          <div class="field-group">
            <label for="estadoIncidencia">Estado</label>
            <select id="estadoIncidencia" name="estadoIncidencia" [(ngModel)]="formulario.estadoIncidencia">
              <option value="abierta">Abierta</option>
              <option value="en proceso">En proceso</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>
          <div class="field-group">
            <label for="reportadoPorId">Reportado por ID</label>
            <input id="reportadoPorId" name="reportadoPorId" [(ngModel)]="formulario.reportadoPorId" required />
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
                <th>Guia</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Reporte</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (incidencia of incidencias; track obtenerId(incidencia)) {
                <tr>
                  <td>{{ incidencia.numeroGuia }}</td>
                  <td>{{ incidencia.tipoIncidencia }}</td>
                  <td><span class="badge warning">{{ incidencia.estadoIncidencia }}</span></td>
                  <td>{{ incidencia.fechaReporte | date: 'short' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Eliminar" (click)="eliminarIncidencia(incidencia)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Sin incidencias registradas.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class IncidenciasComponent implements OnInit {
  protected incidencias: Incidencia[] = [];
  protected formulario: Partial<Incidencia> = this.crearFormularioVacio();

  public constructor(private readonly incidenciaServicio: IncidenciaServicio) {}

  public ngOnInit(): void {
    this.cargarIncidencias();
  }

  protected cargarIncidencias(): void {
    this.incidenciaServicio.listar().subscribe((incidencias) => (this.incidencias = incidencias));
  }

  protected guardarIncidencia(): void {
    this.incidenciaServicio.crear(this.formulario).subscribe(() => {
      this.formulario = this.crearFormularioVacio();
      this.cargarIncidencias();
    });
  }

  protected eliminarIncidencia(incidencia: Incidencia): void {
    this.incidenciaServicio.eliminar(this.obtenerId(incidencia)).subscribe(() => this.cargarIncidencias());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Incidencia> {
    return { paqueteId: '', numeroGuia: '', tipoIncidencia: '', estadoIncidencia: 'abierta', reportadoPorId: '', descripcion: '' };
  }
}
