# Presentacion Avance II - Flujo Demo

## Credenciales demo

- Usuario: `Sistemas`
- Password: `Sistemas*2026`

El frontend acepta `Sistemas` y lo envia al backend como `sistemas@pajaroazul.local`.

## Comandos

Backend:

```bash
cd /home/admin/Documentos/Proyectos/appTrackingPaquetesAPA/backend
npm install
npm run seed
PUERTO=3090 CORS_ORIGINS=http://localhost:4300 npm run dev
```

Frontend:

```bash
cd /home/admin/Documentos/Proyectos/appTrackingPaquetesAPA/frontend
npm install
npm start
```

URL demo:

```bash
http://localhost:4300/login
```

## Flujo demo paso a paso

1. Abrir `/login`.
2. Iniciar sesion con `Sistemas / Sistemas*2026`.
3. Ver dashboard con resumen desde `/api/dashboard/resumen`.
4. Entrar a `/paquetes`.
5. Crear paquete desde `/paquetes/nuevo`.
6. Confirmar que el paquete aparece en el listado.
7. Buscar por `numeroGuia` usando `/api/paquetes/guia/:numeroGuia`.
8. Abrir detalle del paquete desde `/paquetes/:id`.
9. Ver historial desde `/tracking/:numeroGuia`.
10. Crear incidencia desde `/incidencias`.

## Endpoints usados

- `POST /api/auth/login`
- `GET /api/dashboard/resumen`
- `GET /api/paquetes`
- `POST /api/paquetes`
- `GET /api/paquetes/:id`
- `GET /api/paquetes/guia/:numeroGuia`
- `GET /api/tracking/guia/:numeroGuia`
- `GET /api/lugares`
- `GET /api/usuarios`
- `GET /api/estados`
- `GET /api/incidencias`
- `POST /api/incidencias`

## Pantallas listas

- Login visual alineado a appTallerAPA.
- Dashboard con tarjetas resumen y manejo de ceros.
- Listado de paquetes.
- Creacion de paquete.
- Busqueda por guia.
- Detalle de paquete.
- Tracking por guia.
- Incidencias con listado y creacion.
- Menu lateral con rutas funcionales.

## Datos demo

`npm run seed` crea de forma idempotente:

- Estados base del tracking.
- Usuario administrador `Sistemas`.
- Lugares `SPS Sistemas`, `Bodega Central`, `La Ceiba`.
- Usuarios `Remitente Demo`, `Destinatario Demo`, `Motorista Demo`.

## Pendientes tecnicos reales

- Agregar pruebas automatizadas.
- Mejorar validaciones DTO en backend.
- Aplicar autorizacion por rol a todos los endpoints sensibles.
- Implementar carga real de archivos para evidencias.
- Revisar presupuesto de bundle frontend por PrimeNG/Aura.
