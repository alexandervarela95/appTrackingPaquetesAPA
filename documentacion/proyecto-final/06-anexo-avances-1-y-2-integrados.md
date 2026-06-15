# Anexo Integrado de Avances 1 y 2

Este anexo consolida los elementos solicitados en los avances previos para que la entrega final del Avance 3 quede completa y defendible.

## Avance 1

### Objetivo general

Desarrollar una aplicación web cliente-servidor para registrar, consultar y dar seguimiento a paquetes internos de Almacén Pájaro Azul, utilizando Angular en el cliente, Node.js/Express en el servidor y MongoDB como base de datos.

### Objetivos específicos

1. Implementar autenticación segura con usuarios, contraseña y token JWT.
2. Registrar paquetes con guía automática, origen, destino, remitente, destinatario, prioridad y tipo.
3. Consultar paquetes por listado, detalle y número de guía.
4. Registrar movimientos de seguimiento, problemas y comprobantes.
5. Administrar usuarios, lugares y estados del flujo de paquetes.
6. Presentar reportes e indicadores para operación, supervisión y gerencia.

### Alcance del sistema

El sistema cubre:

- Inicio de sesión.
- Dashboard o pantalla de inicio.
- Administración de usuarios.
- Administración de lugares.
- Administración de estados.
- Registro individual de paquetes.
- Registro de varios paquetes juntos.
- Consulta de paquetes.
- Detalle de paquete.
- Hoja imprimible.
- Seguimiento por guía.
- Problemas reportados.
- Comprobantes y archivos de respaldo.
- Reportes.
- Auditoría.

Queda fuera de producción estricta:

- Dominio público.
- TLS.
- Proxy reverso.
- Monitoreo centralizado.
- Almacenamiento externo de archivos.
- Estrategia formal de respaldo productivo.

### Cronograma resumido

| Etapa | Actividades | Entregable |
| --- | --- | --- |
| Semana 1-2 | Definición del problema, objetivos y alcance | Propuesta del proyecto |
| Semana 3-4 | Requerimientos, pantallas iniciales y modelo funcional | Avance 1 |
| Semana 5-6 | Requerimientos detallados, casos de uso, base de datos y esquemas | Avance 2 |
| Semana 7-9 | Desarrollo completo, pruebas, manuales, informe y presentación | Avance 3 |

## Avance 2

### Requerimientos funcionales

| Código | Requerimiento | Entrada principal | Salida principal |
| --- | --- | --- | --- |
| RF-01 | Iniciar sesión | Correo y contraseña | Token de acceso y datos del usuario |
| RF-02 | Administrar usuarios | Nombre, correo, rol, lugar y estado | Lista de usuarios y estado de acceso |
| RF-03 | Administrar lugares | Nombre, ciudad, dirección y estado | Catálogo de lugares |
| RF-04 | Administrar estados | Nombre, descripción y orden | Catálogo de estados del paquete |
| RF-05 | Registrar paquete | Datos de paquete, origen, destino y usuarios relacionados | Paquete con guía automática |
| RF-06 | Registrar varios paquetes juntos | Datos comunes y lista temporal de paquetes | Varios paquetes individuales con guía propia |
| RF-07 | Consultar paquete | Guía o selección desde listado | Detalle del paquete |
| RF-08 | Registrar seguimiento | Paquete, estado, lugar y descripción | Movimiento agregado al historial |
| RF-09 | Reportar problema | Paquete, tipo, descripción y usuario | Problema registrado |
| RF-10 | Subir comprobante | Paquete, tipo, descripción y archivo | Archivo asociado al paquete |
| RF-11 | Consultar reportes | Filtros o consulta general | Reportes de paquetes, problemas y actividad |
| RF-12 | Revisar auditoría | Usuario autorizado | Registro de acciones relevantes |

### Casos de uso principales

| Caso de uso | Actor principal | Flujo básico |
| --- | --- | --- |
| Iniciar sesión | Usuario del sistema | Ingresa correo y contraseña; el sistema valida y abre la pantalla de inicio. |
| Registrar paquete | Usuario o administrador | Completa datos del paquete; el sistema valida, guarda y genera guía. |
| Buscar paquete | Usuario autenticado | Escribe la guía; el sistema muestra información o indica que no existe. |
| Registrar seguimiento | Motorista o administrador | Selecciona paquete, estado y descripción; el sistema agrega movimiento. |
| Reportar problema | Usuario, motorista o administrador | Relaciona el problema con un paquete y registra la descripción. |
| Subir comprobante | Usuario, motorista o administrador | Selecciona archivo permitido y lo asocia al paquete. |
| Administrar catálogos | Administrador | Crea, actualiza o desactiva usuarios, lugares y estados. |
| Revisar reportes | Administrador | Abre reportes y consulta indicadores de operación. |

### Colecciones de MongoDB

| Colección | Descripción |
| --- | --- |
| `usuarios` | Personas que usan el sistema: administradores, usuarios y motoristas. |
| `lugares` | Bodegas, sucursales, departamentos o destinos usados en paquetes. |
| `estados` | Estados permitidos para el flujo de un paquete. |
| `paquetes` | Registro central del paquete y su guía. |
| `trackings` | Movimientos o avances del paquete. |
| `incidencias` | Problemas reportados sobre paquetes. |
| `evidencias` | Comprobantes, imágenes o archivos asociados. |
| `auditlogs` | Acciones relevantes para trazabilidad. |
| `counters` | Contador usado para crear guías secuenciales. |

### Modelo de esquemas

| Entidad | Atributos principales | Asociaciones |
| --- | --- | --- |
| Usuario | nombre, correo, código de empleado, contraseña, rol, estado | Lugar asignado, paquetes, tracking, problemas, comprobantes y auditoría |
| Lugar | nombre, ciudad, dirección, descripción, estado | Origen, destino y ubicación actual |
| Estado | nombre, descripción, orden, estado | Estado actual del paquete y eventos de seguimiento |
| Paquete | guía, descripción, tipo, prioridad, estado, origen, destino, remitente, destinatario, motorista | Tracking, problemas y comprobantes |
| Tracking | paquete, guía, estado, lugar, responsable, descripción, fecha | Paquete, estado, lugar y usuario |
| Incidencia | paquete, guía, tipo, estado, descripción, usuario que reporta | Paquete y usuario |
| Evidencia | paquete, guía, tipo, ruta de archivo, descripción, usuario que reporta | Paquete y usuario |
| Auditoría | usuario, rol, acción, entidad, descripción, fecha | Usuario y entidad afectada |

### Glosario

| Término | Definición |
| --- | --- |
| Guía | Número único que identifica un paquete, por ejemplo `APA-000001`. |
| Paquete | Envío interno registrado en el sistema. |
| Remitente | Persona o área que envía el paquete. |
| Destinatario | Persona o área que recibe el paquete. |
| Motorista | Persona encargada de traslado o entrega. |
| Estado | Etapa actual del paquete dentro del flujo. |
| Seguimiento | Historial de movimientos del paquete. |
| Problema | Situación fuera de lo normal, como retraso, daño, extravío o dato incorrecto. |
| Comprobante | Archivo que respalda una entrega, recepción o problema. |
| Dashboard | Pantalla inicial con resumen de paquetes, problemas y actividad. |
| Auditoría | Registro de acciones importantes realizadas dentro del sistema. |
| Catálogo | Lista base que se mantiene para usar datos consistentes, como lugares o estados. |

