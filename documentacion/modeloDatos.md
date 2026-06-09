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
