# Despliegue Local

## Requisitos

- Node.js compatible con Angular y backend TypeScript.
- npm.
- Docker y Docker Compose.

## Base de datos

```bash
docker compose up -d
```

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed:demo
npm run dev
```

El backend queda en `http://localhost:3180`. Redis ayuda con cache, pero si esta apagado el backend sigue funcionando con fallback.

## Frontend

```bash
cd frontend
npm install
npm start
```

Abrir `http://localhost:4300/login`.

Credenciales demo:

- Usuario visible: `Sistemas`
- Correo API: `sistemas@pajaroazul.com`
- Password: `Sistemas*2026`

## Verificacion

```bash
cd backend
npm run build
npm run test

cd ../frontend
npm run build
```
