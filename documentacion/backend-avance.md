# Avance del Backend de App Tracking Paquetes APA

## Resumen profesional

Se ha implementado un backend completo en `backend/` con arquitectura en capas.
Se utilizaron Node.js, Express, TypeScript, MongoDB (Mongoose), Redis, dotenv, cors, helmet y morgan.

## Componentes creados

- `src/app.ts`: configuracion de la aplicacion Express.
- `src/servidor.ts`: arranque del servidor y conexion a MongoDB/Redis.
- `src/config`: configuracion de entorno y conexiones.
- `src/modelos`: modelos Mongoose para usuario, lugar, estado, paquete, tracking, incidencia y evidencia.
- `src/controladores`: controladores REST con respuestas JSON uniformes.
- `src/servicios`: logica de negocios y validaciones.
- `src/rutas`: rutas de API y endpoint `/api/salud`.
- `src/utilidades`: respuestas API, generacion de numero de guia y validacion de referencias.
- `src/semillas/estadosSemilla.ts`: carga de estados iniciales.
- `src/semillas/usuarioDefault.ts`: seed idempotente para usuario administrador de pruebas.

## Reglas de negocio implementadas

- Generacion automatica de `numeroGuia` unico cuando no se provee.
- Creacion de tracking inicial al crear un paquete.
- Creacion de nuevo registro de tracking al cambiar `estadoActualId` de un paquete.
- Uso de `estado: false` para desactivar registros criticos en lugar de eliminarlos.
- Validacion de `lugarOrigenId`, `lugarDestinoId` y usuarios relacionados.
- Cache Redis en dashboard y busqueda por `numeroGuia`.
- Usuario default `Sistemas` con rol `administrador`, correo tecnico `sistemas@pajaroazul.local` y password hasheada con bcrypt.

## Seed de usuario default

Ejecutar desde `backend/`:

```bash
npm run seed
```

Credenciales para presentacion:

- Usuario: `Sistemas`
- Password: `Sistemas*2026`

El frontend permite escribir `Sistemas` y traduce esa credencial al correo tecnico
que espera el endpoint real `POST /api/auth/login`.

## Estado actual

- Backend compilable y preparado para ejecutarse localmente.
- Documentacion base incluida en `backend/README.md`.
- Commit local realizado en la rama `feature/backend-api-app-tracking-envio`.
