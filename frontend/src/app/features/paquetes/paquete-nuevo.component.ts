import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Lugar } from '../../core/modelos/lugar.model';
import { Paquete } from '../../core/modelos/paquete.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { LugarServicio } from '../../core/servicios/lugar.servicio';
import { PaqueteServicio } from '../../core/servicios/paquete.servicio';
import { UsuarioServicio } from '../../core/servicios/usuario.servicio';

// Formulario para registrar paquetes internos con origen, destino y responsables.
@Component({
  selector: 'app-paquete-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen-shell">
      <header class="section-header">
        <div>
          <span>Envios internos</span>
          <h1>Registrar paquete</h1>
        </div>
      </header>

      <form class="glass-panel form-grid formulario-paquete" (ngSubmit)="guardarPaquete()">
        <div class="form-row">
          <div class="field-group">
            <label for="tipoPaquete">Tipo de paquete</label>
            <input id="tipoPaquete" name="tipoPaquete" [(ngModel)]="formulario.tipoPaquete" required placeholder="Documento, equipo, accesorio" />
          </div>
          <div class="field-group">
            <label for="prioridad">Prioridad</label>
            <select id="prioridad" name="prioridad" [(ngModel)]="formulario.prioridad">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <label for="descripcion">Descripcion</label>
          <textarea id="descripcion" name="descripcion" [(ngModel)]="formulario.descripcion" required placeholder="Contenido del envio"></textarea>
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

        <button class="button-primary" type="submit" [disabled]="guardando">
          <i class="pi pi-save"></i>{{ guardando ? 'Guardando...' : 'Registrar paquete' }}
        </button>

        @if (mensaje) {
          <p class="status-message" [class.error]="hayError">{{ mensaje }}</p>
        }
      </form>
    </section>
  `,
  styles: [
    `
      .formulario-paquete {
        max-width: 920px;
      }
    `,
  ],
})
export class PaqueteNuevoComponent implements OnInit {
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected formulario: Partial<Paquete> = this.crearFormularioVacio();
  protected mensaje = '';
  protected hayError = false;
  protected guardando = false;

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

  protected guardarPaquete(): void {
    // Validacion rapida de UI; el backend vuelve a validar antes de guardar.
    if (!this.formulario.descripcion || !this.formulario.tipoPaquete || !this.formulario.lugarOrigenId || !this.formulario.lugarDestinoId || !this.formulario.usuarioRemitenteId || !this.formulario.usuarioDestinatarioId) {
      this.mostrarError('Completa los campos obligatorios antes de guardar.');
      return;
    }

    this.guardando = true;
    this.paqueteServicio.crear(this.formulario).subscribe({
      next: (paquete) => {
        this.guardando = false;
        this.mensaje = 'Paquete registrado correctamente.';
        this.hayError = false;
        setTimeout(() => this.router.navigate(['/paquetes', this.obtenerId(paquete)]), 650);
      },
      error: () => {
        this.guardando = false;
        this.mostrarError('No se pudo registrar el paquete. Intenta de nuevo.');
      },
    });
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }

  private crearFormularioVacio(): Partial<Paquete> {
    return {
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

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.hayError = true;
  }
}
