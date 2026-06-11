# CI/CD

## Workflow disponible

Archivo:

```text
.github/workflows/ci.yml
```

El pipeline se ejecuta en push a `main` y pull request hacia `main`.

## Pasos

1. Descargar codigo.
2. Configurar Node.js 22.
3. Instalar dependencias backend con `npm ci`.
4. Compilar backend.
5. Ejecutar pruebas backend.
6. Instalar dependencias frontend con `npm ci`.
7. Compilar frontend.

## Alcance

Este CI valida calidad basica de integracion. No hace despliegue porque todavia no existe servidor, dominio, TLS ni estrategia productiva aprobada.

