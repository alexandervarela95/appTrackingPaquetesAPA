# appTrackingPaquetesAPA

Sistema fullstack para tracking interno de paquetes de Almacen Pajaro Azul. Incluye autenticacion JWT, roles, CRUD operativo, dashboard, tracking por guia, incidencias, evidencias con upload real, Redis con fallback y datos demo idempotentes.

## Tecnologias

- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Redis, JWT, Zod, Multer, Jest.
- Frontend: Angular standalone, TypeScript, RxJS, SCSS, PrimeIcons.
- Infra local: Docker Compose para MongoDB y Redis.

## Estructura

- `backend/`: API REST y seeds.
- `frontend/`: interfaz Angular.
- `documentacion/`: guias de entrega, seguridad, endpoints y demo.
- `docker-compose.yml`: servicios locales de datos.

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

Frontend: `http://localhost:3180/login`

Credenciales demo:

- Usuario visible: `Sistemas`
- Correo API: `sistemas@pajaroazul.local`
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
```

## Documentación de gestión y código

- `documentacion/documentacion-codigo.md`: mapa técnico del backend, frontend, rutas, servicios y flujo funcional.
- `documentacion/estado-validacion-scrum.md`: estado validado, criterios de listo, riesgos y pendientes priorizados.
- `documentacion/despliegue-local.md`: guía para levantar el entorno local.
- `documentacion/endpoints-api.md`: referencia de endpoints locales.

## Flujo demo

1. Login con `Sistemas / Sistemas*2026`.
2. Revisar dashboard.
3. Entrar a paquetes y abrir `APA-DEMO-2026`.
4. Crear paquete nuevo.
5. Buscar por numero de guia.
6. Revisar tracking.
7. Crear incidencia.
8. Subir evidencia PDF/JPG/PNG.
9. Revisar usuarios, lugares y estados.

## Estado actual

Proyecto listo para pruebas locales y demo funcional cuando Docker Desktop, MongoDB y Redis están activos. Tiene una base sólida para futura producción, pero aún requiere infraestructura productiva formal, monitoreo, backups, políticas de permisos por propiedad de recurso, pruebas end-to-end y pipeline CI/CD.
