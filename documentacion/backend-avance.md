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

## Reglas de negocio implementadas

- Generacion automatica de `numeroGuia` unico cuando no se provee.
- Creacion de tracking inicial al crear un paquete.
- Creacion de nuevo registro de tracking al cambiar `estadoActualId` de un paquete.
- Uso de `estado: false` para desactivar registros criticos en lugar de eliminarlos.
- Validacion de `lugarOrigenId`, `lugarDestinoId` y usuarios relacionados.
- Cache Redis en dashboard y busqueda por `numeroGuia`.

## Estado actual

- Backend compilable y preparado para ejecutarse localmente.
- Documentacion base incluida en `backend/README.md`.
- Commit local realizado en la rama `feature/backend-api-app-tracking-envio`.
