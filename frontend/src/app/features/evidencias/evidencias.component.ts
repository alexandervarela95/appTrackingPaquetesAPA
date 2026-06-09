import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evidencia } from '../../core/modelos/evidencia.model';
import { EvidenciaServicio } from '../../core/servicios/evidencia.servicio';

@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Comprobantes y soportes</span>
          <h1>Evidencias</h1>
        </div>
        <button class="icon-button" type="button" title="Actualizar" (click)="cargarEvidencias()">
          <i class="pi pi-refresh"></i>
        </button>
      </header>

      <section class="content-grid">
        <form class="glass-panel form-grid" (ngSubmit)="guardarEvidencia()">
          <h2>Nueva evidencia</h2>
          <div class="field-group">
            <label for="paqueteId">Paquete ID</label>
            <input id="paqueteId" name="paqueteId" [(ngModel)]="formulario.paqueteId" required />
          </div>
          <div class="field-group">
            <label for="numeroGuia">Numero guia</label>
            <input id="numeroGuia" name="numeroGuia" [(ngModel)]="formulario.numeroGuia" required />
          </div>
          <div class="field-group">
            <label for="tipoEvidencia">Tipo</label>
            <input id="tipoEvidencia" name="tipoEvidencia" [(ngModel)]="formulario.tipoEvidencia" required placeholder="Foto, firma, documento" />
          </div>
          <div class="field-group">
            <label for="rutaArchivo">Ruta archivo</label>
            <input id="rutaArchivo" name="rutaArchivo" [(ngModel)]="formulario.rutaArchivo" placeholder="URL o ruta interna" />
          </div>
          <div class="field-group">
            <label for="reportadoPorId">Reportado por ID</label>
            <input id="reportadoPorId" name="reportadoPorId" [(ngModel)]="formulario.reportadoPorId" required />
          </div>
          <div class="field-group">
            <label for="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion"></textarea>
          </div>
          <button class="button-primary" type="submit"><i class="pi pi-save"></i>Guardar</button>
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
                  <td>{{ evidencia.rutaArchivo || '-' }}</td>
                  <td>{{ evidencia.fechaReporte | date: 'short' }}</td>
                  <td>
                    <button class="icon-button" type="button" title="Eliminar" (click)="eliminarEvidencia(evidencia)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">Sin evidencias registradas.</td>
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
  protected formulario: Partial<Evidencia> = this.crearFormularioVacio();

  public constructor(private readonly evidenciaServicio: EvidenciaServicio) {}

  public ngOnInit(): void {
    this.cargarEvidencias();
  }

  protected cargarEvidencias(): void {
    this.evidenciaServicio.listar().subscribe((evidencias) => (this.evidencias = evidencias));
  }

  protected guardarEvidencia(): void {
    this.evidenciaServicio.crear(this.formulario).subscribe(() => {
      this.formulario = this.crearFormularioVacio();
      this.cargarEvidencias();
    });
  }

  protected eliminarEvidencia(evidencia: Evidencia): void {
    this.evidenciaServicio.eliminar(this.obtenerId(evidencia)).subscribe(() => this.cargarEvidencias());
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Evidencia> {
    return { paqueteId: '', numeroGuia: '', tipoEvidencia: '', rutaArchivo: '', reportadoPorId: '', descripcion: '' };
  }
}
