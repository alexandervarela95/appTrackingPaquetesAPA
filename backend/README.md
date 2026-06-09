# Backend appTrackingPaquetesAPA

API REST para trazabilidad de paquetes internos.

## Stack

- Express + TypeScript
- MongoDB + Mongoose
- Redis con cliente fallback
- JWT + roles
- Zod para validacion
- Multer para evidencias
- Jest + Supertest

## Variables

Copiar `.env.example` a `.env`:

```bash
NODE_ENV=development
PUERTO=3090
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGINS=http://localhost:4300
JWT_SECRET=cambiar_esta_clave_en_produccion
JWT_EXPIRES_IN=1d
```

## Comandos

```bash
npm install
npm run build
npm run dev
npm run start
npm run seed:demo
npm run test
```

## Seguridad

- `/api/salud` y `/api/auth/login` son publicos.
- Rutas operativas requieren JWT.
- Administrador gestiona catalogos y usuarios.
- Motorista puede actualizar tracking/paquetes segun rutas permitidas.
- Usuario puede crear paquetes, incidencias y evidencias.
- Login tiene rate limit por IP.
- Payload JSON limitado a 2 MB.
- Upload de evidencias limitado a 5 MB y extensiones `jpg`, `jpeg`, `png`, `pdf`.

## Uploads

Los archivos se guardan en `backend/uploads/evidencias/`. Git solo versiona `.gitkeep`; los archivos reales quedan ignorados.
