// Genera un manual de usuario detallado con capturas reales del frontend en ejecucion.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium, request } = requireFrontend('@playwright/test');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3180';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4300';
const USUARIO_DEMO = process.env.USUARIO_DEMO || 'sistemas@pajaroazul.com';
const PASSWORD_DEMO = process.env.PASSWORD_DEMO || 'Sistemas*2026';

const salidaDir = path.join(raizProyecto, 'documentacion', 'manual-usuario');
const capturasDir = path.join(salidaDir, 'capturas-detallado');
const htmlPath = path.join(salidaDir, 'manual-usuario-detallado-appTrackingPaquetesAPA.html');
const pdfPath = path.join(salidaDir, 'manual-usuario-detallado-appTrackingPaquetesAPA.pdf');

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function asegurarDirectorios() {
  fs.mkdirSync(capturasDir, { recursive: true });
}

function escapar(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function rel(ruta) {
  return path.relative(salidaDir, ruta).replaceAll(path.sep, '/');
}

async function autenticar() {
  const api = await request.newContext({ baseURL: BACKEND_URL });
  const respuesta = await api.post('/api/auth/login', {
    data: { correo: USUARIO_DEMO, contrasena: PASSWORD_DEMO },
  });

  if (!respuesta.ok()) {
    const cuerpo = await respuesta.text();
    throw new Error(`No fue posible iniciar sesion. HTTP ${respuesta.status()} ${cuerpo}`);
  }

  const json = await respuesta.json();
  await api.dispose();
  return json.datos;
}

async function obtenerPrimerPaquete(token) {
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
  const paquetes = Array.isArray(json.datos) ? json.datos : [];
  return paquetes[0] || null;
}

async function crearPaginaAutenticada(browser, sesion) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1180 },
    deviceScaleFactor: 1,
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
    `,
  }).catch(() => undefined);
  return { context, page };
}

async function capturar(page, nombre, ruta, preparador) {
  await page.goto(`${FRONTEND_URL}${ruta}`, { waitUntil: 'networkidle', timeout: 45000 });
  await esperar(900);
  if (preparador) {
    await preparador(page);
    await esperar(500);
  }
  const archivo = path.join(capturasDir, `${nombre}.png`);
  await page.screenshot({ path: archivo, fullPage: false });
  return rel(archivo);
}

async function seleccionarPrimerValor(page, selector) {
  await page.waitForSelector(selector, { timeout: 12000 });
  const valor = await page.$eval(selector, (select) => {
    const opciones = Array.from(select.options).filter((opcion) => opcion.value);
    return opciones[0]?.value || '';
  });
  if (valor) {
    await page.selectOption(selector, valor);
  }
}

async function prepararConsolidacion(page) {
  await seleccionarPrimerValor(page, '#lugarOrigenId');
  await seleccionarPrimerValor(page, '#lugarDestinoId');
  await seleccionarPrimerValor(page, '#usuarioRemitenteId');
  await seleccionarPrimerValor(page, '#usuarioDestinatarioId');
  await page.selectOption('#prioridad', 'media');
  await page.fill('#observacionGeneral', 'Entrega consolidada para el mismo destinatario.');

  await page.fill('#tipoPaquete', 'Documento');
  await page.fill('#descripcion', 'Factura original de proveedor');
  await page.fill('#observaciones', 'Entregar en sobre cerrado');
  await page.getByRole('button', { name: /Agregar a lista/i }).click();

  await page.fill('#tipoPaquete', 'Equipo');
  await page.fill('#descripcion', 'Mouse inalambrico');
  await page.fill('#observaciones', 'Para usuario final');
  await page.getByRole('button', { name: /Agregar a lista/i }).click();
}

function figura(captura, titulo, explicacion, puntos = []) {
  const pins = puntos
    .map((punto, indice) => `<span class="pin" style="left:${punto.x}%;top:${punto.y}%">${indice + 1}</span>`)
    .join('');
  const lista = puntos
    .map((punto, indice) => `<li><strong>${indice + 1}.</strong> ${escapar(punto.texto)}</li>`)
    .join('');

  return `
    <figure class="shot">
      <figcaption>
        <strong>${escapar(titulo)}</strong>
        <span>${escapar(explicacion)}</span>
      </figcaption>
      <div class="shot-frame">
        <img src="${captura}" alt="${escapar(titulo)}" />
        ${pins}
      </div>
      ${lista ? `<ol class="callouts">${lista}</ol>` : ''}
    </figure>
  `;
}

function pasos(items) {
  return `<ol class="steps">${items.map((item) => `<li>${escapar(item)}</li>`).join('')}</ol>`;
}

function tabla(filas) {
  return `
    <table>
      <thead><tr><th>Parte del sistema</th><th>Qué significa en palabras sencillas</th><th>Para qué le sirve a supervisión o gerencia</th></tr></thead>
      <tbody>
        ${filas.map((fila) => `<tr><td>${escapar(fila[0])}</td><td>${escapar(fila[1])}</td><td>${escapar(fila[2])}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function construirHtml(capturas, paqueteDemo) {
  const fecha = new Date().toLocaleString('es-HN', { dateStyle: 'long', timeStyle: 'short' });
  const guiaDemo = paqueteDemo?.numeroGuia || 'APA-000001';

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Manual de uso - appTrackingPaquetesAPA</title>
  <style>
    @page { size: Letter; margin: 0.62in 0.56in 0.68in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #172033;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.48;
      background: #ffffff;
    }
    .doc-header {
      margin-bottom: 0.24in;
      padding: 0.18in 0.2in;
      border-left: 8px solid #1448a8;
      border-radius: 8px;
      background: #f8fbff;
      page-break-after: avoid;
    }
    .kicker { color: #1448a8; font-size: 11pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; }
    h1 { margin: 0; color: #07133d; font-size: 30pt; line-height: 1.05; }
    h2 {
      margin: 0.32in 0 0.12in;
      padding-bottom: 0.05in;
      color: #0f172a;
      font-size: 17pt;
      border-bottom: 2px solid #1448a8;
      page-break-after: avoid;
    }
    h3 { margin: 0.22in 0 0.08in; color: #123f91; font-size: 12.8pt; page-break-after: avoid; }
    p { margin: 0 0 0.1in; font-size: 10.3pt; }
    li { margin-bottom: 0.05in; font-size: 10.15pt; }
    .subtitle { max-width: 7in; color: #46556f; font-size: 12.5pt; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.12in; margin-top: 0.15in; }
    .meta { border: 1px solid #d9e2ef; border-radius: 8px; padding: 0.12in; background: #fbfdff; }
    .meta span { display: block; color: #64748b; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; }
    .meta strong { display: block; margin-top: 0.03in; color: #111827; font-size: 10.5pt; }
    .note {
      margin: 0.12in 0;
      padding: 0.12in 0.15in;
      border-left: 5px solid #1448a8;
      border-radius: 7px;
      background: #eef5ff;
      color: #17335f;
      font-size: 10pt;
    }
    .warning { border-left-color: #d97706; background: #fffbeb; color: #78350f; }
    .toc { columns: 2; column-gap: 0.32in; }
    table { width: 100%; border-collapse: collapse; margin: 0.12in 0 0.18in; font-size: 9.3pt; page-break-inside: avoid; }
    th { background: #1448a8; color: #ffffff; text-align: left; padding: 0.08in; }
    td { border: 1px solid #d7dee8; padding: 0.08in; vertical-align: top; }
    .shot { margin: 0.2in 0 0.26in; page-break-inside: avoid; }
    .shot figcaption { display: grid; gap: 0.03in; margin-bottom: 0.08in; color: #334155; font-size: 9.6pt; }
    .shot figcaption strong { color: #0f172a; font-size: 10.8pt; }
    .shot-frame { position: relative; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background: #f8fafc; box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12); }
    .shot-frame img { display: block; width: 100%; height: auto; }
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
    .callouts { margin: 0.09in 0 0; padding: 0.1in 0.18in 0.08in 0.32in; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
    .steps { padding-left: 0.24in; }
    .two-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.17in; }
    .card { border: 1px solid #dbe4ee; border-radius: 8px; padding: 0.12in; background: #fbfdff; page-break-inside: avoid; }
    .page-break { page-break-before: always; }
    footer { margin-top: 0.25in; color: #64748b; font-size: 8.5pt; text-align: center; }
  </style>
</head>
<body>
  <section class="doc-header">
    <div class="kicker">Almacen Pajaro Azul</div>
    <h1>Manual de uso<br />appTrackingPaquetesAPA</h1>
    <p class="subtitle">Guía práctica para registrar, buscar y dar seguimiento a paquetes internos. Está escrita para que la pueda usar personal de bodega, oficina, supervisión y gerencia.</p>
    <div class="meta-grid">
      <div class="meta"><span>Sistema</span><strong>appTrackingPaquetesAPA</strong></div>
      <div class="meta"><span>Fecha del documento</span><strong>${escapar(fecha)}</strong></div>
      <div class="meta"><span>Acceso al sistema</span><strong>${escapar(FRONTEND_URL)}</strong></div>
      <div class="meta"><span>Responsable</span><strong>Ing. Alexander Varela</strong></div>
    </div>
    <p class="note">Este documento explica qué hacer en cada pantalla, dónde presionar y qué revisar antes de guardar información.</p>
  </section>

  <section>
    <h2>Indice</h2>
    <ol class="toc">
      <li>Para qué sirve el sistema</li>
      <li>Roles y permisos</li>
      <li>Reglas básicas de uso</li>
      <li>Inicio de sesión</li>
      <li>Pantalla de inicio</li>
      <li>Menu lateral</li>
      <li>Paquetes</li>
      <li>Registrar paquete</li>
      <li>Consolidar paquetes</li>
      <li>Detalle e impresión</li>
      <li>Seguimiento</li>
      <li>Problemas reportados</li>
      <li>Comprobantes y archivos de respaldo</li>
      <li>Personal, ubicaciones y estados</li>
      <li>Informes</li>
      <li>Errores comunes</li>
      <li>Buenas practicas</li>
    </ol>
  </section>

  <section>
    <h2>1. Para qué sirve el sistema</h2>
    <p>appTrackingPaquetesAPA ayuda a llevar control de los paquetes internos: quién los envía, hacia dónde van, en qué estado están, qué problema tuvieron y qué comprobante se adjuntó.</p>
    <p>La guía es el número que identifica cada paquete. El formato actual es <strong>APA-000001</strong>. El sistema crea ese número automáticamente; el usuario no debe inventarlo ni escribirlo a mano.</p>
    <div class="note">Forma sencilla de entenderlo: la guía es como el número de turno del paquete. Con ese número se busca rápido y se evita confundir un paquete con otro.</div>
  </section>

  <section>
    <h2>2. Roles y permisos</h2>
    ${tabla([
      ['Administrador', 'Puede revisar y mantener la mayor parte del sistema.', 'Ayuda a controlar usuarios, lugares, reportes y el trabajo general.'],
      ['Usuario', 'Puede registrar y consultar paquetes según los permisos asignados.', 'Sirve para el trabajo diario en bodega, oficina o cualquier área que envía paquetes.'],
      ['Motorista', 'Puede revisar paquetes asignados y registrar avances de entrega.', 'Ayuda a saber por dónde va el paquete y qué pasó durante el traslado.'],
    ])}
  </section>

  <section>
    <h2>3. Reglas básicas de uso</h2>
    ${pasos([
      'No comparta su usuario ni contraseña.',
      'Revise bien de dónde sale el paquete, hacia dónde va, quién lo envía y quién lo recibe antes de guardar.',
      'Use descripciones claras. Ejemplo: Factura original de proveedor, no escriba solo Documento.',
      'Si algo sale mal, registre el problema en el sistema.',
      'Si tiene una foto, PDF o comprobante, súbalo como respaldo.',
      'Al terminar, cierre sesión desde el botón de usuario.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.login, 'Inicio de sesión', 'Pantalla donde se escribe el usuario y la contraseña para entrar.', [
    { x: 62, y: 36, texto: 'Aquí se escribe el correo o usuario asignado.' },
    { x: 62, y: 49, texto: 'Aquí se escribe la contraseña.' },
    { x: 62, y: 64, texto: 'Botón para entrar al sistema.' },
  ])}
  <section>
    <h2>4. Cómo iniciar sesión</h2>
    ${pasos([
      'Abra el navegador.',
      `Entre a ${FRONTEND_URL}/login.`,
      'Escriba el correo asignado.',
      'Escriba la contraseña.',
      'Presione el botón de inicio de sesión.',
      'Si los datos son correctos, verá la pantalla de inicio.',
    ])}
  </section>

  ${figura(capturas.dashboard, 'Pantalla de inicio', 'Resumen rápido del trabajo: paquetes registrados, problemas y comprobantes.', [
    { x: 16, y: 18, texto: 'Menú lateral para entrar a las demás pantallas.' },
    { x: 42, y: 28, texto: 'Cuadros con números importantes del día.' },
    { x: 58, y: 60, texto: 'Resumen visual para revisar cómo va la operación.' },
  ])}
  <section>
    <h2>5. Cómo leer la pantalla de inicio</h2>
    <p>Para bodega u operación, esta pantalla ayuda a saber cuántos paquetes hay, cuántos problemas se han reportado y si existen comprobantes cargados.</p>
    <p>Para supervisión o gerencia, sirve como una vista rápida del movimiento de paquetes y de los puntos que necesitan atención.</p>
  </section>

  <div class="page-break"></div>
  ${figura(capturas.paquetes, 'Lista de paquetes', 'Pantalla principal para buscar paquetes y abrir su información.', [
    { x: 28, y: 23, texto: 'Nombre de la pantalla en la que está trabajando.' },
    { x: 55, y: 23, texto: 'Buscador para escribir la guía del paquete.' },
    { x: 80, y: 23, texto: 'Botones para registrar o actualizar información.' },
    { x: 82, y: 58, texto: 'Opciones para ver el paquete o revisar sus movimientos.' },
  ])}
  <section>
    <h2>6. Paquetes</h2>
    ${pasos([
      'Entre al menú Paquetes.',
      'Revise la lista de paquetes registrados.',
      `Para buscar un paquete, escriba una guía como ${guiaDemo}.`,
      'Use Ver detalle para revisar toda la información.',
      'Use Seguimiento para ver los movimientos del paquete.',
    ])}
  </section>

  ${figura(capturas.paqueteNuevo, 'Registrar un paquete', 'Formulario para crear un paquete nuevo.', [
    { x: 31, y: 33, texto: 'Tipo de paquete, prioridad y descripción.' },
    { x: 52, y: 53, texto: 'De dónde sale, hacia dónde va, quién envía y quién recibe.' },
    { x: 50, y: 82, texto: 'Botón para guardar el paquete.' },
  ])}
  <section>
    <h2>7. Registrar un paquete</h2>
    ${pasos([
      'Presione Registrar paquete.',
      'Seleccione el tipo de paquete y la prioridad.',
      'Escriba una descripción clara.',
      'Seleccione origen y destino.',
      'Seleccione remitente y destinatario.',
      'Seleccione motorista si aplica.',
      'Presione Registrar paquete.',
      'El sistema guarda el paquete y crea su guía automáticamente.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.consolidar, 'Registrar varios paquetes juntos', 'Pantalla para preparar varios paquetes y guardarlos al final.', [
    { x: 28, y: 34, texto: 'Datos que se repetirán en todos los paquetes.' },
    { x: 29, y: 66, texto: 'Formulario para agregar cada paquete a la lista.' },
    { x: 78, y: 36, texto: 'Resumen de lo que se está preparando.' },
    { x: 48, y: 84, texto: 'Lista temporal: permite revisar, editar o quitar antes de guardar.' },
  ])}
  <section>
    <h2>8. Registrar varios paquetes juntos</h2>
    <p>Use esta pantalla cuando varios paquetes tienen datos parecidos, por ejemplo el mismo destino o la misma persona que recibe. Mientras solo agregue paquetes a la lista, todavía no quedan guardados de forma definitiva.</p>
    ${pasos([
      'Seleccione los datos que se repetirán: origen, destino, remitente, destinatario y prioridad.',
      'Escriba tipo, descripción y observaciones del primer paquete.',
      'Presione Agregar a lista.',
      'Repita el proceso para cada paquete adicional.',
      'Revise la lista antes de guardar.',
      'Si un dato está mal, use Editar. Si un paquete no debe ir, use Quitar.',
      'Presione Guardar todos cuando la lista esté correcta.',
      'El sistema crea cada paquete por separado y genera una guía para cada uno.',
    ])}
    <div class="note">Ejemplo: si guarda tres paquetes, el sistema puede crear APA-000001, APA-000002 y APA-000003. Cada guía se busca después por separado.</div>
  </section>

  ${figura(capturas.detalle, 'Detalle del paquete', 'Vista completa de un paquete ya registrado.', [
    { x: 29, y: 20, texto: 'Número de guía y datos principales.' },
    { x: 74, y: 19, texto: 'Botones para ver movimientos o imprimir.' },
    { x: 48, y: 58, texto: 'Datos importantes del envío.' },
  ])}
  <section>
    <h2>9. Detalle del paquete</h2>
    <p>El detalle sirve para confirmar toda la información de un paquete. Desde aquí se revisa la guía, prioridad, origen, destino, personas relacionadas y observaciones.</p>
  </section>

  ${figura(capturas.imprimir, 'Hoja para imprimir', 'Formato limpio para imprimir la hoja del envío interno.', [
    { x: 53, y: 18, texto: 'Encabezado con logo y guía.' },
    { x: 46, y: 45, texto: 'Datos de origen y destino.' },
    { x: 53, y: 76, texto: 'Detalle del envio y firmas.' },
  ])}
  <section>
    <h2>10. Imprimir hoja de envio</h2>
    ${pasos([
      'Abra el detalle del paquete.',
      'Presione la opcion de impresion si esta disponible.',
      'Revise que la guía, origen, destino y descripción sean correctos.',
      'Presione Imprimir.',
      'En la impresión no deben salir menú lateral ni botones del sistema.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.tracking, 'Seguimiento por guía', 'Historial de movimientos del paquete.', [
    { x: 40, y: 23, texto: 'Campo para buscar por guía.' },
    { x: 28, y: 48, texto: 'Fecha del movimiento.' },
    { x: 58, y: 48, texto: 'Estado y ubicación del paquete.' },
    { x: 78, y: 48, texto: 'Descripción del evento.' },
  ])}
  <section>
    <h2>11. Seguimiento</h2>
    <p>Seguimiento responde a la pregunta: qué ha pasado con este paquete. Cada movimiento queda ordenado por fecha.</p>
    ${pasos([
      'Entre a Seguimiento.',
      `Escriba una guía, por ejemplo ${guiaDemo}.`,
      'Presione Buscar.',
      'Revise la tabla de movimientos.',
    ])}
  </section>

  ${figura(capturas.incidencias, 'Problemas reportados', 'Pantalla para registrar y revisar problemas encontrados con un paquete.', [
    { x: 26, y: 30, texto: 'Campos para buscar o registrar un problema.' },
    { x: 54, y: 58, texto: 'Lista de problemas registrados.' },
    { x: 82, y: 33, texto: 'Acciones disponibles según el permiso del usuario.' },
  ])}
  <section>
    <h2>12. Problemas</h2>
    <p>Registre un problema cuando algo no vaya normal: paquete demorado, dato incorrecto, entrega incompleta, extravío o daño.</p>
  </section>

  ${figura(capturas.evidencias, 'Comprobantes y archivos de respaldo', 'Pantalla para consultar o subir archivos relacionados con un paquete.', [
    { x: 28, y: 30, texto: 'Datos para relacionar el archivo con el paquete.' },
    { x: 54, y: 58, texto: 'Listado de comprobantes existentes.' },
    { x: 82, y: 33, texto: 'Botones para cargar o descargar archivos.' },
  ])}
  <section>
    <h2>13. Comprobantes</h2>
    <p>Use comprobantes para respaldar una entrega, un problema o una recepción. Los archivos permitidos son JPG, JPEG, PNG y PDF, con límite de 5 MB.</p>
  </section>

  <div class="page-break"></div>
  ${figura(capturas.usuarios, 'Personal', 'Pantalla para mantener las personas que usan el sistema.', [
    { x: 26, y: 28, texto: 'Formulario o resumen de la persona.' },
    { x: 55, y: 58, texto: 'Lista de personal registrado.' },
    { x: 82, y: 30, texto: 'Acciones de mantenimiento.' },
  ])}
  ${figura(capturas.lugares, 'Ubicaciones', 'Lista de sucursales, bodegas o departamentos.', [
    { x: 28, y: 30, texto: 'Datos de la ubicación.' },
    { x: 54, y: 58, texto: 'Listado de ubicaciones.' },
  ])}
  ${figura(capturas.estados, 'Estados del paquete', 'Lista de etapas que puede tener un paquete.', [
    { x: 28, y: 30, texto: 'Nombre y orden del estado.' },
    { x: 54, y: 58, texto: 'Listado de estados configurados.' },
  ])}
  <section>
    <h2>14. Personal, ubicaciones y estados</h2>
    <p>Estas pantallas sirven para mantener ordenada la información base. Si estos datos están bien, al registrar paquetes se cometen menos errores.</p>
    ${tabla([
      ['Personal', 'Registra usuarios, motoristas y administradores.', 'Controla quiénes pueden entrar y qué rol tienen.'],
      ['Ubicaciones', 'Registra lugares de origen, destino o trabajo.', 'Permite revisar movimientos por área o sucursal.'],
      ['Estados', 'Define las etapas del paquete.', 'Evita que cada persona escriba un estado diferente para la misma situación.'],
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.reportes, 'Informes', 'Pantalla para revisar resúmenes útiles de la operación.', [
    { x: 30, y: 28, texto: 'Opciones de informes disponibles.' },
    { x: 56, y: 58, texto: 'Resultados de paquetes, problemas o actividad.' },
  ])}
  <section>
    <h2>15. Informes para supervisión</h2>
    <p>Los informes muestran información reunida en un solo lugar. Para gerencia, ayudan a ver cuántos paquetes se mueven, qué problemas siguen pendientes y qué actividad reciente existe.</p>
  </section>

  <section>
    <h2>16. Errores comunes y que hacer</h2>
    ${tabla([
      ['Guía mal escrita', 'La guía debe verse como APA-000001.', 'Evita búsquedas con códigos viejos o mal escritos.'],
      ['Datos incompletos', 'Falta un campo obligatorio o el dato no tiene el formato correcto.', 'Ayuda a guardar información limpia y confiable.'],
      ['No tiene permiso', 'El usuario no puede hacer esa acción.', 'Protege pantallas administrativas o delicadas.'],
      ['Paquete no encontrado', 'La guía no existe o el usuario no tiene acceso a ese paquete.', 'Puede indicar error al escribir la guía o falta de permiso.'],
      ['Archivo no permitido', 'Solo se aceptan JPG, JPEG, PNG o PDF hasta 5 MB.', 'Evita archivos pesados o formatos que no corresponden.'],
    ])}
  </section>

  <section>
    <h2>17. Buenas practicas</h2>
    <div class="two-col">
      <div class="card">
        <h3>Para bodega y usuarios operativos</h3>
        ${pasos([
          'Escriba descripciones claras y fáciles de entender.',
          'Revise destino y destinatario antes de guardar.',
          'Use Registrar varios paquetes juntos cuando son varios paquetes para la misma persona.',
          'Suba comprobantes cuando tenga una foto, PDF o respaldo útil.',
          'Cierre sesión al terminar.',
        ])}
      </div>
      <div class="card">
        <h3>Para supervisión y gerencia</h3>
        ${pasos([
          'Revise la pantalla de inicio e informes con frecuencia.',
          'Observe problemas abiertos.',
          'Mantenga usuarios y ubicaciones actualizados.',
          'Pida que cada movimiento importante quede registrado.',
          'Use las guías para revisar entregas y tiempos.',
        ])}
      </div>
    </div>
  </section>

  <footer>appTrackingPaquetesAPA | Manual de usuario</footer>
</body>
</html>`;
}

async function main() {
  asegurarDirectorios();
  const sesion = await autenticar();
  const paqueteDemo = await obtenerPrimerPaquete(sesion.token);
  const browser = await chromium.launch({ headless: true });

  const loginContext = await browser.newContext({ viewport: { width: 1440, height: 1180 } });
  const loginPage = await loginContext.newPage();
  const login = await capturar(loginPage, '01-login', '/login');
  await loginContext.close();

  const { context, page } = await crearPaginaAutenticada(browser, sesion);
  const capturas = {
    login,
    dashboard: await capturar(page, '02-dashboard', '/dashboard'),
    paquetes: await capturar(page, '03-paquetes', '/paquetes'),
    paqueteNuevo: await capturar(page, '04-registrar-paquete', '/paquetes/nuevo'),
    consolidar: await capturar(page, '05-consolidar-paquetes', '/paquetes/consolidar', prepararConsolidacion),
    detalle: paqueteDemo ? await capturar(page, '06-detalle-paquete', `/paquetes/${paqueteDemo._id || paqueteDemo.id}`) : await capturar(page, '06-detalle-paquete', '/paquetes'),
    imprimir: paqueteDemo ? await capturar(page, '07-hoja-imprimible', `/paquetes/${paqueteDemo._id || paqueteDemo.id}/imprimir`) : await capturar(page, '07-hoja-imprimible', '/paquetes'),
    tracking: await capturar(page, '08-seguimiento', `/tracking/${paqueteDemo?.numeroGuia || 'APA-000001'}`),
    incidencias: await capturar(page, '09-problemas', '/incidencias'),
    evidencias: await capturar(page, '10-comprobantes', '/evidencias'),
    usuarios: await capturar(page, '11-personal', '/usuarios'),
    lugares: await capturar(page, '12-ubicaciones', '/lugares'),
    estados: await capturar(page, '13-estados-paquete', '/estados'),
    reportes: await capturar(page, '14-informes', '/reportes'),
  };

  const html = construirHtml(capturas, paqueteDemo);
  fs.writeFileSync(htmlPath, html, 'utf8');

  await page.goto(`file://${htmlPath.replaceAll(path.sep, '/')}`, { waitUntil: 'networkidle' });
  await page.pdf({ path: pdfPath, format: 'Letter', printBackground: true });

  await context.close();
  await browser.close();

  console.log(`Manual HTML: ${htmlPath}`);
  console.log(`Manual PDF: ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
