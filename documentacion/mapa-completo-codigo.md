# Mapa completo del codigo

Este documento enumera los archivos fuente, vistas, estilos y scripts del proyecto `appTrackingPaquetesAPA`. Sirve como guia rapida para ubicar responsabilidades sin mezclar documentacion con reglas de negocio.

No describe cambios funcionales: solo explica que hace cada pieza del codigo.

Total documentado: 145 archivos.

## Backend

- `backend/src/__tests__/accesoPaquete.test.ts`: Prueba automatizada que valida el flujo de accesoPaquete y evita regresiones en backend.
- `backend/src/__tests__/auth.test.ts`: Prueba automatizada que valida el flujo de auth y evita regresiones en backend.
- `backend/src/__tests__/health.test.ts`: Prueba automatizada que valida el flujo de health y evita regresiones en backend.
- `backend/src/__tests__/paquete.test.ts`: Prueba automatizada que valida el flujo de paquete y evita regresiones en backend.
- `backend/src/app.ts`: Configura la aplicacion Express, middlewares globales y montaje principal de rutas API.
- `backend/src/config/conexionMongo.ts`: Configura conexionMongo para que el backend use entorno, base de datos o cache de forma centralizada.
- `backend/src/config/conexionRedis.ts`: Configura conexionRedis para que el backend use entorno, base de datos o cache de forma centralizada.
- `backend/src/config/configuracionEntorno.ts`: Configura configuracionEntorno para que el backend use entorno, base de datos o cache de forma centralizada.
- `backend/src/controladores/auditLog.controlador.ts`: Controlador de auditLog: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/auth.controlador.ts`: Controlador de auth: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/dashboard.controlador.ts`: Controlador de dashboard: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/estado.controlador.ts`: Controlador de estado: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/evidencia.controlador.ts`: Controlador de evidencia: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/incidencia.controlador.ts`: Controlador de incidencia: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/lugar.controlador.ts`: Controlador de lugar: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/paquete.controlador.ts`: Controlador de paquete: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/reporte.controlador.ts`: Controlador de reporte: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/salud.controlador.ts`: Controlador de salud: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/tracking.controlador.ts`: Controlador de tracking: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/controladores/usuario.controlador.ts`: Controlador de usuario: recibe la peticion HTTP, coordina el servicio y devuelve la respuesta API.
- `backend/src/index.ts`: Punto de arranque del backend: carga entorno, conecta servicios y levanta el servidor HTTP.
- `backend/src/middlewares/auth.middleware.ts`: Middleware de auth: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/manejadorErrores.middleware.ts`: Middleware de manejadorErrores: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/rateLimitMiddleware.ts`: Middleware de rateLimitMiddleware: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/rolMiddleware.ts`: Middleware de rolMiddleware: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/rutaNoEncontrada.middleware.ts`: Middleware de rutaNoEncontrada: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/subidaArchivoMiddleware.ts`: Middleware de subidaArchivoMiddleware: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/middlewares/validacionMiddleware.ts`: Middleware de validacionMiddleware: aplica una regla transversal antes de que la peticion llegue al controlador.
- `backend/src/modelos/auditLog.model.ts`: Modelo de auditLog: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/contador.model.ts`: Modelo de contador: guarda secuencias atomicas para generar guias de paquete sin duplicados.
- `backend/src/modelos/estado.model.ts`: Modelo de estado: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/evidencia.model.ts`: Modelo de evidencia: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/incidencia.model.ts`: Modelo de incidencia: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/lugar.model.ts`: Modelo de lugar: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/paquete.model.ts`: Modelo de paquete: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/tracking.model.ts`: Modelo de tracking: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/modelos/usuario.model.ts`: Modelo de usuario: define la forma de los datos persistidos y sus tipos principales.
- `backend/src/realtime/events.ts`: Soporte de tiempo real para publicar eventos de events hacia clientes conectados.
- `backend/src/realtime/publisher.ts`: Soporte de tiempo real para publicar eventos de publisher hacia clientes conectados.
- `backend/src/realtime/server.ts`: Soporte de tiempo real para publicar eventos de server hacia clientes conectados.
- `backend/src/rutas/auditLog.rutas.ts`: Rutas de auditLog: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/auth.rutas.ts`: Rutas de auth: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/dashboard.rutas.ts`: Rutas de dashboard: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/estado.rutas.ts`: Rutas de estado: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/evidencia.rutas.ts`: Rutas de evidencia: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/incidencia.rutas.ts`: Rutas de incidencia: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/index.rutas.ts`: Rutas de index: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/lugar.rutas.ts`: Rutas de lugar: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/paquete.rutas.ts`: Rutas de paquete: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/reporte.rutas.ts`: Rutas de reporte: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/salud.rutas.ts`: Rutas de salud: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/tracking.rutas.ts`: Rutas de tracking: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/rutas/usuario.rutas.ts`: Rutas de usuario: conecta endpoints, validaciones, seguridad y controlador correspondiente.
- `backend/src/semillas/datosIniciales.ts`: Datos semilla de datosIniciales: prepara informacion inicial necesaria para usar el sistema.
- `backend/src/semillas/estadosSemilla.ts`: Datos semilla de estadosSemilla: prepara informacion inicial necesaria para usar el sistema.
- `backend/src/semillas/usuarioDefault.ts`: Datos semilla de usuarioDefault: prepara informacion inicial necesaria para usar el sistema.
- `backend/src/servicios/accesoPaquete.servicio.ts`: Servicio de accesoPaquete: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/auditLog.servicio.ts`: Servicio de auditLog: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/auth.servicio.ts`: Servicio de auth: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/dashboard.servicio.ts`: Servicio de dashboard: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/estado.servicio.ts`: Servicio de estado: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/evidencia.servicio.ts`: Servicio de evidencia: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/incidencia.servicio.ts`: Servicio de incidencia: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/lugar.servicio.ts`: Servicio de lugar: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/paquete.servicio.ts`: Servicio de paquete: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/reporte.servicio.ts`: Servicio de reporte: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/storage.servicio.ts`: Servicio de storage: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/tracking.servicio.ts`: Servicio de tracking: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servicios/usuario.servicio.ts`: Servicio de usuario: concentra la regla de negocio y las operaciones de datos reutilizables.
- `backend/src/servidor.ts`: Crea el servidor HTTP y conecta Express con los servicios de tiempo real.
- `backend/src/utilidades/generadorCodigo.ts`: Utilidad de generadorCodigo: funcion auxiliar compartida por varias partes del backend.
- `backend/src/utilidades/generarNumeroGuia.ts`: Utilidad de generarNumeroGuia: funcion auxiliar compartida por varias partes del backend.
- `backend/src/utilidades/respuestaApi.ts`: Utilidad de respuestaApi: funcion auxiliar compartida por varias partes del backend.
- `backend/src/utilidades/validacionReferencias.ts`: Utilidad de validacionReferencias: funcion auxiliar compartida por varias partes del backend.
- `backend/src/validadores/authValidador.ts`: Validador de authValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/camposComunes.ts`: Validador de camposComunes: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/estadoValidador.ts`: Validador de estadoValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/evidenciaValidador.ts`: Validador de evidenciaValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/incidenciaValidador.ts`: Validador de incidenciaValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/lugarValidador.ts`: Validador de lugarValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/mongoIdValidador.ts`: Validador de mongoIdValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/paqueteValidador.ts`: Validador de paqueteValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/trackingValidador.ts`: Validador de trackingValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
- `backend/src/validadores/usuarioValidador.ts`: Validador de usuarioValidador: revisa entradas con esquemas antes de ejecutar la regla de negocio.
## Frontend

