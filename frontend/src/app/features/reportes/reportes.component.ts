import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReporteServicio } from '../../core/servicios/reporte.servicio';
import { RealtimeService } from '../../core/servicios/realtime.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Salidas de informacion</span>
          <h1>Reportes</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      <section class="metrics-grid">
        <article class="metric-card">
          <i class="pi pi-box"></i>
          <span class="muted">Estados con paquetes</span>
          <strong>{{ paquetesPorEstado.length }}</strong>
        </article>
        <article class="metric-card">
          <i class="pi pi-exclamation-triangle"></i>
          <span class="muted">Incidencias reportadas</span>
          <strong>{{ totalIncidencias }}</strong>
        </article>
        <article class="metric-card">
          <i class="pi pi-history"></i>
          <span class="muted">Actividad reciente</span>
          <strong>{{ totalActividad }}</strong>
        </article>
      </section>

      <article class="table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Total paquetes</th>
            </tr>
          </thead>
          <tbody>
            @for (fila of paquetesPorEstado; track fila._id) {
              <tr>
                <td>{{ fila._id }}</td>
                <td>{{ fila.total }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="2">No hay datos de paquetes por estado.</td>
              </tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
})
export class ReportesComponent implements OnInit {
  protected paquetesPorEstado: Array<{ _id: string; total: number }> = [];
  protected totalIncidencias = 0;
  protected totalActividad = 0;

  public constructor(
    private readonly reporteServicio: ReporteServicio,
    private readonly realtimeService: RealtimeService,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
    this.realtimeService.escuchar('dashboard:updated').subscribe(() => this.cargarDatos());
  }

  protected cargarDatos(): void {
    this.reporteServicio.paquetesPorEstado().subscribe((datos) => (this.paquetesPorEstado = datos));
    this.reporteServicio.incidencias().subscribe((datos) => (this.totalIncidencias = datos.length));
    this.reporteServicio.actividad().subscribe((datos) => (this.totalActividad = datos.length));
  }
}
