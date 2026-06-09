# Endpoints API

Base local: `http://localhost:4300/api`

## Publicos

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/salud` | Verifica estado del servicio |
| POST | `/auth/login` | Login con correo y contrasena |

Body login:

```json
{ "correo": "sistemas@pajaroazul.local", "contrasena": "Sistemas*2026" }
```

## Protegidos

Todos requieren `Authorization: Bearer <token>`.

| Metodo | Endpoint | Roles |
| --- | --- | --- |
| GET | `/dashboard/resumen` | administrador |
| GET | `/usuarios` | administrador |
| POST | `/usuarios` | administrador |
| PUT | `/usuarios/:id` | administrador |
| DELETE | `/usuarios/:id` | administrador |
| GET | `/lugares` | autenticado |
| POST | `/lugares` | administrador |
| PUT | `/lugares/:id` | administrador |
| DELETE | `/lugares/:id` | administrador |
| GET | `/estados` | autenticado |
| POST | `/estados` | administrador |
| PUT | `/estados/:id` | administrador |
| DELETE | `/estados/:id` | administrador |
| GET | `/paquetes` | autenticado |
| GET | `/paquetes/guia/:numeroGuia` | autenticado |
| POST | `/paquetes` | administrador, usuario |
| PUT | `/paquetes/:id` | administrador, motorista |
| DELETE | `/paquetes/:id` | administrador |
| GET | `/tracking/guia/:numeroGuia` | autenticado |
| POST | `/tracking` | administrador, motorista |
| GET | `/incidencias` | administrador |
| POST | `/incidencias` | administrador, usuario, motorista |
| GET | `/evidencias` | autenticado |
| POST | `/evidencias/upload` | administrador, usuario, motorista |
| GET | `/evidencias/archivo/:id` | autenticado |

## Respuesta de validacion

```json
{
  "exito": false,
  "mensaje": "Datos invalidos",
  "errores": [{ "campo": "descripcion", "mensaje": "La descripcion es obligatoria" }]
}
```
