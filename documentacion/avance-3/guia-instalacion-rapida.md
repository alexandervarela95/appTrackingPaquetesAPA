# Guia de instalacion rapida

Proyecto: `appTrackingPaquetesAPA`  
Fecha: 14 de junio de 2026

## 1. Levantar base de datos y Redis

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Esto levanta:

- MongoDB en `27017`.
- Redis en `6379`.

Si no se puede usar Docker, levantar MongoDB y Redis manualmente con esos puertos.

## 2. Configurar backend

```bash
cd backend
npm install
cp .env.example .env
```

Variables principales:

```env
PUERTO=3180
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGINS=http://localhost:4300
JWT_SECRET=cambiar_esta_clave_en_produccion
```

## 3. Cargar datos demo

```bash
npm run seed:demo
```

Credenciales demo:

- Correo: `sistemas@pajaroazul.com`
- Contrasena: `Sistemas*2026`

## 4. Levantar backend

```bash
npm run dev
```

URL backend:

```text
http://localhost:3180
```

Healthcheck:

```bash
curl http://localhost:3180/api/salud
```

Respuesta esperada:

```json
{
  "exito": true,
  "mensaje": "Servicio de salud operando correctamente"
}
```

## 5. Configurar y levantar frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

URL frontend:

```text
http://localhost:4300/login
```

El frontend usa `frontend/proxy.conf.json` para enviar `/api` y `/socket.io` al backend en `3180`.

## 6. Validar login

Abrir:

```text
http://localhost:4300/login
```

Ingresar:

- Correo: `sistemas@pajaroazul.com`
- Contrasena: `Sistemas*2026`

Debe abrir el dashboard.

## 7. Comandos de build y pruebas

Backend:

```bash
cd backend
npm run build
npm test -- --runInBand
```

Frontend:

```bash
cd frontend
npm run build
```

## 8. Puertos usados

| Servicio | Puerto | URL |
| --- | --- | --- |
| Backend | `3180` | `http://localhost:3180` |
| Frontend | `4300` | `http://localhost:4300/login` |
| MongoDB | `27017` | `mongodb://127.0.0.1:27017/appTrackingPaquetesAPA` |
| Redis | `6379` | `redis://127.0.0.1:6379` |

## 9. Problemas rapidos

- Si falla el login, ejecutar `npm run seed:demo`.
- Si el backend no inicia, revisar MongoDB.
- Si Redis falla, el backend puede seguir con fallback.
- Si el frontend no carga datos, revisar que backend este en `3180`.
- Si Docker no responde, revisar permisos del usuario sobre el socket Docker.
