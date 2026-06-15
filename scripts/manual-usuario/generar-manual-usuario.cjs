// Genera el manual de usuario con capturas reales del frontend y pasos de uso.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium, request } = requireFrontend('@playwright/test');
const salidaDir = path.join(raizProyecto, 'documentacion', 'manual-usuario');
const capturasDir = path.join(salidaDir, 'capturas');
const htmlPath = path.join(salidaDir, 'manual-usuario.html');
const pdfPath = path.join(salidaDir, 'manual-usuario-appTrackingPaquetesAPA.pdf');
const logoPath = path.join(raizProyecto, 'frontend', 'public', 'assets', 'login', 'logoAPA.jpg');
const portadaPlantillaPath = path.join(salidaDir, 'portada-template-image1.png');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3180';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4300';
const USUARIO_DEMO = process.env.USUARIO_DEMO || 'sistemas@pajaroazul.local';
const PASSWORD_DEMO = process.env.PASSWORD_DEMO || 'Sistemas*2026';

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function asegurarDirectorios() {
  fs.mkdirSync(capturasDir, { recursive: true });
}

function rel(ruta) {
  return path.relative(salidaDir, ruta).replaceAll(path.sep, '/');
}

function escapar(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cargarLogoDataUri() {
  const logoBytes = fs.readFileSync(logoPath);
  return `data:image/jpeg;base64,${logoBytes.toString('base64')}`;
}

function cargarPortadaPlantillaDataUri() {
  const portadaBytes = fs.readFileSync(portadaPlantillaPath);
  return `data:image/png;base64,${portadaBytes.toString('base64')}`;
}

async function autenticar() {
  const api = await request.newContext({ baseURL: BACKEND_URL });
  const respuesta = await api.post('/api/auth/login', {
    data: { correo: USUARIO_DEMO, contrasena: PASSWORD_DEMO },
  });

  if (!respuesta.ok()) {
    const cuerpo = await respuesta.text();
    throw new Error(`No fue posible iniciar sesion para capturas. HTTP ${respuesta.status()} ${cuerpo}`);
  }

  const json = await respuesta.json();
  await api.dispose();
  return json.datos;
}

async function obtenerPaqueteDemo(token) {
  const api = await request.newContext({
    baseURL: BACKEND_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });
  const respuesta = await api.get('/api/paquetes');
  if (!respuesta.ok()) {
    await api.dispose();
    return null;
  }
  const json = await respuesta.json();
  await api.dispose();
  const datos = Array.isArray(json.datos) ? json.datos : json.datos?.items || json.datos?.paquetes || [];
  return datos[0] || null;
}

async function prepararPagina(browser, sesion) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 980 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });

  await context.addInitScript(({ token, usuario }) => {
    window.localStorage.setItem('apa-token', token);
    window.localStorage.setItem('apa-usuario', JSON.stringify(usuario));
  }, sesion);

  const page = await context.newPage();
  await page.addStyleTag({
    content: `
      * { scroll-behavior: auto !important; }
      body { caret-color: transparent !important; }
      .p-component-overlay, .p-toast { display: none !important; }
    `,
  }).catch(() => undefined);
  return { context, page };
}

async function capturar(page, nombre, ruta) {
  await page.goto(`${FRONTEND_URL}${ruta}`, { waitUntil: 'networkidle', timeout: 45000 });
  await esperar(900);
  const archivo = path.join(capturasDir, `${nombre}.png`);
  await page.screenshot({ path: archivo, fullPage: false });
  return rel(archivo);
}

function figura(captura, titulo, descripcion, marcas = []) {
  const pins = marcas
    .map(
      (m, i) =>
        `<span class="pin" style="left:${m.x}%; top:${m.y}%">${i + 1}</span>`,
    )
    .join('');
  const leyenda = marcas
    .map((m, i) => `<li><strong>${i + 1}.</strong> ${escapar(m.texto)}</li>`)
    .join('');

  return `
    <figure class="screenshot-block">
      <figcaption>
        <strong>${escapar(titulo)}</strong>
        <span>${escapar(descripcion)}</span>
      </figcaption>
      <div class="shot-wrap">
        <img src="${captura}" alt="${escapar(titulo)}" />
        ${pins}
      </div>
      ${marcas.length ? `<ol class="callouts">${leyenda}</ol>` : ''}
    </figure>
  `;
}

