import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Estado } from '../../core/modelos/estado.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Tracking } from '../../core/modelos/tracking.model';
import { EstadoServicio } from '../../core/servicios/estado.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { TrackingServicio } from '../../core/servicios/tracking.servicio';

@Component({
  selector: 'app-paquete-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Detalle de paquete</span>
          <h1>{{ paquete?.numeroGuia || 'Paquete' }}</h1>
        </div>
        <a class="button-secondary" routerLink="/paquetes"><i class="pi pi-arrow-left"></i>Volver</a>
      </header>

      @if (paquete) {
        <section class="content-grid">
          <article class="glass-panel form-grid">
            <h2>Informacion</h2>
            <span class="badge">{{ paquete.prioridad }}</span>
            <p>{{ paquete.descripcion || 'Sin descripcion registrada' }}</p>
            <p class="muted">{{ paquete.observaciones || 'Sin observaciones' }}</p>

            <div class="field-group">
              <label for="estadoActualId">Cambiar estado</label>
              <select id="estadoActualId" name="estadoActualId" [(ngModel)]="estadoActualId">
                @for (estado of estados; track obtenerId(estado)) {
                  <option [value]="obtenerId(estado)">{{ estado.nombre }}</option>
                }
              </select>
            </div>

            <button class="button-primary" type="button" (click)="actualizarEstado()">
              <i class="pi pi-sync"></i>
              Actualizar estado
            </button>
          </article>

          <article class="table-panel">
            <h2>Historial de tracking</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                @for (evento of historial; track obtenerId(evento)) {
                  <tr>
                    <td>{{ evento.fechaEvento | date: 'short' }}</td>
                    <td><span class="badge success">{{ nombreEstado(evento.estadoId) }}</span></td>
                    <td>{{ evento.descripcion }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3">Sin eventos registrados.</td>
                  </tr>
                }
              </tbody>
            </table>
          </article>
        </section>
      }
    </section>
  `,
})
export class PaqueteDetalleComponent implements OnInit {
  protected paquete?: Paquete;
  protected historial: Tracking[] = [];
  protected estados: Estado[] = [];
  protected estadoActualId = '';

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly paqueteServicio: PaqueteServicio,
    private readonly trackingServicio: TrackingServicio,
    private readonly estadoServicio: EstadoServicio,
  ) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.estadoServicio.listar().subscribe((estados) => (this.estados = estados));
    this.paqueteServicio.obtenerPorId(id).subscribe((paquete) => {
      this.paquete = paquete;
      this.estadoActualId = paquete.estadoActualId;
      this.trackingServicio.listarPorPaquete(this.obtenerId(paquete)).subscribe((historial) => (this.historial = historial));
    });
  }

  protected actualizarEstado(): void {
    if (!this.paquete) {
      return;
    }
    this.paqueteServicio.actualizar(this.obtenerId(this.paquete), { estadoActualId: this.estadoActualId }).subscribe((paquete) => {
      this.paquete = paquete;
      this.trackingServicio.listarPorPaquete(this.obtenerId(paquete)).subscribe((historial) => (this.historial = historial));
    });
  }

  protected nombreEstado(estadoId: string): string {
    return this.estados.find((estado) => this.obtenerId(estado) === estadoId)?.nombre || estadoId;
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }
}
