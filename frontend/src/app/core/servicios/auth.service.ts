import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../modelos/auth-user.model';
import { RealtimeService } from './realtime.service';

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
  private readonly correoUsuarioSistemas = 'sistemas@pajaroazul.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private realtimeService: RealtimeService,
  ) {}

  public login(usuarioOCorreo: string, contrasena: string) {
    const correo = this.normalizarCredencialLogin(usuarioOCorreo);

    return this.http.post<LoginRespuesta>('/api/auth/login', { correo, contrasena }).pipe(
      tap((respuesta) => {
        if (respuesta.exito) {
          localStorage.setItem(this.tokenClave, respuesta.datos.token);
          localStorage.setItem(this.usuarioClave, JSON.stringify(respuesta.datos.usuario));
          this.realtimeService.conectar();
        }
      }),
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenClave);
    localStorage.removeItem(this.usuarioClave);
    sessionStorage.removeItem(this.tokenClave);
    sessionStorage.removeItem(this.usuarioClave);
    this.realtimeService.desconectar();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  public obtenerToken(): string | null {
    return localStorage.getItem(this.tokenClave);
  }

  public obtenerUsuario(): AuthUser | null {
    const raw = localStorage.getItem(this.usuarioClave);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.usuarioClave);
      sessionStorage.removeItem(this.usuarioClave);
      return null;
    }
  }

  public estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  private normalizarCredencialLogin(usuarioOCorreo: string): string {
    const credencial = usuarioOCorreo.trim();
    return credencial.toLowerCase() === 'sistemas' ? this.correoUsuarioSistemas : credencial;
  }
}
