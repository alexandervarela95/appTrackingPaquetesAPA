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
PUERTO=3090 CORS_ORIGINS=http://localhost:4300 npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm start
```

Abrir `http://localhost:4300/login`.

## Verificacion

```bash
cd backend
npm run build
npm run test

cd ../frontend
npm run build
```
