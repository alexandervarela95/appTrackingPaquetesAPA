# Manual tecnico

Proyecto: `appTrackingPaquetesAPA`  
Fecha: 14 de junio de 2026

## Requisitos de software

- Node.js compatible con backend TypeScript y Angular 21.
- npm.
- MongoDB 7 o servicio compatible.
- Redis 7 opcional.
- Docker y Docker Compose opcionales para levantar MongoDB y Redis.
- Navegador moderno.

## Requisitos de hardware sugeridos

Para entorno local de desarrollo:

- Procesador de 2 nucleos o superior.
- 4 GB de RAM minimo, 8 GB recomendado.
- 2 GB libres para dependencias, base de datos local y evidencias.

Para un ambiente de pruebas compartido se recomienda separar base de datos, backend y frontend.

## Estructura del proyecto

```text
appTrackingPaquetesAPA/
  backend/
    src/
      config/
      controladores/
      middlewares/
      modelos/
      realtime/
      rutas/
      semillas/
      servicios/
      utilidades/
      validadores/
  frontend/
    src/app/
      core/
      features/
      layout/
  documentacion/
  scripts/
  docker-compose.yml
```

## Arquitectura backend

El backend usa Express con TypeScript. La entrada principal es `backend/src/servidor.ts`, que conecta MongoDB, intenta conectar Redis, crea el servidor HTTP y configura Socket.IO.

`backend/src/app.ts` configura:

- Express.
- CORS.
- Helmet.
- Morgan.
- JSON parser.
- Rutas API.
- Ruta de salud.
- Manejador de 404.
- Manejador central de errores.

Las rutas se montan en `backend/src/rutas/index.rutas.ts` bajo `/api`.

## Arquitectura frontend

El frontend usa Angular standalone. Las rutas se definen en `frontend/src/app/app.routes.ts`. La aplicacion tiene:

- Ruta publica `/login`.
- Layout autenticado para pantallas internas.
- Sidebar global reutilizable.
- Guard de autenticacion.
- Interceptor JWT.
- Servicios HTTP por modulo.

Las pantallas principales estan en `frontend/src/app/features/`.

## Variables de entorno

Archivo base: `backend/.env.example`.

```env
NODE_ENV=development
PUERTO=3180
PORT=3180
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
MONGODB_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGINS=http://localhost:4300
FRONTEND_URL=http://localhost:4300
UPLOAD_DIR=uploads/evidencias
JWT_SECRET=cambiar_esta_clave_en_produccion
JWT_EXPIRES_IN=1d
```

En produccion debe cambiarse `JWT_SECRET` y definirse una politica segura de secretos.

## Instalacion de dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Configuracion de MongoDB

Con Docker Compose:

```bash
docker compose up -d mongodb
```

MongoDB queda expuesto en `27017` y usa la base `appTrackingPaquetesAPA`.

Sin Docker, se debe levantar MongoDB localmente y mantener la URI:

```env
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
```

## Configuracion de Redis

Con Docker Compose:

```bash
docker compose up -d redis
```

Redis queda en `6379`. Si Redis no esta disponible, el backend usa un cliente fallback para no detener el sistema. Esto permite pruebas locales aunque no exista cache.

## Ejecucion del backend

```bash
cd backend
cp .env.example .env
npm run seed:demo
npm run dev
```

Backend local:

```text
http://localhost:3180
```

Healthcheck:

```bash
curl http://localhost:3180/api/salud
```

## Ejecucion del frontend

```bash
cd frontend
npm start
```

Frontend local:

```text
http://localhost:4300/login
```

El proxy de Angular envia `/api` y `/socket.io` a `http://localhost:3180`.

## Ejecucion con Docker

El `docker-compose.yml` del proyecto levanta MongoDB y Redis:

```bash
docker compose up -d
```

El archivo no contiene contenedores para backend y frontend. Esos procesos se ejecutan con npm en local.

## Seed demo

Comando:

```bash
cd backend
npm run seed:demo
```

El seed crea datos iniciales y demo de forma idempotente:

- Estados base del flujo.
- Lugares demo.
- Usuario administrador demo.
- Usuarios y motoristas demo.
- Paquete demo `APA-000001`.
- Tracking demo.
- Incidencia demo.

