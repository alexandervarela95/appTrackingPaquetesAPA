# Manual de usuario

Sistema: `appTrackingPaquetesAPA`  
Uso: control interno de paquetes de Almacen Pajaro Azul  
Fecha: 14 de junio de 2026

## Inicio de sesion

1. Abrir el sistema en:

```text
http://localhost:4300/login
```

2. Escribir el correo y la contrasena.
3. Presionar el boton de ingreso.

Usuario demo principal:

- Correo: `sistemas@pajaroazul.com`
- Contrasena: `Sistemas*2026`

Si las credenciales son correctas, el sistema abre la pantalla de inicio.

## Pantalla de inicio

La pantalla de inicio muestra un resumen del estado general:

- Cantidad de estados de paquete.
- Paquetes en proceso.
- Problemas pendientes.
- Fotos o comprobantes registrados.
- Paquetes por estado.
- Resumen general.

Esta pantalla sirve para revisar rapidamente como esta la operacion.

## Menu lateral

El menu lateral permite entrar a las pantallas principales:

- Inicio.
- Paquetes.
- Registrar paquete.
- Seguimiento.
- Problemas.
- Comprobantes.
- Personal.
- Ubicaciones.
- Estados del paquete.
- Informes.

En la parte inferior aparece la burbuja del usuario. Al abrirla se muestra el nombre, correo y el boton para cerrar sesion.

## Registrar paquete

1. Entrar a `Registrar paquete`.
2. Completar los datos solicitados:
   - Tipo de paquete.
   - Prioridad.
   - Descripcion.
   - Origen.
   - Destino.
   - Remitente.
   - Destinatario.
   - Motorista, si aplica.
   - Observaciones, si aplica.
3. Guardar el registro.

El sistema genera el numero de guia automaticamente al guardar. El usuario no debe escribirlo manualmente. El formato esperado es `APA-000001`.

## Consolidar paquetes

Entrar a `Consolidar paquetes` cuando una misma persona o area recibira varios paquetes. Esta pantalla permite llenar una sola vez los datos comunes del envio y luego agregar varios paquetes a una lista temporal.

Uso basico:

1. Seleccionar lugar origen, lugar destino, remitente y destinatario.
2. Elegir prioridad general y motorista si aplica.
3. Escribir tipo, descripcion y observaciones de un paquete.
4. Presionar `Agregar a lista`.
5. Repetir el proceso para los demas paquetes.
6. Revisar la tabla temporal.
7. Editar o quitar paquetes si hace falta.
8. Presionar `Guardar todos`.

La lista temporal no se guarda en MongoDB hasta presionar `Guardar todos`. Al confirmar, cada paquete queda registrado de forma individual y recibe su propia guia secuencial, por ejemplo `APA-000001`, `APA-000002` y `APA-000003`.

## Consultar paquetes

Entrar a `Paquetes`. Desde esa pantalla se puede revisar el listado de paquetes registrados. La informacion viene de la base de datos y permite entrar al detalle de cada paquete.

El listado sirve para buscar paquetes ya creados y confirmar sus datos principales.

## Ver detalle de paquete

Desde el listado de paquetes, abrir un paquete. En el detalle se puede revisar:

- Numero de guia.
- Descripcion.
- Tipo y prioridad.
- Estado actual.
- Lugar de origen.
- Lugar de destino.
- Remitente.
- Destinatario.
- Motorista asignado, si existe.
- Observaciones.
- Movimientos relacionados.

Desde el detalle tambien se puede acceder a la hoja imprimible.

## Ver seguimiento

Entrar a `Seguimiento`. Se puede consultar el tracking por numero de guia. El sistema muestra los movimientos registrados para saber como ha avanzado el paquete.

Cada movimiento puede incluir estado, descripcion, lugar y fecha.

## Reportar problemas

Entrar a `Problemas`. Esta pantalla se usa para registrar o consultar incidencias relacionadas con paquetes.

Una incidencia permite indicar que existe un problema con una guia, por ejemplo una demora, extravio o situacion que requiere revision.

Los datos principales son:

- Paquete o guia.
- Tipo de problema.
- Descripcion.
- Estado de la incidencia.
- Usuario que reporta.

## Comprobantes y evidencias

Entrar a `Comprobantes`. Desde esta pantalla se pueden consultar evidencias y subir archivos asociados a paquetes.

Formatos aceptados:

- JPG.
- JPEG.
- PNG.
- PDF.

El archivo debe pesar como maximo 5 MB.

Las evidencias sirven para adjuntar fotos, comprobantes o documentos relacionados con el envio.

## Gestionar personal

La pantalla `Personal` permite administrar usuarios del sistema cuando el rol tiene permisos. Se registran datos como nombre, correo, codigo de empleado, rol y lugar asignado.

Roles usados por el sistema:

- Administrador.
- Usuario.
- Motorista.

## Gestionar ubicaciones

La pantalla `Ubicaciones` permite administrar lugares usados por el sistema. Pueden ser sucursales, bodegas o departamentos.

Datos principales:

- Nombre.
- Descripcion.
- Ciudad.
- Direccion.
- Estado activo/inactivo.

Estos lugares se usan como origen, destino o ubicacion actual de un paquete.

## Gestionar estados del paquete

La pantalla `Estados del paquete` permite administrar las etapas del flujo de un paquete.

Estados base del sistema:

- Creado.
- Asignado a motorista.
- En transito.
- Recibido pendiente confirmacion usuario final.
- Recibido usuario final.
- Extraviado.

El orden ayuda a mantener un flujo entendible.

## Ver informes

La pantalla `Informes` permite consultar salidas administrativas. Los informes reales del sistema incluyen:

- Paquetes por estado.
- Incidencias.
- Actividad reciente.

Esta seccion esta orientada a administracion.

## Imprimir hoja de envio

Desde el detalle de un paquete se puede abrir:

```text
/paquetes/:id/imprimir
```

La hoja imprimible muestra la informacion necesaria para acompanar el envio interno:

- Logo.
- Numero de guia.
- Numero de bulto.
- Fecha de creacion.
- Prioridad.
- Origen.
- Destino.
- Detalle del envio.
- Observaciones.
- Firmas.

Para imprimir, presionar el boton `Imprimir`. En la impresion no deben salir el menu lateral ni los botones de la pantalla.

## Cerrar sesion

1. Ir a la burbuja del usuario en la parte inferior del menu lateral.
2. Abrir el panel.
3. Presionar `Cerrar sesion`.

El sistema vuelve al login.

## Mensajes de error comunes

### Credenciales invalidas

Revisar correo y contrasena. Si se usa demo, verificar que el seed se haya ejecutado.

### Token no proporcionado

La sesion no esta activa o expiro. Cerrar sesion y volver a ingresar.

### No tiene permisos para realizar esta accion

El rol del usuario no permite esa operacion. Solicitar apoyo a un administrador.

### Datos invalidos

Alguno de los campos no cumple las reglas del sistema. Revisar campos obligatorios, correo, prioridad, rol o referencias seleccionadas.

### Archivo no permitido

La evidencia debe ser `jpg`, `jpeg`, `png` o `pdf` y no debe superar 5 MB.

## Recomendaciones de uso

- Registrar la descripcion del paquete de forma clara.
- Verificar bien origen, destino, remitente y destinatario antes de guardar.
- Usar observaciones cuando exista una condicion especial del envio.
- Reportar problemas en cuanto se detecten.
- Adjuntar evidencias utiles, no archivos repetidos o sin relacion.
- Cerrar sesion al terminar, especialmente en equipos compartidos.
