const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const raizProyecto = path.resolve(__dirname, '..', '..');
const requireFrontend = createRequire(path.join(raizProyecto, 'frontend', 'package.json'));
const { chromium } = requireFrontend('@playwright/test');

const salidaDir = path.join(raizProyecto, 'documentacion', 'base-datos');
const htmlPath = path.join(salidaDir, 'diagrama-base-datos.html');
const pdfPath = path.join(salidaDir, 'diagrama-base-datos-appTrackingPaquetesAPA.pdf');
const pngPath = path.join(salidaDir, 'diagrama-base-datos-appTrackingPaquetesAPA.png');
const logoPath = path.join(raizProyecto, 'frontend', 'public', 'assets', 'login', 'logoAPA.jpg');

function cargarLogoDataUri() {
  const logoBytes = fs.readFileSync(logoPath);
  return `data:image/jpeg;base64,${logoBytes.toString('base64')}`;
}

function campo(texto, tipo = '') {
  return `<tspan x="0" dy="16">${texto}${tipo ? ` : ${tipo}` : ''}</tspan>`;
}

function entidad(id, x, y, w, h, titulo, subtitulo, campos, clase = '') {
  const lineas = campos.map((c) => campo(c[0], c[1])).join('');
  return `
    <g id="${id}" class="entity ${clase}" transform="translate(${x},${y})">
      <rect class="entity-box" width="${w}" height="${h}" rx="0" />
      <rect class="entity-head" width="${w}" height="30" rx="0" />
      <text class="entity-title" x="${w / 2}" y="20" text-anchor="middle">${titulo}</text>
      <text class="entity-subtitle" x="${w / 2}" y="45" text-anchor="middle">${subtitulo}</text>
      <text class="fields" transform="translate(14,58)">${lineas}</text>
    </g>
  `;
}

function linea(x1, y1, x2, y2, texto, dashed = false) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 8;
  return `
    <g class="relation ${dashed ? 'dashed' : ''}">
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
      <circle cx="${x1}" cy="${y1}" r="3.2" />
      <path d="M ${x2} ${y2} l -9 -5 m 9 5 l -9 5" />
      <text x="${midX}" y="${midY}" text-anchor="middle">${texto}</text>
    </g>
  `;
}

function ruta(puntos, numero, tagX, tagY, dashed = false) {
  const d = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const [x1, y1] = puntos[0];
  return `
    <g class="relation ${dashed ? 'dashed' : ''}">
      <path class="relation-path" d="${d}" marker-end="${dashed ? 'url(#arrow-dashed)' : 'url(#arrow)'}" />
      <circle cx="${x1}" cy="${y1}" r="3.2" />
      <circle class="relation-tag" cx="${tagX}" cy="${tagY}" r="10" />
      <text class="relation-number" x="${tagX}" y="${tagY + 4}" text-anchor="middle">${numero}</text>
    </g>
  `;
}

