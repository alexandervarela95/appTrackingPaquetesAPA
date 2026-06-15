# Informe Avance 3

Proyecto: `appTrackingPaquetesAPA`  
Sistema: Control de envios internos de Almacen Pajaro Azul  
Fecha de preparacion: 14 de junio de 2026

## Introduccion

`appTrackingPaquetesAPA` es una aplicacion web cliente-servidor para controlar paquetes internos entre sucursales, departamentos y usuarios de Almacen Pajaro Azul. El sistema permite registrar paquetes, consultar su estado, revisar movimientos, reportar incidencias, adjuntar evidencias y generar una hoja imprimible de envio interno.

Este Avance 3 integra el desarrollo funcional del backend, el frontend y la documentacion final necesaria para instalar, probar y defender el proyecto. La documentacion se basa en el codigo real del repositorio y en los documentos existentes dentro de la carpeta `documentacion/`.

## Informacion general del proyecto

- Nombre del repositorio: `appTrackingPaquetesAPA`.
- Tipo de sistema: aplicacion web cliente-servidor.
- Backend: API REST con Node.js, Express y TypeScript.
- Frontend: aplicacion Angular.
- Base de datos: MongoDB.
- Cache y apoyo temporal: Redis con fallback local.
- Autenticacion: JWT.
- Validacion de datos: Zod.
- Evidencias: carga de archivos con Multer.
- Tiempo real: Socket.IO con adapter Redis cuando Redis esta disponible.
- Puertos locales: backend `3180`, frontend `4300`.

## Justificacion

El control manual de paquetes internos puede causar perdida de informacion, duplicidad de registros y dificultad para saber en que estado se encuentra un envio. El sistema resuelve ese problema al centralizar la informacion de paquetes, responsables, lugares, estados, incidencias y evidencias.

Con una guia interna, el personal puede consultar el avance de un paquete y revisar los movimientos registrados durante su traslado. Administracion puede ver reportes, mantener catalogos y tener una base de datos organizada para auditoria y seguimiento.

## Objetivo general

Desarrollar un sistema web interno para registrar, consultar y dar seguimiento a paquetes de Almacen Pajaro Azul, usando una arquitectura cliente-servidor con backend en Node.js/Express, frontend en Angular y persistencia en MongoDB.

## Objetivos especificos

- Implementar autenticacion de usuarios mediante JWT.
- Registrar paquetes internos con origen, destino, remitente, destinatario, prioridad y tipo de paquete.
- Consultar paquetes por listado, detalle y numero de guia.
- Registrar movimientos de tracking por paquete.
- Reportar incidencias asociadas a paquetes.
- Adjuntar y consultar evidencias o comprobantes.
- Mantener catalogos de usuarios, lugares y estados.
- Mostrar un dashboard con resumen operativo.
- Generar reportes administrativos.
- Generar una hoja imprimible de envio interno.
- Documentar instalacion, uso, estructura tecnica y validacion final.

## Alcance del sistema

El sistema cubre el flujo operativo principal de paquetes internos:

1. Inicio de sesion.
2. Registro de paquete.
3. Consulta de paquetes.
4. Detalle de paquete.
5. Tracking por paquete o por guia.
6. Reporte de problemas.
7. Registro y descarga de evidencias.
8. Administracion de usuarios, lugares y estados.
9. Visualizacion de dashboard e informes.
10. Impresion de hoja de envio.

No se documenta como sistema productivo final. Para produccion estricta todavia hacen falta dominio, TLS, monitoreo, gestion formal de secretos, almacenamiento externo de evidencias y mayor cobertura E2E.

## Beneficios del proyecto

- Centraliza los datos de paquetes internos.
- Permite trazabilidad por numero de guia.
- Reduce consultas manuales entre areas.
- Ordena los catalogos de usuarios, lugares y estados.
- Deja evidencia de problemas y comprobantes.
- Facilita la defensa academica con datos demo y documentacion tecnica.
- Permite validar el backend y frontend con comandos reproducibles.

## Descripcion general del sistema

La aplicacion tiene un backend Express que expone endpoints bajo `/api`. El frontend Angular consume esos endpoints mediante servicios HTTP, usa un guard para proteger rutas internas y un interceptor para enviar el token JWT.

Las pantallas internas comparten un layout autenticado con sidebar global. La informacion se guarda en MongoDB mediante modelos Mongoose. Redis se usa para cache del dashboard y como apoyo para Socket.IO; si Redis no esta disponible, el backend usa fallback y sigue operando.

## Modulos desarrollados

### Autenticacion

Permite iniciar sesion con correo y contrasena. El backend valida credenciales y devuelve un token JWT con los datos basicos del usuario.

### Dashboard

Muestra resumen de estados, paquetes activos, incidencias abiertas, evidencias registradas y paquetes por estado.

### Paquetes