function seccionProcedimiento(titulo, pasos) {
  return `
    <section>
      <h2>${escapar(titulo)}</h2>
      <ol class="steps">
        ${pasos.map((paso) => `<li>${escapar(paso)}</li>`).join('')}
      </ol>
    </section>
  `;
}

function construirHtml(capturas, fecha, logoDataUri, portadaPlantillaDataUri) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Manual de Usuario - appTrackingPaquetesAPA</title>
  <style>
    @page { size: Letter; margin: 0.62in 0.58in 0.68in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #172033;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.42;
      background: #ffffff;
    }
    .cover {
      min-height: 9.3in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.2in 0 0.1in;
      page-break-after: always;
    }
    .template-cover {
      min-height: 9.3in;
      position: relative;
      padding: 0.62in 0.72in 0.55in;
      overflow: hidden;
      page-break-after: always;
      background: #ffffff;
    }
    .template-cover > div {
      position: relative;
      z-index: 2;
    }
    .template-cover .brand {
      color: #118ed7;
      font-size: 28pt;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0;
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
      width: 3.85in;
      margin-top: 0.38in;
      color: #080b35;
      font-size: 17pt;
      line-height: 1.18;
      font-weight: 800;
      text-transform: uppercase;
    }
    .template-cover .author {
      width: 3.7in;
      margin-top: 0.42in;
      color: #89899c;
      font-size: 10.8pt;
      line-height: 1.55;
      font-weight: 700;
    }
    .template-cover .template-image {
      position: absolute;
      right: -0.35in;
      bottom: 1.35in;
      width: 5.55in;
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
      letter-spacing: 0.02em;
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
    .cover-band {
      border-left: 10px solid #0f766e;
      padding: 0.28in 0.35in;
      background: linear-gradient(90deg, #f0fdfa 0%, #ffffff 74%);
    }
    .kicker {
      color: #0f766e;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0.12in 0 0;
      color: #111827;
      font-size: 28pt;
      line-height: 1.08;
      letter-spacing: 0;
    }
    .subtitle {
      max-width: 6.8in;
      margin-top: 0.14in;
      color: #4b5563;
      font-size: 12.5pt;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.14in;
      margin-top: 0.35in;
    }
    .meta {
      border: 1px solid #d9e2ec;
      border-radius: 8px;
      padding: 0.13in 0.15in;
      background: #fbfdff;
    }
    .meta span {
      display: block;
      color: #64748b;
      font-size: 8.5pt;
      text-transform: uppercase;
      font-weight: 700;
    }
    .meta strong {
      display: block;
      margin-top: 0.02in;
      color: #111827;
      font-size: 10.5pt;
    }
    .cover-note {
      border: 1px solid #99f6e4;
      background: #ecfeff;
      color: #134e4a;
      border-radius: 10px;
      padding: 0.16in 0.2in;
      font-size: 10.5pt;
    }
    .footer-logo {
      display: block;
      width: 1.55in;
      height: auto;
      margin: 0.22in auto 0;
      opacity: 0.9;
    }
    h2 {
      margin: 0.28in 0 0.1in;
      color: #0f172a;
      font-size: 17pt;
      page-break-after: avoid;
      border-bottom: 2px solid #0f766e;
      padding-bottom: 0.05in;
    }
    h3 {
      margin: 0.2in 0 0.07in;
      color: #115e59;
      font-size: 12.5pt;
      page-break-after: avoid;
    }
    p { margin: 0 0 0.09in; font-size: 10.3pt; }
    ul, ol { margin-top: 0.04in; }
    li { margin-bottom: 0.04in; font-size: 10.1pt; }
    .toc {
      columns: 2;
      column-gap: 0.32in;
      padding-left: 0.18in;
    }
    .toc li { break-inside: avoid; }
    .note {
      margin: 0.12in 0;
      padding: 0.12in 0.15in;
      border-left: 5px solid #2563eb;
      background: #eff6ff;
      color: #1e3a8a;
      border-radius: 6px;
      font-size: 10pt;
    }
    .warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
      color: #78350f;
    }
    .screenshot-block {
      margin: 0.18in 0 0.24in;
      page-break-inside: avoid;
    }
    .screenshot-block figcaption {
      display: flex;
      flex-direction: column;
      gap: 0.03in;
      margin-bottom: 0.08in;
      color: #334155;
      font-size: 9.6pt;
    }
    .screenshot-block figcaption strong {
      color: #0f172a;
      font-size: 10.6pt;
    }
    .shot-wrap {
      position: relative;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      background: #f8fafc;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.11);
    }
    .shot-wrap img {
      display: block;
      width: 100%;
      height: auto;
    }
    .pin {
      position: absolute;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      border: 2px solid #ffffff;
      border-radius: 50%;
      background: #dc2626;
      color: #ffffff;
      font-size: 10pt;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.32);
    }
    .callouts {
      margin: 0.1in 0 0;
      padding: 0.1in 0.18in 0.08in 0.32in;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .steps {
      padding-left: 0.24in;
    }
    .two-col {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.18in;
    }
    .card {
      border: 1px solid #dbe4ee;
      border-radius: 8px;
      padding: 0.12in;
      background: #fbfdff;
      page-break-inside: avoid;
    }
    .role-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.12in 0;
      font-size: 9.5pt;
    }
    .role-table th {
      background: #0f766e;
      color: #ffffff;
      text-align: left;
      padding: 0.08in;
    }
    .role-table td {
      border: 1px solid #d7dee8;
      padding: 0.08in;
      vertical-align: top;
    }
    .page-break { page-break-before: always; }
    footer {
      margin-top: 0.25in;
      color: #64748b;
      font-size: 8.5pt;
      text-align: center;
    }
  </style>
