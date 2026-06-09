# Seguridad y Roles

## Roles

- `administrador`: gestion completa de usuarios, lugares, estados, paquetes, tracking, incidencias, evidencias y dashboard.
- `motorista`: consulta operativa, actualizacion de paquetes asignados y creacion de tracking/incidencias/evidencias.
- `usuario`: consulta autenticada, creacion de paquetes, incidencias y evidencias.

## Rutas publicas

- `GET /api/salud`
- `POST /api/auth/login`

## Controles implementados

- JWT obligatorio para rutas sensibles.
- Middleware `autorizarRoles`.
- Respuesta 401 uniforme para token invalido o ausente.
- Respuesta 403 uniforme para rol no permitido.
- Validacion Zod de body y params.
- Rate limit en login.
- Helmet y CORS por variable de entorno.
- Manejo centralizado de errores.
- Upload protegido con Multer.

## Pendientes produccion

- Politica fina por propiedad de recurso: remitente, destinatario y motorista asignado.
- Rotacion y almacenamiento seguro de secretos.
- Auditoria de acciones.
- Logs estructurados y monitoreo.
- Backups automaticos de MongoDB y uploads.
