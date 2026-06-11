# Auditoria

## Objetivo

Registrar acciones criticas del sistema para trazabilidad administrativa y defensa academica.

## Modelo

Archivo:

```text
backend/src/modelos/auditLog.model.ts
```

Campos principales:

- `usuarioId`
- `rol`
- `accion`
- `entidad`
- `entidadId`
- `descripcion`
- `ip`
- `userAgent`
- `metadata`
- `fecha`

## Acciones registradas

- Login exitoso.
- Login fallido.
- Creacion, actualizacion y desactivacion de usuarios.
- Creacion, actualizacion y desactivacion de lugares.
- Creacion, actualizacion y desactivacion de estados.
- Creacion, actualizacion y desactivacion de paquetes.
- Creacion de tracking.
- Creacion y actualizacion de incidencias.
- Registro y subida de evidencias.

## Endpoint

```text
GET /api/auditoria
```

Acceso exclusivo para `administrador`.

## Frontend

Pantalla:

```text
/auditoria
```

Muestra fecha, accion, entidad, rol y descripcion sin exponer metadata sensible.

