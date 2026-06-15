// Genera un manual de usuario detallado con capturas reales del frontend en ejecucion.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium, request } = requireFrontend('@playwright/test');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4300';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3180';
const USUARIO_DEMO = process.env.USUARIO_DEMO || 'sistemas@pajaroazul.com';
const PASSWORD_DEMO = process.env.PASSWORD_DEMO || 'Sistemas*2026';

const salidaDir = path.join(raizProyecto, 'documentacion', 'manual-usuario-detallado');
const capturasDir = path.join(salidaDir, 'capturas');
const htmlPath = path.join(salidaDir, 'manual-usuario-detallado.html');
const pdfPath = path.join(salidaDir, 'manual-usuario-detallado.pdf');

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
      <thead><tr><th>Elemento</th><th>Explicacion sencilla</th><th>Uso para supervision o gerencia</th></tr></thead>
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
  <title>Manual de usuario detallado - appTrackingPaquetesAPA</title>
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
    .cover {
      min-height: 9.4in;
      display: grid;
      align-content: center;
      gap: 0.22in;
      padding: 0.5in 0.35in;
      page-break-after: always;
      border-left: 12px solid #1448a8;
      background: linear-gradient(135deg, #f8fbff 0%, #ffffff 72%);
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
  <main class="cover">
    <div class="kicker">Almacen Pajaro Azul</div>
    <h1>Manual de usuario detallado<br />appTrackingPaquetesAPA</h1>
    <p class="subtitle">Guia practica para usar el sistema de control y seguimiento interno de paquetes. Esta version incluye capturas reales tomadas del frontend funcionando.</p>
    <div class="meta-grid">
      <div class="meta"><span>Sistema</span><strong>appTrackingPaquetesAPA</strong></div>
      <div class="meta"><span>Fecha de generacion</span><strong>${escapar(fecha)}</strong></div>
      <div class="meta"><span>Frontend</span><strong>${escapar(FRONTEND_URL)}</strong></div>
      <div class="meta"><span>Usuario demo</span><strong>${escapar(USUARIO_DEMO)}</strong></div>
    </div>
    <p class="note">Este manual esta escrito en lenguaje claro. La idea es que una persona que sabe leer pueda seguir los pasos, y que un gerente tambien pueda entender el valor operativo y de control de cada pantalla.</p>
  </main>

  <section>
    <h2>Indice</h2>
    <ol class="toc">
      <li>Para que sirve el sistema</li>
      <li>Roles y permisos</li>
      <li>Reglas basicas de uso</li>
      <li>Inicio de sesion</li>
      <li>Dashboard</li>
      <li>Menu lateral</li>
      <li>Paquetes</li>
      <li>Registrar paquete</li>
      <li>Consolidar paquetes</li>
      <li>Detalle e impresion</li>
      <li>Seguimiento</li>
      <li>Problemas e incidencias</li>
      <li>Comprobantes y evidencias</li>
      <li>Personal, ubicaciones y estados</li>
      <li>Informes</li>
      <li>Errores comunes</li>
      <li>Buenas practicas</li>
    </ol>
  </section>

  <section>
    <h2>1. Para que sirve el sistema</h2>
    <p>appTrackingPaquetesAPA sirve para registrar paquetes internos, darles seguimiento por numero de guia, consultar su estado, reportar problemas, subir comprobantes y revisar informacion administrativa.</p>
    <p>Una guia es el codigo que identifica un paquete. El formato actual es <strong>APA-000001</strong>. La guia la genera el sistema; el usuario no debe escribirla manualmente.</p>
    <div class="note">Idea sencilla: si el paquete fuera una persona en una fila, la guia seria su numero de turno. Con ese numero se puede encontrar rapidamente en el sistema.</div>
  </section>

  <section>
    <h2>2. Roles y permisos</h2>
    ${tabla([
      ['Administrador', 'Puede revisar y administrar casi todo el sistema.', 'Permite control de usuarios, catalogos, reportes y supervision general.'],
      ['Usuario', 'Puede registrar y consultar paquetes segun permisos.', 'Sirve para operacion diaria en oficina, bodega o departamento.'],
      ['Motorista', 'Puede consultar paquetes asignados y registrar avances.', 'Apoya el control de entrega y trazabilidad de movimientos.'],
    ])}
  </section>

  <section>
    <h2>3. Reglas basicas de uso</h2>
    ${pasos([
      'No comparta su usuario ni contrasena.',
      'Revise bien origen, destino, remitente y destinatario antes de guardar.',
      'Use descripciones claras. Ejemplo: Factura original de proveedor, no solo Documento.',
      'Si hay un problema, registre una incidencia.',
      'Si tiene una foto, PDF o comprobante, subalo como evidencia.',
      'Al terminar, cierre sesion desde la burbuja inferior del usuario.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.login, 'Inicio de sesion', 'Pantalla donde el usuario ingresa sus credenciales para entrar al sistema.', [
    { x: 62, y: 36, texto: 'Campo para escribir correo o usuario.' },
    { x: 62, y: 49, texto: 'Campo para escribir la contrasena.' },
    { x: 62, y: 64, texto: 'Boton para entrar al sistema.' },
  ])}
  <section>
    <h2>4. Como iniciar sesion</h2>
    ${pasos([
      'Abra el navegador.',
      `Entre a ${FRONTEND_URL}/login.`,
      'Escriba el correo asignado.',
      'Escriba la contrasena.',
      'Presione el boton de inicio de sesion.',
      'Si los datos son correctos, vera la pantalla de inicio o dashboard.',
    ])}
  </section>

  ${figura(capturas.dashboard, 'Dashboard o pantalla de inicio', 'Resumen rapido de la operacion. Ayuda a ver cantidad de paquetes, problemas y comprobantes.', [
    { x: 16, y: 18, texto: 'Menu lateral con todas las pantallas principales.' },
    { x: 42, y: 28, texto: 'Tarjetas con indicadores principales.' },
    { x: 58, y: 60, texto: 'Resumen y distribucion de paquetes.' },
  ])}
  <section>
    <h2>5. Como leer el dashboard</h2>
    <p>Para una persona operativa, esta pantalla responde: cuantos paquetes hay, cuantos problemas existen y si hay comprobantes cargados.</p>
    <p>Para gerencia, esta pantalla sirve como vista rapida de volumen de trabajo, incidencias pendientes y actividad general.</p>
  </section>

  <div class="page-break"></div>
  ${figura(capturas.paquetes, 'Listado de paquetes', 'Pantalla principal para consultar paquetes, buscar por guia y abrir detalle o seguimiento.', [
    { x: 28, y: 23, texto: 'Titulo de la pantalla.' },
    { x: 55, y: 23, texto: 'Buscador por numero de guia.' },
    { x: 80, y: 23, texto: 'Acciones para registrar o actualizar.' },
    { x: 82, y: 58, texto: 'Acciones por paquete: detalle y seguimiento.' },
  ])}
  <section>
    <h2>6. Paquetes</h2>
    ${pasos([
      'Entre al menu Paquetes.',
      'Revise la lista de paquetes registrados.',
      `Para buscar un paquete, escriba una guia como ${guiaDemo}.`,
      'Use Ver detalle para revisar toda la informacion.',
      'Use Seguimiento para ver los movimientos del paquete.',
    ])}
  </section>

  ${figura(capturas.paqueteNuevo, 'Registrar paquete individual', 'Formulario para crear un solo paquete.', [
    { x: 31, y: 33, texto: 'Tipo, prioridad y descripcion.' },
    { x: 52, y: 53, texto: 'Origen, destino, remitente y destinatario.' },
    { x: 50, y: 82, texto: 'Boton para registrar el paquete.' },
  ])}
  <section>
    <h2>7. Registrar un paquete</h2>
    ${pasos([
      'Presione Registrar paquete.',
      'Seleccione tipo de paquete y prioridad.',
      'Escriba una descripcion clara.',
      'Seleccione origen y destino.',
      'Seleccione remitente y destinatario.',
      'Seleccione motorista si aplica.',
      'Presione Registrar paquete.',
      'El sistema guarda el paquete y genera su guia automaticamente.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.consolidar, 'Consolidar paquetes', 'Pantalla para armar una lista temporal y guardar varios paquetes al final.', [
    { x: 28, y: 34, texto: 'Datos comunes para todos los paquetes del lote.' },
    { x: 29, y: 66, texto: 'Formulario para agregar cada paquete a la lista.' },
    { x: 78, y: 36, texto: 'Resumen del lote temporal.' },
    { x: 48, y: 84, texto: 'Tabla temporal: se puede editar, quitar o guardar todo.' },
  ])}
  <section>
    <h2>8. Consolidar paquetes</h2>
    <p>Use esta pantalla cuando varios paquetes comparten datos, por ejemplo mismo destino y mismo destinatario. El sistema no guarda nada en MongoDB mientras usted solo agrega a la lista temporal.</p>
    ${pasos([
      'Seleccione los datos comunes: origen, destino, remitente, destinatario y prioridad.',
      'Escriba tipo, descripcion y observaciones del primer paquete.',
      'Presione Agregar a lista.',
      'Repita el proceso para cada paquete adicional.',
      'Revise la tabla temporal.',
      'Si un dato esta mal, use Editar. Si no debe ir, use Quitar.',
      'Presione Guardar todos cuando la lista este correcta.',
      'El backend crea cada paquete por separado y genera una guia para cada uno.',
    ])}
    <div class="note">Ejemplo: si guarda tres paquetes, el sistema puede responder con APA-000001, APA-000002 y APA-000003. Cada guia se puede buscar despues en Paquetes o Seguimiento.</div>
  </section>

  ${figura(capturas.detalle, 'Detalle del paquete', 'Vista completa de un paquete ya registrado.', [
    { x: 29, y: 20, texto: 'Numero de guia y datos principales.' },
    { x: 74, y: 19, texto: 'Accesos para seguimiento o impresion.' },
    { x: 48, y: 58, texto: 'Datos operativos del envio.' },
  ])}
  <section>
    <h2>9. Detalle del paquete</h2>
    <p>El detalle sirve para confirmar toda la informacion de un paquete. Desde aqui se puede revisar la guia, prioridad, origen, destino, usuarios relacionados y observaciones.</p>
  </section>

  ${figura(capturas.imprimir, 'Hoja imprimible', 'Formato limpio para imprimir la hoja de envio interno.', [
    { x: 53, y: 18, texto: 'Encabezado con logo y guia.' },
    { x: 46, y: 45, texto: 'Datos de origen y destino.' },
    { x: 53, y: 76, texto: 'Detalle del envio y firmas.' },
  ])}
  <section>
    <h2>10. Imprimir hoja de envio</h2>
    ${pasos([
      'Abra el detalle del paquete.',
      'Presione la opcion de impresion si esta disponible.',
      'Revise que la guia, origen, destino y descripcion sean correctos.',
      'Presione Imprimir.',
      'En la impresion no deben salir menu lateral ni botones del sistema.',
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.tracking, 'Seguimiento por guia', 'Historial de movimientos del paquete.', [
    { x: 40, y: 23, texto: 'Campo para buscar por guia.' },
    { x: 28, y: 48, texto: 'Fecha del movimiento.' },
    { x: 58, y: 48, texto: 'Estado y ubicacion del paquete.' },
    { x: 78, y: 48, texto: 'Descripcion del evento.' },
  ])}
  <section>
    <h2>11. Seguimiento</h2>
    <p>Seguimiento responde a la pregunta: que ha pasado con este paquete. Cada movimiento queda ordenado por fecha.</p>
    ${pasos([
      'Entre a Seguimiento.',
      `Escriba una guia, por ejemplo ${guiaDemo}.`,
      'Presione Buscar.',
      'Revise la tabla de movimientos.',
    ])}
  </section>

  ${figura(capturas.incidencias, 'Problemas o incidencias', 'Pantalla para reportar problemas encontrados con un paquete.', [
    { x: 26, y: 30, texto: 'Formulario o filtros de incidencia.' },
    { x: 54, y: 58, texto: 'Listado de problemas registrados.' },
    { x: 82, y: 33, texto: 'Acciones segun permisos.' },
  ])}
  <section>
    <h2>12. Problemas</h2>
    <p>Registre una incidencia cuando algo no va normal: paquete demorado, dato incorrecto, entrega incompleta, extravio o dano.</p>
  </section>

  ${figura(capturas.evidencias, 'Comprobantes y evidencias', 'Pantalla para consultar o subir archivos relacionados con un paquete.', [
    { x: 28, y: 30, texto: 'Datos para asociar evidencia al paquete.' },
    { x: 54, y: 58, texto: 'Listado de comprobantes existentes.' },
    { x: 82, y: 33, texto: 'Carga o descarga de archivos.' },
  ])}
  <section>
    <h2>13. Comprobantes</h2>
    <p>Use comprobantes para respaldar una entrega, un problema o una recepcion. Los archivos permitidos son JPG, JPEG, PNG y PDF, con limite de 5 MB.</p>
  </section>

  <div class="page-break"></div>
  ${figura(capturas.usuarios, 'Personal', 'Administracion de usuarios del sistema.', [
    { x: 26, y: 28, texto: 'Formulario o resumen de usuario.' },
    { x: 55, y: 58, texto: 'Lista de personal registrado.' },
    { x: 82, y: 30, texto: 'Acciones de mantenimiento.' },
  ])}
  ${figura(capturas.lugares, 'Ubicaciones', 'Catalogo de sucursales, bodegas o departamentos.', [
    { x: 28, y: 30, texto: 'Datos de la ubicacion.' },
    { x: 54, y: 58, texto: 'Listado de ubicaciones.' },
  ])}
  ${figura(capturas.estados, 'Estados del paquete', 'Catalogo de etapas que puede tener un paquete.', [
    { x: 28, y: 30, texto: 'Nombre y orden del estado.' },
    { x: 54, y: 58, texto: 'Listado de estados configurados.' },
  ])}
  <section>
    <h2>14. Personal, ubicaciones y estados</h2>
    <p>Estas pantallas son de mantenimiento. Mantenerlas ordenadas ayuda a que los paquetes tengan datos correctos desde el registro.</p>
    ${tabla([
      ['Personal', 'Registra usuarios, motoristas y administradores.', 'Controla quienes pueden entrar y que rol tienen.'],
      ['Ubicaciones', 'Registra lugares de origen, destino o trabajo.', 'Permite analizar movimientos por area o sucursal.'],
      ['Estados', 'Define etapas del paquete.', 'Estandariza el seguimiento y evita nombres distintos para el mismo estado.'],
    ])}
  </section>

  <div class="page-break"></div>
  ${figura(capturas.reportes, 'Informes', 'Pantalla para consultar salidas administrativas.', [
    { x: 30, y: 28, texto: 'Resumen de reportes disponibles.' },
    { x: 56, y: 58, texto: 'Resultados de paquetes, incidencias o actividad.' },
  ])}
  <section>
    <h2>15. Informes para supervision</h2>
    <p>Los informes sirven para revisar datos agrupados. Para un gerente, esta pantalla ayuda a detectar volumen de paquetes, problemas pendientes y actividad reciente.</p>
  </section>

  <section>
    <h2>16. Errores comunes y que hacer</h2>
    ${tabla([
      ['Formato de guia invalido', 'La guia debe verse como APA-000001.', 'Evita busquedas sobre codigos viejos o mal escritos.'],
      ['Datos invalidos', 'Falta un campo obligatorio o el dato no cumple formato.', 'Garantiza calidad de datos antes de guardar.'],
      ['No tiene permisos', 'El usuario no puede ejecutar esa accion.', 'Protege operaciones administrativas o sensibles.'],
      ['Paquete no encontrado', 'La guia o id no existe para el usuario actual.', 'Puede indicar error de escritura o falta de acceso.'],
      ['Archivo no permitido', 'Solo se aceptan JPG, JPEG, PNG o PDF hasta 5 MB.', 'Controla riesgos y uso de almacenamiento.'],
    ])}
  </section>

  <section>
    <h2>17. Buenas practicas</h2>
    <div class="two-col">
      <div class="card">
        <h3>Para usuarios operativos</h3>
        ${pasos([
          'Escriba descripciones claras.',
          'Revise destino y destinatario antes de guardar.',
          'Use consolidacion cuando son varios paquetes para la misma persona.',
          'Suba comprobantes cuando exista evidencia util.',
          'Cierre sesion al terminar.',
        ])}
      </div>
      <div class="card">
        <h3>Para supervision y gerencia</h3>
        ${pasos([
          'Revise dashboard e informes con frecuencia.',
          'Observe incidencias abiertas.',
          'Mantenga usuarios y ubicaciones actualizados.',
          'Pida que cada movimiento importante quede registrado.',
          'Use las guias para auditar entregas y tiempos.',
        ])}
      </div>
    </div>
  </section>

  <footer>Manual generado con capturas reales del sistema appTrackingPaquetesAPA.</footer>
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

  await page.setContent(html, { waitUntil: 'networkidle' });
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
