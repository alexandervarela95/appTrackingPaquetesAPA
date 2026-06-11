# Tiempo Real

## Objetivo

El sistema usa Socket.IO para notificar cambios operativos sin recargar la pagina. REST sigue siendo la fuente principal de escritura y consulta; tiempo real actua como canal de actualizacion.

## Backend

Archivos principales:

- `backend/src/realtime/server.ts`
- `backend/src/realtime/events.ts`
- `backend/src/realtime/publisher.ts`

El servidor Socket.IO se monta sobre el mismo servidor HTTP de Express. Las conexiones se autentican con JWT usando el token del usuario actual.

## Rooms disponibles

- `usuario:{usuarioId}`
- `rol:{rol}`
- `paquete:{paqueteId}`
- `guia:{numeroGuia}`

## Eventos emitidos

- `dashboard:updated`
- `package:created`
- `package:updated`
- `package:status-changed`
- `tracking:created`
- `incident:created`
- `incident:updated`
- `evidence:uploaded`
- `catalog:updated`
- `audit:created`

## Frontend

Archivo principal:

- `frontend/src/app/core/servicios/realtime.service.ts`

El servicio lee el JWT local, abre la conexion Socket.IO, maneja reconexion/desconexion y expone streams RxJS por evento.

## Pantallas conectadas

- Dashboard: recarga metricas con `dashboard:updated` e incidencias nuevas.
- Paquetes: recarga listado ante creacion, actualizacion o cambio de estado.
- Tracking: recarga historial cuando llega `tracking:created` para la guia activa.
- Reportes: refresca salidas cuando cambia el dashboard.
- Auditoria: actualiza registros cuando se genera un evento de auditoria.

## Validacion manual

1. Abrir dos sesiones del frontend.
2. Iniciar sesion con usuario administrador.
3. Crear o actualizar un paquete en una sesion.
4. Verificar que la otra sesion actualiza el listado sin refrescar manualmente.
5. Registrar tracking y validar que el timeline de la guia activa se refresca.

