# Pruebas End-to-End

## Herramienta

El frontend incluye Playwright Test.

## Comando

```bash
cd frontend
npm run e2e
```

## Requisitos

- Backend activo en `http://localhost:4300`.
- Frontend activo en `http://localhost:3180`.
- Seed demo ejecutado.
- Navegadores de Playwright instalados en el equipo.

## Flujo cubierto

- Login con usuario demo.
- Acceso al dashboard.
- Validacion visual de metricas base.

La suite queda preparada para ampliar flujos de creacion de paquete, busqueda por guia, tracking, incidencias y evidencias.

