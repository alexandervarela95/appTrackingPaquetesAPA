# Frontend appTrackingPaquetesAPA

Interfaz Angular para la trazabilidad de envios internos de Almacen Pajaro Azul.

## Tecnologias

- Angular standalone components
- TypeScript
- RxJS
- PrimeIcons
- SCSS global

## Estructura principal

- `src/app/core/modelos`: contratos TypeScript usados por las pantallas.
- `src/app/core/servicios`: servicios HTTP para consumir la API Express.
- `src/app/core/guards`: proteccion de rutas autenticadas.
- `src/app/core/interceptors`: envio automatico de token JWT.
- `src/app/layout`: shell principal con menu lateral.
- `src/app/features`: pantallas funcionales por modulo.

## Pantallas incluidas

- Login
- Dashboard
- Registro y consulta de paquetes
- Detalle de paquete
- Tracking por numero de guia
- Incidencias
- Evidencias
- Usuarios
- Lugares
- Estados

## Login

La ruta `/login` replica visualmente el login de `appTallerAPA`: misma tarjeta glass,
fondo, logo institucional, iconos, inputs, checkbox, boton, enlace y footer.

Credenciales de prueba despues de ejecutar el seed backend:

- Usuario: `Sistemas`
- Password: `Sistemas*2026`

## Ejecucion local

Instalar dependencias:

```bash
npm install
```

Iniciar frontend:

```bash
npm start
```

El frontend se sirve en `http://localhost:4300`.

Ruta de login:

```bash
http://localhost:4300/login
```

## Conexion con backend

El archivo `proxy.conf.json` redirige `/api` hacia `http://localhost:3090`.
Si el backend usa otro puerto, ajustar ese archivo o la variable `PUERTO` del backend.

## Build

```bash
npm run build
```

El build genera archivos en `frontend/dist/`, carpeta ignorada por Git.
