// Genera el informe final HTML a partir de la informacion documentada del proyecto.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium } = requireFrontend('@playwright/test');

const salidaDir = path.join(raizProyecto, 'documentacion', 'informe-final');
const htmlPath = path.join(salidaDir, 'informe-final-avance-3.html');
const pdfPath = path.join(salidaDir, 'informe-final-avance-3-appTrackingPaquetesAPA.pdf');
const previewPath = path.join(salidaDir, 'informe-final-preview.png');

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
  <title>Informe Final Avance 3 - appTrackingPaquetesAPA</title>
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
    .brand {
      color: #118ed7;
      font-size: 28pt;
      line-height: 1;
      font-weight: 800;
      text-transform: uppercase;
    }
    .main-title {
      width: 3.95in;
      margin-top: 1.02in;
      color: #07133d;
      font-size: 23pt;
      line-height: 1.14;
      font-weight: 800;
      text-transform: uppercase;
    }
    .system-title {
      width: 3.15in;
      margin-top: 0.36in;
      color: #080b35;
      font-size: 15.5pt;
      line-height: 1.18;
      font-weight: 800;
      text-transform: uppercase;
    }
    .author {
      width: 3.3in;
      margin-top: 0.42in;
      color: #89899c;
      font-size: 10.8pt;
      line-height: 1.55;
      font-weight: 700;
    }
    .template-image {
      position: absolute;
      right: -0.35in;
      bottom: 0.58in;
      width: 5.05in;
      height: auto;
      z-index: 1;
    }
    .footer-brand {
      position: absolute;
      left: 0.72in;
      bottom: 0.42in;
      color: #8a8a9a;
      font-size: 13pt;
      font-style: italic;
      font-weight: 800;
      text-transform: uppercase;
    }
    .footer-tagline {
      position: absolute;
      left: 0.72in;
      bottom: 0.24in;
      color: #8a8a9a;
      font-size: 5.5pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .template-cover .footer-brand {
      position: absolute;
      z-index: 2;
    }
    .template-cover .footer-tagline {
      position: absolute;
      z-index: 2;
    }
    h1, h2, h3 { page-break-after: avoid; letter-spacing: 0; }
    h1 {
      margin: 0 0 0.12in;
      color: #07133d;
      font-size: 23pt;
      line-height: 1.12;
    }
    h2 {
      margin: 0.28in 0 0.1in;
      color: #0f172a;
      font-size: 16.2pt;
      border-bottom: 2px solid #118ed7;
      padding-bottom: 0.05in;
    }
    h3 {
      margin: 0.18in 0 0.06in;
      color: #0f4c81;
      font-size: 12.1pt;
    }
    p { margin: 0 0 0.09in; font-size: 9.8pt; }
    ul, ol { margin-top: 0.04in; padding-left: 0.24in; }
    li { margin-bottom: 0.04in; font-size: 9.6pt; }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.6pt;
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
      font-size: 8.1pt;
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
    .toc { columns: 2; column-gap: 0.3in; }
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
    .success {
      border-left-color: #059669;
      background: #ecfdf5;
      color: #064e3b;
    }
    .warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
      color: #78350f;
    }
    .page-break { page-break-before: always; }
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
      min-height: 0.86in;
      background: #f8fbff;
      text-align: center;
      font-size: 9.2pt;
    }
    .arch-box strong {
      display: block;
      color: #07133d;
      margin-bottom: 0.05in;
      font-size: 10.3pt;
    }
    .arrow {
      text-align: center;
      font-weight: 800;
      color: #0f4c81;
      font-size: 16pt;
    }
    .diagram {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 0.14in;
      background: #ffffff;
      margin: 0.12in 0 0.18in;
      page-break-inside: avoid;
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
    <div class="main-title">INFORME FINAL<br />AVANCE 3</div>
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
    <h1>Informe Final del Proyecto</h1>
    <p>Este informe presenta la entrega final del Avance 3 del proyecto <strong>appTrackingPaquetesAPA</strong>, una aplicación web para la trazabilidad interna de paquetes de Almacén Pájaro Azul. El documento consolida el desarrollo completo del sistema, la documentación técnica, el manual de usuario, la base de datos, las pruebas, los anexos y los elementos necesarios para defensa académica.</p>
    <div class="meta-grid">
      <div class="meta"><span>Proyecto</span><strong>appTrackingPaquetesAPA</strong></div>
      <div class="meta"><span>Entidad</span><strong>Almacén Pájaro Azul</strong></div>
      <div class="meta"><span>Tipo de solución</span><strong>Aplicación web cliente-servidor</strong></div>
      <div class="meta"><span>Entrega</span><strong>Avance 3 - Proyecto final</strong></div>
      <div class="meta"><span>Backend</span><strong>Express, TypeScript, MongoDB</strong></div>
      <div class="meta"><span>Frontend</span><strong>Angular standalone</strong></div>
    </div>
  </section>

  <section>
    <h2>Índice</h2>
    <ol class="toc">
      <li>Introducción</li>
      <li>Información general</li>
      <li>Justificación</li>
      <li>Beneficios del proyecto</li>
      <li>Objetivos</li>
      <li>Alcance del sistema</li>
      <li>Requerimientos funcionales</li>
      <li>Requerimientos no funcionales</li>
      <li>Arquitectura del sistema</li>
      <li>Tecnologías utilizadas</li>
      <li>Modelo y diagrama de base de datos</li>
      <li>Roles y permisos</li>
      <li>Funcionalidades implementadas</li>
      <li>Manual técnico resumido</li>
      <li>Manual de usuario resumido</li>
      <li>Pruebas y validación</li>
      <li>CI/CD</li>
      <li>Backups y restauración</li>
      <li>Valor agregado</li>
      <li>Limitaciones y recomendaciones</li>
      <li>Conclusiones</li>
      <li>Anexos</li>
    </ol>
  </section>

  <section>
    <h2>1. Introducción</h2>
    <p>La trazabilidad de paquetes es un proceso esencial para controlar movimientos internos, reducir incertidumbre operativa y disponer de información confiable para bodega, operación, supervisión y gerencia. appTrackingPaquetesAPA responde a esa necesidad mediante una plataforma web que centraliza paquetes, estados, lugares, usuarios, tracking, incidencias, evidencias, reportes y auditoría.</p>
    <p>El Avance 3 exige presentar el desarrollo completo del sistema, el manual técnico, el manual de usuario, el repositorio del proyecto, el informe digital y la preparación para defensa. Este informe integra esos elementos y documenta el estado real de la aplicación.</p>
  </section>

  <section>
    <h2>2. Información General</h2>
    <table>
      <thead><tr><th>Elemento</th><th>Detalle</th></tr></thead>
      <tbody>
        <tr><td>Nombre del proyecto</td><td>appTrackingPaquetesAPA</td></tr>
        <tr><td>Entidad de referencia</td><td>Almacén Pájaro Azul</td></tr>
        <tr><td>Tipo de sistema</td><td>Sistema web de tracking y trazabilidad de paquetes.</td></tr>
        <tr><td>Usuarios principales</td><td>Administradores, usuarios operativos, motoristas, bodega, supervisión y gerencia.</td></tr>
        <tr><td>Repositorio</td><td><code>https://github.com/alexandervarela95/appTrackingPaquetesAPA</code></td></tr>
        <tr><td>Estado</td><td>Funcional para pruebas locales y defensa académica.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>3. Justificación</h2>
    <p>El control manual o disperso de paquetes puede provocar pérdida de visibilidad, consultas lentas, falta de evidencia, errores de comunicación y poca trazabilidad de responsabilidades. El sistema propuesto reduce esos riesgos al centralizar la información y permitir que cada paquete cuente con número de guía, historial de avances, estado actual, incidencias, evidencias y responsables asociados.</p>
    <p>La solución también aporta valor académico porque implementa una arquitectura moderna con backend desacoplado, frontend web, base de datos documental, roles, seguridad, tiempo real, pruebas, CI/CD y documentación formal.</p>
  </section>

  <section>
    <h2>4. Beneficios del Proyecto</h2>
    <ul>
      <li>Centraliza la información de paquetes en una plataforma única.</li>
      <li>Permite consultar el estado de un envío mediante número de guía.</li>
      <li>Mejora la trazabilidad con historial de tracking.</li>
      <li>Permite registrar incidencias y evidencias asociadas a cada paquete.</li>
      <li>Facilita reportes para supervisión y gerencia.</li>
      <li>Agrega auditoría de acciones críticas para control administrativo.</li>
      <li>Ofrece una base técnica escalable para futuras mejoras productivas.</li>
    </ul>
  </section>

  <section>
    <h2>5. Objetivos</h2>
    <h3>Objetivo general</h3>
    <p>Desarrollar una aplicación web cliente-servidor que permita administrar y consultar la trazabilidad interna de paquetes de Almacén Pájaro Azul, integrando seguridad, roles, base de datos, evidencias, reportes y actualización operativa.</p>
    <h3>Objetivos específicos</h3>
    <ol>
      <li>Implementar un backend REST con Express, TypeScript, MongoDB y validaciones.</li>
      <li>Construir un frontend Angular funcional para usuarios operativos y administrativos.</li>
      <li>Registrar paquetes con origen, destino, responsables, estado y número de guía.</li>
      <li>Consultar historial de tracking por paquete y por número de guía.</li>
      <li>Registrar incidencias y evidencias como respaldo del proceso.</li>
      <li>Incorporar autenticación JWT, roles, auditoría, reportes y pruebas.</li>
    </ol>
  </section>

  <section>
    <h2>6. Alcance del Sistema</h2>
    <p>El sistema cubre el ciclo operativo de un paquete desde su registro hasta su consulta y seguimiento. Incluye catálogos de usuarios, lugares y estados; gestión de paquetes; tracking; incidencias; evidencias; dashboard; reportes; auditoría; datos demo; documentación y scripts de respaldo.</p>
    <div class="callout">
      <strong>Fuera del alcance productivo actual:</strong> dominio público, TLS, proxy reverso, monitoreo centralizado, almacenamiento externo de evidencias, despliegue horizontal y suite E2E completa para todos los flujos.
    </div>
  </section>

  <section class="page-break">
    <h2>7. Requerimientos Funcionales</h2>
    <table>
      <thead><tr><th>Código</th><th>Requerimiento</th><th>Estado</th></tr></thead>
      <tbody>
        <tr><td>RF-01</td><td>Permitir inicio de sesión seguro.</td><td>Completado</td></tr>
        <tr><td>RF-02</td><td>Administrar usuarios, roles y estado de acceso.</td><td>Completado</td></tr>
        <tr><td>RF-03</td><td>Administrar lugares operativos.</td><td>Completado</td></tr>
        <tr><td>RF-04</td><td>Administrar estados de paquetes.</td><td>Completado</td></tr>
        <tr><td>RF-05</td><td>Registrar paquetes con origen, destino y responsables.</td><td>Completado</td></tr>
        <tr><td>RF-06</td><td>Consultar paquetes por listado y número de guía.</td><td>Completado</td></tr>
        <tr><td>RF-07</td><td>Registrar y consultar tracking.</td><td>Completado</td></tr>
        <tr><td>RF-08</td><td>Registrar incidencias.</td><td>Completado</td></tr>
        <tr><td>RF-09</td><td>Cargar y consultar evidencias.</td><td>Completado</td></tr>
        <tr><td>RF-10</td><td>Visualizar dashboard y reportes.</td><td>Completado</td></tr>
        <tr><td>RF-11</td><td>Consultar auditoría de acciones relevantes.</td><td>Completado</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>8. Requerimientos No Funcionales</h2>
    <table>
      <thead><tr><th>Categoría</th><th>Requerimiento</th><th>Cumplimiento</th></tr></thead>
      <tbody>
        <tr><td>Seguridad</td><td>Autenticación, autorización y validación de entradas.</td><td>JWT, roles, Zod, Helmet, CORS y rate limit.</td></tr>
        <tr><td>Mantenibilidad</td><td>Separación por capas y componentes.</td><td>Backend por rutas, controladores, servicios y modelos; frontend por features y servicios.</td></tr>
        <tr><td>Disponibilidad local</td><td>Levantar dependencias con facilidad.</td><td>Docker Compose para MongoDB y Redis.</td></tr>
        <tr><td>Calidad</td><td>Validar compilación y pruebas.</td><td>Build backend, tests backend, build frontend y CI/CD.</td></tr>
        <tr><td>Escalabilidad</td><td>Base preparada para crecimiento.</td><td>Arquitectura desacoplada, Redis, Socket.IO y servicios separados.</td></tr>
        <tr><td>Trazabilidad</td><td>Registrar acciones y cambios relevantes.</td><td>Auditoría y tracking por guía.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>9. Arquitectura del Sistema</h2>
    <p>La arquitectura separa claramente el cliente web, la API de negocio y los servicios de datos. Esta separación facilita mantenimiento, pruebas, escalabilidad y defensa técnica.</p>
    <div class="architecture">
      <div class="arch-box"><strong>Frontend Angular</strong>Interfaz de usuario, rutas protegidas, servicios HTTP, formularios y conexión en tiempo real.</div>
      <div class="arrow">→</div>
      <div class="arch-box"><strong>Backend Express</strong>API REST, controladores, servicios, validaciones, seguridad, auditoría y eventos.</div>
      <div class="arrow">→</div>
      <div class="arch-box"><strong>Datos e Infraestructura</strong>MongoDB, Redis, almacenamiento de evidencias y Docker Compose.</div>
    </div>
    <table>
      <thead><tr><th>Capa</th><th>Responsabilidad</th></tr></thead>
      <tbody>
        <tr><td>Presentación</td><td>Angular muestra pantallas de login, dashboard, paquetes, tracking, incidencias, evidencias, reportes y auditoría.</td></tr>
        <tr><td>Aplicación</td><td>Express recibe solicitudes, valida permisos y coordina reglas de negocio.</td></tr>
        <tr><td>Dominio/servicios</td><td>Servicios backend concentran lógica de paquetes, tracking, auditoría, reportes y evidencias.</td></tr>
        <tr><td>Persistencia</td><td>Mongoose gestiona documentos e índices en MongoDB.</td></tr>
        <tr><td>Infraestructura</td><td>Docker, Redis, CI/CD y scripts de respaldo soportan ejecución y validación.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>10. Tecnologías Utilizadas</h2>
    <table>
      <thead><tr><th>Componente</th><th>Tecnología</th><th>Uso</th></tr></thead>
      <tbody>
        <tr><td>Backend</td><td>Node.js, Express, TypeScript</td><td>API y lógica de negocio.</td></tr>
        <tr><td>Frontend</td><td>Angular, RxJS, SCSS, PrimeNG</td><td>Interfaz web funcional.</td></tr>
        <tr><td>Base de datos</td><td>MongoDB, Mongoose</td><td>Persistencia documental.</td></tr>
        <tr><td>Caché / soporte</td><td>Redis</td><td>Cache y soporte para eventos.</td></tr>
        <tr><td>Seguridad</td><td>JWT, bcryptjs, Helmet, CORS</td><td>Sesión, contraseñas y protección HTTP.</td></tr>
        <tr><td>Validación</td><td>Zod</td><td>Validación de datos de entrada.</td></tr>
        <tr><td>Archivos</td><td>Multer</td><td>Subida de evidencias.</td></tr>
        <tr><td>Tiempo real</td><td>Socket.IO</td><td>Actualización de pantallas conectadas.</td></tr>
        <tr><td>Pruebas</td><td>Jest, Supertest, Playwright</td><td>Validación backend y E2E base.</td></tr>
        <tr><td>CI/CD</td><td>GitHub Actions</td><td>Build y pruebas automáticas.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>11. Modelo y Diagrama de Base de Datos</h2>
    <p>La base de datos usa MongoDB con Mongoose. El modelo central es <code>Paquete</code>, relacionado con usuarios, lugares, estados, tracking, incidencias, evidencias y auditoría.</p>
    <table>
      <thead><tr><th>Colección</th><th>Propósito</th><th>Relaciones principales</th></tr></thead>
      <tbody>
        <tr><td>Usuario</td><td>Empleados, administradores y motoristas.</td><td>Lugar asignado, paquetes, tracking, auditoría.</td></tr>
        <tr><td>Lugar</td><td>Bodegas, sucursales, origen y destino.</td><td>Paquete y tracking.</td></tr>
        <tr><td>Estado</td><td>Estados del flujo del paquete.</td><td>Paquete y tracking.</td></tr>
        <tr><td>Paquete</td><td>Registro central del envío.</td><td>Usuarios, lugares, estado, tracking, incidencias y evidencias.</td></tr>
        <tr><td>Tracking</td><td>Historial de avances.</td><td>Paquete, estado, lugar y usuario responsable.</td></tr>
        <tr><td>Incidencia</td><td>Problemas o eventos que requieren seguimiento.</td><td>Paquete y usuario que reporta.</td></tr>
        <tr><td>Evidencia</td><td>Archivos de respaldo del proceso.</td><td>Paquete y usuario que reporta.</td></tr>
        <tr><td>AuditLog</td><td>Registro de acciones relevantes.</td><td>Usuario, entidad, acción y metadatos.</td></tr>
      </tbody>
    </table>
    <div class="diagram">
      <img class="db-diagram" src="${dbDiagramDataUri}" alt="Diagrama de base de datos appTrackingPaquetesAPA" />
    </div>
  </section>

  <section>
    <h2>12. Roles y Permisos</h2>
    <table>
      <thead><tr><th>Rol</th><th>Responsabilidad</th><th>Acceso principal</th></tr></thead>
      <tbody>
        <tr><td>Administrador</td><td>Control general del sistema.</td><td>Usuarios, catálogos, paquetes, reportes y auditoría.</td></tr>
        <tr><td>Motorista</td><td>Seguimiento operativo de paquetes asignados.</td><td>Paquetes asignados, tracking, incidencias y evidencias.</td></tr>
        <tr><td>Usuario</td><td>Registro o consulta de paquetes relacionados.</td><td>Paquetes propios o relacionados, incidencias y evidencias.</td></tr>
      </tbody>
    </table>
    <p>Además del rol, el sistema aplica control por propiedad de paquete para restringir el acceso a recursos que no corresponden al usuario autenticado.</p>
  </section>

  <section>
    <h2>13. Funcionalidades Implementadas</h2>
    <table>
      <thead><tr><th>Módulo</th><th>Funcionalidad</th></tr></thead>
      <tbody>
        <tr><td>Autenticación</td><td>Login con JWT y normalización de usuario visible Sistemas.</td></tr>
        <tr><td>Dashboard</td><td>Indicadores de estados, paquetes activos, incidencias y evidencias.</td></tr>
        <tr><td>Paquetes</td><td>Listado, búsqueda, registro, detalle y actualización.</td></tr>
        <tr><td>Tracking</td><td>Consulta cronológica por guía y registro de avances.</td></tr>
        <tr><td>Incidencias</td><td>Registro y consulta de eventos operativos.</td></tr>
        <tr><td>Evidencias</td><td>Carga real de archivos y consulta asociada a paquetes.</td></tr>
        <tr><td>Usuarios</td><td>Administración de cuentas y roles.</td></tr>
        <tr><td>Lugares</td><td>Catálogo de bodegas, sucursales y direcciones.</td></tr>
        <tr><td>Estados</td><td>Catálogo ordenado del flujo del paquete.</td></tr>
        <tr><td>Reportes</td><td>Paquetes por estado, incidencias y actividad.</td></tr>
        <tr><td>Auditoría</td><td>Registro de acciones relevantes.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>14. Manual Técnico Resumido</h2>
    <p>El manual técnico completo fue generado como documento independiente y se encuentra en <code>documentacion/manual-tecnico/manual-tecnico-appTrackingPaquetesAPA.pdf</code>. Incluye instalación, arquitectura, variables, backend, frontend, base de datos, endpoints, seguridad, pruebas, CI/CD, backups y solución de problemas.</p>
    <h3>Comandos principales</h3>
    <pre>docker compose up -d

cd backend
npm install
copy .env.example .env
npm run seed:demo
npm run dev

cd ../frontend
npm install
npm start</pre>
    <h3>Validación técnica</h3>
    <pre>cd backend
npm run build
npm test -- --runInBand

cd ../frontend
npm run build</pre>
  </section>

  <section>
    <h2>15. Manual de Usuario Resumido</h2>
    <p>El manual de usuario completo fue generado como PDF profesional con capturas del sistema y se encuentra en <code>documentacion/manual-usuario/manual-usuario-appTrackingPaquetesAPA.pdf</code>. Está redactado para personal de bodega, operación, supervisión y gerencia.</p>
    <ol>
      <li>Ingresar al sistema con usuario autorizado.</li>
      <li>Revisar el dashboard operativo.</li>
      <li>Consultar o registrar paquetes.</li>
      <li>Ver seguimiento por número de guía.</li>
      <li>Registrar incidencias cuando exista un problema operativo.</li>
      <li>Adjuntar evidencias como respaldo del proceso.</li>
      <li>Consultar reportes y auditoría según permisos.</li>
      <li>Cerrar sesión al finalizar.</li>
    </ol>
  </section>

  <section>
    <h2>16. Pruebas y Validación</h2>
    <table>
      <thead><tr><th>Área</th><th>Validación</th><th>Resultado documentado</th></tr></thead>
      <tbody>
        <tr><td>Backend</td><td><code>npm run build</code></td><td>Correcto.</td></tr>
        <tr><td>Backend</td><td><code>npm test -- --runInBand</code></td><td>4 suites y 7 pruebas aprobadas.</td></tr>
        <tr><td>Frontend</td><td><code>npm run build</code></td><td>Correcto, sin advertencia de presupuesto.</td></tr>
        <tr><td>CI/CD</td><td>Workflow GitHub Actions</td><td>Instala, compila y prueba backend; compila frontend.</td></tr>
        <tr><td>Manual</td><td>Validación visual</td><td>Capturas y PDFs generados correctamente.</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>17. CI/CD</h2>
    <p>El proyecto incluye un pipeline en <code>.github/workflows/ci.yml</code>. Se ejecuta en push y pull request hacia <code>main</code>.</p>
    <ul>
      <li>Checkout del repositorio.</li>
      <li>Configuración de Node.js 22.</li>
      <li>Instalación de dependencias backend con <code>npm ci</code>.</li>
      <li>Build y pruebas backend.</li>
      <li>Instalación de dependencias frontend con <code>npm ci</code>.</li>
      <li>Build frontend.</li>
    </ul>
  </section>

  <section>
    <h2>18. Backups y Restauración</h2>
    <p>La documentación de respaldo y restauración se encuentra en <code>documentacion/backups-restauracion.md</code> y los scripts en <code>scripts/backup/</code>. Se recomienda ejecutar respaldo antes de pruebas destructivas, cambios mayores o defensa final.</p>
    <pre>scripts\\backup\\mongo-backup.cmd
scripts\\backup\\mongo-restore.cmd</pre>
  </section>

  <section>
    <h2>19. Valor Agregado</h2>
    <ul>
      <li>Tiempo real con Socket.IO para reflejar cambios relevantes.</li>
      <li>Auditoría de acciones críticas para trazabilidad administrativa.</li>
      <li>Reportes reales con consultas a MongoDB.</li>
      <li>Control por propiedad de recurso, no solamente por rol general.</li>
      <li>Upload real de evidencias con validación de formato.</li>
      <li>CI/CD básico con GitHub Actions.</li>
      <li>Documentación formal: manual de usuario, manual técnico, informe final y diagrama de base de datos.</li>
      <li>Scripts reproducibles para generar documentos y diagramas.</li>
    </ul>
  </section>

  <section>
    <h2>20. Limitaciones y Recomendaciones</h2>
    <table>
      <thead><tr><th>Limitación actual</th><th>Recomendación</th></tr></thead>
      <tbody>
        <tr><td>No existe despliegue productivo con dominio y TLS.</td><td>Configurar servidor, HTTPS y proxy reverso.</td></tr>
        <tr><td>El almacenamiento de evidencias es local.</td><td>Migrar a S3, Azure Blob o servicio equivalente.</td></tr>
        <tr><td>La suite E2E es base.</td><td>Ampliar pruebas para paquete, tracking, incidencias y evidencias.</td></tr>
        <tr><td>No hay monitoreo centralizado.</td><td>Agregar logs, métricas y alertas.</td></tr>
        <tr><td>Socket.IO horizontal requiere adapter completo.</td><td>Configurar Redis adapter para múltiples instancias en producción.</td></tr>
      </tbody>
    </table>
  </section>

  <section class="page-break">
    <h2>21. Conclusiones</h2>
    <ol>
      <li>appTrackingPaquetesAPA cumple el objetivo de registrar y consultar la trazabilidad interna de paquetes mediante una aplicación web funcional.</li>
      <li>El sistema presenta una arquitectura defendible, separando frontend, backend, servicios, modelos, validadores y datos.</li>
      <li>La solución incorpora elementos de valor académico y técnico: JWT, roles, MongoDB, Redis, Socket.IO, auditoría, reportes, evidencias, pruebas y CI/CD.</li>
      <li>La documentación generada cubre manual de usuario, manual técnico, diagrama de base de datos e informe final del Avance 3.</li>
      <li>El proyecto está listo para pruebas locales y defensa académica, quedando pendientes específicos para producción estricta.</li>
    </ol>
  </section>

  <section>
    <h2>22. Anexos</h2>
    <h3>Anexo A. Documentos generados</h3>
    <table>
      <thead><tr><th>Documento</th><th>Ruta</th></tr></thead>
      <tbody>
        <tr><td>Manual de usuario</td><td><code>documentacion/manual-usuario/manual-usuario-appTrackingPaquetesAPA.pdf</code></td></tr>
        <tr><td>Manual técnico</td><td><code>documentacion/manual-tecnico/manual-tecnico-appTrackingPaquetesAPA.pdf</code></td></tr>
        <tr><td>Diagrama de base de datos</td><td><code>documentacion/base-datos/diagrama-base-datos-appTrackingPaquetesAPA.pdf</code></td></tr>
        <tr><td>Informe final</td><td><code>documentacion/informe-final/informe-final-avance-3-appTrackingPaquetesAPA.pdf</code></td></tr>
      </tbody>
    </table>
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
    <h3>Anexo C. Repositorio</h3>
    <p>Repositorio público del proyecto: <code>https://github.com/alexandervarela95/appTrackingPaquetesAPA</code>.</p>
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
      `<div style="width:100%; padding:0 0.62in; display:flex; align-items:center; justify-content:space-between; font-family: Segoe UI, Arial, sans-serif; font-size:8px; color:#64748b;"><img src="${logoDataUri}" style="height:16px; width:auto;" /><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`,
    margin: { top: '0.5in', right: '0.62in', bottom: '0.62in', left: '0.62in' },
  });
  await browser.close();

  console.log(JSON.stringify({ pdfPath, htmlPath, previewPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
