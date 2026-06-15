# Documentación Técnica

## Descripción del sistema

Sistema web de trazabilidad de envíos internos para Almacén Pájaro Azul. Permite registrar paquetes, gestionar estados, guardar incidencias y evidencias, y consultar el historial de seguimiento.

## Objetivo general

Proveer una solución profesional y escalable que soporte el seguimiento de paquetes y envíos internos, con una arquitectura separada de backend y frontend, y servicios de caché para mejorar el rendimiento.

## Tecnologías usadas

- Backend: Node.js, Express, TypeScript
- Base de datos: MongoDB, Mongoose
- Caché: Redis
- Frontend: Angular
- Seguridad: helmet, cors, JWT
- Documentación: Markdown

## Arquitectura del proyecto

El sistema usa una arquitectura de capas:

- `backend/src/config` - configuración y conexiones externas.
- `backend/src/modelos` - esquemas de datos Mongoose.
- `backend/src/servicios` - lógica de negocio.
- `backend/src/controladores` - controladores HTTP.
- `backend/src/rutas` - rutas REST.
- `backend/src/middlewares` - validación y manejo de errores.

## Estructura de carpetas

- `backend/` - API de servidor
- `frontend/` - aplicación Angular
- `documentacion/` - documentación técnica
- `docker-compose.yml` - contenedores MongoDB y Redis
- `.gitignore` - exclusiones de Git
- `CHANGELOG.md` - historial de versiones

## Modelo de datos

Ver `modeloDatos.md` para el detalle de colecciones y relaciones.

## Colecciones MongoDB

- `usuarios`
- `lugares`
- `estados`
- `paquetes`
- `trackings`
- `incidencias`
- `evidencias`

## Endpoints

Ver `endpoints.md` para la lista completa de rutas disponibles.

## Reglas de negocio

1. Al crear un paquete, el backend genera un `numeroGuia` secuencial con formato `APA-000001`.
2. Al crear un paquete, se crea un registro inicial en `tracking` con estado `Creado`.
3. Al actualizar el estado del paquete, se crea un registro adicional en `tracking`.
4. Las eliminaciones críticas se realizan por estado inactivo en lugar de borrado físico.
5. Se valida la existencia de referencias (`lugarOrigenId`, `lugarDestinoId`, `usuarioRemitenteId`, `usuarioDestinatarioId`, `motoristaAsignadoId`).
6. Redis se usa para cachear el resumen del dashboard y optimizar consultas recurrentes.

## Flujo de tracking

1. El usuario crea un paquete.
2. El sistema registra el paquete y crea un `tracking` inicial.
3. Cada cambio de estado del paquete genera un nuevo registro `tracking`.
4. Se puede consultar el historial por `paqueteId` o `numeroGuia`.

## Uso de Redis

Redis se utiliza como caché para el resumen del dashboard. El resultado se guarda temporalmente y se actualiza cada vez que expira.

## Variables de entorno

- `PORT`
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`

## Comandos de instalación

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Comandos de ejecución

```bash
cd backend
npm run dev

cd frontend
npm start
```

## Flujo Git profesional

1. Clonar el repositorio.
2. Crear ramas separadas para backend y frontend.
3. Usar `git add`, `git commit` y `git push` con convenciones `feat`, `docs`, `chore`.
4. No mezclar backend y frontend en la misma rama.

## Convenciones de commits

- `feat(backend): ...`
- `feat(frontend): ...`
- `docs(project): ...`
- `chore(git): ...`

## Pendientes técnicos

- Implementar frontend visual completo basado en `appTallerAPA`.
- Agregar validación más estricta de DTOs y esquemas.
- Añadir pruebas automáticas unitarias e integrales.