Credenciales principales:

- Correo: `sistemas@pajaroazul.com`
- Contrasena: `Sistemas*2026`
- Rol: `administrador`

## Scripts disponibles

Backend:

```bash
npm run dev
npm run build
npm start
npm run seed
npm run seed:demo
npm test
```

Frontend:

```bash
npm start
npm run build
npm run watch
npm test
npm run e2e
```

Scripts del proyecto:

- `scripts/backup/mongo-backup.cmd`: respaldo MongoDB.
- `scripts/backup/mongo-restore.cmd`: restauracion MongoDB.
- `scripts/base-datos/generar-diagrama-base-datos.cjs`: diagrama de base de datos.
- `scripts/manual-tecnico/generar-manual-tecnico.cjs`: manual tecnico HTML.
- `scripts/manual-usuario/generar-manual-usuario.cjs`: manual de usuario HTML.
- `scripts/informe-final/generar-informe-final.cjs`: informe final HTML.

## Endpoints principales

Todas las rutas operativas usan prefijo `/api`.

| Modulo | Ruta base | Uso |
| --- | --- | --- |
| Salud | `/api/salud` | Verificar que el backend responde. |
| Auth | `/api/auth/login` | Inicio de sesion. |
| Usuarios | `/api/usuarios` | CRUD de personal. |
| Lugares | `/api/lugares` | CRUD de ubicaciones. |
| Estados | `/api/estados` | CRUD de estados. |
| Paquetes | `/api/paquetes` | CRUD y consulta de paquetes. |
| Paquetes bulk | `/api/paquetes/bulk` | Creacion masiva de paquetes consolidados. |
| Tracking | `/api/tracking` | Movimientos de paquetes. |
| Incidencias | `/api/incidencias` | Problemas reportados. |
| Evidencias | `/api/evidencias` | Comprobantes y archivos. |
| Dashboard | `/api/dashboard/resumen` | Resumen operativo. |
| Auditoria | `/api/auditoria` | Registros de auditoria. |
| Reportes | `/api/reportes` | Informes administrativos. |

## Modelos principales

### Usuario

Campos principales: nombre, correo, codigoEmpleado, contrasena, rol, lugarAsignadoId, estado, fechas de creacion y actualizacion.

### Lugar

Campos principales: nombre, descripcion, ciudad, direccion, estado y fechas.

### Estado

Campos principales: nombre, descripcion, orden, estado y fechas.

### Paquete

Campos principales: numeroGuia, descripcion, tipoPaquete, prioridad, estadoActualId, lugarOrigenId, lugarDestinoId, usuarioRemitenteId, usuarioDestinatarioId, motoristaAsignadoId, observaciones, estado y fechas.

El campo `numeroGuia` se genera solo en backend usando la coleccion `counters`. El formato valido es `APA-000001`: prefijo `APA`, guion y 6 digitos con ceros a la izquierda.

### Tracking

Campos principales: paqueteId, numeroGuia, estadoId, descripcion, lugarActualId, usuarioResponsableId y fechaEvento.

### Incidencia

Campos principales: paqueteId, numeroGuia, tipoIncidencia, descripcion, estadoIncidencia, reportadoPorId, fechaReporte y fechaCierre.

### Evidencia

Campos principales: paqueteId, numeroGuia, tipoEvidencia, descripcion, rutaArchivo, reportadoPorId y fechaReporte.

### AuditLog

Campos principales: usuarioId, rol, accion, entidad, entidadId, descripcion, ip, userAgent, metadata y fecha.

## Colecciones MongoDB

Las colecciones derivan de los modelos Mongoose:

- `usuarios`
- `lugares`
- `estados`
- `paquetes`
- `trackings`
- `incidencias`
- `evidencias`
- `auditlogs`

## Validadores

Los validadores estan en `backend/src/validadores/`. Usan Zod para revisar entradas antes de ejecutar controladores:

- `authValidador.ts`
- `usuarioValidador.ts`
- `lugarValidador.ts`
- `estadoValidador.ts`
- `paqueteValidador.ts`
- `trackingValidador.ts`
- `incidenciaValidador.ts`
- `evidenciaValidador.ts`
- `mongoIdValidador.ts`
- `camposComunes.ts`

