# appTrackingPaquetesAPA

Sistema fullstack para tracking interno de paquetes de Almacen Pajaro Azul. Incluye autenticacion JWT, roles, control por propiedad de recurso, CRUD operativo, dashboard, tracking por guia, incidencias, evidencias con upload real, auditoria, reportes, Socket.IO para tiempo real, Redis con fallback y datos demo idempotentes.

## Tecnologias

- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Redis, JWT, Zod, Multer, Socket.IO y Jest.
- Frontend: Angular standalone, TypeScript, RxJS, SCSS, PrimeIcons, Socket.IO Client y Playwright.
- Infra local: Docker Compose para MongoDB y Redis.
- CI/CD: GitHub Actions.

## Estructura

- `backend/`: API REST, Socket.IO, modelos, servicios, middlewares, seeds y pruebas.
- `frontend/`: interfaz Angular, guards, interceptores, servicios, pantallas y E2E.
- `documentacion/`: guias tecnicas, usuario, validacion, roles, reportes y defensa.
- `scripts/backup/`: scripts de backup y restauracion MongoDB.
- `.github/workflows/ci.yml`: validacion automatica en GitHub.

## Inicio rapido

```bash
docker compose up -d

cd backend
npm install
cp .env.example .env
npm run seed:demo
npm run dev

cd ../frontend
npm install
npm start
```

Backend: `http://localhost:3180`
Frontend: `http://localhost:4300/login`

Credenciales demo:

- Usuario visible: `Sistemas`
- Correo API: `sistemas@pajaroazul.com`
- Password: `Sistemas*2026`
- Rol: `administrador`

## Comandos clave

Backend:

```bash
npm run build
npm run seed
npm run seed:demo
npm run test
npm run dev
```

Frontend:

```bash
npm run build
npm start
npm run e2e
```

CI/CD:

```bash
git push origin main
```

El workflow `.github/workflows/ci.yml` ejecuta instalacion, build backend, pruebas backend y build frontend.

## Documentacion de gestion y codigo

- `documentacion/documentacion-codigo.md`: mapa tecnico del backend, frontend, rutas, servicios y flujo funcional.
- `documentacion/estado-validacion-scrum.md`: estado validado, criterios de listo, riesgos y pendientes priorizados.
- `documentacion/despliegue-local.md`: guia para levantar el entorno local.
- `documentacion/endpoints-api.md`: referencia de endpoints locales.
- `documentacion/tiempo-real.md`: eventos Socket.IO, rooms y validacion manual.
- `documentacion/roles-permisos.md`: reglas por rol y propiedad de recurso.
- `documentacion/auditoria.md`: trazabilidad de acciones criticas.
- `documentacion/reportes.md`: salidas de informacion y endpoints.
- `documentacion/backups-restauracion.md`: respaldo y restauracion de MongoDB.
- `documentacion/ci-cd.md`: pipeline de GitHub Actions.
- `documentacion/e2e.md`: pruebas end-to-end base.

## Flujo demo

1. Login con `Sistemas / Sistemas*2026`.
2. Revisar dashboard.
3. Entrar a paquetes y abrir `APA-000001`.
4. Crear paquete nuevo.
5. Consolidar varios paquetes desde `/paquetes/consolidar`.
6. Buscar por numero de guia.
7. Revisar tracking.
8. Crear incidencia.
9. Subir evidencia PDF/JPG/PNG.
10. Revisar usuarios, lugares y estados.
11. Revisar reportes.
12. Auditoria queda oculta para roles normales y solo se habilita para roles tecnicos.

La consolidacion permite armar una lista temporal de paquetes en frontend y guardarlos todos al final. Cada paquete se crea como registro individual y recibe su propia guia secuencial `APA-000001`.

## Estado actual

Proyecto listo para pruebas locales y demo funcional cuando MongoDB esta activo. Redis ayuda con cache y tiempo real, pero si esta apagado el backend usa fallback y no se cae. Tiene base defendible para entrega academica: backend y frontend integrados, datos reales desde MongoDB, tiempo real con Socket.IO, reportes, control por propiedad de recurso, CI/CD basico y documentacion final.

Para produccion estricta todavia requiere dominio, TLS, proxy reverso, monitoreo centralizado, almacenamiento externo de evidencias, adapter Redis de Socket.IO para despliegue horizontal y mayor cobertura E2E.
