# Reportes

## Objetivo

Cumplir salidas de informacion consultando MongoDB, sin mocks criticos.

## Endpoints

```text
GET /api/reportes/paquetes-por-estado
GET /api/reportes/incidencias
GET /api/reportes/actividad
```

## Salidas defendibles

1. Dashboard general con metricas.
2. Listado de paquetes.
3. Consulta por numero de guia.
4. Timeline de tracking.
5. Reporte de incidencias.
6. Reporte de paquetes por estado.
7. Reporte de actividad reciente.

## Filtros soportados

- `fechaInicio`
- `fechaFin`
- `estadoId`
- `lugarOrigenId`
- `lugarDestinoId`
- `motoristaId`
- `prioridad`
- `estadoIncidencia`

## Frontend

Pantalla:

```text
/reportes
```

Muestra metricas agregadas y tabla de paquetes por estado.

