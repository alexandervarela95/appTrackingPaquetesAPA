// Interceptor de auth: ajusta peticiones HTTP salientes, como autenticacion y cabeceras.
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

// Agrega el JWT a cada llamada HTTP para que el backend pueda validar usuario y rol.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  const request = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Si el token vence o no sirve, limpiamos sesion para no dejar la app en estado raro.
        authService.logout();
      }
      return throwError(() => error);
    }),
  );
};
