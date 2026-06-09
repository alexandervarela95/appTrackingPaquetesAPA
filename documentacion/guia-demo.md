# Guia Demo

1. Clonar el repositorio.
2. Ejecutar `docker compose up -d`.
3. Entrar a `backend/`.
4. Ejecutar `npm install`.
5. Copiar `.env.example` a `.env`.
6. Ejecutar `npm run seed:demo`.
7. Levantar backend con `PUERTO=4300 CORS_ORIGINS=http://localhost:3180 npm run dev`.
8. Entrar a `frontend/`.
9. Ejecutar `npm install`.
10. Levantar frontend con `npm start`.
11. Abrir `http://localhost:3180/login`.
12. Login: `Sistemas / Sistemas*2026`.
13. Revisar dashboard.
14. Abrir paquetes y buscar `APA-DEMO-2026`.
15. Crear un paquete nuevo.
16. Entrar al detalle y cambiar estado.
17. Revisar tracking por guia.
18. Crear incidencia.
19. Subir evidencia PDF/JPG/PNG.
20. Revisar usuarios, lugares y estados.
21. Cerrar sesion.
22. Intentar entrar a `/dashboard` sin token y confirmar redireccion a login.
