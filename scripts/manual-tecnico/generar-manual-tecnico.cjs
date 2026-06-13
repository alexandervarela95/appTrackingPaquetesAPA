const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium } = requireFrontend('@playwright/test');

const salidaDir = path.join(raizProyecto, 'documentacion', 'manual-tecnico');
const htmlPath = path.join(salidaDir, 'manual-tecnico.html');
const pdfPath = path.join(salidaDir, 'manual-tecnico-appTrackingPaquetesAPA.pdf');
const previewPath = path.join(salidaDir, 'manual-tecnico-preview.png');

const logoPath = path.join(raizProyecto, 'frontend', 'public', 'assets', 'login', 'logoAPA.jpg');
const portadaPlantillaPath = path.join(raizProyecto, 'documentacion', 'manual-usuario', 'portada-template-image1.png');
const diagramaBaseDatosPath = path.join(raizProyecto, 'documentacion', 'base-datos', 'diagrama-base-datos-appTrackingPaquetesAPA.png');

function dataUri(filePath, mimeType) {
  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function construirHtml({ fecha, logoDataUri, portadaDataUri, dbDiagramDataUri }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Manual Técnico - appTrackingPaquetesAPA</title>
  <style>
    @page { size: Letter; margin: 0.64in 0.62in 0.7in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #172033;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.43;
      background: #ffffff;
    }
    .template-cover {
      min-height: 9.3in;
      position: relative;
      padding: 0.62in 0.72in 0.55in;
      overflow: hidden;
      page-break-after: always;
      background: #ffffff;
    }
    .template-cover > div { position: relative; z-index: 2; }
    .template-cover .brand {
      color: #118ed7;
      font-size: 28pt;
      line-height: 1;
      font-weight: 800;
      text-transform: uppercase;
    }
    .template-cover .main-title {
      width: 3.9in;
      margin-top: 1.05in;
      color: #07133d;
      font-size: 24pt;
      line-height: 1.14;
      font-weight: 800;
      text-transform: uppercase;
    }
    .template-cover .system-title {
      width: 3.0in;
      margin-top: 0.36in;
      color: #080b35;
      font-size: 15.5pt;
      line-height: 1.18;
      font-weight: 800;
      text-transform: uppercase;
    }
    .template-cover .author {
      width: 3.15in;
      margin-top: 0.42in;
      color: #89899c;
      font-size: 10.8pt;
      line-height: 1.55;
      font-weight: 700;
    }
    .template-cover .template-image {
      position: absolute;
      right: -0.35in;
      bottom: 0.58in;
      width: 5.05in;
      height: auto;
      z-index: 1;
    }
    .template-cover .footer-brand {
      position: absolute;
      left: 0.72in;
      bottom: 0.42in;
      color: #8a8a9a;
      font-size: 13pt;
      font-style: italic;
      font-weight: 800;
      text-transform: uppercase;
    }
    .template-cover .footer-tagline {
      position: absolute;
      left: 0.72in;
      bottom: 0.24in;
      color: #8a8a9a;
      font-size: 5.5pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1, h2, h3 { page-break-after: avoid; letter-spacing: 0; }
    h1 {
      margin: 0 0 0.12in;
      color: #07133d;
      font-size: 24pt;
      line-height: 1.1;
    }
    h2 {
      margin: 0.28in 0 0.1in;
      color: #0f172a;
      font-size: 16.5pt;
      border-bottom: 2px solid #118ed7;
      padding-bottom: 0.05in;
    }
    h3 {
      margin: 0.18in 0 0.06in;
      color: #0f4c81;
      font-size: 12.2pt;
    }
    p { margin: 0 0 0.09in; font-size: 9.8pt; }
    ul, ol { margin-top: 0.04in; padding-left: 0.24in; }
    li { margin-bottom: 0.04in; font-size: 9.6pt; }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.7pt;
      background: #eef2f7;
      padding: 0.01in 0.04in;
      border-radius: 3px;
    }
    pre {
      margin: 0.1in 0 0.14in;
      padding: 0.12in;
      background: #0f172a;
      color: #e5eefc;
      border-radius: 8px;
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.2pt;
      line-height: 1.38;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.1in 0 0.16in;
      font-size: 8.9pt;
      page-break-inside: avoid;
    }
    th {
      background: #0f4c81;
      color: #ffffff;
      text-align: left;
      padding: 0.07in;
      border: 1px solid #0f4c81;
    }
    td {
      border: 1px solid #d7dee8;
      padding: 0.07in;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    .toc {
      columns: 2;
      column-gap: 0.3in;
      margin-bottom: 0.18in;
    }
    .toc li { break-inside: avoid; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.11in;
      margin: 0.16in 0;
    }
    .meta {
      border: 1px solid #d8e2ee;
      border-radius: 8px;
      padding: 0.11in 0.13in;
      background: #fbfdff;
      min-height: 0.58in;
    }
    .meta span {
      display: block;
      color: #64748b;
      font-size: 7.8pt;
      text-transform: uppercase;
      font-weight: 800;
    }
    .meta strong {
      display: block;
      margin-top: 0.03in;
      color: #111827;
      font-size: 9.8pt;
    }
    .callout {
      margin: 0.12in 0;
      padding: 0.12in 0.15in;
      border-left: 5px solid #118ed7;
      background: #eff6ff;
      color: #183b66;
      border-radius: 6px;
      page-break-inside: avoid;
    }
    .warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
      color: #78350f;
    }
    .success {
      border-left-color: #059669;
      background: #ecfdf5;
      color: #064e3b;
    }
    .page-break { page-break-before: always; }
    .diagram {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 0.14in;
      background: #ffffff;
      margin: 0.12in 0 0.18in;
      page-break-inside: avoid;
    }
    .architecture {
      display: grid;
      grid-template-columns: 1fr 0.32in 1fr 0.32in 1fr;
      gap: 0.06in;
      align-items: center;
      margin: 0.16in 0;
      page-break-inside: avoid;
    }
    .arch-box {
      border: 1.5px solid #0f4c81;
      border-radius: 8px;
      padding: 0.12in;
      min-height: 0.9in;
      background: #f8fbff;
      text-align: center;
    }
    .arch-box strong {
      display: block;
      color: #07133d;
      margin-bottom: 0.05in;
      font-size: 10.5pt;
    }
    .arrow {
      text-align: center;
      font-weight: 800;
      color: #0f4c81;
      font-size: 16pt;
    }
    .db-diagram {
      width: 100%;
      display: block;
      border: 1px solid #d7dee8;
    }
    .footer-logo {
      display: block;
      width: 1.45in;
      height: auto;
      margin: 0.2in auto 0;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <main class="template-cover">
    <div class="brand">ALMACEN PAJARO AZUL</div>
    <div class="main-title">MANUAL TÉCNICO</div>
    <div class="system-title">SISTEMA DE TRACKING<br />DE PAQUETES<br />APPTRACKINGPAQUETESAPA</div>
    <div class="author">
      Ing. Alexander Varela<br />
      Desarrollo de Aplicaciones de Vanguardia<br />
      ${fecha}
    </div>
    <img class="template-image" src="${portadaDataUri}" alt="Almacen Pajaro Azul" />
    <div class="footer-brand">PAJARO AZUL</div>
    <div class="footer-tagline">PASION POR LA MUSICA</div>
  </main>

  <section>
    <h1>Manual Técnico</h1>
    <p>Este documento consolida la documentación técnica necesaria para instalar, ejecutar, validar, mantener y defender el sistema <strong>appTrackingPaquetesAPA</strong>. Está orientado a personal de sistemas, docentes evaluadores y responsables técnicos del proyecto.</p>
    <div class="meta-grid">
      <div class="meta"><span>Proyecto</span><strong>appTrackingPaquetesAPA</strong></div>
      <div class="meta"><span>Tipo de solución</span><strong>Aplicación web cliente-servidor</strong></div>
      <div class="meta"><span>Backend</span><strong>Node.js, Express, TypeScript</strong></div>
      <div class="meta"><span>Frontend</span><strong>Angular standalone</strong></div>
      <div class="meta"><span>Base de datos</span><strong>MongoDB con Mongoose</strong></div>
      <div class="meta"><span>Infraestructura local</span><strong>Docker Compose, MongoDB y Redis</strong></div>
    </div>
  </section>

  <section>
    <h2>Índice</h2>
    <ol class="toc">
      <li>Propósito y alcance</li>
      <li>Resumen del sistema</li>
      <li>Arquitectura general</li>
      <li>Tecnologías utilizadas</li>
      <li>Estructura del repositorio</li>
      <li>Requisitos de instalación</li>
      <li>Variables de entorno</li>
      <li>Ejecución local</li>
      <li>Backend</li>
      <li>Frontend</li>
      <li>Modelo de datos</li>
      <li>API REST</li>
      <li>Seguridad y roles</li>
      <li>Tiempo real</li>
      <li>Auditoría</li>
      <li>Reportes</li>
      <li>Evidencias y archivos</li>
      <li>Pruebas</li>
      <li>CI/CD</li>
      <li>Backups y restauración</li>
      <li>Despliegue sugerido</li>
      <li>Solución de problemas</li>
      <li>Anexos</li>
    </ol>
  </section>

  <section>
    <h2>1. Propósito y Alcance</h2>
    <p>El sistema permite registrar paquetes internos, dar seguimiento por número de guía, administrar catálogos operativos, registrar incidencias, subir evidencias, consultar reportes y mantener auditoría de acciones relevantes.</p>
    <p>El alcance técnico incluye backend API REST, frontend Angular, persistencia en MongoDB, caché y mensajería auxiliar con Redis, comunicación en tiempo real con Socket.IO, autenticación JWT, autorización por roles y pipeline de validación en GitHub Actions.</p>
    <div class="callout">
      <strong>Alcance de este manual:</strong> instalación local, configuración, arquitectura, componentes, comandos, validaciones, mantenimiento, respaldo y criterios técnicos para defensa del Avance 3.
    </div>
  </section>

  <section>
    <h2>2. Resumen del Sistema</h2>
    <table>
      <thead><tr><th>Área</th><th>Descripción</th></tr></thead>
      <tbody>
        <tr><td>Gestión de paquetes</td><td>Alta, consulta, actualización y control de paquetes con número de guía.</td></tr>
        <tr><td>Tracking</td><td>Historial de avances por paquete y por guía.</td></tr>
        <tr><td>Incidencias</td><td>Registro de problemas operativos asociados a un paquete.</td></tr>
        <tr><td>Evidencias</td><td>Carga y consulta de archivos JPG, PNG y PDF relacionados con el proceso.</td></tr>
        <tr><td>Reportes</td><td>Salidas de información para paquetes por estado, incidencias y actividad.</td></tr>
        <tr><td>Auditoría</td><td>Registro de acciones relevantes para trazabilidad administrativa.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>3. Arquitectura General</h2>
    <p>La aplicación sigue una separación clara entre cliente, servidor y servicios de infraestructura. El frontend consume la API del backend. El backend aplica reglas de negocio y persiste información en MongoDB. Redis se utiliza como soporte para caché y tiempo real, con tolerancia a fallo para no bloquear la operación principal.</p>
    <div class="architecture">
      <div class="arch-box"><strong>Frontend Angular</strong>Login, dashboard, paquetes, tracking, incidencias, evidencias, reportes y auditoría.</div>
      <div class="arrow">→</div>
      <div class="arch-box"><strong>Backend Express</strong>API REST, validaciones, seguridad, servicios, auditoría y eventos en tiempo real.</div>
      <div class="arrow">→</div>
      <div class="arch-box"><strong>Datos e Infraestructura</strong>MongoDB, Redis, almacenamiento local de evidencias y Docker Compose.</div>
    </div>
    <h3>Capas del backend</h3>
    <table>
      <thead><tr><th>Capa</th><th>Carpeta</th><th>Responsabilidad</th></tr></thead>
      <tbody>
        <tr><td>Configuración</td><td><code>backend/src/config</code></td><td>Variables de entorno, conexión a MongoDB y Redis.</td></tr>
        <tr><td>Rutas</td><td><code>backend/src/rutas</code></td><td>Definición de endpoints REST.</td></tr>
        <tr><td>Controladores</td><td><code>backend/src/controladores</code></td><td>Reciben solicitudes HTTP y delegan al servicio correspondiente.</td></tr>
        <tr><td>Servicios</td><td><code>backend/src/servicios</code></td><td>Reglas de negocio, persistencia y operaciones principales.</td></tr>
        <tr><td>Modelos</td><td><code>backend/src/modelos</code></td><td>Esquemas Mongoose y definición de índices.</td></tr>
        <tr><td>Middlewares</td><td><code>backend/src/middlewares</code></td><td>Autenticación, roles, validación, subida de archivos y errores.</td></tr>
        <tr><td>Validadores</td><td><code>backend/src/validadores</code></td><td>Esquemas Zod para validar entradas.</td></tr>
        <tr><td>Tiempo real</td><td><code>backend/src/realtime</code></td><td>Socket.IO, rooms, eventos y Redis adapter con fallback.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>4. Tecnologías Utilizadas</h2>
    <table>
      <thead><tr><th>Componente</th><th>Tecnología</th><th>Uso</th></tr></thead>
      <tbody>
        <tr><td>Backend</td><td>Node.js, Express, TypeScript</td><td>Servidor API y lógica de negocio tipada.</td></tr>
        <tr><td>Base de datos</td><td>MongoDB, Mongoose</td><td>Persistencia documental, esquemas e índices.</td></tr>
        <tr><td>Caché / soporte</td><td>Redis</td><td>Caché operativo y soporte para tiempo real.</td></tr>
        <tr><td>Autenticación</td><td>JWT, bcryptjs</td><td>Sesiones seguras y contraseñas cifradas.</td></tr>
        <tr><td>Validación</td><td>Zod</td><td>Validación de entradas antes de procesarlas.</td></tr>
        <tr><td>Archivos</td><td>Multer</td><td>Carga de evidencias.</td></tr>
        <tr><td>Tiempo real</td><td>Socket.IO</td><td>Notificación de cambios relevantes.</td></tr>
        <tr><td>Frontend</td><td>Angular, RxJS, PrimeNG, SCSS</td><td>Interfaz web, rutas, formularios y servicios HTTP.</td></tr>
        <tr><td>Pruebas</td><td>Jest, Supertest, Playwright</td><td>Pruebas backend y base E2E frontend.</td></tr>
        <tr><td>CI/CD</td><td>GitHub Actions</td><td>Build y pruebas automáticas en la rama principal.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>5. Estructura del Repositorio</h2>
    <pre>appTrackingPaquetesAPA/
  backend/                 API REST, Socket.IO, modelos, servicios y pruebas
  frontend/                Aplicación Angular y pruebas E2E
  documentacion/           Manuales, diagramas, estado del proyecto y guías
  scripts/backup/          Scripts de respaldo y restauración
  docker-compose.yml       MongoDB y Redis para entorno local
  .github/workflows/ci.yml Pipeline de validación automática</pre>
    <p>La estructura separa responsabilidades y facilita la defensa técnica: backend y frontend pueden compilarse, probarse y desplegarse como componentes independientes.</p>
  </section>

  <section>
    <h2>6. Requisitos de Instalación</h2>
    <table>
      <thead><tr><th>Requisito</th><th>Versión / condición recomendada</th><th>Uso</th></tr></thead>
      <tbody>
        <tr><td>Node.js</td><td>22.x recomendado para CI</td><td>Instalación de dependencias y ejecución de backend/frontend.</td></tr>
        <tr><td>npm</td><td>Incluido con Node.js</td><td>Gestión de paquetes y scripts.</td></tr>
        <tr><td>Docker Desktop</td><td>Activo antes de ejecutar la app</td><td>Levantar MongoDB y Redis.</td></tr>
        <tr><td>Git</td><td>Configurado con acceso al repositorio</td><td>Clonar, versionar y publicar cambios.</td></tr>
        <tr><td>Navegador</td><td>Chrome, Edge o equivalente</td><td>Uso de la aplicación web.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>7. Variables de Entorno</h2>
    <p>El backend utiliza <code>backend/.env</code>. El archivo base es <code>backend/.env.example</code>.</p>
    <pre>NODE_ENV=development
PUERTO=4300
PORT=4300
MONGO_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
MONGODB_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGINS=http://localhost:3180
FRONTEND_URL=http://localhost:3180
UPLOAD_DIR=uploads/evidencias
JWT_SECRET=cambiar_esta_clave_en_produccion
JWT_EXPIRES_IN=1d</pre>
    <div class="warning callout">
      <strong>Importante:</strong> en producción, <code>JWT_SECRET</code> debe ser una clave segura y no debe versionarse. Los secretos deben administrarse con variables de entorno del servidor o del proveedor cloud.
    </div>
  </section>

  <section>
    <h2>8. Ejecución Local</h2>
    <h3>8.1 Levantar infraestructura</h3>
    <pre>docker compose up -d</pre>
    <h3>8.2 Backend</h3>
    <pre>cd backend
npm install
copy .env.example .env
npm run seed:demo
npm run dev</pre>
    <h3>8.3 Frontend</h3>
    <pre>cd frontend
npm install
npm start</pre>
    <h3>8.4 URLs locales</h3>
    <table>
      <thead><tr><th>Servicio</th><th>URL</th><th>Uso</th></tr></thead>
      <tbody>
        <tr><td>Frontend</td><td><code>http://localhost:3180/login</code></td><td>Acceso a la aplicación.</td></tr>
        <tr><td>Backend salud</td><td><code>http://localhost:4300/api/salud</code></td><td>Validar que la API responde.</td></tr>
        <tr><td>MongoDB</td><td><code>localhost:27017</code></td><td>Base de datos local.</td></tr>
        <tr><td>Redis</td><td><code>localhost:6379</code></td><td>Caché y soporte de eventos.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>9. Backend</h2>
    <p>El backend expone una API REST protegida por JWT. Su entrada principal es <code>src/servidor.ts</code>, que conecta MongoDB, Redis y configura Socket.IO sobre el servidor HTTP.</p>
    <h3>Scripts principales</h3>
    <table>
      <thead><tr><th>Comando</th><th>Descripción</th></tr></thead>
      <tbody>
        <tr><td><code>npm run dev</code></td><td>Ejecuta el backend en modo desarrollo con recarga.</td></tr>
        <tr><td><code>npm run build</code></td><td>Compila TypeScript usando <code>tsconfig.build.json</code>.</td></tr>
        <tr><td><code>npm start</code></td><td>Ejecuta el backend compilado desde <code>dist/</code>.</td></tr>
        <tr><td><code>npm run seed:demo</code></td><td>Carga datos demo idempotentes.</td></tr>
        <tr><td><code>npm test</code></td><td>Ejecuta pruebas con Jest.</td></tr>
      </tbody>
    </table>
    <h3>Servicios principales</h3>
    <table>
      <thead><tr><th>Servicio</th><th>Responsabilidad</th></tr></thead>
      <tbody>
        <tr><td><code>auth.servicio.ts</code></td><td>Login, validación de contraseña y emisión de JWT.</td></tr>
        <tr><td><code>paquete.servicio.ts</code></td><td>Registro, consulta y actualización de paquetes.</td></tr>
        <tr><td><code>tracking.servicio.ts</code></td><td>Historial de avances por paquete y guía.</td></tr>
        <tr><td><code>incidencia.servicio.ts</code></td><td>Gestión de incidencias operativas.</td></tr>
        <tr><td><code>evidencia.servicio.ts</code></td><td>Carga y consulta de evidencias.</td></tr>
        <tr><td><code>dashboard.servicio.ts</code></td><td>Resumen operativo del tablero.</td></tr>
        <tr><td><code>auditLog.servicio.ts</code></td><td>Registro de acciones auditables.</td></tr>
        <tr><td><code>reporte.servicio.ts</code></td><td>Consultas agregadas para reportes.</td></tr>
        <tr><td><code>accesoPaquete.servicio.ts</code></td><td>Control por rol y propiedad del paquete.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>10. Frontend</h2>
    <p>El frontend está construido con Angular standalone. Utiliza rutas protegidas, servicios HTTP, interceptor de token, componentes por módulo funcional y conexión al canal de tiempo real.</p>
    <h3>Rutas visibles</h3>
    <table>
      <thead><tr><th>Ruta</th><th>Pantalla</th></tr></thead>
      <tbody>
        <tr><td><code>/login</code></td><td>Inicio de sesión.</td></tr>
        <tr><td><code>/dashboard</code></td><td>Resumen operativo.</td></tr>
        <tr><td><code>/paquetes</code></td><td>Listado y búsqueda de paquetes.</td></tr>
        <tr><td><code>/paquetes/nuevo</code></td><td>Registro de paquete.</td></tr>
        <tr><td><code>/paquetes/:id</code></td><td>Detalle del paquete.</td></tr>
        <tr><td><code>/tracking/:numeroGuia</code></td><td>Seguimiento por guía.</td></tr>
        <tr><td><code>/incidencias</code></td><td>Gestión de incidencias.</td></tr>
        <tr><td><code>/evidencias</code></td><td>Carga y consulta de evidencias.</td></tr>
        <tr><td><code>/usuarios</code></td><td>Administración de usuarios.</td></tr>
        <tr><td><code>/lugares</code></td><td>Administración de lugares.</td></tr>
        <tr><td><code>/estados</code></td><td>Administración de estados.</td></tr>
        <tr><td><code>/reportes</code></td><td>Salidas de información.</td></tr>
        <tr><td><code>/auditoria</code></td><td>Registro de auditoría.</td></tr>
      </tbody>
    </table>
    <h3>Scripts principales</h3>
    <pre>npm start      # ng serve --port 3180 --proxy-config proxy.conf.json
npm run build  # build de producción
npm run e2e    # pruebas Playwright</pre>
  </section>

  <section class="page-break">
    <h2>11. Modelo de Datos</h2>
    <p>MongoDB almacena documentos por colección. Mongoose define esquemas, validaciones básicas e índices. La colección central es <code>Paquete</code>, relacionada con usuarios, lugares, estados, tracking, incidencias y evidencias.</p>
    <table>
      <thead><tr><th>Colección</th><th>Uso</th><th>Relaciones principales</th></tr></thead>
      <tbody>
        <tr><td><code>usuarios</code></td><td>Empleados, motoristas y administradores.</td><td>Lugar asignado, paquetes, tracking, incidencias, evidencias y auditoría.</td></tr>
        <tr><td><code>lugares</code></td><td>Bodegas, sucursales y destinos.</td><td>Origen, destino y ubicación actual.</td></tr>
        <tr><td><code>estados</code></td><td>Flujo del paquete.</td><td>Estado actual y estado de tracking.</td></tr>
        <tr><td><code>paquetes</code></td><td>Registro central del envío.</td><td>Usuarios, lugares, estado, tracking, incidencias y evidencias.</td></tr>
        <tr><td><code>trackings</code></td><td>Historial de avances.</td><td>Paquete, estado, lugar y usuario responsable.</td></tr>
        <tr><td><code>incidencias</code></td><td>Problemas o eventos de seguimiento.</td><td>Paquete y usuario que reporta.</td></tr>
        <tr><td><code>evidencias</code></td><td>Archivos de respaldo.</td><td>Paquete y usuario que reporta.</td></tr>
        <tr><td><code>auditlogs</code></td><td>Trazabilidad administrativa.</td><td>Usuario, entidad, acción y metadatos.</td></tr>
      </tbody>
    </table>
    <div class="diagram">
      <img class="db-diagram" src="${dbDiagramDataUri}" alt="Diagrama de base de datos appTrackingPaquetesAPA" />
    </div>
  </section>

  <section>
    <h2>12. API REST</h2>
    <p>La API utiliza la base <code>/api</code>. Los endpoints protegidos requieren encabezado <code>Authorization: Bearer &lt;token&gt;</code>.</p>
    <table>
      <thead><tr><th>Módulo</th><th>Endpoints principales</th><th>Roles</th></tr></thead>
      <tbody>
        <tr><td>Salud</td><td><code>GET /salud</code></td><td>Público</td></tr>
        <tr><td>Auth</td><td><code>POST /auth/login</code></td><td>Público</td></tr>
        <tr><td>Dashboard</td><td><code>GET /dashboard/resumen</code></td><td>Administrador</td></tr>
        <tr><td>Usuarios</td><td><code>GET/POST/PUT/DELETE /usuarios</code></td><td>Administrador</td></tr>
        <tr><td>Lugares</td><td><code>GET/POST/PUT/DELETE /lugares</code></td><td>Autenticado / Administrador</td></tr>
        <tr><td>Estados</td><td><code>GET/POST/PUT/DELETE /estados</code></td><td>Autenticado / Administrador</td></tr>
        <tr><td>Paquetes</td><td><code>GET /paquetes</code>, <code>POST /paquetes</code>, <code>PUT /paquetes/:id</code></td><td>Según rol y propiedad</td></tr>
        <tr><td>Tracking</td><td><code>GET /tracking/guia/:numeroGuia</code>, <code>POST /tracking</code></td><td>Autenticado / Motorista / Administrador</td></tr>
        <tr><td>Incidencias</td><td><code>GET /incidencias</code>, <code>POST /incidencias</code></td><td>Administrador / Usuario / Motorista</td></tr>
        <tr><td>Evidencias</td><td><code>GET /evidencias</code>, <code>POST /evidencias/upload</code></td><td>Autenticado</td></tr>
        <tr><td>Reportes</td><td><code>GET /reportes/*</code></td><td>Administrador</td></tr>
        <tr><td>Auditoría</td><td><code>GET /auditoria</code></td><td>Administrador</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>13. Seguridad y Roles</h2>
    <table>
      <thead><tr><th>Mecanismo</th><th>Implementación</th><th>Objetivo</th></tr></thead>
      <tbody>
        <tr><td>JWT</td><td><code>auth.middleware.ts</code> e interceptor frontend</td><td>Proteger rutas internas y endpoints privados.</td></tr>
        <tr><td>Bcrypt</td><td><code>auth.servicio.ts</code></td><td>Comparar contraseñas cifradas.</td></tr>
        <tr><td>Roles</td><td><code>rolMiddleware.ts</code></td><td>Limitar acciones administrativas u operativas.</td></tr>
        <tr><td>Propiedad de recurso</td><td><code>accesoPaquete.servicio.ts</code></td><td>Evitar que usuarios consulten paquetes no relacionados.</td></tr>
        <tr><td>Helmet y CORS</td><td><code>app.ts</code></td><td>Endurecer cabeceras HTTP y controlar orígenes.</td></tr>
        <tr><td>Rate limit</td><td><code>rateLimitMiddleware.ts</code></td><td>Reducir abuso en endpoints sensibles.</td></tr>
        <tr><td>Zod</td><td><code>validadores/</code></td><td>Validar entradas y devolver errores consistentes.</td></tr>
      </tbody>
    </table>
    <div class="success callout">
      El diseño protege tanto rutas frontend como endpoints backend. La seguridad real se aplica en el servidor; el frontend solo mejora la experiencia de navegación.
    </div>
  </section>

  <section>
    <h2>14. Tiempo Real</h2>
    <p>Socket.IO permite notificar cambios relevantes a pantallas abiertas. El backend autentica la conexión mediante JWT y organiza clientes por salas como usuario, rol, paquete y guía.</p>
    <table>
      <thead><tr><th>Evento</th><th>Uso esperado</th></tr></thead>
      <tbody>
        <tr><td><code>dashboard:updated</code></td><td>Actualizar métricas del tablero.</td></tr>
        <tr><td><code>package:created</code></td><td>Notificar creación de paquete.</td></tr>
        <tr><td><code>package:updated</code></td><td>Notificar actualización de paquete.</td></tr>
        <tr><td><code>tracking:created</code></td><td>Actualizar historial de seguimiento.</td></tr>
        <tr><td><code>incidence:created</code></td><td>Notificar incidencia nueva.</td></tr>
        <tr><td><code>evidence:created</code></td><td>Notificar evidencia nueva.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>15. Auditoría</h2>
    <p>La auditoría registra acciones sensibles con usuario, rol, acción, entidad, descripción, IP, user agent, metadatos y fecha. Esto permite rastrear cambios y apoyar la defensa del control administrativo.</p>
    <p>Eventos auditables: login exitoso/fallido, creación y actualización de entidades, cambios en paquetes, tracking, incidencias, evidencias y operaciones administrativas.</p>
  </section>

  <section>
    <h2>16. Reportes</h2>
    <table>
      <thead><tr><th>Reporte</th><th>Objetivo</th></tr></thead>
      <tbody>
        <tr><td>Paquetes por estado</td><td>Conocer distribución operativa del flujo de paquetes.</td></tr>
        <tr><td>Incidencias</td><td>Revisar casos abiertos, en proceso o cerrados.</td></tr>
        <tr><td>Actividad reciente</td><td>Evaluar movimientos y acciones recientes del sistema.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>17. Evidencias y Archivos</h2>
    <p>Las evidencias se cargan con Multer y se almacenan bajo la ruta configurada en <code>UPLOAD_DIR</code>. El modelo guarda tipo, descripción, ruta del archivo, paquete, guía, usuario que reporta y fecha.</p>
    <table>
      <thead><tr><th>Control</th><th>Detalle</th></tr></thead>
      <tbody>
        <tr><td>Formatos permitidos</td><td>JPG, JPEG, PNG y PDF.</td></tr>
        <tr><td>Asociación</td><td>La evidencia queda relacionada con un paquete y un número de guía.</td></tr>
        <tr><td>Acceso</td><td>La descarga valida permisos sobre el paquete relacionado.</td></tr>
        <tr><td>Producción</td><td>Se recomienda migrar a almacenamiento externo como S3, Azure Blob o equivalente.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>18. Pruebas y Validación</h2>
    <h3>Backend</h3>
    <pre>cd backend
npm run build
npm test -- --runInBand</pre>
    <p>Las pruebas cubren salud de API, autenticación, paquetes y acceso por propiedad de recurso.</p>
    <h3>Frontend</h3>
    <pre>cd frontend
npm run build
npm run e2e</pre>
    <p>El build valida que Angular compile correctamente. Las pruebas E2E requieren backend, frontend y datos demo activos.</p>
    <h3>Validación manual mínima</h3>
    <ol>
      <li>Levantar Docker, backend y frontend.</li>
      <li>Entrar con <code>Sistemas / Sistemas*2026</code>.</li>
      <li>Revisar dashboard, paquetes, tracking, incidencias, evidencias, reportes y auditoría.</li>
      <li>Crear un paquete de prueba y verificar que aparezca en listado y tracking.</li>
      <li>Registrar una incidencia y una evidencia.</li>
    </ol>
  </section>

  <section>
    <h2>19. CI/CD</h2>
    <p>El repositorio cuenta con workflow de GitHub Actions en <code>.github/workflows/ci.yml</code>. Se ejecuta en push y pull request hacia <code>main</code>.</p>
    <table>
      <thead><tr><th>Paso</th><th>Acción</th></tr></thead>
      <tbody>
        <tr><td>Checkout</td><td>Descarga el repositorio.</td></tr>
        <tr><td>Setup Node.js</td><td>Configura Node 22 y caché de npm.</td></tr>
        <tr><td>Backend install</td><td>Ejecuta <code>npm ci</code> en backend.</td></tr>
        <tr><td>Backend build</td><td>Ejecuta <code>npm run build</code>.</td></tr>
        <tr><td>Backend test</td><td>Ejecuta <code>npm test -- --runInBand</code>.</td></tr>
        <tr><td>Frontend install</td><td>Ejecuta <code>npm ci</code> en frontend.</td></tr>
        <tr><td>Frontend build</td><td>Ejecuta <code>npm run build</code>.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>20. Backups y Restauración</h2>
    <p>El proyecto incluye scripts en <code>scripts/backup/</code> para respaldar y restaurar MongoDB. La estrategia recomendada es respaldar antes de cambios importantes, despliegues o pruebas destructivas.</p>
    <pre>scripts\\backup\\mongo-backup.cmd
scripts\\backup\\mongo-restore.cmd</pre>
    <div class="warning callout">
      Antes de una defensa o presentación, se recomienda probar restauración en una base temporal para confirmar que el respaldo es utilizable.
    </div>
  </section>

  <section>
    <h2>21. Despliegue Sugerido</h2>
    <table>
      <thead><tr><th>Elemento</th><th>Recomendación para producción</th></tr></thead>
      <tbody>
        <tr><td>Frontend</td><td>Compilar con <code>npm run build</code> y servir desde Nginx, Apache o hosting estático.</td></tr>
        <tr><td>Backend</td><td>Ejecutar <code>npm run build</code> y <code>npm start</code> bajo PM2, systemd o contenedor.</td></tr>
        <tr><td>Dominio y TLS</td><td>Usar HTTPS obligatorio con certificado válido.</td></tr>
        <tr><td>Proxy reverso</td><td>Nginx o equivalente para enrutar API, frontend y Socket.IO.</td></tr>
        <tr><td>Secretos</td><td>Variables seguras fuera del repositorio.</td></tr>
        <tr><td>Archivos</td><td>Almacenamiento externo para evidencias.</td></tr>
        <tr><td>Observabilidad</td><td>Logs centralizados, métricas y alertas.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>22. Solución de Problemas</h2>
    <table>
      <thead><tr><th>Problema</th><th>Causa probable</th><th>Acción sugerida</th></tr></thead>
      <tbody>
        <tr><td>Backend no inicia</td><td>MongoDB no disponible o variables incompletas.</td><td>Revisar Docker, <code>.env</code> y <code>/api/salud</code>.</td></tr>
        <tr><td>Frontend no carga datos</td><td>Backend apagado o proxy no configurado.</td><td>Confirmar backend en puerto 4300 y reiniciar <code>npm start</code>.</td></tr>
        <tr><td>Login falla</td><td>Credenciales incorrectas o seed no ejecutado.</td><td>Ejecutar <code>npm run seed:demo</code> y probar usuario Sistemas.</td></tr>
        <tr><td>Evidencias no suben</td><td>Archivo no permitido o carpeta sin permisos.</td><td>Usar JPG, PNG o PDF y revisar <code>UPLOAD_DIR</code>.</td></tr>
        <tr><td>Tiempo real no actualiza</td><td>Socket.IO o Redis no disponible.</td><td>Revisar consola, proxy <code>/socket.io</code> y estado de Redis.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>23. Anexos</h2>
    <h3>Anexo A. Comandos de referencia</h3>
    <pre>docker compose up -d
docker compose ps

cd backend
npm run build
npm test -- --runInBand
npm run seed:demo
npm run dev

cd frontend
npm run build
npm start
npm run e2e</pre>
    <h3>Anexo B. Credenciales demo</h3>
    <table>
      <thead><tr><th>Campo</th><th>Valor</th></tr></thead>
      <tbody>
        <tr><td>Usuario visible</td><td><code>Sistemas</code></td></tr>
        <tr><td>Correo API</td><td><code>sistemas@pajaroazul.local</code></td></tr>
        <tr><td>Contraseña</td><td><code>Sistemas*2026</code></td></tr>
        <tr><td>Rol</td><td><code>administrador</code></td></tr>
      </tbody>
    </table>
    <h3>Anexo C. Criterios de listo técnico</h3>
    <ul>
      <li>Docker levanta MongoDB y Redis sin conflicto de puertos.</li>
      <li>Backend compila y responde en <code>/api/salud</code>.</li>
      <li>Frontend compila y permite login.</li>
      <li>Seed demo crea datos iniciales sin duplicar registros.</li>
      <li>CRUD principal, tracking, incidencias, evidencias, reportes y auditoría funcionan.</li>
      <li>GitHub Actions valida build y pruebas en <code>main</code>.</li>
    </ul>
  </section>

  <footer><img class="footer-logo" src="${logoDataUri}" alt="Pajaro Azul" /></footer>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(salidaDir, { recursive: true });

  const fecha = new Intl.DateTimeFormat('es-HN', {
    dateStyle: 'long',
    timeZone: 'America/Tegucigalpa',
  }).format(new Date());

  const logoDataUri = dataUri(logoPath, 'image/jpeg');
  const portadaDataUri = dataUri(portadaPlantillaPath, 'image/png');
  const dbDiagramDataUri = dataUri(diagramaBaseDatosPath, 'image/png');

  fs.writeFileSync(htmlPath, construirHtml({ fecha, logoDataUri, portadaDataUri, dbDiagramDataUri }), 'utf8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath.replaceAll(path.sep, '/')}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: previewPath, fullPage: false });
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      `<div style="width:100%; padding:0 0.62in; display:flex; align-items:center; justify-content:space-between; font-family: Segoe UI, Arial, sans-serif; font-size:8px; color:#64748b;"><img src="${logoDataUri}" style="height:16px; width:auto;" /><span>Pagina <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`,
    margin: { top: '0.5in', right: '0.62in', bottom: '0.62in', left: '0.62in' },
  });
  await browser.close();

  console.log(JSON.stringify({ pdfPath, htmlPath, previewPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
