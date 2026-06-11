# Roles y Permisos

## Roles

- `administrador`
- `motorista`
- `usuario`

## Administrador

Puede gestionar usuarios, lugares, estados, paquetes, tracking, incidencias, evidencias, reportes y auditoria.

## Motorista

Puede ver paquetes asignados, registrar tracking en paquetes asignados y reportar incidencias relacionadas.

No puede administrar usuarios, lugares, estados ni modificar paquetes no asignados.

## Usuario

Puede crear paquetes, ver paquetes donde participa como remitente o destinatario, consultar tracking, reportar incidencias y subir evidencias relacionadas.

No puede ver paquetes ajenos, asignar motoristas ni administrar catalogos.

## Implementacion

Archivos principales:

- `backend/src/middlewares/auth.middleware.ts`
- `backend/src/middlewares/rolMiddleware.ts`
- `backend/src/servicios/accesoPaquete.servicio.ts`

El control fino por propiedad se aplica en consultas y operaciones criticas sobre paquetes, tracking y evidencias.

