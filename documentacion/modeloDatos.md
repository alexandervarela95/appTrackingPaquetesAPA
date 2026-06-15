# Modelo de Datos

## Usuario

- `nombre`
- `correo`
- `codigoEmpleado`
- `contrasena`
- `rol`
- `lugarAsignadoId`
- `estado`
- `fechaCreacion`
- `fechaActualizacion`

## Lugar

- `nombre`
- `descripcion`
- `estado`
- `ciudad`
- `direccion`
- `fechaCreacion`
- `fechaActualizacion`

## Estado

- `nombre`
- `descripcion`
- `orden`
- `estado`
- `fechaCreacion`
- `fechaActualizacion`

## Paquete

- `numeroGuia`
- `descripcion`
- `tipoPaquete`
- `prioridad`
- `estadoActualId`
- `lugarOrigenId`
- `lugarDestinoId`
- `usuarioRemitenteId`
- `usuarioDestinatarioId`
- `motoristaAsignadoId`
- `observaciones`
- `estado`
- `fechaCreacion`
- `fechaActualizacion`

Formato de `numeroGuia`: `APA-000001`. La guia se genera en backend con un contador atomico y no debe escribirse manualmente desde el frontend.

## Counter

- `_id`
- `seq`

Se usa para mantener la secuencia de guias de paquetes. El documento principal es `_id: paquetes`.

## Tracking

- `paqueteId`
- `numeroGuia`
- `estadoId`
- `descripcion`
- `lugarActualId`
- `usuarioResponsableId`
- `fechaEvento`
- `fechaCreacion`

## Incidencia

- `paqueteId`
- `numeroGuia`
- `tipoIncidencia`
- `descripcion`
- `estadoIncidencia`
- `reportadoPorId`
- `fechaReporte`
- `fechaCierre`

## Evidencia

- `paqueteId`
- `numeroGuia`
- `tipoEvidencia`
- `descripcion`
- `rutaArchivo`
- `reportadoPorId`
- `fechaReporte`