function construirHtml(logoDataUri) {
  const fecha = new Intl.DateTimeFormat('es-HN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Tegucigalpa',
  }).format(new Date());

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Diagrama de Base de Datos - appTrackingPaquetesAPA</title>
  <style>
    html, body {
      margin: 0;
      background: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    }
    .sheet {
      width: 1700px;
      height: 1100px;
      margin: 0 auto;
      background: #fff;
    }
    svg {
      display: block;
      width: 1700px;
      height: 1100px;
      background: #fff;
    }
    text {
      fill: #111;
      letter-spacing: 0;
    }
    .border { fill: none; stroke: #000; stroke-width: 2; }
    .thin { fill: none; stroke: #000; stroke-width: 1; }
    .grid-label { font-size: 14px; font-weight: 700; }
    .title { font-size: 27px; font-weight: 700; }
    .subtitle { font-size: 16px; font-weight: 700; }
    .entity-box { fill: #fff; stroke: #000; stroke-width: 1.6; }
    .entity-head { fill: #eef2f7; stroke: #000; stroke-width: 1.2; }
    .entity-title { font-size: 15px; font-weight: 700; }
    .entity-subtitle { font-size: 11px; font-weight: 700; }
    .fields { font-size: 11px; font-family: Arial, Helvetica, sans-serif; }
    .center .entity-head { fill: #e4eefb; }
    .catalog .entity-head { fill: #edf7ed; }
    .child .entity-head { fill: #fff4dc; }
    .audit .entity-head { fill: #f1eaff; }
    .relation .relation-path,
    .relation > circle:not(.relation-tag) {
      fill: none;
      stroke: #000;
      stroke-width: 1.35;
    }
    .relation-tag {
      fill: #fff;
      stroke: #000;
      stroke-width: 1.2;
    }
    .relation-number {
      font-size: 10.5px;
      font-weight: 700;
      fill: #111;
    }
    .dashed .relation-path,
    .dashed > circle:not(.relation-tag) {
      stroke-dasharray: 7 5;
    }
    .note-title,
    .ref-title {
      font-size: 14px;
      font-weight: 700;
    }
    .note-text,
    .ref-text,
    .cartouche {
      font-size: 11px;
    }
    .cartouche-title {
      font-size: 10px;
      font-weight: 700;
    }
    .logo {
      image-rendering: auto;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <svg viewBox="0 0 1700 1100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
        </marker>
        <marker id="arrow-dashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
        </marker>
      </defs>
      <rect class="border" x="10" y="8" width="1680" height="1084" />
      <rect class="thin" x="36" y="32" width="1628" height="968" />

      <!-- Coordenadas superiores -->
      ${Array.from({ length: 8 }, (_, i) => {
        const x = 36 + i * (1628 / 8);
        return `<line class="thin" x1="${x}" y1="8" x2="${x}" y2="32" /><text class="grid-label" x="${x + 1628 / 16}" y="24" text-anchor="middle">${i + 1}</text>`;
      }).join('')}
      <line class="thin" x1="1664" y1="8" x2="1664" y2="32" />

      <!-- Coordenadas laterales -->
      ${['A', 'B', 'C', 'D', 'E', 'F'].map((letra, i) => {
        const y = 32 + i * (968 / 6);
        return `<line class="thin" x1="10" y1="${y}" x2="36" y2="${y}" /><text class="grid-label" x="22" y="${y + 968 / 12 + 4}" text-anchor="middle">${letra}</text>`;
      }).join('')}

      <text class="title" x="850" y="72" text-anchor="middle">DIAGRAMA DE BASE DE DATOS - APPTRACKINGPAQUETESAPA</text>
      <text class="subtitle" x="850" y="100" text-anchor="middle">MODELO DOCUMENTAL MONGODB / RELACIONES OPERATIVAS DEL SISTEMA</text>
      <image class="logo" href="${logoDataUri}" x="60" y="48" width="188" height="48" preserveAspectRatio="xMidYMid meet" />

      <!-- Entidades -->
      ${entidad('estado', 700, 140, 300, 172, 'ESTADO', 'Catalogo de avance del paquete', [
        ['PK _id', 'ObjectId'],
        ['UK nombre', 'String'],
        ['orden', 'Number'],
        ['descripcion', 'String'],
        ['estado', 'Boolean'],
        ['fechaCreacion / fechaActualizacion', 'Date'],
      ], 'catalog')}

      ${entidad('usuario', 90, 210, 360, 230, 'USUARIO', 'Personas que operan o consultan', [
        ['PK _id', 'ObjectId'],
        ['UK correo', 'String'],
        ['UK codigoEmpleado', 'String'],
        ['nombre', 'String'],
        ['contrasena', 'String'],
        ['rol', 'usuario | motorista | administrador'],
        ['FK lugarAsignadoId', 'Lugar'],
        ['estado', 'Boolean'],
        ['fechaCreacion / fechaActualizacion', 'Date'],
      ], 'catalog')}

      ${entidad('lugar', 90, 570, 360, 182, 'LUGAR', 'Bodegas, sucursales y destinos', [
        ['PK _id', 'ObjectId'],
        ['nombre', 'String'],
        ['ciudad', 'String'],
        ['direccion', 'String'],
        ['descripcion', 'String'],
        ['estado', 'Boolean'],
        ['fechaCreacion / fechaActualizacion', 'Date'],
      ], 'catalog')}

      ${entidad('paquete', 620, 360, 460, 300, 'PAQUETE', 'Registro central del envio', [
        ['PK _id', 'ObjectId'],
        ['UK numeroGuia', 'String'],
        ['descripcion', 'String'],
        ['tipoPaquete', 'String'],
        ['prioridad', 'baja | media | alta'],
        ['FK estadoActualId', 'Estado'],
        ['FK lugarOrigenId / lugarDestinoId', 'Lugar'],
        ['FK usuarioRemitenteId', 'Usuario'],
        ['FK usuarioDestinatarioId', 'Usuario'],
        ['FK motoristaAsignadoId', 'Usuario'],
        ['observaciones', 'String'],
        ['estado', 'Boolean'],
        ['fechaCreacion / fechaActualizacion', 'Date'],
      ], 'center')}

      ${entidad('tracking', 1230, 170, 350, 205, 'TRACKING', 'Historial de avances', [
        ['PK _id', 'ObjectId'],
        ['FK paqueteId', 'Paquete'],
        ['numeroGuia', 'String'],
        ['FK estadoId', 'Estado'],
        ['FK lugarActualId', 'Lugar'],
        ['FK usuarioResponsableId', 'Usuario'],
        ['descripcion', 'String'],
        ['fechaEvento / fechaCreacion', 'Date'],
      ], 'child')}

      ${entidad('incidencia', 1230, 455, 350, 205, 'INCIDENCIA', 'Casos que requieren seguimiento', [
        ['PK _id', 'ObjectId'],
        ['FK paqueteId', 'Paquete'],
        ['numeroGuia', 'String'],
        ['tipoIncidencia', 'String'],
        ['estadoIncidencia', 'abierta | en proceso | cerrada'],
        ['FK reportadoPorId', 'Usuario'],
        ['descripcion', 'String'],
        ['fechaReporte / fechaCierre', 'Date'],
      ], 'child')}

      ${entidad('evidencia', 1230, 735, 350, 190, 'EVIDENCIA', 'Archivos y respaldos del proceso', [
        ['PK _id', 'ObjectId'],
        ['FK paqueteId', 'Paquete'],
        ['numeroGuia', 'String'],
        ['tipoEvidencia', 'String'],
        ['rutaArchivo', 'String'],
        ['FK reportadoPorId', 'Usuario'],
        ['descripcion', 'String'],
        ['fechaReporte', 'Date'],
      ], 'child')}

      ${entidad('auditoria', 610, 735, 480, 190, 'AUDITORIA', 'Registro de acciones relevantes', [
        ['PK _id', 'ObjectId'],
        ['FK usuarioId', 'Usuario'],
        ['rol', 'String'],
        ['accion', 'String'],
        ['entidad / entidadId', 'String'],
        ['descripcion', 'String'],
        ['ip / userAgent', 'String'],
        ['metadata', 'Mixed'],
        ['fecha', 'Date'],
      ], 'audit')}

      <!-- Relaciones principales -->
      ${ruta([[450, 290], [535, 290], [535, 420], [620, 420]], 1, 535, 356)}
      ${ruta([[450, 650], [535, 650], [535, 510], [620, 510]], 2, 535, 580)}
      ${ruta([[850, 312], [850, 360]], 3, 878, 336)}
      ${ruta([[1080, 430], [1150, 430], [1150, 260], [1230, 260]], 4, 1150, 346)}
      ${ruta([[1080, 510], [1150, 510], [1150, 555], [1230, 555]], 5, 1150, 535)}
      ${ruta([[1080, 600], [1150, 600], [1150, 820], [1230, 820]], 6, 1150, 710)}
      ${ruta([[1000, 225], [1110, 225], [1110, 245], [1230, 245]], 7, 1110, 224)}
      ${ruta([[850, 660], [850, 735]], 8, 878, 698, true)}
      ${ruta([[450, 250], [500, 250], [500, 710], [610, 710], [610, 830]], 9, 500, 710, true)}

      <!-- Referencias -->
      <g transform="translate(70,905)">
        <rect class="thin" x="0" y="0" width="500" height="88" />
        <text class="ref-title" x="250" y="19" text-anchor="middle">REFERENCIAS</text>
        <text class="ref-text" x="14" y="37">PK: principal   UK: unico   FK: referencia</text>
        <text class="ref-text" x="14" y="54">1 Usuarios   2 Origen/destino   3 Estado actual   4 Avances</text>
        <text class="ref-text" x="14" y="70">5 Incidencias   6 Evidencias   7 Estado avance</text>
        <line x1="14" y1="81" x2="74" y2="81" stroke="#000" stroke-width="1.35" />
        <text class="ref-text" x="84" y="85">directa</text>
        <line x1="250" y1="81" x2="320" y2="81" stroke="#000" stroke-width="1.35" stroke-dasharray="7 5" />
        <text class="ref-text" x="330" y="85">8-9 auditoria</text>
      </g>

      <!-- Notas -->
      <g transform="translate(70,790)">
        <text class="note-title" x="0" y="0">NOTAS:</text>
        <text class="note-text" x="0" y="28">1. Paquete es la coleccion central: concentra numero de guia, origen, destino, usuarios y estado actual.</text>
        <text class="note-text" x="0" y="52">2. Tracking, Incidencia y Evidencia se relacionan con Paquete para conservar historial y respaldo operativo.</text>
        <text class="note-text" x="0" y="76">3. Usuario, Lugar y Estado funcionan como catalogos de apoyo para control, busqueda y reportes.</text>
        <text class="note-text" x="0" y="100">4. Auditoria registra acciones relevantes para trazabilidad administrativa.</text>
      </g>

      <!-- Cajetin inferior -->
      <rect class="thin" x="10" y="1000" width="1680" height="90" />
      <line class="thin" x1="430" y1="1000" x2="430" y2="1090" />
      <line class="thin" x1="840" y1="1000" x2="840" y2="1090" />
      <line class="thin" x1="1040" y1="1000" x2="1040" y2="1090" />
      <line class="thin" x1="1220" y1="1000" x2="1220" y2="1090" />
      <line class="thin" x1="1400" y1="1000" x2="1400" y2="1090" />
      <line class="thin" x1="1545" y1="1000" x2="1545" y2="1090" />
      <text class="cartouche-title" x="24" y="1018">PROYECTO:</text>
      <text class="cartouche" x="115" y="1060" text-anchor="middle">APPTRACKINGPAQUETESAPA</text>
      <text class="cartouche-title" x="448" y="1018">PLANO:</text>
      <text class="cartouche" x="635" y="1060" text-anchor="middle">DIAGRAMA DE BASE DE DATOS</text>
      <text class="cartouche-title" x="858" y="1018">ELABORADO POR:</text>
      <text class="cartouche" x="940" y="1060" text-anchor="middle">ING. ALEXANDER VARELA</text>
      <text class="cartouche-title" x="1058" y="1018">REVISO:</text>
      <text class="cartouche" x="1130" y="1060" text-anchor="middle">DOCENTE / SCRUM MASTER</text>
      <text class="cartouche-title" x="1238" y="1018">FECHA:</text>
      <text class="cartouche" x="1310" y="1060" text-anchor="middle">${fecha}</text>
      <text class="cartouche-title" x="1418" y="1018">NORMA:</text>
      <text class="cartouche" x="1472" y="1060" text-anchor="middle">DOCUMENTACION INTERNA</text>
      <text class="cartouche-title" x="1562" y="1018">PLANO No.:</text>
      <text class="cartouche" x="1618" y="1060" text-anchor="middle">BD-01</text>
    </svg>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(salidaDir, { recursive: true });
  const logoDataUri = cargarLogoDataUri();
  fs.writeFileSync(htmlPath, construirHtml(logoDataUri), 'utf8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1700, height: 1100 }, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath.replaceAll(path.sep, '/')}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: pngPath, fullPage: true });
  await page.pdf({
    path: pdfPath,
    width: '17in',
    height: '11in',
    printBackground: true,
    margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
  });
  await browser.close();

  console.log(JSON.stringify({ pdfPath, pngPath, htmlPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
