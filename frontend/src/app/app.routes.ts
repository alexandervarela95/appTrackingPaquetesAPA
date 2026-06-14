import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { LoginComponent } from './features/autenticacion/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PaquetesComponent } from './features/paquetes/paquetes.component';
import { PaqueteNuevoComponent } from './features/paquetes/paquete-nuevo.component';
import { PaqueteDetalleComponent } from './features/paquetes/paquete-detalle.component';
import { PaqueteImprimirComponent } from './features/paquetes/paquete-imprimir.component';
import { TrackingComponent } from './features/tracking/tracking.component';
import { IncidenciasComponent } from './features/incidencias/incidencias.component';
import { EvidenciasComponent } from './features/evidencias/evidencias.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { LugaresComponent } from './features/lugares/lugares.component';
import { EstadosComponent } from './features/estados/estados.component';
import { AuditoriaComponent } from './features/auditoria/auditoria.component';
import { ReportesComponent } from './features/reportes/reportes.component';
import { authGuard } from './core/guards/auth.guard';

// Auditoria queda oculta para usuarios normales. Si alguien entra por URL, vuelve al dashboard.
const auditoriaGuard = () => {
  const usuario = JSON.parse(localStorage.getItem('apa-usuario') || 'null') as { rol?: string } | null;
  const rol = usuario?.rol?.toLowerCase().trim();
  const autorizado = ['dev', 'desarrollador', 'admin_tecnico', 'administrador_tecnico'].includes(rol || '');

  return autorizado || inject(Router).createUrlTree(['/dashboard']);
};

// Todas las pantallas internas viven dentro del mismo layout para compartir sidebar y fondo.
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'paquetes', component: PaquetesComponent },
      { path: 'paquetes/nuevo', component: PaqueteNuevoComponent },
      { path: 'paquetes/:id/imprimir', component: PaqueteImprimirComponent },
      { path: 'paquetes/:id', component: PaqueteDetalleComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'tracking/:numeroGuia', component: TrackingComponent },
      { path: 'incidencias', component: IncidenciasComponent },
      { path: 'evidencias', component: EvidenciasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'lugares', component: LugaresComponent },
      { path: 'estados', component: EstadosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'auditoria', component: AuditoriaComponent, canActivate: [auditoriaGuard] },
      { path: 'actividad', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
