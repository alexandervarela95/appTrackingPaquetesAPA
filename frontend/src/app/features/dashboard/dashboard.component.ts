import { Component, OnInit } from '@angular/core';
import { DashboardResumen } from '../../core/modelos/dashboard.model';
import { DashboardServicio } from '../../core/servicios/dashboard.servicio';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Sistema de trazabilidad APA</span>
          <h1>Dashboard</h1>
        </div>
        <div class="header-actions">
          <span class="badge">Redis cache</span>
          <button class="icon-button" type="button" title="Actualizar" (click)="cargarResumen()">
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </header>

      <section class="metrics-grid">
        @for (metrica of metricas; track metrica.titulo) {
          <article class="metric-card">
            <i [class]="metrica.icono"></i>
            <span class="muted">{{ metrica.titulo }}</span>
            <strong>{{ metrica.valor }}</strong>
          </article>
        }
      </section>

      <section class="content-grid">
        <article class="glass-panel">
          <h2>Paquetes por estado</h2>
          <div class="chart-bars">
            @for (barra of barrasEstado; track barra.id) {
              <div>
                <span [style.height.%]="barra.altura"></span>
                <small>{{ barra.total }}</small>
              </div>
            }
          </div>
        </article>

        <article class="glass-panel">
          <h2>Resumen operativo</h2>
          <div class="summary-list">
            <span>{{ resumen?.paquetesActivos || 0 }} paquetes activos en trazabilidad</span>
            <span>{{ resumen?.incidenciasAbiertas || 0 }} incidencias abiertas</span>
            <span>{{ resumen?.evidenciasRegistradas || 0 }} evidencias registradas</span>
          </div>
        </article>
      </section>

      @if (mensajeError) {
        <p class="status-message error">{{ mensajeError }}</p>
      }
    </section>
  `,
  styles: [
    `
      h2 {
        margin: 0 0 16px;
      }

      .chart-bars {
        height: 280px;
        display: flex;
        align-items: end;
        gap: 14px;
      }

      .chart-bars div {
        flex: 1;
        display: grid;
        gap: 8px;
        align-items: end;
        justify-items: center;
        height: 100%;
      }

      .chart-bars span {
        width: 100%;
        min-height: 8px;
        border-radius: 14px 14px 6px 6px;
        background: rgba(255, 255, 255, 0.24);
      }

      .summary-list {
        display: grid;
        gap: 14px;
      }

      .summary-list span {
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.82);
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  protected resumen?: DashboardResumen;
  protected mensajeError = '';

  public constructor(private readonly dashboardServicio: DashboardServicio) {}

  public ngOnInit(): void {
    this.cargarResumen();
  }

  protected get metricas() {
    return [
      { titulo: 'Estados', valor: this.resumen?.totalEstados || 0, icono: 'pi pi-tags' },
      { titulo: 'Paquetes activos', valor: this.resumen?.paquetesActivos || 0, icono: 'pi pi-box' },
      { titulo: 'Incidencias abiertas', valor: this.resumen?.incidenciasAbiertas || 0, icono: 'pi pi-exclamation-triangle' },
      { titulo: 'Evidencias', valor: this.resumen?.evidenciasRegistradas || 0, icono: 'pi pi-file' },
    ];
  }

  protected get barrasEstado() {
    const datos = this.resumen?.paquetesPorEstado || [];
    const maximo = Math.max(...datos.map((item) => item.total), 1);
    return datos.map((item) => ({ id: item._id, total: item.total, altura: Math.max((item.total / maximo) * 100, 8) }));
  }

  protected cargarResumen(): void {
    this.mensajeError = '';
    this.dashboardServicio.obtenerResumen().subscribe({
      next: (resumen) => (this.resumen = resumen),
      error: () => (this.mensajeError = 'No fue posible cargar el dashboard. Valida token y backend.'),
    });
  }
}