</head>
<body>
  <main class="template-cover">
    <div class="brand">ALMACEN PAJARO AZUL</div>
    <div class="main-title">MANUAL DE USUARIO</div>
    <div class="system-title">SISTEMA DE TRACKING<br />DE PAQUETES<br />APPTRACKINGPAQUETESAPA</div>
    <div class="author">
      Ing. Alexander Varela<br />
      Desarrollo de Aplicaciones de Vanguardia<br />
      ${escapar(fecha)}
    </div>
    <img class="template-image" src="${portadaPlantillaDataUri}" alt="Almacen Pajaro Azul" />
    <div class="footer-brand">PAJARO AZUL</div>
    <div class="footer-tagline">PASION POR LA MUSICA</div>
  </main>

  <section>
    <h2>Indice de Uso</h2>
    <ol class="toc">
      <li>Objetivo del manual</li>
      <li>Roles y permisos esperados</li>
      <li>Ingreso al sistema</li>
      <li>Dashboard operativo</li>
      <li>Gestion de paquetes</li>
      <li>Registro de paquete nuevo</li>
      <li>Detalle y seguimiento</li>
      <li>Tracking por numero de guia</li>
      <li>Incidencias</li>
      <li>Evidencias</li>
      <li>Administracion de usuarios</li>
      <li>Lugares y estados</li>
      <li>Reportes</li>
      <li>Auditoria</li>
      <li>Errores comunes</li>
    </ol>
    <div class="note">
      Este manual esta escrito para usuarios operativos, administradores y personal de sistemas. Los marcadores rojos numerados senalan las acciones principales de cada pantalla.
    </div>
  </section>

  <section>
    <h2>Objetivo del Manual</h2>
    <p>Orientar al usuario final en el uso correcto de appTrackingPaquetesAPA, explicando cada pantalla, los pasos principales y las acciones disponibles para registrar, consultar y controlar paquetes dentro del proceso logistico.</p>
    <p>El sistema permite reunir en un solo lugar la informacion de paquetes, seguimiento, incidencias, evidencias, reportes y auditoria. Las pantallas principales se actualizan automaticamente cuando existen cambios relevantes.</p>
  </section>

  <section>
    <h2>Roles y Permisos</h2>
    <table class="role-table">
      <thead><tr><th>Rol</th><th>Uso principal</th><th>Acciones esperadas</th></tr></thead>
      <tbody>
        <tr><td>Administrador</td><td>Control general del sistema.</td><td>Gestiona usuarios, lugares, estados, paquetes, reportes y auditoria.</td></tr>
        <tr><td>Motorista</td><td>Operacion de entrega y seguimiento.</td><td>Consulta paquetes asignados, registra avances, incidencias y evidencias.</td></tr>
        <tr><td>Usuario</td><td>Consulta del paquete.</td><td>Consulta paquetes relacionados y revisa el estado del envio.</td></tr>
      </tbody>
    </table>
  </section>

  ${figura(capturas.login, 'Pantalla de inicio de sesion', 'Ingreso seguro al sistema mediante credenciales autorizadas.', [
    { x: 62, y: 35, texto: 'Campo para usuario corto o correo electronico.' },
    { x: 62, y: 48, texto: 'Campo de contrasena asignada al usuario.' },
    { x: 62, y: 65, texto: 'Boton para autenticar y abrir el dashboard.' },
  ])}

  ${seccionProcedimiento('Como iniciar sesion', [
    'Abrir el acceso del sistema desde el navegador.',
    'Escribir el usuario asignado.',
    'Escribir la contrasena correspondiente.',
    'Presionar Iniciar sesion.',
    'Si las credenciales son correctas, el sistema redirige al dashboard.',
  ])}

  <div class="page-break"></div>
  ${figura(capturas.dashboard, 'Dashboard operativo', 'Vista inicial con resumen del estado de la operacion y conexion en tiempo real.', [
    { x: 16, y: 18, texto: 'Menu lateral para navegar entre modulos.' },
    { x: 42, y: 22, texto: 'Indicadores principales de paquetes y gestion.' },
    { x: 76, y: 16, texto: 'Estado de actualizacion en tiempo real.' },
    { x: 66, y: 58, texto: 'Graficas y resumenes de paquetes por estado.' },
  ])}

  ${seccionProcedimiento('Uso del dashboard', [
    'Revise los indicadores para conocer paquetes activos, entregas e incidencias.',
    'Use el menu lateral para abrir el modulo que necesita operar.',
    'Use el boton de actualizacion si necesita refrescar la informacion de forma manual.',
  ])}

  ${figura(capturas.paquetes, 'Modulo de paquetes', 'Listado principal para consultar, buscar y abrir paquetes registrados.', [
    { x: 24, y: 23, texto: 'Titulo del modulo y contexto de trabajo.' },
    { x: 84, y: 22, texto: 'Accion para registrar un paquete nuevo.' },
    { x: 52, y: 34, texto: 'Busqueda por numero de guia u otros datos visibles.' },
    { x: 82, y: 64, texto: 'Acciones rapidas para ver detalle o tracking.' },
  ])}

  ${seccionProcedimiento('Consultar paquetes', [
    'Entre al menu Paquetes.',
    'Revise la tabla de paquetes disponibles segun su rol.',
    'Use el buscador para ubicar un paquete por numero de guia.',
    'Presione el icono de detalle para ver informacion completa.',
    'Presione el icono de tracking para revisar eventos de seguimiento.',
  ])}

  <div class="page-break"></div>
  ${figura(capturas.paqueteNuevo, 'Registro de paquete nuevo', 'Formulario para crear un envio con datos de origen, destino y responsable.', [
    { x: 34, y: 27, texto: 'Datos generales del paquete.' },
    { x: 67, y: 40, texto: 'Campos relacionados con origen, destino y asignacion.' },
    { x: 82, y: 18, texto: 'Boton para volver al listado sin guardar.' },
  ])}

  ${seccionProcedimiento('Registrar un paquete', [
    'Abra Paquetes y presione Nuevo.',
    'Complete los datos requeridos del paquete.',
    'Seleccione origen, destino, estado inicial y responsable cuando aplique.',
    'Guarde el formulario.',
    'Valide que el paquete aparezca en el listado y tenga numero de guia.',
  ])}

  ${figura(capturas.paqueteDetalle, 'Detalle del paquete', 'Ficha individual con datos principales y accesos a tracking.', [
    { x: 28, y: 28, texto: 'Resumen del paquete seleccionado.' },
    { x: 72, y: 24, texto: 'Accion para abrir tracking del paquete.' },
    { x: 48, y: 60, texto: 'Informacion operativa y datos asociados.' },
  ])}

  ${figura(capturas.tracking, 'Seguimiento por numero de guia', 'Consulta cronologica de avances asociados al paquete.', [
    { x: 30, y: 24, texto: 'Numero de guia consultado.' },
    { x: 50, y: 42, texto: 'Linea de avances del paquete.' },
    { x: 75, y: 25, texto: 'Registro de un nuevo avance cuando el rol lo permite.' },
  ])}

  ${seccionProcedimiento('Consultar seguimiento', [
    'Abra Tracking desde el menu o desde el detalle de un paquete.',
    'Ingrese o confirme el numero de guia.',
    'Revise los avances ordenados por fecha.',
    'Cuando tenga permisos, registre nuevos avances para actualizar la ubicacion o estado.',
  ])}

  <div class="page-break"></div>
  ${figura(capturas.incidencias, 'Gestion de incidencias', 'Registro y consulta de problemas encontrados durante el proceso de entrega.', [
    { x: 27, y: 24, texto: 'Listado de incidencias existentes.' },
    { x: 67, y: 35, texto: 'Datos de paquete, tipo de incidencia y descripcion.' },
    { x: 84, y: 24, texto: 'Acciones disponibles segun permisos.' },
  ])}

  ${figura(capturas.evidencias, 'Evidencias', 'Modulo para consultar o cargar archivos que respaldan la gestion del paquete.', [
    { x: 28, y: 24, texto: 'Evidencias registradas.' },
    { x: 53, y: 45, texto: 'Referencia al paquete o evento asociado.' },
    { x: 82, y: 26, texto: 'Acciones de carga/consulta cuando esten habilitadas.' },
  ])}

  ${seccionProcedimiento('Registrar incidencias y evidencias', [
    'Abra Incidencias para documentar problemas como retrasos, direccion incorrecta o paquete danado.',
    'Asocie la incidencia al paquete correspondiente.',
    'Use Evidencias para subir imagenes o archivos que respalden la gestion.',
    'Verifique que la evidencia quede disponible para consulta posterior.',
  ])}

  ${figura(capturas.usuarios, 'Administracion de usuarios', 'Pantalla administrativa para mantener usuarios, roles y estado de acceso.', [
    { x: 28, y: 24, texto: 'Listado de usuarios registrados.' },
    { x: 52, y: 42, texto: 'Datos de identidad, correo, rol y estado.' },
    { x: 83, y: 24, texto: 'Acciones de administracion disponibles.' },
  ])}

  <div class="page-break"></div>
  ${figura(capturas.lugares, 'Lugares operativos', 'Catalogo de lugares, sucursales o puntos usados en origen y destino.', [
    { x: 30, y: 24, texto: 'Lugares existentes en el sistema.' },
    { x: 52, y: 44, texto: 'Informacion de ciudad, direccion o descripcion.' },
    { x: 84, y: 24, texto: 'Acciones de mantenimiento del catalogo.' },
  ])}

  ${figura(capturas.estados, 'Estados de paquete', 'Catalogo que controla los estados permitidos en el flujo del paquete.', [
    { x: 28, y: 24, texto: 'Estados configurados para el proceso.' },
    { x: 55, y: 44, texto: 'Descripcion y propiedades del estado.' },
    { x: 84, y: 24, texto: 'Acciones para administrar el catalogo.' },
  ])}

  ${figura(capturas.reportes, 'Reportes', 'Indicadores y consultas para analizar paquetes, incidencias y actividad.', [
    { x: 28, y: 24, texto: 'Opciones de reporte disponibles.' },
    { x: 56, y: 44, texto: 'Resultados agregados para analisis operativo.' },
    { x: 78, y: 24, texto: 'Secciones utiles para defensa y seguimiento gerencial.' },
  ])}

  ${seccionProcedimiento('Consultar reportes', [
    'Abra Reportes desde el menu lateral.',
    'Revise paquetes por estado, incidencias y actividad.',
    'Use la informacion para detectar carga operativa, retrasos o comportamiento del sistema.',
  ])}

  <div class="page-break"></div>
  ${figura(capturas.auditoria, 'Auditoria', 'Registro de acciones relevantes para trazabilidad y control.', [
    { x: 28, y: 24, texto: 'Listado de acciones auditadas.' },
    { x: 52, y: 43, texto: 'Usuario, entidad, accion y fecha del evento.' },
    { x: 78, y: 24, texto: 'Informacion util para seguimiento de seguridad.' },
  ])}

  ${seccionProcedimiento('Revisar auditoria', [
    'Ingrese al modulo Auditoria con un usuario autorizado.',
    'Revise las acciones registradas por el sistema.',
    'Use la fecha, usuario y descripcion para rastrear cambios o eventos relevantes.',
  ])}

  <section>
    <h2>Errores Comunes y Solucion</h2>
    <div class="two-col">
      <div class="card">
        <h3>No puedo iniciar sesion</h3>
        <p>Verifique que el usuario y la contrasena esten escritos correctamente. Si el problema continua, solicite a Sistemas revisar que su cuenta este activa.</p>
      </div>
      <div class="card">
        <h3>No cargan datos</h3>
        <p>Actualice la pantalla. Si la informacion no aparece, reporte el caso a Sistemas indicando el modulo donde ocurre.</p>
      </div>
      <div class="card">
        <h3>No veo cambios recientes</h3>
        <p>Use el boton de actualizar o vuelva a entrar al modulo. Si el dato sigue igual, confirme con el area responsable si ya fue registrado.</p>
      </div>
      <div class="card">
        <h3>No veo un modulo</h3>
        <p>Puede depender del rol asignado. Solicite a un administrador revisar permisos y estado del usuario.</p>
      </div>
    </div>
  </section>

  <section>
    <h2>Cierre de Sesion</h2>
    <p>Para salir del sistema, use el boton de usuario o cierre de sesion ubicado en la parte inferior del menu lateral. Al cerrar sesion, la pantalla vuelve al inicio de sesion.</p>
    <div class="warning note">
      En equipos compartidos, siempre cierre sesion al finalizar. No deje el navegador abierto con una sesion administrativa activa.
    </div>
  </section>

  <footer><img class="footer-logo" src="${logoDataUri}" alt="Pajaro Azul" /></footer>