- `frontend/src/app/app.config.ts`: Configura proveedores globales de Angular, rutas, HTTP e interceptores de la aplicacion.
- `frontend/src/app/app.html`: Plantilla raiz que deja a Angular renderizar la ruta activa.
- `frontend/src/app/app.routes.ts`: Define el mapa de navegacion del frontend y que pantallas se cargan por ruta.
- `frontend/src/app/app.scss`: Estilos puntuales del componente raiz Angular.
- `frontend/src/app/app.spec.ts`: Prueba base del componente raiz para validar que Angular lo crea correctamente.
- `frontend/src/app/app.ts`: Componente raiz Angular que aloja el router principal de la aplicacion.
- `frontend/src/app/core/guards/auth.guard.ts`: Guard de auth: protege rutas y decide si el usuario puede entrar.
- `frontend/src/app/core/interceptors/auth.interceptor.ts`: Interceptor de auth: ajusta peticiones HTTP salientes, como autenticacion y cabeceras.
- `frontend/src/app/core/modelos/auth-user.model.ts`: Modelo de auth user: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/dashboard.model.ts`: Modelo de dashboard: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/estado.model.ts`: Modelo de estado: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/evidencia.model.ts`: Modelo de evidencia: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/incidencia.model.ts`: Modelo de incidencia: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/lugar.model.ts`: Modelo de lugar: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/paquete.model.ts`: Modelo de paquete: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/respuesta-api.model.ts`: Modelo de respuesta api: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/tracking.model.ts`: Modelo de tracking: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/modelos/usuario.model.ts`: Modelo de usuario: define la forma de los datos persistidos y sus tipos principales.
- `frontend/src/app/core/servicios/api-crud.servicio.ts`: Servicio de api crud: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/auditoria.servicio.ts`: Servicio de auditoria: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/auth.service.ts`: Servicio de auth: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/dashboard.servicio.ts`: Servicio de dashboard: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/estado.servicio.ts`: Servicio de estado: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/evidencia.servicio.ts`: Servicio de evidencia: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/incidencia.servicio.ts`: Servicio de incidencia: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/lugar.servicio.ts`: Servicio de lugar: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/paquete.servicio.ts`: Servicio de paquete: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/realtime.service.ts`: Servicio de realtime: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/reporte.servicio.ts`: Servicio de reporte: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/tracking.servicio.ts`: Servicio de tracking: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/servicios/usuario.servicio.ts`: Servicio de usuario: concentra la regla de negocio y las operaciones de datos reutilizables.
- `frontend/src/app/core/utilidades/numero-guia.ts`: Utilidad de numero de guia: normaliza y valida el formato `APA-000001` antes de buscar.
- `frontend/src/app/features/auditoria/auditoria.component.ts`: Pantalla de auditoria: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/autenticacion/login.component.html`: Plantilla de login: estructura visual que muestra datos y controles de la vista.
- `frontend/src/app/features/autenticacion/login.component.scss`: Estilos de login: ajusta presentacion, responsive y estados visuales de la pantalla.
- `frontend/src/app/features/autenticacion/login.component.ts`: Pantalla de login: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/dashboard/dashboard.component.ts`: Pantalla de dashboard: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/estados/estados.component.ts`: Pantalla de estados: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/evidencias/evidencias.component.ts`: Pantalla de evidencias: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/incidencias/incidencias.component.ts`: Pantalla de incidencias: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/lugares/lugares.component.ts`: Pantalla de lugares: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/paquetes/paquete-detalle.component.ts`: Pantalla de paquete detalle: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/paquetes/paquete-consolidar.component.ts`: Pantalla de consolidacion de paquetes: arma una lista temporal y guarda todo al confirmar.
- `frontend/src/app/features/paquetes/paquete-imprimir.component.ts`: Pantalla de paquete imprimir: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/paquetes/paquete-nuevo.component.ts`: Pantalla de paquete nuevo: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/paquetes/paquetes.component.ts`: Pantalla de paquetes: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/reportes/reportes.component.ts`: Pantalla de reportes: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/tracking/tracking.component.ts`: Pantalla de tracking: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/features/usuarios/usuarios.component.ts`: Pantalla de usuarios: maneja datos, acciones de usuario y estado visual de la vista.
- `frontend/src/app/layout/layout.component.html`: Plantilla del layout autenticado: coloca el sidebar global y el contenedor donde entra cada pantalla.
- `frontend/src/app/layout/layout.component.scss`: Estilos del layout autenticado: mantiene medidas, fondo, scroll general y espacio del contenido.
- `frontend/src/app/layout/layout.component.ts`: Componente del layout autenticado: organiza la estructura comun usada por pantallas internas.
- `frontend/src/app/layout/sidebar.component.html`: Plantilla del sidebar global: muestra marca, navegacion, usuario y panel de sesion.
- `frontend/src/app/layout/sidebar.component.scss`: Estilos del sidebar global: mantiene ancho, alto, scroll interno, burbuja de usuario y dropdown.
- `frontend/src/app/layout/sidebar.component.ts`: Componente del sidebar global: calcula usuario activo, opcion seleccionada y cierre de sesion.
## Scripts

- `scripts/backup/mongo-backup.cmd`: Respalda la base de datos MongoDB del proyecto para conservar una copia recuperable.
- `scripts/backup/mongo-restore.cmd`: Restaura una copia de MongoDB generada por el proceso de respaldo del proyecto.
- `scripts/base-datos/generar-diagrama-base-datos.cjs`: Genera el diagrama de base de datos usado por la documentacion tecnica.
- `scripts/informe-final/generar-informe-final.cjs`: Genera el informe final HTML a partir de la informacion documentada del proyecto.
- `scripts/manual-tecnico/generar-manual-tecnico.cjs`: Genera el manual tecnico HTML con capturas y secciones operativas del sistema.
- `scripts/manual-usuario/generar-manual-usuario.cjs`: Genera el manual de usuario con capturas reales del frontend y pasos de uso.

## Criterio de mantenimiento

- Si se agrega una pantalla, servicio, ruta o script nuevo, debe añadirse a este mapa.
- Los comentarios de cabecera explican responsabilidad; los comentarios internos deben reservarse para decisiones que no sean obvias leyendo el codigo.
- La documentacion debe mantenerse en espanol claro, directa y sin alterar la logica del sistema.
