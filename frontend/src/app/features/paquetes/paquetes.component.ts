import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Estado } from '../../core/modelos/estado.model';
import { Lugar } from '../../core/modelos/lugar.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { EstadoServicio } from '../../core/servicios/estado.servicio';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Consulta operativa de envios</span>
          <h1>Paquetes</h1>
        </div>
        <div class="toolbar">
          <form class="toolbar" (ngSubmit)="buscarPorGuia()">
            <input class="search-input" name="numeroGuiaBusqueda" [(ngModel)]="numeroGuiaBusqueda" placeholder="Buscar por numero guia" />
            <button class="button-secondary" type="submit"><i class="pi pi-search"></i>Buscar</button>
          </form>
          <a class="button-primary" routerLink="/paquetes/nuevo"><i class="pi pi-plus"></i>Nuevo</a>
          <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando paquetes...</p>
      }

      @if (paqueteEncontrado) {
        <article class="glass-panel resultado-guia">
          <div>
            <span class="muted">Resultado por guia</span>
            <h2>{{ paqueteEncontrado.numeroGuia }}</h2>
            <p>{{ paqueteEncontrado.descripcion || 'Sin descripcion' }}</p>
          </div>
          <a class="button-secondary" [routerLink]="['/paquetes', obtenerId(paqueteEncontrado)]">
            <i class="pi pi-eye"></i>Ver detalle
          </a>
        </article>
      }

      <article class="table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Numero guia</th>
              <th>Descripcion</th>
              <th>Prioridad</th>
              <th>Estado actual</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha creacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (paquete of paquetes; track obtenerId(paquete)) {
              <tr>
                <td><span class="badge">{{ paquete.numeroGuia }}</span></td>
                <td>{{ paquete.descripcion || paquete.tipoPaquete }}</td>
                <td>{{ paquete.prioridad }}</td>
                <td>{{ nombreEstado(paquete.estadoActualId) }}</td>
                <td>{{ nombreLugar(paquete.lugarOrigenId) }}</td>
                <td>{{ nombreLugar(paquete.lugarDestinoId) }}</td>
                <td>{{ paquete.fechaCreacion | date: 'short' }}</td>
                <td class="toolbar">
                  <a class="icon-button" [routerLink]="['/paquetes', obtenerId(paquete)]" title="Ver detalle">
                    <i class="pi pi-eye"></i>
                  </a>
                  <a class="icon-button" [routerLink]="['/tracking', paquete.numeroGuia]" title="Tracking">
                    <i class="pi pi-map-marker"></i>
                  </a>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8">No hay paquetes registrados. Usa el boton Nuevo para crear el primer envio.</td>
              </tr>
            }
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [
    `
      .resultado-guia {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
      }

      .resultado-guia h2 {
        margin: 4px 0;
      }
    `,
  ],
})
export class PaquetesComponent implements OnInit {
  protected paquetes: Paquete[] = [];
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected estados: Estado[] = [];
  protected numeroGuiaBusqueda = '';
  protected paqueteEncontrado?: Paquete;
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;

  public constructor(
    private readonly paqueteServicio: PaqueteServicio,
    private readonly lugarServicio: LugarServicio,
    private readonly usuarioServicio: UsuarioServicio,
    private readonly estadoServicio: EstadoServicio,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
  }

  protected cargarDatos(): void {
    this.mensaje = '';
    this.cargando = true;
    this.paqueteServicio.listar().subscribe({
      next: (paquetes) => {
        this.paquetes = paquetes;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No fue posible cargar paquetes.');
      },
    });
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios));
    this.estadoServicio.listar().subscribe((estados) => (this.estados = estados));
  }

  protected buscarPorGuia(): void {
    const numeroGuia = this.numeroGuiaBusqueda.trim();
    this.paqueteEncontrado = undefined;
    if (!numeroGuia) {
      this.mostrarError('Ingresa un numero de guia para buscar.');
      return;
    }

    this.paqueteServicio.obtenerPorGuia(numeroGuia).subscribe({
      next: (paquete) => {
        this.paqueteEncontrado = paquete;
        this.mensaje = 'Paquete encontrado.';
        this.hayError = false;
      },
      error: () => this.mostrarError('No encontrado.'),
    });
  }

  protected nombreLugar(lugarId?: string): string {
    return this.lugares.find((lugar) => this.obtenerId(lugar) === String(lugarId || ''))?.nombre || '-';
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
