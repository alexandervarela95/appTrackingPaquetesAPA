# appTrackingPaquetesAPA

Sistema de trazabilidad de envíos internos para Almacén Pájaro Azul.

## Estructura del proyecto

- `backend/` - API en Node.js + Express + TypeScript
- `frontend/` - Aplicación Angular
- `documentacion/` - Documentación técnica del proyecto
- `docker-compose.yml` - Contenedores para MongoDB y Redis
- `.gitignore` - reglas de exclusión de Git
- `CHANGELOG.md` - historial de versiones

## Ejecución local

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Flujo demo Avance II

Preparar datos demo:

```bash
cd backend
npm run seed
```

Credenciales:

- Usuario: `Sistemas`
- Password: `Sistemas*2026`

Pantallas principales:

- `/login`
- `/dashboard`
- `/paquetes`
- `/paquetes/nuevo`
- `/paquetes/:id`
- `/tracking/:numeroGuia`
- `/incidencias`

Ver detalle en `documentacion/presentacion-avance-ii.md`.

### Docker para MongoDB y Redis
```bash
docker compose up -d
```

### Puertos

- Backend: `3090`
- Frontend: `4300`
- MongoDB: `27017`
- Redis: `6379`
