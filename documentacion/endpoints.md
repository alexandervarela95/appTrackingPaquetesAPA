# Endpoints API

## Health

- `GET /api/salud`

## Autenticación

- `POST /api/auth/login`

## Usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

## Lugares

- `GET /api/lugares`
- `GET /api/lugares/:id`
- `POST /api/lugares`
- `PUT /api/lugares/:id`
- `DELETE /api/lugares/:id`

## Estados

- `GET /api/estados`
- `GET /api/estados/:id`
- `POST /api/estados`
- `PUT /api/estados/:id`
- `DELETE /api/estados/:id`

## Paquetes

- `GET /api/paquetes`
- `GET /api/paquetes/:id`
- `GET /api/paquetes/guia/:numeroGuia`
- `POST /api/paquetes`
- `POST /api/paquetes/bulk`
- `PUT /api/paquetes/:id`
- `DELETE /api/paquetes/:id`

Formato de `:numeroGuia`: `APA-000001`.

## Tracking

- `GET /api/tracking/paquete/:paqueteId`
- `GET /api/tracking/guia/:numeroGuia`
- `POST /api/tracking`

Formato de `:numeroGuia`: `APA-000001`.

## Incidencias

- `GET /api/incidencias`
- `GET /api/incidencias/:id`
- `POST /api/incidencias`
- `PUT /api/incidencias/:id`
- `DELETE /api/incidencias/:id`

## Evidencias

- `GET /api/evidencias`
- `GET /api/evidencias/:id`
- `POST /api/evidencias`
- `DELETE /api/evidencias/:id`

## Dashboard

- `GET /api/dashboard/resumen`
