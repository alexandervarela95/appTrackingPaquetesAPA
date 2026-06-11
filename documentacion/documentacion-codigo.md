# Documentación del Código

## Propósito del sistema

`appTrackingPaquetesAPA` administra la trazabilidad interna de paquetes de Almacén Pájaro Azul. El sistema permite registrar paquetes, consultar su avance por número de guía, mantener catálogos operativos, reportar incidencias y adjuntar evidencias.

## Arquitectura general

El proyecto está dividido en tres bloques:

- `backend/`: API REST en Express y TypeScript.
- `frontend/`: aplicación Angular standalone.
- `docker-compose.yml`: servicios locales de MongoDB y Redis.

Puertos locales definidos:

- Backend: `4300`.
- Frontend: `3180`.
- MongoDB: `27017`.
- Redis: `6379`.

## Backend

### Entrada de la aplicación

- `src/servidor.ts`: inicia el servidor, conecta MongoDB y Redis, y publica la API.
- `src/app.ts`: configura Express, CORS, seguridad, logging, rutas y manejadores de error.
- `src/config/configuracionEntorno.ts`: centraliza variables de entorno como puerto, MongoDB, Redis, CORS y JWT.

### Configuración de datos

- `src/config/conexionMongo.ts`: establece la conexión principal a MongoDB mediante Mongoose.
- `src/config/conexionRedis.ts`: conecta Redis y mantiene tolerancia a fallo para que la API no quede bloqueada si Redis no está disponible.

### Rutas principales

Todas las rutas operativas se agrupan en `src/rutas/index.rutas.ts`:

- `/api/auth`: autenticación.
- `/api/usuarios`: administración de usuarios.
- `/api/lugares`: catálogo de lugares.
- `/api/estados`: catálogo de estados.
- `/api/paquetes`: gestión y consulta de paquetes.
- `/api/tracking`: historial de movimientos.
- `/api/incidencias`: registro de incidencias.
- `/api/evidencias`: carga, consulta y descarga de evidencias.
- `/api/dashboard`: métricas del tablero.

### Capas de backend

- `controladores/`: reciben la petición HTTP, validan flujo básico y devuelven respuestas.
- `servicios/`: concentran reglas de negocio y operaciones de persistencia.
- `modelos/`: definen esquemas Mongoose.
- `validadores/`: definen reglas Zod para entradas de usuario.
- `middlewares/`: autenticación, autorización, validación, errores, rate limit y subida de archivos.
- `utilidades/`: funciones compartidas como generación de códigos y formato de respuesta.
- `semillas/`: carga de datos demo y usuario inicial.

### Seguridad implementada

- JWT para sesiones.
- Roles para autorización.
- Rate limit en login.
- Helmet para cabeceras HTTP.
- Validación con Zod.
- Límite de carga para evidencias.
- Restricción de extensiones permitidas: `jpg`, `jpeg`, `png`, `pdf`.

## Frontend

### Entrada y configuración

- `src/main.ts`: carga `zone.js` y arranca Angular.
- `src/app/app.config.ts`: configura router, HTTP client, interceptor JWT, PrimeNG, animaciones y cambio de detección.
- `src/app/app.routes.ts`: declara rutas públicas y protegidas.

### Rutas visibles

- `/login`: inicio de sesión.
- `/dashboard`: resumen operativo.
- `/paquetes`: listado y búsqueda de paquetes.
- `/paquetes/nuevo`: creación de paquetes.
- `/paquetes/:id`: detalle y cambio de estado.
- `/tracking`: consulta de tracking.
- `/tracking/:numeroGuia`: tracking directo por guía.
- `/incidencias`: gestión de incidencias.
- `/evidencias`: carga y consulta de evidencias.
- `/usuarios`: administración de usuarios.
- `/lugares`: administración de lugares.
- `/estados`: administración de estados.

### Servicios frontend

Los servicios ubicados en `src/app/core/servicios/` encapsulan la comunicación HTTP con el backend. La mayoría hereda de `ApiCrudServicio`, que estandariza operaciones de listar, obtener, crear, actualizar y eliminar.

Servicios clave:

- `auth.service.ts`: login, persistencia de token y usuario, cierre de sesión.
- `api-crud.servicio.ts`: base CRUD reutilizable.
- `paquete.servicio.ts`: operaciones específicas de paquetes y búsqueda por guía.
- `tracking.servicio.ts`: historial por paquete y por guía.
- `dashboard.servicio.ts`: métricas del tablero.
- `evidencia.servicio.ts`: carga y descarga de archivos.

### Cambio de detección

El frontend usa `zone.js` para que Angular repinte automáticamente la interfaz después de respuestas HTTP, timers y otras tareas asíncronas. Esto evita que la información aparezca solo después de hacer clic o interactuar con la pantalla.

Archivos relacionados:

- `src/main.ts`
- `src/app/app.config.ts`
- `package.json`

## Flujo funcional principal

1. El usuario ingresa credenciales en `/login`.
2. El backend valida correo y contraseña.
3. La API devuelve JWT y datos del usuario.
4. El frontend guarda la sesión localmente.
5. El `authGuard` protege rutas internas.
6. El interceptor HTTP agrega el token a llamadas protegidas.
7. Las pantallas consultan datos mediante servicios Angular.
8. El backend consulta MongoDB y utiliza Redis donde aplica.
9. La interfaz se actualiza automáticamente al recibir respuestas.

## Variables de entorno

Archivo base: `backend/.env.example`.

Valores locales esperados:

```env
NODE_ENV=development
PUERTO=4300
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGINS=http://localhost:3180
JWT_SECRET=cambiar_esta_clave_en_produccion
JWT_EXPIRES_IN=1d
```

Si MongoDB local requiere autenticación, `MONGO_URI` debe incluir usuario, contraseña y `authSource`.

## Validación recomendada antes de entregar

```bash
cd backend
npm.cmd run build
npm.cmd test -- --runInBand

cd ../frontend
npm.cmd run build
```

Luego validar manualmente:

- `http://localhost:4300/api/salud`
- `http://localhost:3180/login`
- Login con `sistemas@pajaroazul.local` y `Sistemas*2026`.

