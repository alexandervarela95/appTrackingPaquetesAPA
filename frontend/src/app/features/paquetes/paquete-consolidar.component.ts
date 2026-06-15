// Pantalla de consolidacion: arma una lista temporal y guarda varios paquetes al confirmar.
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Lugar } from '../../core/modelos/lugar.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { PaqueteBulkItem, PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

interface PaqueteTemporal extends PaqueteBulkItem {
  idTemporal: number;
}

@Component({
  selector: 'app-paquete-consolidar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Envios internos</span>
          <h1>Consolidar paquetes</h1>
          <p>Agrega varios paquetes a una lista y guárdalos todos al final.</p>
        </div>
        <a class="button-secondary" routerLink="/paquetes"><i class="pi pi-arrow-left"></i>Paquetes</a>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (!paquetesCreados.length) {
        <section class="content-grid consolidate-grid">
          <form class="glass-panel form-grid" (ngSubmit)="agregarALista()">
            <h2>Datos comunes</h2>
            <div class="form-row">
              <div class="field-group">
                <label for="lugarOrigenId">Lugar origen</label>
                <select id="lugarOrigenId" name="lugarOrigenId" [(ngModel)]="comunes.lugarOrigenId" required>
                  <option value="">Seleccionar</option>
                  @for (lugar of lugares; track obtenerId(lugar)) {
                    <option [value]="obtenerId(lugar)">{{ lugar.nombre }}</option>
                  }
                </select>
              </div>
              <div class="field-group">
                <label for="lugarDestinoId">Lugar destino</label>
                <select id="lugarDestinoId" name="lugarDestinoId" [(ngModel)]="comunes.lugarDestinoId" required>
                  <option value="">Seleccionar</option>
                  @for (lugar of lugares; track obtenerId(lugar)) {
                    <option [value]="obtenerId(lugar)">{{ lugar.nombre }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="field-group">
                <label for="usuarioRemitenteId">Usuario remitente</label>
                <select id="usuarioRemitenteId" name="usuarioRemitenteId" [(ngModel)]="comunes.usuarioRemitenteId" required>
                  <option value="">Seleccionar</option>
                  @for (usuario of usuarios; track obtenerId(usuario)) {
                    <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
                  }
                </select>
              </div>
              <div class="field-group">
                <label for="usuarioDestinatarioId">Usuario destinatario</label>
                <select id="usuarioDestinatarioId" name="usuarioDestinatarioId" [(ngModel)]="comunes.usuarioDestinatarioId" required>
                  <option value="">Seleccionar</option>
                  @for (usuario of usuarios; track obtenerId(usuario)) {
                    <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="field-group">
                <label for="prioridad">Prioridad general</label>
                <select id="prioridad" name="prioridad" [(ngModel)]="comunes.prioridad">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div class="field-group">
                <label for="motoristaAsignadoId">Motorista</label>
                <select id="motoristaAsignadoId" name="motoristaAsignadoId" [(ngModel)]="comunes.motoristaAsignadoId">
                  <option value="">Sin asignar</option>
                  @for (usuario of motoristas; track obtenerId(usuario)) {
                    <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="field-group">
              <label for="observacionGeneral">Observación general</label>
              <textarea id="observacionGeneral" name="observacionGeneral" [(ngModel)]="comunes.observacionGeneral"></textarea>
            </div>

            <h2>{{ indiceEdicion === null ? 'Agregar paquete' : 'Editar paquete' }}</h2>
            <div class="form-row">
              <div class="field-group">
                <label for="tipoPaquete">Tipo de paquete</label>
                <input id="tipoPaquete" name="tipoPaquete" [(ngModel)]="paqueteActual.tipoPaquete" required placeholder="Documento, equipo, accesorio" />
              </div>
              <div class="field-group">
                <label for="descripcion">Descripción</label>
                <input id="descripcion" name="descripcion" [(ngModel)]="paqueteActual.descripcion" required placeholder="Contenido del paquete" />
              </div>
            </div>

            <div class="field-group">
              <label for="observaciones">Observaciones del paquete</label>
              <textarea id="observaciones" name="observaciones" [(ngModel)]="paqueteActual.observaciones"></textarea>
            </div>

            <div class="toolbar">
              <button class="button-primary" type="submit">
                <i class="pi" [class.pi-plus]="indiceEdicion === null" [class.pi-check]="indiceEdicion !== null"></i>
                {{ indiceEdicion === null ? 'Agregar a lista' : 'Guardar edición' }}
              </button>
              @if (indiceEdicion !== null) {
                <button class="button-secondary" type="button" (click)="cancelarEdicion()">Cancelar edición</button>
              }
            </div>
          </form>

          <aside class="glass-panel summary-panel">
            <h2>Resumen</h2>
            <p><strong>{{ paquetesTemporales.length }}</strong> paquetes en lista</p>
            <p>Destino: {{ nombreLugar(comunes.lugarDestinoId) }}</p>
            <p>Destinatario: {{ nombreUsuario(comunes.usuarioDestinatarioId) }}</p>
            <p>Prioridad: {{ comunes.prioridad }}</p>
          </aside>
        </section>

        <article class="table-panel">
          <div class="table-header-row">
            <h2>Lista temporal</h2>
            <div class="toolbar">
              <button class="button-secondary" type="button" [disabled]="!paquetesTemporales.length || guardando" (click)="limpiarLista()">Limpiar lista</button>
              <button class="button-primary" type="button" [disabled]="guardando || !paquetesTemporales.length" (click)="guardarTodos()">
                <i class="pi pi-save"></i>{{ guardando ? 'Guardando...' : 'Guardar todos' }}
              </button>
              <button class="button-secondary" type="button" (click)="cancelar()">Cancelar</button>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Observaciones</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (paquete of paquetesTemporales; track paquete.idTemporal; let i = $index) {
                <tr>
                  <td>{{ i + 1 }}</td>
                  <td>{{ paquete.tipoPaquete }}</td>
                  <td>{{ paquete.descripcion }}</td>
                  <td>{{ paquete.observaciones || '-' }}</td>
                  <td class="toolbar">
                    <button class="icon-button" type="button" title="Editar" (click)="editarPaquete(i)"><i class="pi pi-pencil"></i></button>
                    <button class="icon-button" type="button" title="Quitar" (click)="quitarPaquete(i)"><i class="pi pi-trash"></i></button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Todavía no hay paquetes en la lista temporal.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      } @else {
        <article class="glass-panel success-panel">
          <span class="badge success">Consolidación guardada</span>
          <h2>{{ paquetesCreados.length }} paquetes creados</h2>
          <div class="guide-list">
            @for (paquete of paquetesCreados; track obtenerId(paquete)) {
              <a class="badge" [routerLink]="['/paquetes', obtenerId(paquete)]">{{ paquete.numeroGuia }}</a>
            }
          </div>
          <div class="toolbar">
            <a class="button-primary" routerLink="/paquetes"><i class="pi pi-list"></i>Ver paquetes</a>
            <button class="button-secondary" type="button" (click)="crearOtra()">Crear otra consolidación</button>
          </div>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .section-header p {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
      }

      .consolidate-grid {
        grid-template-columns: minmax(0, 1fr) minmax(260px, 0.32fr);
      }

      .summary-panel,
      .success-panel {
        display: grid;
        gap: var(--space-3);
        align-content: start;
      }

      .table-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .table-header-row h2,
      .success-panel h2 {
        margin: 0;
      }

      .guide-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      @media (max-width: 980px) {
        .consolidate-grid {
          grid-template-columns: 1fr;
        }

        .table-header-row {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class PaqueteConsolidarComponent implements OnInit {
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected paquetesTemporales: PaqueteTemporal[] = [];
  protected paquetesCreados: Paquete[] = [];
  protected paqueteActual: PaqueteBulkItem = this.crearPaqueteVacio();
  protected comunes = this.crearComunesVacios();
  protected mensaje = '';
  protected hayError = false;
  protected guardando = false;
  protected indiceEdicion: number | null = null;
  private siguienteIdTemporal = 1;

  public constructor(
    private readonly paqueteServicio: PaqueteServicio,
    private readonly lugarServicio: LugarServicio,
    private readonly usuarioServicio: UsuarioServicio,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares.filter((lugar) => lugar.estado !== false)));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios.filter((usuario) => usuario.estado !== false)));
  }

  protected get motoristas(): Usuario[] {
    return this.usuarios.filter((usuario) => usuario.rol === 'motorista' || usuario.rol === 'administrador');
  }

  protected agregarALista(): void {
    if (!this.paqueteActual.tipoPaquete.trim() || !this.paqueteActual.descripcion.trim()) {
      this.mostrarError('Completa tipo y descripción antes de agregar el paquete.');
      return;
    }

    const paquete = {
      idTemporal: this.indiceEdicion === null ? this.siguienteIdTemporal++ : this.paquetesTemporales[this.indiceEdicion].idTemporal,
      tipoPaquete: this.paqueteActual.tipoPaquete.trim(),
      descripcion: this.paqueteActual.descripcion.trim(),
      observaciones: this.paqueteActual.observaciones?.trim() || '',
    };

    if (this.indiceEdicion === null) {
      this.paquetesTemporales = [...this.paquetesTemporales, paquete];
    } else {
      this.paquetesTemporales = this.paquetesTemporales.map((item, index) => (index === this.indiceEdicion ? paquete : item));
    }

    this.paqueteActual = this.crearPaqueteVacio();
    this.indiceEdicion = null;
    this.mensaje = '';
    this.hayError = false;
  }

  protected editarPaquete(index: number): void {
    const paquete = this.paquetesTemporales[index];
    this.indiceEdicion = index;
    this.paqueteActual = {
      tipoPaquete: paquete.tipoPaquete,
      descripcion: paquete.descripcion,
      observaciones: paquete.observaciones,
    };
  }

  protected quitarPaquete(index: number): void {
    this.paquetesTemporales = this.paquetesTemporales.filter((_, indice) => indice !== index);
    if (this.indiceEdicion === index) {
      this.cancelarEdicion();
    }
  }

  protected limpiarLista(): void {
    this.paquetesTemporales = [];
    this.cancelarEdicion();
  }

  protected cancelarEdicion(): void {
    this.indiceEdicion = null;
    this.paqueteActual = this.crearPaqueteVacio();
  }

  protected guardarTodos(): void {
    if (!this.comunes.lugarOrigenId || !this.comunes.lugarDestinoId || !this.comunes.usuarioRemitenteId || !this.comunes.usuarioDestinatarioId) {
      this.mostrarError('Completa origen, destino, remitente y destinatario antes de guardar.');
      return;
    }
    if (!this.paquetesTemporales.length) {
      this.mostrarError('Agrega al menos un paquete a la lista.');
      return;
    }

    this.guardando = true;
    this.paqueteServicio.crearBulk({
      ...this.comunes,
      paquetes: this.paquetesTemporales.map(({ idTemporal: _idTemporal, ...paquete }) => paquete),
    }).subscribe({
      next: (respuesta) => {
        this.guardando = false;
        this.paquetesCreados = respuesta.paquetes;
        this.paquetesTemporales = [];
        this.cancelarEdicion();
        this.mensaje = respuesta.advertencia || 'Paquetes creados correctamente.';
        this.hayError = false;
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudieron guardar los paquetes consolidados. Revisa los datos e intenta de nuevo.');
      },
    });
  }

  protected cancelar(): void {
    this.router.navigate(['/paquetes']);
  }

  protected crearOtra(): void {
    this.paquetesCreados = [];
    this.comunes = this.crearComunesVacios();
    this.mensaje = '';
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  protected nombreLugar(lugarId?: string): string {
    return this.lugares.find((lugar) => this.obtenerId(lugar) === String(lugarId || ''))?.nombre || '-';
  }

  protected nombreUsuario(usuarioId?: string): string {
    return this.usuarios.find((usuario) => this.obtenerId(usuario) === String(usuarioId || ''))?.nombre || '-';
  }

  private crearPaqueteVacio(): PaqueteBulkItem {
    return { tipoPaquete: '', descripcion: '', observaciones: '' };
  }

  private crearComunesVacios() {
    return {
      lugarOrigenId: '',
      lugarDestinoId: '',
      usuarioRemitenteId: '',
      usuarioDestinatarioId: '',
      motoristaAsignadoId: '',
      prioridad: 'media',
      observacionGeneral: '',
    };
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