Permite listar, crear, consultar, actualizar y eliminar paquetes segun permisos. Cada paquete maneja guia, descripcion, tipo, prioridad, estado actual, origen, destino, remitente, destinatario, motorista opcional y observaciones. La guia se genera unicamente en backend con formato secuencial `APA-000001`.

### Consolidacion de paquetes

Permite capturar datos comunes de envio, agregar varios paquetes a una lista temporal y guardarlos todos al final. La lista temporal vive en el frontend hasta que el usuario presiona `Guardar todos`. El backend crea cada paquete como registro individual, genera una guia secuencial por paquete y crea su tracking inicial.

### Tracking

Guarda movimientos del paquete con estado, descripcion, lugar actual, usuario responsable y fecha del evento. Permite consultar por paquete o por numero de guia.

### Incidencias

Permite reportar problemas sobre paquetes. Maneja tipo, descripcion, estado de incidencia, usuario que reporta y fechas.

### Evidencias

Permite registrar comprobantes y subir archivos `jpg`, `jpeg`, `png` o `pdf`, con limite de 5 MB por archivo.

### Usuarios / Personal

Permite administrar usuarios del sistema. Los roles reales definidos en el modelo son `usuario`, `motorista` y `administrador`.

### Lugares / Ubicaciones

Permite administrar sucursales, bodegas o departamentos usados como origen, destino o lugar actual del tracking.

### Estados del paquete

Permite administrar los estados del flujo de paquetes, como `Creado`, `Asignado a motorista`, `En transito`, `Recibido pendiente confirmacion usuario final`, `Recibido usuario final` y `Extraviado`.

### Reportes / Informes

Incluye reportes de paquetes por estado, incidencias y actividad reciente.

### Auditoria

Existe modulo backend de auditoria y ruta frontend protegida. En el sidebar normal queda oculta para roles de operacion y se habilita solo para roles tecnicos definidos en el frontend.

## Tecnologias utilizadas

### Backend

- Node.js.
- Express.
- TypeScript.
- MongoDB.
- Mongoose.
- Redis.
- Socket.IO.
- JWT.
- Zod.
- Multer.
- Helmet.
- Morgan.
- Jest y Supertest.

### Frontend

- Angular.
- TypeScript.
- RxJS.
- SCSS.
- PrimeIcons.
- Socket.IO Client.
- Playwright para pruebas E2E disponibles.

### Infraestructura local

- Docker Compose para MongoDB y Redis.
- Scripts de backup y restauracion de MongoDB.

## Arquitectura del sistema

El backend esta organizado por capas:

- `rutas/`: define endpoints.
- `controladores/`: atienden la peticion HTTP.
- `servicios/`: concentran reglas de negocio.
- `modelos/`: definen esquemas Mongoose.
- `middlewares/`: autenticacion, roles, validacion, errores y subida de archivos.
- `validadores/`: esquemas Zod.
- `utilidades/`: funciones compartidas.
- `realtime/`: eventos y emision Socket.IO.
- `semillas/`: datos iniciales y demo.

El frontend esta organizado por:

- `core/modelos/`: tipos de datos usados por Angular.
- `core/servicios/`: comunicacion HTTP con la API.
- `core/guards/`: proteccion de rutas.
- `core/interceptors/`: envio automatico de token.
- `features/`: pantallas funcionales.
- `layout/`: layout autenticado y sidebar global.

## Base de datos MongoDB

La base de datos local configurada es `appTrackingPaquetesAPA`. La conexion se define en `backend/.env.example` con:

```env
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
```

MongoDB es obligatorio para operar. Si no esta disponible, el backend no puede iniciar correctamente porque no tendria persistencia.

## Colecciones principales

- `usuarios`: personal que usa el sistema.
- `lugares`: sucursales, bodegas o departamentos.
- `estados`: estados del flujo de paquetes.
- `paquetes`: envios internos registrados.
- `trackings`: movimientos de cada paquete.
- `incidencias`: problemas reportados.
- `evidencias`: comprobantes o archivos asociados.
- `auditlogs`: registros de auditoria.
- `counters`: contador atomico usado para generar guias secuenciales.

## Roles y permisos

Roles reales del modelo:

- `administrador`: puede administrar catalogos, usuarios, reportes y eliminaciones.
- `usuario`: puede operar paquetes, incidencias y evidencias segun rutas permitidas.
- `motorista`: puede participar en tracking, actualizar paquetes segun rutas permitidas y registrar evidencias/incidencias.

Las rutas usan `authMiddleware` para requerir token y `autorizarRoles` para limitar acciones especificas.

## Funcionalidades implementadas

