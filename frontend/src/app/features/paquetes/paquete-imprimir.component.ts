// Pantalla de paquete imprimir: maneja datos, acciones de usuario y estado visual de la vista.
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

// Vista de impresion de la hoja del paquete.
// Usa datos reales y evita imprimir sidebar, botones o fondos del dashboard.
@Component({
  selector: 'app-paquete-imprimir',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="print-screen">
      <div class="print-actions">
        @if (paquete) {
          <a class="button-secondary" [routerLink]="['/paquetes', obtenerId(paquete)]"><i class="pi pi-arrow-left"></i>Volver al detalle</a>
        }
        <button type="button" class="button-primary" [disabled]="!paquete" (click)="imprimir()">
          <i class="pi pi-print"></i>Imprimir
        </button>
      </div>

      @if (mensaje) {
        <p class="status-message error">{{ mensaje }}</p>
      }

      @if (paquete) {
        <article class="shipping-sheet" aria-label="Hoja de envio interno">
          <header class="sheet-header">
            <div class="sheet-brand">
              <img src="assets/login/logoAPA.jpg" alt="Almacen Pajaro Azul" />
              <div>
                <strong>Almacén Pájaro Azul</strong>
                <span>Hoja de envío interno</span>
              </div>
            </div>

            <div class="sheet-code-grid">
              <div class="sheet-code-box guide">
                <span>N° guía</span>
                <strong>{{ paquete.numeroGuia }}</strong>
              </div>
              <div class="sheet-code-box">
                <span>N° bulto</span>
                <strong>1</strong>
              </div>
            </div>
          </header>

          <!-- Datos superiores que si van en la hoja. Estado actual se dejo fuera por requerimiento. -->
          <section class="sheet-summary">
            <div>
              <span>Fecha de creación</span>
              <strong>{{ paquete.fechaCreacion | date: 'short' }}</strong>
            </div>
            <div>
              <span>Prioridad</span>
              <strong>{{ paquete.prioridad || '-' }}</strong>
            </div>
          </section>

          <!-- Origen y destino mantienen dos columnas para parecer una guia/cargo impresa. -->
          <section class="sheet-columns">
            <div class="sheet-section">
              <h2>Origen</h2>
              <dl>
                <div>
                  <dt>Lugar origen</dt>
                  <dd>{{ nombreLugar(paquete.lugarOrigenId) }}</dd>
                </div>
                <div>
                  <dt>Remitente</dt>
                  <dd>{{ nombreUsuario(paquete.usuarioRemitenteId) }}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{{ correoUsuario(paquete.usuarioRemitenteId) }}</dd>
                </div>
                <div>
                  <dt>Departamento / sucursal</dt>
                  <dd>{{ detalleLugar(paquete.lugarOrigenId) }}</dd>
                </div>
              </dl>
            </div>

            <div class="sheet-section">
              <h2>Destino</h2>
              <dl>
                <div>
                  <dt>Lugar destino</dt>
                  <dd>{{ nombreLugar(paquete.lugarDestinoId) }}</dd>
                </div>
                <div>
                  <dt>Destinatario</dt>
                  <dd>{{ nombreUsuario(paquete.usuarioDestinatarioId) }}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{{ correoUsuario(paquete.usuarioDestinatarioId) }}</dd>
                </div>
              </dl>
            </div>
          </section>

          <!-- No se muestran motorista, ultimo movimiento ni pie de pagina del sistema. -->
          <section class="sheet-section full">
            <h2>Detalle del envío</h2>
            <div class="detail-grid">
              <div>
                <span>Tipo de paquete</span>
                <strong>{{ paquete.tipoPaquete || '-' }}</strong>
              </div>
              <div class="wide">
                <span>Descripción</span>
                <p>{{ paquete.descripcion || 'Sin descripción' }}</p>
              </div>
              <div class="wide observations-field">
                <span>Observaciones</span>
                <p>{{ paquete.observaciones || 'Sin observaciones' }}</p>
              </div>
            </div>
          </section>

          <section class="sheet-signatures">
            <div>
              <span>Firma de quien entrega</span>
            </div>
            <div>
              <span>Firma de quien recibe</span>
            </div>
            <div>
              <span>Fecha y hora de recepción</span>
            </div>
          </section>

        </article>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .print-screen {
        display: grid;
        gap: var(--space-5);
      }

      .print-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
      }

      .shipping-sheet {
        width: min(100%, 980px);
        margin: 0 auto;
        overflow: hidden;
        border: 2px solid #111111;
        background: #ffffff;
        color: #111111;
        font-family: Arial, Helvetica, sans-serif;
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
      }

      .sheet-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
        gap: 22px;
        align-items: center;
        padding: 26px 30px;
        background: #4b5563;
        color: #ffffff;
      }

      .sheet-brand {
        display: flex;
        align-items: center;
        gap: 18px;
        min-width: 0;
      }

      .sheet-brand img {
        width: 118px;
        max-height: 56px;
        object-fit: contain;
        border-radius: 8px;
        background: #ffffff;
        padding: 6px;
      }

      .sheet-brand strong {
        display: block;
        font-size: 2rem;
        line-height: 1;
        text-transform: uppercase;
      }

      .sheet-brand span,
      .sheet-code-box span,
      .sheet-summary span,
      .detail-grid span {
        display: block;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .sheet-code-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 132px;
        gap: 14px;
      }

      .sheet-code-box {
        min-height: 104px;
        display: grid;
        align-content: start;
        gap: 12px;
        padding: 16px;
        border-radius: 20px;
        background: #ffffff;
        color: #111111;
      }

      .sheet-code-box strong {
        overflow-wrap: anywhere;
        font-size: 1.15rem;
      }

      .sheet-code-box.guide strong {
        font-size: 1.35rem;
      }

      .sheet-summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border-bottom: 2px solid #111111;
      }

      .sheet-summary div {
        min-height: 74px;
        padding: 14px 20px;
        border-right: 1px solid #111111;
      }

      .sheet-summary div:last-child {
        border-right: 0;
      }

      .sheet-summary strong {
        display: block;
        margin-top: 6px;
        font-size: 1rem;
        overflow-wrap: anywhere;
      }

      .sheet-columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border-bottom: 2px solid #111111;
      }

      .sheet-section {
        padding: 24px 28px;
      }

      .sheet-columns .sheet-section:first-child {
        border-right: 2px solid #111111;
      }

      .sheet-section h2 {
        margin: 0 0 18px;
        font-size: 2.35rem;
        line-height: 1;
        text-transform: uppercase;
      }

      .sheet-section dl {
        display: grid;
        gap: 16px;
        margin: 0;
      }

      .sheet-section dl div {
        min-height: 54px;
        border-bottom: 2px solid #111111;
      }

      .sheet-section dt {
        font-size: 0.84rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      .sheet-section dd {
        margin: 5px 0 0;
        font-size: 1rem;
        overflow-wrap: anywhere;
      }

      .sheet-section.full {
        border-bottom: 2px solid #111111;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 22px;
      }

      .detail-grid > div {
        min-height: 58px;
        padding-bottom: 10px;
        border-bottom: 1px solid #111111;
      }

      .detail-grid .wide {
        grid-column: 1 / -1;
      }

      .detail-grid p {
        margin: 6px 0 0;
        overflow-wrap: anywhere;
      }

      .observations-field {
        display: grid;
        align-content: start;
        gap: 8px;
        min-height: 76px;
        padding-bottom: 12px;
      }

      .observations-field p {
        margin: 0;
        line-height: 1.38;
        white-space: pre-line;
      }

      .sheet-signatures {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        padding: 42px 28px 24px;
      }

      .sheet-signatures div {
        min-height: 60px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        border-top: 2px solid #111111;
        text-align: center;
      }

      .sheet-signatures span {
        padding-top: 8px;
        font-size: 0.82rem;
        font-weight: 700;
      }

      @media (max-width: 780px) {
        .sheet-header,
        .sheet-columns,
        .sheet-summary,
        .sheet-signatures {
          grid-template-columns: 1fr;
        }

        .sheet-code-grid {
          grid-template-columns: 1fr;
        }

        .sheet-columns .sheet-section:first-child,
        .sheet-summary div {
          border-right: 0;
        }

        .sheet-summary div,
        .sheet-columns .sheet-section:first-child {
          border-bottom: 1px solid #111111;
        }
      }

      /* Configuracion de impresion en carta horizontal. */
      @media print {
        :host {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .print-screen {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .print-actions,
        .status-message {
          display: none !important;
        }

        .shipping-sheet {
          /* Alturas fijas para que el formato no se parta en dos paginas. */
          width: 100%;
          height: calc(8.5in - 12mm);
          margin: 0;
          display: grid;
          grid-template-rows: 1.22in 0.56in 2.36in 1.62in 0.82in;
          border: 2px solid #000000;
          box-shadow: none;
          overflow: hidden;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .sheet-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 4.35in;
          gap: 0.18in;
          align-items: center;
          padding: 0.18in 0.24in;
        }

        .sheet-brand {
          gap: 0.16in;
        }

        .sheet-brand img {
          width: 1.28in;
          max-height: 0.42in;
          padding: 0.04in;
          border-radius: 0.06in;
        }

        .sheet-brand strong {
          max-width: 3.35in;
          font-size: 0.28in;
          line-height: 0.9;
        }

        .sheet-brand span,
        .sheet-code-box span,
        .sheet-summary span,
        .detail-grid span {
          font-size: 0.075in;
          line-height: 1.15;
        }

        .sheet-code-grid {
          grid-template-columns: minmax(0, 1fr) 1.16in;
          gap: 0.12in;
        }

        .sheet-code-box {
          min-height: 0.82in;
          gap: 0.08in;
          padding: 0.12in;
          border-radius: 0.14in;
        }

        .sheet-code-box strong,
        .sheet-code-box.guide strong {
          font-size: 0.15in;
          line-height: 1.25;
        }

        .sheet-summary {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .sheet-summary div {
          min-height: 0;
          padding: 0.11in 0.18in;
        }

        .sheet-summary strong {
          margin-top: 0.04in;
          font-size: 0.12in;
          line-height: 1.15;
        }

        .sheet-columns {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .sheet-columns .sheet-section:first-child {
          border-right: 2px solid #000000;
          border-bottom: 0;
        }

        .sheet-section {
          padding: 0.16in 0.22in;
        }

        .sheet-section h2 {
          margin: 0 0 0.1in;
          font-size: 0.32in;
          line-height: 0.95;
        }

        .sheet-section dl {
          gap: 0.085in;
        }

        .sheet-section dl div {
          min-height: 0.34in;
          border-bottom: 2px solid #000000;
        }

        .sheet-section dt {
          font-size: 0.075in;
          line-height: 1.1;
        }

        .sheet-section dd {
          margin-top: 0.035in;
          font-size: 0.105in;
          line-height: 1.2;
        }

        .detail-grid {
          grid-template-columns: 1.72in minmax(0, 1fr);
          gap: 0.08in 0.18in;
        }

        .detail-grid > div {
          min-height: 0.3in;
          padding-bottom: 0.075in;
        }

        .detail-grid .wide {
          grid-column: 1 / -1;
        }

        .detail-grid strong,
        .detail-grid p {
          margin-top: 0.035in;
          font-size: 0.105in;
          line-height: 1.18;
        }

        .observations-field {
          gap: 0.055in;
          min-height: 0.48in;
          padding-bottom: 0.1in;
        }

        .observations-field p {
          margin: 0;
          line-height: 1.28;
          white-space: pre-line;
        }

        .sheet-signatures {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.18in;
          padding: 0.18in 0.22in 0.1in;
        }

        .sheet-signatures div {
          min-height: 0.28in;
          align-items: flex-start;
        }

        .sheet-signatures span {
          padding-top: 0.055in;
          font-size: 0.075in;
          line-height: 1.1;
        }
      }
    `,
  ],
})
export class PaqueteImprimirComponent implements OnInit {
  protected paquete?: Paquete;
  protected historial: Tracking[] = [];
  protected estados: Estado[] = [];
  protected lugares: Lugar[] = [];
  protected usuarios: Usuario[] = [];
  protected mensaje = '';
  protected fechaImpresion = new Date();

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
    this.paqueteServicio.obtenerPorId(id).subscribe({
      next: (paquete) => {
        this.paquete = paquete;
        this.trackingServicio.listarPorPaquete(this.obtenerId(paquete)).subscribe((historial) => (this.historial = historial));
      },
      error: () => {
        this.mensaje = 'No se pudo cargar la hoja de envio del paquete.';
      },
    });
  }

  protected imprimir(): void {
    this.fechaImpresion = new Date();
    setTimeout(() => window.print(), 0);
  }

  protected nombreLugar(lugarId?: string): string {
    return this.lugares.find((lugar) => this.obtenerId(lugar) === String(lugarId || ''))?.nombre || '-';
  }

  protected detalleLugar(lugarId?: string): string {
    const lugar = this.lugares.find((registro) => this.obtenerId(registro) === String(lugarId || ''));
    return [lugar?.ciudad, lugar?.direccion].filter(Boolean).join(' - ') || '-';
  }

  protected nombreUsuario(usuarioId?: string): string {
    return this.usuarios.find((usuario) => this.obtenerId(usuario) === String(usuarioId || ''))?.nombre || '-';
  }

  protected correoUsuario(usuarioId?: string): string {
    return this.usuarios.find((usuario) => this.obtenerId(usuario) === String(usuarioId || ''))?.correo || '-';
  }

  protected nombreEstado(estadoId?: string): string {
    return this.estados.find((estado) => this.obtenerId(estado) === String(estadoId || ''))?.nombre || '-';
  }

  protected obtenerId(registro: { _id?: string; id?: string }): string {
    return registro._id || registro.id || '';
  }
}
