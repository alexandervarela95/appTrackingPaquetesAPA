import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Estado } from '../../core/modelos/estado.model';
import { Lugar } from '../../core/modelos/lugar.model';
import { Tracking } from '../../core/modelos/tracking.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { EstadoServicio } from '../../core/servicios/estado.servicio';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { TrackingServicio } from '../../core/servicios/tracking.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';
import { RealtimeService } from '../../core/servicios/realtime.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Movimientos del paquete</span>
          <h1>Seguimiento</h1>
        </div>
        <form class="toolbar" (ngSubmit)="buscarPorGuia()">
          <input class="search-input" name="numeroGuia" [(ngModel)]="numeroGuia" placeholder="Numero de guia" />
          <button class="button-primary" type="submit"><i class="pi pi-search"></i>Buscar</button>
        </form>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Buscando movimientos...</p>
      }

      <article class="table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Guia</th>
              <th>Estado</th>
              <th>Lugar actual</th>
              <th>Responsable</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            @for (evento of historial; track obtenerId(evento)) {
              <tr>
                <td>{{ evento.fechaEvento | date: 'short' }}</td>
                <td><span class="badge">{{ evento.numeroGuia }}</span></td>
                <td>{{ nombreEstado(evento.estadoId) }}</td>
                <td>{{ nombreLugar(evento.lugarActualId) }}</td>
                <td>{{ nombreUsuario(evento.usuarioResponsableId) }}</td>
                <td>{{ evento.descripcion }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">Ingresa una guia para ver los movimientos del paquete.</td>
              </tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
})
export class TrackingComponent implements OnInit, OnDestroy {
  protected numeroGuia = '';
  protected historial: Tracking[] = [];
  protected estados: Estado[] = [];
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;
  private readonly destruir$ = new Subject<void>();

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly trackingServicio: TrackingServicio,
    private readonly estadoServicio: EstadoServicio,
    private readonly lugarServicio: LugarServicio,
    private readonly usuarioServicio: UsuarioServicio,
    private readonly realtimeService: RealtimeService,
  ) {}

  public ngOnInit(): void {
    this.estadoServicio.listar().subscribe((estados) => (this.estados = estados));
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios));

    const numeroGuiaRuta = this.route.snapshot.paramMap.get('numeroGuia');
    if (numeroGuiaRuta) {
      this.numeroGuia = numeroGuiaRuta;
      this.realtimeService.unirseAGuia(numeroGuiaRuta);
      this.buscarPorGuia();
    }
    this.realtimeService.escuchar('tracking:created').pipe(takeUntil(this.destruir$)).subscribe((evento) => {
      if (!this.numeroGuia || evento.numeroGuia === this.numeroGuia.trim()) {
        this.buscarPorGuia();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  protected buscarPorGuia(): void {
    const numeroGuia = this.numeroGuia.trim();
    this.historial = [];
    this.mensaje = '';
    if (!numeroGuia) {
      this.mostrarError('Ingresa una guia para buscar el paquete.');
      return;
    }
    this.realtimeService.unirseAGuia(numeroGuia);
    this.cargando = true;
    this.trackingServicio.listarPorGuia(numeroGuia).subscribe({
      next: (historial) => {
        this.cargando = false;
        this.historial = historial;
        if (historial.length === 0) {
          this.mostrarError('Todavia no hay movimientos para esta guia.');
        }
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No se pudo consultar la informacion. Intenta de nuevo.');
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

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