## Autenticacion JWT

El login genera un token con datos basicos del usuario. Las rutas protegidas esperan:

```http
Authorization: Bearer <token>
```

El frontend guarda el token y el interceptor lo agrega automaticamente a las peticiones HTTP.

## Roles y permisos

Roles reales:

- `administrador`
- `usuario`
- `motorista`

El middleware `autorizarRoles` limita acciones como crear catalogos, eliminar registros, ver reportes o actualizar estados.

## Manejo de evidencias

La subida usa Multer en `subidaArchivoMiddleware.ts`.

- Carpeta local: `uploads/evidencias`.
- Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.pdf`.
- Tamano maximo: 5 MB.

## Consolidacion de paquetes

Endpoint:

```http
POST /api/paquetes/bulk
```

Permisos:

- `administrador`
- `usuario`

El frontend arma una lista temporal y no guarda nada en MongoDB hasta confirmar. El backend valida los datos comunes, valida que la lista tenga entre 1 y 50 paquetes, genera una guia propia para cada paquete y crea el tracking inicial.

Ejemplo de payload:

```json
{
  "lugarOrigenId": "id",
  "lugarDestinoId": "id",
  "usuarioRemitenteId": "id",
  "usuarioDestinatarioId": "id",
  "prioridad": "media",
  "observacionGeneral": "Entregar en recepcion",
  "paquetes": [
    {
      "tipoPaquete": "Documento",
      "descripcion": "Factura original",
      "observaciones": "Sobre cerrado"
    },
    {
      "tipoPaquete": "Equipo",
      "descripcion": "Mouse inalambrico",
      "observaciones": "Para usuario final"
    }
  ]
}
```

Respuesta esperada:

```json
{
  "exito": true,
  "mensaje": "Paquetes consolidados creados correctamente",
  "datos": {
    "paquetes": [
      { "numeroGuia": "APA-000001" },
      { "numeroGuia": "APA-000002" }
    ],
    "parcial": false
  }
}
```

Si MongoDB soporta transacciones, paquete y tracking se guardan dentro de una transaccion. En MongoDB local sin replica set, el sistema valida todo antes de guardar y responde con una advertencia si usa fallback sin transaccion.

## Hoja imprimible

Ruta frontend:

```text
/paquetes/:id/imprimir
```

La hoja se imprime desde el navegador con `window.print()`. Los estilos `@media print` ocultan botones, sidebar y fondos no imprimibles.

## Backups y restauracion

Existen scripts en `scripts/backup/`:

- `mongo-backup.cmd`
- `mongo-restore.cmd`

Antes de una entrega productiva se recomienda probar la restauracion completa, no solo la generacion del respaldo.

## Testing

Backend:

```bash
cd backend
npm test -- --runInBand
```

Pruebas disponibles:

- Salud.
- Login.
- Validaciones de paquete.
- Acceso de paquete.

Frontend:

```bash
cd frontend
npm run e2e
```

El proyecto tiene Playwright configurado, pero se recomienda ampliar cobertura E2E para flujos completos.

## Build de produccion

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Problemas comunes y solucion

### MongoDB no conecta

Revisar que MongoDB este activo en `27017` y que `MONGO_URI` apunte a la base correcta.

### Redis no conecta

Redis es opcional para desarrollo. El backend muestra advertencia y usa fallback. Para cache y adapter distribuido, levantar Redis en `6379`.

### Login falla

Ejecutar:

```bash
cd backend
npm run seed:demo
```

Luego usar `sistemas@pajaroazul.com` y `Sistemas*2026`.

### Frontend no llama al backend

Revisar `frontend/proxy.conf.json` y confirmar que el backend este en `http://localhost:3180`.

### Archivos no suben

Verificar extension permitida y tamano menor o igual a 5 MB.

## Recomendaciones para produccion

- Usar `JWT_SECRET` fuerte y administrado como secreto.
- Configurar TLS y proxy reverso.
- Usar almacenamiento externo para evidencias.
- Automatizar backups y probar restauraciones.
- Agregar monitoreo y alertas.
- Separar ambientes de desarrollo, pruebas y produccion.
- Ampliar pruebas E2E.
- Revisar permisos por propiedad de recurso para todos los flujos sensibles.
