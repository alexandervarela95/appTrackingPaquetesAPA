import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/servicios/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  protected menuItems = [
    { etiqueta: 'Dashboard', icono: 'pi pi-chart-line', ruta: '/dashboard' },
    { etiqueta: 'Paquetes', icono: 'pi pi-box', ruta: '/paquetes' },
    { etiqueta: 'Tracking', icono: 'pi pi-map-marker', ruta: '/tracking' },
    { etiqueta: 'Incidencias', icono: 'pi pi-exclamation-triangle', ruta: '/incidencias' },
    { etiqueta: 'Evidencias', icono: 'pi pi-file-image', ruta: '/evidencias' },
    { etiqueta: 'Usuarios', icono: 'pi pi-users', ruta: '/usuarios' },
    { etiqueta: 'Lugares', icono: 'pi pi-building', ruta: '/lugares' },
    { etiqueta: 'Estados', icono: 'pi pi-tags', ruta: '/estados' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  protected regresarLogin(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