</body>
</html>`;
}

async function main() {
  asegurarDirectorios();

  const sesion = await autenticar();
  const paqueteDemo = await obtenerPaqueteDemo(sesion.token);
  const browser = await chromium.launch({ headless: true });

  const loginContext = await browser.newContext({
    viewport: { width: 1440, height: 980 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const loginPage = await loginContext.newPage();
  await loginPage.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle', timeout: 45000 });
  await esperar(700);
  const loginPath = path.join(capturasDir, '01-login.png');
  await loginPage.screenshot({ path: loginPath, fullPage: false });
  await loginContext.close();

  const { context, page } = await prepararPagina(browser, sesion);
  const detalleRuta = paqueteDemo?._id ? `/paquetes/${paqueteDemo._id}` : '/paquetes';
  const guia = paqueteDemo?.numeroGuia || paqueteDemo?.guia || '';
  const trackingRuta = guia ? `/tracking/${encodeURIComponent(guia)}` : '/tracking';

  const capturas = {
    login: rel(loginPath),
    dashboard: await capturar(page, '02-dashboard', '/dashboard'),
    paquetes: await capturar(page, '03-paquetes', '/paquetes'),
    paqueteNuevo: await capturar(page, '04-paquete-nuevo', '/paquetes/nuevo'),
    paqueteDetalle: await capturar(page, '05-paquete-detalle', detalleRuta),
    tracking: await capturar(page, '06-tracking', trackingRuta),
    incidencias: await capturar(page, '07-incidencias', '/incidencias'),
    evidencias: await capturar(page, '08-evidencias', '/evidencias'),
    usuarios: await capturar(page, '09-usuarios', '/usuarios'),
    lugares: await capturar(page, '10-lugares', '/lugares'),
    estados: await capturar(page, '11-estados', '/estados'),
    reportes: await capturar(page, '12-reportes', '/reportes'),
    auditoria: await capturar(page, '13-auditoria', '/auditoria'),
  };

  await context.close();

  const fecha = new Intl.DateTimeFormat('es-HN', {
    dateStyle: 'long',
    timeZone: 'America/Tegucigalpa',
  }).format(new Date());

  const logoDataUri = cargarLogoDataUri();
  const portadaPlantillaDataUri = cargarPortadaPlantillaDataUri();
  fs.writeFileSync(htmlPath, construirHtml(capturas, fecha, logoDataUri, portadaPlantillaDataUri), 'utf8');

  const pdfContext = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const pdfPage = await pdfContext.newPage();
  await pdfPage.goto(`file://${htmlPath.replaceAll(path.sep, '/')}`, { waitUntil: 'networkidle' });
  await pdfPage.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      `<div style="width:100%; padding:0 0.58in; display:flex; align-items:center; justify-content:space-between; font-family: Segoe UI, Arial, sans-serif; font-size:8px; color:#64748b;"><img src="${logoDataUri}" style="height:16px; width:auto;" /><span>Pagina <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`,
    margin: { top: '0.45in', right: '0.58in', bottom: '0.58in', left: '0.58in' },
  });
  await pdfContext.close();
  await browser.close();

  console.log(JSON.stringify({ pdfPath, htmlPath, capturasDir }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
