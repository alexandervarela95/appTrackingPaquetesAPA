import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthUser } from '../core/modelos/auth-user.model';
import { AuthService } from '../core/servicios/auth.service';

// Sidebar global del sistema. Debe verse igual en todas las pantallas internas.
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  protected panelUsuarioAbierto = false;
  protected usuarioActual: AuthUser | null = null;

  private readonly todosLosItemsMenu = [
    { etiqueta: 'Inicio', icono: 'pi pi-chart-line', ruta: '/dashboard' },
    { etiqueta: 'Paquetes', icono: 'pi pi-box', ruta: '/paquetes' },
    { etiqueta: 'Registrar paquete', icono: 'pi pi-plus-circle', ruta: '/paquetes/nuevo' },
    { etiqueta: 'Seguimiento', icono: 'pi pi-map-marker', ruta: '/tracking' },
    { etiqueta: 'Problemas', icono: 'pi pi-exclamation-triangle', ruta: '/incidencias' },
    { etiqueta: 'Comprobantes', icono: 'pi pi-file', ruta: '/evidencias' },
    { etiqueta: 'Personal', icono: 'pi pi-users', ruta: '/usuarios' },
    { etiqueta: 'Ubicaciones', icono: 'pi pi-building', ruta: '/lugares' },
    { etiqueta: 'Estados del paquete', icono: 'pi pi-tags', ruta: '/estados' },
    { etiqueta: 'Informes', icono: 'pi pi-chart-bar', ruta: '/reportes' },
    { etiqueta: 'Actividad', icono: 'pi pi-shield', ruta: '/auditoria' },
  ];

  protected menuItems = this.todosLosItemsMenu.filter((item) => item.ruta !== '/auditoria');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.usuarioActual = this.authService.obtenerUsuario();
    // Actividad/Auditoria queda solo para roles tecnicos, no para usuarios de operacion.
    this.menuItems = this.todosLosItemsMenu.filter((item) => item.ruta !== '/auditoria' || this.puedeVerAuditoria());
  }

  protected regresarLogin(): void {
    this.panelUsuarioAbierto = false;
    this.usuarioActual = null;
    this.authService.logout();
  }

  protected alternarPanelUsuario(): void {
    this.usuarioActual = this.authService.obtenerUsuario();
    this.panelUsuarioAbierto = !this.panelUsuarioAbierto;
  }

  protected cerrarPanelUsuario(): void {
    this.panelUsuarioAbierto = false;
  }

  protected esItemActivo(item: { ruta: string }): boolean {
    const rutaActual = this.router.url.split('?')[0].split('#')[0];

    if (item.ruta === '/paquetes') {
      // Detalle de paquete cuenta como Paquetes, pero Registrar paquete tiene su propio item.
      return rutaActual === '/paquetes' || (rutaActual.startsWith('/paquetes/') && rutaActual !== '/paquetes/nuevo');
    }

    if (item.ruta === '/tracking') {
      return rutaActual === '/tracking' || rutaActual.startsWith('/tracking/');
    }

    return rutaActual === item.ruta;
  }

  protected nombreUsuario(): string {
    return this.usuarioActual?.nombre?.trim() || 'Usuario';
  }

  protected correoUsuario(): string {
    return this.usuarioActual?.correo?.trim() || '';
  }

  protected inicialesUsuario(): string {
    const nombre = this.nombreUsuario();
    const partes = nombre.split(' ').filter(Boolean);
    const iniciales = partes.length > 1 ? `${partes[0][0]}${partes[1][0]}` : nombre.slice(0, 2);
    return iniciales.toUpperCase();
  }

  private puedeVerAuditoria(): boolean {
    const rol = this.usuarioActual?.rol?.toLowerCase().trim();
    return ['dev', 'desarrollador', 'admin_tecnico', 'administrador_tecnico'].includes(rol || '');
  }
}
