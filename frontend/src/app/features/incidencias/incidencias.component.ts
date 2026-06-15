// Pantalla de incidencias: maneja datos, acciones de usuario y estado visual de la vista.
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Incidencia } from '../../core/modelos/incidencia.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { IncidenciaServicio } from '../../core/servicios/incidencia.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

// Pantalla de problemas. Permite reportar incidencias amarradas a un paquete y su guia.
@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Problemas en envios</span>
          <h1>Problemas</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando problemas...</p>
      }

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarIncidencia()">
          <h2>Nuevo problema</h2>
          <div class="field-group">
            <label for="paqueteId">Paquete</label>
            <select id="paqueteId" name="paqueteId" [(ngModel)]="formulario.paqueteId" (ngModelChange)="seleccionarPaquete($event)" required>
              <option value="">Seleccionar</option>
              @for (paquete of paquetes; track obtenerId(paquete)) {
                <option [value]="obtenerId(paquete)">{{ paquete.numeroGuia }} - {{ paquete.descripcion || paquete.tipoPaquete }}</option>
              }
            </select>
          </div>
          <div class="field-group">
            <label for="numeroGuia">Numero guia</label>
            <input id="numeroGuia" name="numeroGuia" [(ngModel)]="formulario.numeroGuia" readonly required />
          </div>
          <div class="field-group">
            <label for="tipoIncidencia">Tipo de problema</label>
            <input id="tipoIncidencia" name="tipoIncidencia" [(ngModel)]="formulario.tipoIncidencia" required placeholder="Retraso, dano, extravio" />
          </div>
          <div class="field-group">
            <label for="estadoIncidencia">Estado</label>
            <select id="estadoIncidencia" name="estadoIncidencia" [(ngModel)]="formulario.estadoIncidencia">
              <option value="abierta">Abierta</option>
              <option value="en proceso">En proceso</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>
          <div class="field-group">
            <label for="reportadoPorId">Reportado por</label>
            <select id="reportadoPorId" name="reportadoPorId" [(ngModel)]="formulario.reportadoPorId" required>
              <option value="">Seleccionar</option>
              @for (usuario of usuarios; track obtenerId(usuario)) {
                <option [value]="obtenerId(usuario)">{{ usuario.nombre }}</option>
              }
            </select>
          </div>
          <div class="field-group">
            <label for="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion"></textarea>
          </div>
          <button class="button-primary" type="submit" [disabled]="guardando">
            <i class="pi pi-save"></i>{{ guardando ? 'Guardando...' : 'Guardar problema' }}
          </button>
        </form>

        <article class="table-panel">
          <table class="data-table">
            <thead>
              <tr>
                <th>Guia</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Reportado por</th>
                <th>Reporte</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (incidencia of incidencias; track obtenerId(incidencia)) {
                <tr>
                  <td>{{ incidencia.numeroGuia }}</td>
                  <td>{{ incidencia.tipoIncidencia }}</td>
                  <td><span class="badge warning">{{ incidencia.estadoIncidencia }}</span></td>
                  <td>{{ nombreUsuario(incidencia.reportadoPorId) }}</td>
                  <td>{{ incidencia.fechaReporte | date: 'short' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Eliminar" (click)="eliminarIncidencia(incidencia)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6">Todavia no hay problemas para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class IncidenciasComponent implements OnInit {
  protected incidencias: Incidencia[] = [];
  protected paquetes: Paquete[] = [];
  protected usuarios: Usuario[] = [];
  protected formulario: Partial<Incidencia> = this.crearFormularioVacio();
  protected mensaje = '';
  protected hayError = false;
  protected cargando = false;
  protected guardando = false;

  public constructor(
    private readonly incidenciaServicio: IncidenciaServicio,
    private readonly paqueteServicio: PaqueteServicio,
    private readonly usuarioServicio: UsuarioServicio,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
  }

  protected cargarDatos(): void {
    this.cargando = true;
    this.incidenciaServicio.listar().subscribe({
      next: (incidencias) => {
        this.incidencias = incidencias;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No se pudieron cargar los problemas. Intenta de nuevo.');
      },
    });
    this.paqueteServicio.listar().subscribe((paquetes) => (this.paquetes = paquetes));
    this.usuarioServicio.listar().subscribe((usuarios) => (this.usuarios = usuarios.filter((usuario) => usuario.estado !== false)));
  }

  protected seleccionarPaquete(paqueteId: string): void {
    // Al elegir paquete copiamos la guia para evitar que el usuario la escriba mal.
    const paquete = this.paquetes.find((registro) => this.obtenerId(registro) === paqueteId);
    this.formulario.numeroGuia = paquete?.numeroGuia || '';
  }

  protected guardarIncidencia(): void {
    // Validacion visual minima; el backend valida el payload completo con Zod.
    if (!this.formulario.paqueteId || !this.formulario.numeroGuia || !this.formulario.tipoIncidencia || !this.formulario.reportadoPorId) {
      this.mostrarError('Completa los campos obligatorios.');
      return;
    }

    this.guardando = true;
    this.incidenciaServicio.crear(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Problema guardado correctamente.';
        this.hayError = false;
        this.formulario = this.crearFormularioVacio();
        this.cargarDatos();
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudo guardar el problema. Intenta de nuevo.');
      },
    });
  }

  protected eliminarIncidencia(incidencia: Incidencia): void {
    if (!confirm('Desea eliminar este problema?')) {
      return;
    }
    this.incidenciaServicio.eliminar(this.obtenerId(incidencia)).subscribe(() => this.cargarDatos());
  }

  protected nombreUsuario(usuarioId?: string): string {
    return this.usuarios.find((usuario) => this.obtenerId(usuario) === String(usuarioId || ''))?.nombre || '-';
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Incidencia> {
    return { paqueteId: '', numeroGuia: '', tipoIncidencia: '', estadoIncidencia: 'abierta', reportadoPorId: '', descripcion: '' };
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
