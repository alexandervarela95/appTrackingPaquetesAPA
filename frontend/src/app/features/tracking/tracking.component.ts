import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tracking } from '../../core/modelos/tracking.model';
import { TrackingServicio } from '../../core/servicios/tracking.servicio';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Historial de trazabilidad</span>
          <h1>Tracking</h1>
        </div>
        <form class="toolbar" (ngSubmit)="buscarPorGuia()">
          <input class="search-input" name="numeroGuia" [(ngModel)]="numeroGuia" placeholder="Numero de guia" />
          <button class="button-primary" type="submit"><i class="pi pi-search"></i>Buscar</button>
        </form>
      </header>

      <article class="table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Guia</th>
              <th>Estado</th>
              <th>Lugar</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            @for (evento of historial; track obtenerId(evento)) {
              <tr>
                <td>{{ evento.fechaEvento | date: 'short' }}</td>
                <td><span class="badge">{{ evento.numeroGuia }}</span></td>
                <td>{{ evento.estadoId }}</td>
                <td>{{ evento.lugarActualId || '-' }}</td>
                <td>{{ evento.descripcion }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">Busca una guia para ver su historial.</td>
              </tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
})
export class TrackingComponent {
  protected numeroGuia = '';
  protected historial: Tracking[] = [];

  public constructor(private readonly trackingServicio: TrackingServicio) {}

  protected buscarPorGuia(): void {
    if (!this.numeroGuia.trim()) {
      this.historial = [];
      return;
    }
    this.trackingServicio.listarPorGuia(this.numeroGuia.trim()).subscribe((historial) => (this.historial = historial));
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }
}
