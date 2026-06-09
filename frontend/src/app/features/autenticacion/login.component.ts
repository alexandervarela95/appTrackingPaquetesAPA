import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/servicios/auth.service';

/**
 * Pantalla de inicio de sesion del sistema de tracking APA.
 *
 * @remarks
 * Replica la composicion visual del login de appTallerAPA y mantiene la
 * autenticacion real contra el backend Express/JWT de appTrackingPaquetesAPA.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  /** Logo institucional copiado desde appTallerAPA para conservar identidad visual. */
  protected readonly rutaLogoLogin = 'assets/login/logoAPA.jpg';

  /** Usuario o correo escrito por la persona que inicia sesion. */
  protected usuario = '';

  /** Estado visual del checkbox solicitado por el diseno original. */
  protected recordarUsuario = false;

  /** Contrasena escrita en el formulario. */
  protected contrasena = '';

  protected cargando = false;
  protected mensajeError = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /**
   * Ejecuta el login real y navega al dashboard solo cuando backend confirma JWT.
   */
  protected iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.usuario.trim() || !this.contrasena) {
      this.mensajeError = 'Ingresa usuario y contrasena.';
      return;
    }

    this.cargando = true;

    this.authService
      .login(this.usuario, this.contrasena)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (error) => {
          this.mensajeError =
            error.error?.mensaje ||
            error.error?.error ||
            error.message ||
            'No se pudo iniciar sesion. Revisa tus credenciales.';
        },
      });
  }
}
