# Matriz de Cumplimiento - Avance 3

Proyecto: `appTrackingPaquetesAPA`  
Entidad: Almacén Pájaro Azul  
Responsable: Ing. Alexander Varela  
Fecha: 15 de junio de 2026

## Requisitos del documento del proyecto

| Requisito | Estado | Evidencia |
| --- | --- | --- |
| Desarrollo completo del sistema cliente-servidor | Cumplido | Código del repositorio: `backend/` y `frontend/`. Backend Express TypeScript y frontend Angular. |
| Manual técnico | Cumplido | `02-manual-tecnico-appTrackingPaquetesAPA.pdf`. |
| Manual de usuario | Cumplido | `03-manual-usuario-appTrackingPaquetesAPA.pdf`, con capturas reales y lenguaje operativo. |
| Integración de avances anteriores | Cumplido | `06-anexo-avances-1-y-2-integrados.md` y el informe digital final. |
| Repositorio del proyecto | Cumplido | `https://github.com/alexandervarela95/appTrackingPaquetesAPA`, rama `presentacion-de-proyecto-final`. |
| Informe digital PDF | Cumplido | `01-informe-digital-proyecto-final-appTrackingPaquetesAPA.pdf`. |
| Presentación | Cumplido | `07-presentacion-defensa-proyecto-final.pdf`. |

## Criterios técnicos de evaluación

| Criterio | Estado | Evidencia dentro del proyecto |
| --- | --- | --- |
| Arquitectura y organización | Cumplido | Backend organizado en rutas, controladores, servicios, modelos, middlewares, validadores, utilidades, realtime y semillas. Frontend organizado en core, servicios, guards, interceptores, layout y features. |
| Funcionalidades por rol | Cumplido | Roles `administrador`, `motorista` y `usuario`; middleware de autenticación y autorización; documentación en `roles-permisos.md`. |
| Base de datos MongoDB | Cumplido | Modelos Mongoose para usuarios, lugares, estados, paquetes, tracking, incidencias, evidencias, auditoría y contador de guías. Diagrama en `04-diagrama-base-datos-appTrackingPaquetesAPA.pdf`. |
| Tiempo real | Cumplido | Socket.IO con eventos para dashboard, paquetes, tracking, incidencias, evidencias, catálogos y auditoría; adapter Redis cuando Redis está disponible. |
| Frontend Angular | Cumplido | Pantallas de login, dashboard, paquetes, nuevo paquete, consolidación, detalle, impresión, seguimiento, incidencias, evidencias, usuarios, lugares, estados, reportes y auditoría. |
| Backend y casos de uso | Cumplido | Servicios de aplicación para reglas de negocio y controladores que delegan lógica; endpoints documentados. |
| Testing y calidad | Cumplido | Pruebas backend con Jest y Supertest; build backend y frontend validados. |
| CI/CD | Cumplido básico | `.github/workflows/ci.yml` instala dependencias, compila backend, ejecuta pruebas backend y compila frontend. |

## Mínimos funcionales adicionales

| Requisito adicional | Cumplimiento |
| --- | --- |
| Mínimo 5 mantenimientos | Usuarios, lugares, estados, paquetes, tracking, incidencias y evidencias. |
| Mínimo 5 salidas de información | Dashboard, listado de paquetes, detalle de paquete, seguimiento por guía, reportes, hoja imprimible, auditoría y listados administrativos. |
| Aplicación web cliente-servidor | Angular consume API REST Express y eventos Socket.IO. |
| Tecnologías vistas en clase o de vanguardia | Angular, Node.js, Express, TypeScript, MongoDB, Redis, Socket.IO, JWT, Zod, Docker y GitHub Actions. |

## Resultado

La documentación final cubre los puntos solicitados para el Avance 3 y deja evidencia suficiente para defensa técnica, funcional y académica.

