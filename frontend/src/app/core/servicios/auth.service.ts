import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../modelos/auth-user.model';

interface LoginRespuesta {
  exito: boolean;
  mensaje: string;
  datos: {
    token: string;
    usuario: AuthUser;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenClave = 'apa-token';
  private readonly usuarioClave = 'apa-usuario';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public login(correo: string, contrasena: string) {
    return this.http.post<LoginRespuesta>('/api/auth/login', { correo, contrasena }).pipe(
      tap((respuesta) => {
        if (respuesta.exito) {
          localStorage.setItem(this.tokenClave, respuesta.datos.token);
          localStorage.setItem(this.usuarioClave, JSON.stringify(respuesta.datos.usuario));
        }
      }),
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenClave);
    localStorage.removeItem(this.usuarioClave);
    this.router.navigateByUrl('/login');
  }

  public obtenerToken(): string | null {
    return localStorage.getItem(this.tokenClave);
  }

  public obtenerUsuario(): AuthUser | null {
    const raw = localStorage.getItem(this.usuarioClave);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  public estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
}
