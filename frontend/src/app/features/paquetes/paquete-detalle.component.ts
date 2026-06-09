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
        <div class="toolbar">
          @if (paquete) {
            <a class="button-secondary" [routerLink]="['/tracking', paquete.numeroGuia]"><i class="pi pi-map-marker"></i>Ver tracking</a>
          }
          <a class="button-secondary" routerLink="/paquetes"><i class="pi pi-arrow-left"></i>Volver</a>
        </div>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (paquete) {
        <section class="content-grid">
          <article class="glass-panel form-grid">
            <h2>Informacion del envio</h2>
            <p><strong>Descripcion:</strong> {{ paquete.descripcion || 'Sin descripcion' }}</p>
            <p><strong>Tipo:</strong> {{ paquete.tipoPaquete }}</p>
            <p><strong>Prioridad:</strong> <span class="badge">{{ paquete.prioridad }}</span></p>
            <p><strong>Estado actual:</strong> {{ nombreEstado(paquete.estadoActualId) }}</p>
            <p><strong>Origen:</strong> {{ nombreLugar(paquete.lugarOrigenId) }}</p>
            <p><strong>Destino:</strong> {{ nombreLugar(paquete.lugarDestinoId) }}</p>
            <p><strong>Remitente:</strong> {{ nombreUsuario(paquete.usuarioRemitenteId) }}</p>
            <p><strong>Destinatario:</strong> {{ nombreUsuario(paquete.usuarioDestinatarioId) }}</p>
            <p><strong>Motorista:</strong> {{ nombreUsuario(paquete.motoristaAsignadoId) }}</p>
            <p><strong>Observaciones:</strong> {{ paquete.observaciones || 'Sin observaciones' }}</p>

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
            <h2>Historial reciente</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Lugar</th>
                  <th>Responsable</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                @for (evento of historial; track obtenerId(evento)) {
                  <tr>
                    <td>{{ evento.fechaEvento | date: 'short' }}</td>
                    <td><span class="badge success">{{ nombreEstado(evento.estadoId) }}</span></td>
                    <td>{{ nombreLugar(evento.lugarActualId) }}</td>
                    <td>{{ nombreUsuario(evento.usuarioResponsableId) }}</td>
                    <td>{{ evento.descripcion }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5">Sin eventos registrados.</td>
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
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected estadoActualId = '';
  protected mensaje = '';
  protected hayError = false;

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
    this.paqueteServicio.actualizar(this.obtenerId(this.paquete), { estadoActualId: this.estadoActualId }).subscribe({
      next: (paquete) => {
        this.paquete = paquete;
        this.mensaje = 'Estado actualizado correctamente.';
        this.hayError = false;
        this.cargarHistorial(paquete);
      },
      error: () => {
        this.mensaje = 'No fue posible actualizar el estado.';
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
    this.paqueteServicio.obtenerPorId(id).subscribe({
      next: (paquete) => {
        this.paquete = paquete;
        this.estadoActualId = paquete.estadoActualId;
        this.cargarHistorial(paquete);
      },
      error: () => {
        this.mensaje = 'Paquete no encontrado.';
        this.hayError = true;
      },
    });
  }

  private cargarHistorial(paquete: Paquete): void {
    this.trackingServicio.listarPorPaquete(this.obtenerId(paquete)).subscribe((historial) => (this.historial = historial));
  }
}
