import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Estado } from '../../core/modelos/estado.model';
import { Lugar } from '../../core/modelos/lugar.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Tracking } from '../../core/modelos/tracking.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { EstadoServicio } from '../../core/servicios/estado.servicio';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { TrackingServicio } from '../../core/servicios/tracking.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

// Detalle operativo del paquete: informacion, historial, cambio de estado e impresion.
@Component({
  selector: 'app-paquete-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Informacion del paquete</span>
          <h1>{{ paquete?.numeroGuia || 'Paquete' }}</h1>
        </div>
        <div class="toolbar">
          @if (paquete) {
            <a class="button-secondary" [routerLink]="['/tracking', paquete.numeroGuia]"><i class="pi pi-map-marker"></i>Ver seguimiento</a>
            <a class="button-secondary" [routerLink]="['/paquetes', obtenerId(paquete), 'imprimir']"><i class="pi pi-print"></i>Imprimir hoja</a>
          }
          <a class="button-secondary" routerLink="/paquetes"><i class="pi pi-arrow-left"></i>Volver</a>
        </div>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando detalle del paquete...</p>
      }

      @if (paquete) {
        <section class="content-grid">
          <article class="glass-panel form-grid">
            <h2>Informacion del envio</h2>
            <p><strong>Descripcion:</strong> {{ paquete.descripcion || 'No hay descripcion disponible' }}</p>
            <p><strong>Tipo:</strong> {{ paquete.tipoPaquete }}</p>
            <p><strong>Prioridad:</strong> <span class="badge">{{ paquete.prioridad }}</span></p>
            <p><strong>Estado actual:</strong> {{ nombreEstado(paquete.estadoActualId) }}</p>
            <p><strong>Origen:</strong> {{ nombreLugar(paquete.lugarOrigenId) }}</p>
            <p><strong>Destino:</strong> {{ nombreLugar(paquete.lugarDestinoId) }}</p>
            <p><strong>Remitente:</strong> {{ nombreUsuario(paquete.usuarioRemitenteId) }}</p>
            <p><strong>Destinatario:</strong> {{ nombreUsuario(paquete.usuarioDestinatarioId) }}</p>
            <p><strong>Motorista:</strong> {{ nombreUsuario(paquete.motoristaAsignadoId) }}</p>
            <p><strong>Observaciones:</strong> {{ paquete.observaciones || 'No hay observaciones' }}</p>

            <div class="field-group">
              <label for="estadoActualId">Cambiar estado</label>
              <select id="estadoActualId" name="estadoActualId" [(ngModel)]="estadoActualId">
                @for (estado of estados; track obtenerId(estado)) {
                  <option [value]="obtenerId(estado)">{{ estado.nombre }}</option>
                }
              </select>
            </div>

            <button class="button-primary" type="button" [disabled]="guardando" (click)="actualizarEstado()">
              <i class="pi pi-sync"></i>
              {{ guardando ? 'Actualizando...' : 'Actualizar estado' }}
            </button>
          </article>

          <article class="table-panel movimientos-panel">
            <div class="panel-heading">
              <h2>Movimientos recientes</h2>
            </div>
            <div class="movimientos-table-wrap">
              <table class="data-table movimientos-table">
                <thead>
                  <tr>
                    <th class="col-fecha">Fecha</th>
                    <th class="col-estado">Estado</th>
                    <th class="col-lugar">Lugar</th>
                    <th class="col-responsable">Responsable</th>
                    <th class="col-descripcion">Descripcion</th>
                  </tr>
                </thead>
                <tbody>
                  @for (evento of historial; track obtenerId(evento)) {
                    <tr>
                      <td class="col-fecha">{{ evento.fechaEvento | date: 'short' }}</td>
                      <td class="col-estado"><span class="badge success">{{ nombreEstado(evento.estadoId) }}</span></td>
                      <td class="col-lugar">{{ nombreLugar(evento.lugarActualId) }}</td>
                      <td class="col-responsable">{{ nombreUsuario(evento.usuarioResponsableId) }}</td>
                      <td class="col-descripcion">{{ evento.descripcion || 'Sin descripcion' }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5">Todavia no hay movimientos para este paquete.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </article>
        </section>
      }
    </section>
  `,
  styles: [
    `
      :host {
        min-width: 0;
      }

      .content-grid {
        min-width: 0;
      }

      .panel-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
      }

      .movimientos-panel {
        min-width: 0;
        overflow: hidden;
      }

      .movimientos-table-wrap {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .movimientos-table {
        min-width: 680px;
        table-layout: fixed;
      }

      .movimientos-table th,
      .movimientos-table td {
        text-align: left;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      .movimientos-table th:last-child,
      .movimientos-table td:last-child {
        text-align: left;
      }

      .col-fecha {
        width: 112px;
      }

      .col-estado {
        width: 150px;
      }

      .col-lugar,
      .col-responsable {
        width: 135px;
      }

      .col-descripcion {
        width: auto;
      }

      @media (max-width: 680px) {
        .movimientos-table {
          min-width: 620px;
        }
      }
    `,
  ],
})
export class PaqueteDetalleComponent implements OnInit {
  protected paquete?: Paquete;
  protected historial: Tracking[] = [];
  protected estados: Estado[] = [];
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected estadoActualId = '';
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;
  protected guardando = false;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly paqueteServicio: PaqueteServicio,
    private readonly trackingServicio: TrackingServicio,
    private readonly estadoServicio: EstadoServicio,
    private readonly lugarServicio: LugarServicio,
    private readonly usuarioServicio: UsuarioServicio,
  ) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.estadoServicio.listar().subscribe((estados) => (this.estados = estados));
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios));
    this.cargarPaquete(id);
  }

  protected actualizarEstado(): void {
    if (!this.paquete) {
      return;
    }
    this.guardando = true;
    // Al actualizar estado, el backend crea el movimiento de tracking correspondiente.
    this.paqueteServicio.actualizar(this.obtenerId(this.paquete), { estadoActualId: this.estadoActualId }).subscribe({
      next: (paquete) => {
        this.guardando = false;
        this.paquete = paquete;
        this.mensaje = 'Estado actualizado correctamente.';
        this.hayError = false;
        this.cargarHistorial(paquete);
      },
      error: () => {
        this.guardando = false;
        this.mensaje = 'No se pudo actualizar el estado. Intenta de nuevo.';
        this.hayError = true;
      },
    });
  }

  protected nombreLugar(lugarId?: string): string {
    return this.lugares.find((lugar) => this.obtenerId(lugar) === String(lugarId || ''))?.nombre || '-';
  }

  protected nombreUsuario(usuarioId?: string): string {
    return this.usuarios.find((usuario) => this.obtenerId(usuario) === String(usuarioId || ''))?.nombre || '-';
  }

  protected nombreEstado(estadoId?: string): string {
    return this.estados.find((estado) => this.obtenerId(estado) === String(estadoId || ''))?.nombre || '-';
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private cargarPaquete(id: string): void {
    this.cargando = true;
    this.paqueteServicio.obtenerPorId(id).subscribe({
      next: (paquete) => {
        this.cargando = false;
        this.paquete = paquete;
        this.estadoActualId = paquete.estadoActualId;
        this.cargarHistorial(paquete);
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Paquete no encontrado.';
        this.hayError = true;
      },
    });
  }

  private cargarHistorial(paquete: Paquete): void {
    // El historial alimenta la tabla de movimientos recientes.
    this.trackingServicio.listarPorPaquete(this.obtenerId(paquete)).subscribe((historial) => (this.historial = historial));
  }
}
