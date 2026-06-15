# Avance del Frontend de App Tracking Paquetes APA

## Login visual

La pantalla `/login` fue igualada visualmente al login de `appTallerAPA`.
Se reutilizo la misma composicion: fondo glass, tarjeta centrada, logo superior,
iconos PrimeNG en inputs, checkbox de recordar usuario, boton principal, enlace
de recuperacion de contrasena y footer institucional.

## Assets copiados

- `frontend/public/assets/login/logoAPA.jpg`

El asset proviene de:

- `/home/admin/Documentos/Proyectos/appTallerAPA/frontend/imagenes/iconos/logoAPA.jpg`

No se modifico `appTallerAPA`.

## Archivos modificados

- `frontend/src/app/features/autenticacion/login.component.ts`
- `frontend/src/app/features/autenticacion/login.component.html`
- `frontend/src/app/features/autenticacion/login.component.scss`
- `frontend/src/app/core/servicios/auth.service.ts`
- `frontend/src/styles.scss`
- `frontend/README.md`

## Integracion con backend

El login usa el servicio real de autenticacion Angular contra `POST /api/auth/login`.
Para la cuenta de presentacion, el frontend acepta `Sistemas` y lo normaliza a
`sistemas@pajaroazul.com`, que es el correo tecnico del usuario creado por el
seed backend.

## Estado

- Login visual alineado a appTallerAPA.
- Assets minimos copiados.
- Integracion JWT real conservada.
- Sin autenticacion falsa en frontend.
