// Pantalla de evidencias: maneja datos, acciones de usuario y estado visual de la vista.
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evidencia } from '../../core/modelos/evidencia.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { EvidenciaServicio } from '../../core/servicios/evidencia.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';

// Pantalla de comprobantes. Sube archivos reales y los relaciona con una guia.
@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Fotos, firmas y documentos</span>
          <h1>Comprobantes</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarDatos()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      @if (mensaje) {
        <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
      }

      @if (cargando) {
        <p class="status-message">Cargando comprobantes...</p>
      }

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarEvidencia()">
          <h2>Nuevo comprobante</h2>
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
            <label for="tipoEvidencia">Tipo de comprobante</label>
            <input id="tipoEvidencia" name="tipoEvidencia" [(ngModel)]="formulario.tipoEvidencia" required placeholder="Foto, firma, documento" />
          </div>
          <div class="field-group">
            <label for="archivo">Archivo</label>
            <div class="file-control">
              <input id="archivo" class="file-input" name="archivo" type="file" accept=".jpg,.jpeg,.png,.pdf" (change)="seleccionarArchivo($event)" required />
              <label class="button-secondary file-button" for="archivo">
                <i class="pi pi-paperclip"></i>Seleccionar archivo
              </label>
              <span>{{ archivoSeleccionado?.name || 'Ningun archivo seleccionado' }}</span>
            </div>
          </div>
          <div class="field-group">
            <label for="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion"></textarea>
          </div>
          <button class="button-primary" type="submit" [disabled]="guardando">
            <i class="pi pi-upload"></i>{{ guardando ? 'Subiendo...' : 'Subir comprobante' }}
          </button>
        </form>

        <article class="table-panel">
          <table class="data-table">
            <thead>
              <tr>
                <th>Guia</th>
                <th>Tipo</th>
                <th>Archivo</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (evidencia of evidencias; track obtenerId(evidencia)) {
                <tr>
                  <td>{{ evidencia.numeroGuia }}</td>
                  <td><span class="badge">{{ evidencia.tipoEvidencia }}</span></td>
                  <td>
                    @if (evidencia.rutaArchivo) {
                      <button class="button-secondary" type="button" (click)="descargarEvidencia(evidencia)">
                        <i class="pi pi-download"></i>Descargar
                      </button>
                    } @else {
                      <span>-</span>
                    }
                  </td>
                  <td>{{ evidencia.fechaReporte | date: 'short' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Eliminar" (click)="eliminarEvidencia(evidencia)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Todavia no hay comprobantes para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </section>
  `,
})
export class EvidenciasComponent implements OnInit {
  protected evidencias: Evidencia[] = [];
  protected paquetes: Paquete[] = [];
  protected formulario: Partial<Evidencia> = this.crearFormularioVacio();
  protected archivoSeleccionado?: File;
  protected mensaje = '';
  protected hayError = false;
  protected guardando = false;
  protected cargando = false;

  public constructor(
    private readonly evidenciaServicio: EvidenciaServicio,
    private readonly paqueteServicio: PaqueteServicio,
  ) {}

  public ngOnInit(): void {
    this.cargarDatos();
  }

  protected cargarDatos(): void {
    this.cargando = true;
    this.evidenciaServicio.listar().subscribe({
      next: (evidencias) => {
        this.evidencias = evidencias;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarError('No se pudieron cargar los comprobantes. Intenta de nuevo.');
      },
    });
    this.paqueteServicio.listar().subscribe((paquetes) => (this.paquetes = paquetes));
  }

  protected seleccionarPaquete(paqueteId: string): void {
    // La guia se toma del paquete seleccionado para mantener el comprobante bien amarrado.
    const paquete = this.paquetes.find((registro) => this.obtenerId(registro) === paqueteId);
    this.formulario.numeroGuia = paquete?.numeroGuia || '';
  }

  protected seleccionarArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) {
      this.archivoSeleccionado = undefined;
      return;
    }

    const extensionValida = /\.(jpg|jpeg|png|pdf)$/i.test(archivo.name);
    if (!extensionValida || archivo.size > 5 * 1024 * 1024) {
      input.value = '';
      this.archivoSeleccionado = undefined;
      this.mostrarError('El archivo debe ser jpg, jpeg, png o pdf y pesar maximo 5 MB.');
      return;
    }

    this.archivoSeleccionado = archivo;
    this.mensaje = '';
  }

  protected guardarEvidencia(): void {
    if (!this.formulario.paqueteId || !this.formulario.numeroGuia || !this.formulario.tipoEvidencia || !this.archivoSeleccionado) {
      this.mostrarError('Completa paquete, tipo y archivo antes de subir.');
      return;
    }

    this.guardando = true;
    this.evidenciaServicio.subirEvidencia({
      paqueteId: this.formulario.paqueteId,
      numeroGuia: this.formulario.numeroGuia,
      tipoEvidencia: this.formulario.tipoEvidencia,
      descripcion: this.formulario.descripcion,
      archivo: this.archivoSeleccionado,
    }).subscribe({
      next: () => {
        this.mensaje = 'Comprobante subido correctamente.';
        this.hayError = false;
        this.guardando = false;
        this.archivoSeleccionado = undefined;
        this.formulario = this.crearFormularioVacio();
        this.cargarDatos();
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudo subir el comprobante. Intenta de nuevo.');
      },
    });
  }

  protected eliminarEvidencia(evidencia: Evidencia): void {
    if (!confirm('Desea eliminar este comprobante?')) {
      return;
    }
    this.evidenciaServicio.eliminar(this.obtenerId(evidencia)).subscribe(() => this.cargarDatos());
  }

  protected descargarEvidencia(evidencia: Evidencia): void {
    this.evidenciaServicio.descargarArchivo(this.obtenerId(evidencia)).subscribe((archivo) => {
      const url = URL.createObjectURL(archivo);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Evidencia> {
    return { paqueteId: '', numeroGuia: '', tipoEvidencia: '', descripcion: '' };
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
