import { Routes } from '@angular/router';
import { LoginComponent } from './features/autenticacion/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PaquetesComponent } from './features/paquetes/paquetes.component';
import { PaqueteDetalleComponent } from './features/paquetes/paquete-detalle.component';
import { TrackingComponent } from './features/tracking/tracking.component';
import { IncidenciasComponent } from './features/incidencias/incidencias.component';
import { EvidenciasComponent } from './features/evidencias/evidencias.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { LugaresComponent } from './features/lugares/lugares.component';
import { EstadosComponent } from './features/estados/estados.component';
import { authGuard } from './core/guards/auth.guard';

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
      { path: 'paquetes/:id', component: PaqueteDetalleComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'incidencias', component: IncidenciasComponent },
      { path: 'evidencias', component: EvidenciasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'lugares', component: LugaresComponent },
      { path: 'estados', component: EstadosComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