- Login con JWT.
- Proteccion de rutas backend y frontend.
- Dashboard con resumen operativo.
- CRUD de usuarios.
- CRUD de lugares.
- CRUD de estados.
- CRUD principal de paquetes.
- Consulta de paquete por numero de guia.
- Tracking por paquete y por guia.
- Incidencias.
- Evidencias con carga y descarga de archivos.
- Reportes administrativos.
- Auditoria.
- Sidebar global en frontend.
- Hoja imprimible de envio interno.
- Seed demo idempotente.
- Build backend y frontend.
- Pruebas automatizadas backend.

## Entradas del sistema

- Credenciales de login.
- Datos de usuarios: nombre, correo, codigo de empleado, rol, lugar asignado y estado.
- Datos de lugares: nombre, descripcion, ciudad, direccion y estado.
- Datos de estados: nombre, descripcion, orden y estado.
- Datos de paquetes: descripcion, tipo, prioridad, origen, destino, remitente, destinatario, motorista opcional y observaciones.
- Datos de tracking: paquete, estado, descripcion, lugar actual y responsable.
- Datos de incidencias: paquete, guia, tipo, descripcion, estado y usuario que reporta.
- Datos de evidencias: paquete, guia, tipo, descripcion y archivo opcional.

## Salidas del sistema

- Dashboard de inicio.
- Listado de paquetes.
- Detalle de paquete.
- Seguimiento por guia.
- Reporte de incidencias.
- Listado de evidencias.
- Informes administrativos.
- Hoja imprimible de envio interno.
- Mensajes de validacion y error.

## Validaciones

El backend usa Zod para validar entradas antes de llegar a controladores y servicios. Algunas reglas reales:

- ObjectId valido para referencias MongoDB.
- Prioridad permitida: `baja`, `media`, `alta`.
- Rol permitido: `usuario`, `motorista`, `administrador`.
- Estado de incidencia permitido: `abierta`, `en proceso`, `cerrada`.
- Correo con formato valido.
- Contrasena minima de 6 caracteres al crear usuarios.
- Peticiones de actualizacion no pueden venir vacias.

## Seguridad

- JWT para sesiones.
- Token enviado en encabezado `Authorization: Bearer`.
- Middleware de roles.
- Rate limit en login.
- Helmet para cabeceras HTTP.
- CORS configurado para `http://localhost:4300`.
- Validacion Zod.
- Restriccion de extensiones y tamano en evidencias.

## Evidencias y archivos

Las evidencias se suben con Multer a `uploads/evidencias`. Los formatos permitidos son `jpg`, `jpeg`, `png` y `pdf`. El limite por archivo es 5 MB. En produccion se recomienda mover este almacenamiento a un servicio externo o volumen administrado.

## Tiempo real

El sistema tiene Socket.IO. Usa el mismo JWT del API para autenticar sockets. Permite eventos para paquetes, tracking, incidencias, evidencias, dashboard, catalogos y auditoria. Si Redis esta disponible, Socket.IO puede usar adapter Redis; si no, opera con adapter local.

## Reportes e informes

Los reportes reales del backend son:

- `/api/reportes/paquetes-por-estado`
- `/api/reportes/incidencias`
- `/api/reportes/actividad`

Estos reportes estan protegidos por token y rol `administrador`.

## Hoja imprimible de envio

Existe la ruta frontend `/paquetes/:id/imprimir`. Muestra una hoja de envio interno en formato imprimible. La vista evita imprimir sidebar, botones o fondos del dashboard. Incluye logo, numero de guia, numero de bulto, fecha de creacion, prioridad, origen, destino, detalle del envio, observaciones y area de firmas.

## Pruebas realizadas

Se ejecutaron:

- `npm run build` en backend.
- `npm test -- --runInBand` en backend.
- `npm run build` en frontend.
- Healthcheck `GET http://localhost:3180/api/salud`.
- Login demo con `sistemas@pajaroazul.com`.
- Revision HTTP del frontend en `http://localhost:4300/`.

## Estado final del proyecto

El proyecto esta funcional para pruebas locales y defensa academica. El backend compila, las pruebas automatizadas disponibles pasan y el frontend genera build. MongoDB es necesario para operar. Redis esta preparado, pero el backend puede seguir con fallback si Redis no responde.

## Pendientes reales

- Ampliar pruebas E2E para flujos completos de paquete, tracking, incidencias y evidencias.
- Validar restauracion real de backup antes de una entrega productiva.
- Configurar dominio, TLS y proxy reverso si se publica fuera del entorno local.
- Separar almacenamiento de evidencias para produccion.
- Implementar monitoreo y logs centralizados.
- Fortalecer politicas de secretos por ambiente.
- Revisar advertencias de presupuesto SCSS en build frontend si se desea dejar cero warnings.

## Conclusiones

El Avance 3 deja un sistema completo para la defensa del proyecto. La aplicacion integra backend, frontend, base de datos, validaciones, seguridad, reportes, evidencias y una hoja imprimible. La documentacion permite explicar como esta construido el sistema, como se instala, como se usa y que puntos quedan pendientes antes de pensar en produccion estricta.
