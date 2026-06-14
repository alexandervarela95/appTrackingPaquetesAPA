import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/servicios/auth.service';

// Pantalla de login. Solo arma la vista; la validacion real de credenciales vive en el backend.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected readonly rutaLogoLogin = 'assets/login/logoAPA.jpg';
  protected usuario = '';
  protected recordarUsuario = false;
  protected contrasena = '';

  protected cargando = false;
  protected mensajeError = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  protected iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.usuario.trim() || !this.contrasena) {
      this.mensajeError = 'Ingresa usuario y contrasena.';
      return;
    }

    this.cargando = true;

    // El servicio normaliza "Sistemas" al correo demo para facilitar la presentacion.
    this.authService
      .login(this.usuario, this.contrasena)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: () => {
          this.mensajeError = 'No se pudo iniciar sesion. Revisa tus datos e intenta de nuevo.';
        },
      });
  }
}
