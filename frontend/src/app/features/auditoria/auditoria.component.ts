import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuditLog, AuditoriaServicio } from '../../core/servicios/auditoria.servicio';
import { RealtimeService } from '../../core/servicios/realtime.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Historial administrativo</span>
          <h1>Actividad</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      @if (cargando) {
        <p class="status-message">Cargando actividad...</p>
      }

      <article class="table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Movimiento</th>
              <th>Area</th>
              <th>Puesto</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            @for (registro of auditoria; track registro._id) {
              <tr>
                <td>{{ registro.fecha | date: 'short' }}</td>
                <td>{{ registro.accion }}</td>
                <td>{{ registro.entidad }}</td>
                <td>{{ registro.rol || '-' }}</td>
                <td>{{ registro.descripcion }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">Todavia no hay actividad para mostrar.</td>
              </tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
})
export class AuditoriaComponent implements OnInit {
  protected auditoria: AuditLog[] = [];
  protected cargando = false;

  public constructor(
    private readonly auditoriaServicio: AuditoriaServicio,
    private readonly realtimeService: RealtimeService,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
    this.realtimeService.escuchar('audit:created').subscribe(() => this.cargarDatos());
  }

  protected cargarDatos(): void {
    this.cargando = true;
    this.auditoriaServicio.listar().subscribe({
      next: (auditoria) => {
        this.auditoria = auditoria;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }
}
