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
          <span>Registro y consulta de envios</span>
          <h1>Paquetes</h1>
        </div>
        <div class="toolbar">
          <input class="search-input" name="busqueda" [(ngModel)]="busqueda" placeholder="Buscar guia, tipo o descripcion" />
          <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </header>

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarPaquete()">
          <h2>Nuevo paquete</h2>
          <div class="field-group">
            <label for="tipoPaquete">Tipo de paquete</label>
            <input id="tipoPaquete" name="tipoPaquete" [(ngModel)]="formulario.tipoPaquete" required placeholder="Documento, equipo, accesorio" />
          </div>

          <div class="form-row">
            <div class="field-group">
              <label for="prioridad">Prioridad</label>
              <select id="prioridad" name="prioridad" [(ngModel)]="formulario.prioridad">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div class="field-group">
              <label for="numeroGuia">Numero de guia</label>
              <input id="numeroGuia" name="numeroGuia" [(ngModel)]="formulario.numeroGuia" placeholder="Automatico si queda vacio" />
            </div>
          </div>

          <div class="field-group">
            <label for="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion" placeholder="Contenido del envio"></textarea>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label for="lugarOrigenId">Origen</label>
              <select id="lugarOrigenId" name="lugarOrigenId" [(ngModel)]="formulario.lugarOrigenId" required>
                <option value="">Seleccionar</option>
                @for (lugar of lugares; track obtenerId(lugar)) {
                  <option [value]="obtenerId(lugar)">{{ lugar.nombre }}</option>
                }
              </select>
            </div>
            <div class="field-group">
              <label for="lugarDestinoId">Destino</label>
              <select id="lugarDestinoId" name="lugarDestinoId" [(ngModel)]="formulario.lugarDestinoId" required>
                <option value="">Seleccionar</option>
                @for (lugar of lugares; track obtenerId(lugar)) {
                  <option [value]="obtenerId(lugar)">{{ lugar.nombre }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label for="usuarioRemitenteId">Remitente</label>
              <select id="usuarioRemitenteId" name="usuarioRemitenteId" [(ngModel)]="formulario.usuarioRemitenteId" required>
                <option value="">Seleccionar</option>
                @for (usuario of usuarios; track obtenerId(usuario)) {
                  <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
                }
              </select>
            </div>
            <div class="field-group">
              <label for="usuarioDestinatarioId">Destinatario</label>
              <select id="usuarioDestinatarioId" name="usuarioDestinatarioId" [(ngModel)]="formulario.usuarioDestinatarioId" required>
                <option value="">Seleccionar</option>
                @for (usuario of usuarios; track obtenerId(usuario)) {
                  <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
                }
              </select>
            </div>
          </div>

          <div class="field-group">
            <label for="motoristaAsignadoId">Motorista</label>
            <select id="motoristaAsignadoId" name="motoristaAsignadoId" [(ngModel)]="formulario.motoristaAsignadoId">
              <option value="">Sin asignar</option>
              @for (usuario of motoristas; track obtenerId(usuario)) {
                <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
              }
            </select>
          </div>

          <div class="field-group">
            <label for="observaciones">Observaciones</label>
            <textarea id="observaciones" name="observaciones" [(ngModel)]="formulario.observaciones"></textarea>
          </div>

          <button class="button-primary" type="submit">
            <i class="pi pi-save"></i>
            Registrar paquete
          </button>
          @if (mensaje) {
            <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
          }
        </form>

        <article class="table-panel">
          <table class="data-table">
            <thead>
              <tr>
                <th>Guia</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Creacion</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (paquete of paquetesFiltrados; track obtenerId(paquete)) {
                <tr>
                  <td><span class="badge">{{ paquete.numeroGuia }}</span></td>
                  <td>{{ paquete.tipoPaquete }}</td>
                  <td>{{ paquete.prioridad }}</td>
                  <td>{{ paquete.fechaCreacion | date: 'short' }}</td>
                  <td class="toolbar">
                    <a class="icon-button" [routerLink]="['/paquetes', obtenerId(paquete)]" title="Ver detalle">
                      <i class="pi pi-eye"></i>
                    </a>
                    <button class="icon-button" type="button" title="Eliminar" (click)="eliminarPaquete(paquete)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">No hay paquetes para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class PaquetesComponent implements OnInit {
  protected paquetes: Paquete[] = [];
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected estados: Estado[] = [];
  protected busqueda = '';
  protected mensaje = '';
  protected hayError = false;
  protected formulario: Partial<Paquete> = this.crearFormularioVacio();

  public constructor(
    private readonly paqueteServicio: PaqueteServicio,
    private readonly lugarServicio: LugarServicio,
    private readonly usuarioServicio: UsuarioServicio,
    private readonly estadoServicio: EstadoServicio,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
  }

  protected get motoristas(): Usuario[] {
    return this.usuarios.filter((usuario) => usuario.rol === 'motorista' || usuario.rol === 'administrador');
  }

  protected get paquetesFiltrados(): Paquete[] {
    const criterio = this.busqueda.trim().toLowerCase();
    if (!criterio) {
      return this.paquetes;
    }
    return this.paquetes.filter((paquete) =>
      [paquete.numeroGuia, paquete.tipoPaquete, paquete.descripcion, paquete.prioridad].some((valor) =>
        String(valor || '').toLowerCase().includes(criterio),
      ),
    );
  }

  protected cargarDatos(): void {
    this.paqueteServicio.listar().subscribe((paquetes) => (this.paquetes = paquetes));
    this.lugarServicio.listar().subscribe((lugares) => (this.lugares = lugares));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios));
    this.estadoServicio.listar().subscribe((estados) => (this.estados = estados));
  }

  protected guardarPaquete(): void {
    this.paqueteServicio.crear(this.formulario).subscribe({
      next: () => {
        this.mensaje = 'Paquete registrado correctamente.';
        this.hayError = false;
        this.formulario = this.crearFormularioVacio();
        this.cargarDatos();
      },
      error: () => {
        this.mensaje = 'No fue posible registrar el paquete. Revisa referencias obligatorias.';
        this.hayError = true;
      },
    });
  }

  protected eliminarPaquete(paquete: Paquete): void {
    const id = this.obtenerId(paquete);
    if (!id) {
      return;
    }
    this.paqueteServicio.eliminar(id).subscribe(() => this.cargarDatos());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Paquete> {
    return {
      numeroGuia: '',
      tipoPaquete: '',
      prioridad: 'media',
      descripcion: '',
      lugarOrigenId: '',
      lugarDestinoId: '',
      usuarioRemitenteId: '',
      usuarioDestinatarioId: '',
      motoristaAsignadoId: '',
      observaciones: '',
    };
  }
}
