import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="login-page">
      <section class="login-card" aria-label="Inicio de sesion">
        <div class="login-brand">
          <span class="brand-mark" aria-hidden="true"><i class="pi pi-send"></i></span>
          <div class="brand-copy">
            <span>Sistema de trazabilidad interna</span>
            <h1>Almacen Pajaro Azul</h1>
          </div>
        </div>

        <form class="login-form" (ngSubmit)="iniciarSesion()" novalidate>
          <div class="field-group">
            <label for="correo">Correo</label>
            <input id="correo" name="correo" type="email" [(ngModel)]="correo" autocomplete="username" placeholder="usuario@apa.hn" />
          </div>

          <div class="field-group">
            <label for="contrasena">Contrasena</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              [(ngModel)]="contrasena"
              autocomplete="current-password"
              placeholder="Ingresa tu contrasena"
            />
          </div>

          @if (mensajeError) {
            <p class="status-message error">{{ mensajeError }}</p>
          }

          <button class="button-primary" type="submit" [disabled]="cargando">
            <i class="pi pi-sign-in"></i>
            {{ cargando ? 'Validando...' : 'Iniciar sesion' }}
          </button>
        </form>
      </section>

      <footer class="login-footer">
        <div></div>
        <span>Elaborado por Sistemas de Almacen Pajaro Azul</span>
      </footer>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100dvh;
      }

      .login-page {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 32px 18px;
        background:
          linear-gradient(rgba(15, 23, 42, 0.34), rgba(15, 23, 42, 0.58)),
          url("https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/signin/signin-glass.jpg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .login-card {
        width: min(100%, 410px);
        display: grid;
        gap: 30px;
        padding: 38px 34px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.12);
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
        backdrop-filter: blur(24px);
      }

      .login-brand {
        display: grid;
        gap: 16px;
        justify-items: center;
        text-align: center;
      }

      .brand-mark {
        display: inline-grid;
        width: 74px;
        height: 74px;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.18);
        color: #ffffff;
        font-size: 2.2rem;
      }

      .brand-copy span {
        color: rgba(255, 255, 255, 0.82);
      }

      .brand-copy h1 {
        margin: 5px 0 0;
        color: #ffffff;
        font-size: clamp(1.9rem, 6vw, 2.45rem);
        font-weight: 600;
        line-height: 1.08;
      }

      .login-form {
        display: grid;
        gap: 18px;
      }

      .login-footer {
        position: fixed;
        right: 18px;
        bottom: 18px;
        left: 18px;
        display: grid;
        gap: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.82rem;
      }

      .login-footer div {
        height: 1px;
        background: rgba(255, 255, 255, 0.28);
      }
    `,
  ],
})
export class LoginComponent {
  protected correo = '';
  protected contrasena = '';
  protected cargando = false;
  protected mensajeError = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  protected iniciarSesion(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Credenciales invalidas o backend no disponible.';
      },
    });
  }
}
