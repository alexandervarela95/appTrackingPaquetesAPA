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

Frontend: `http://localhost:4300/login`

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

Proyecto listo para entrega academica avanzada y demo funcional. Tiene base solida para futura produccion, pero aun requiere infraestructura productiva formal, monitoreo, backups, politicas de permisos por propiedad de recurso y pipeline CI/CD.
