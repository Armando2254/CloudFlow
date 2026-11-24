(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const NODE_W = 150;
  const NODE_H = 120;

  /* =========================================================
     Componentes: contenido educativo
     ========================================================= */
  const COMPONENTS = {
    device: {
      zone: 'external', icon: 'device',
      title: 'Dispositivo', sub: 'del usuario',
      name: 'Dispositivo del usuario',
      what: 'Es la computadora o el celular desde donde una persona usa una aplicación, por ejemplo un navegador web o una app móvil.',
      purpose: 'Es el punto de partida y de llegada: desde aquí se envían las solicitudes y aquí se muestran los resultados.',
      during: 'Genera la solicitud cuando la persona abre una página o pulsa un botón, y al final muestra la respuesta recibida.'
    },
    internet: {
      zone: 'external', icon: 'internet',
      title: 'Internet', sub: 'Red pública',
      name: 'Internet',
      what: 'Es la red mundial que conecta millones de dispositivos y servidores entre sí, a través de cables, antenas y routers.',
      purpose: 'Transporta la información, dividida en pequeños paquetes, entre el usuario y la nube sin importar la distancia.',
      during: 'Lleva la solicitud hacia la nube y, más tarde, trae de vuelta la respuesta al dispositivo.'
    },
    cloud: {
      zone: 'cloud',
      name: 'Infraestructura del proveedor de nube',
      what: 'Es el conjunto de centros de datos, redes y servicios que un proveedor (como AWS, Azure o Google Cloud) ofrece a sus clientes. No es un único servidor: son muchos recursos que trabajan juntos.',
      purpose: 'Permite usar cómputo, datos y almacenamiento bajo demanda, sin comprar ni mantener equipos propios.',
      during: 'Recibe la solicitud por su puerta de entrada y reparte el trabajo entre sus servicios internos.'
    },
    entry: {
      zone: 'cloud', icon: 'entry',
      title: 'Entrada', sub: 'Distribuye solicitudes',
      name: 'Entrada y distribución de solicitudes',
      what: 'Es el servicio que funciona como puerta de entrada de la nube. Suele llamarse balanceador de carga o puerta de enlace (API gateway).',
      purpose: 'Recibe las peticiones y las envía al servicio correcto, repartiéndolas para que ningún servidor se sature.',
      during: 'Recibe la solicitud, revisa a qué servicio va dirigida y la reenvía al servidor de aplicación. Al final, deja salir la respuesta hacia Internet.'
    },
    app: {
      zone: 'cloud', icon: 'app',
      title: 'Cómputo', sub: 'Servidor de aplicación',
      name: 'Servidor de aplicación / cómputo',
      what: 'Es una máquina virtual o un contenedor dentro de la nube que ejecuta el programa de la aplicación.',
      purpose: 'Procesa cada solicitud: aplica las reglas de la aplicación, pide datos y archivos, y arma la respuesta.',
      during: 'Entiende qué pidió el usuario, consulta la base de datos y el almacenamiento, y prepara la respuesta.'
    },
    db: {
      zone: 'cloud', icon: 'db',
      title: 'Base de datos', sub: 'Datos estructurados',
      name: 'Base de datos',
      what: 'Es un sistema que guarda información organizada, como usuarios, pedidos o publicaciones, para encontrarla con rapidez.',
      purpose: 'Permite consultar, guardar y modificar datos de forma ordenada y segura.',
      during: 'Recibe la consulta del servidor, busca (o guarda) los datos y devuelve el resultado.'
    },
    storage: {
      zone: 'cloud', icon: 'storage',
      title: 'Almacenamiento', sub: 'Archivos e imágenes',
      name: 'Almacenamiento',
      what: 'Es un servicio para guardar archivos como fotos, videos, documentos o copias de seguridad. También se conoce como almacenamiento de objetos.',
      purpose: 'Conserva archivos de forma duradera y los entrega cuando la aplicación los necesita.',
      during: 'Entrega el archivo que pide el servidor, por ejemplo la foto de perfil de la persona.'
    },
    response: {
      zone: 'external', icon: 'response',
      title: 'Respuesta', sub: 'al usuario',
      name: 'Respuesta al usuario',
      what: 'Es el resultado final que regresa desde la nube: una página, datos o una imagen listos para mostrarse.',
      purpose: 'Completa el ciclo: la persona ve en pantalla lo que pidió.',
      during: 'Llega al dispositivo y el navegador o la app la muestra en pantalla.'
    }
  };

  /* =========================================================
     Pasos de la simulación
     segs: tramos animados (path, dir 'f' = ida / 'r' = regreso)
     a/b : ventana del tramo dentro del paso (0 a 1)
     nodes: componentes resaltados en cada ventana
     ========================================================= */
  const STEPS = [
    {
      title: 'El usuario hace una solicitud', focus: 'device', dur: 2600, cloud: false,
      text: 'Por ejemplo, una persona abre su perfil en una aplicación. El dispositivo prepara una solicitud que indica qué información necesita.',
      nodes: [{ id: 'device', a: 0 }],
      segs: []
    },
    {
      title: 'La solicitud viaja por Internet', focus: 'internet', dur: 3200, cloud: false,
      text: 'La solicitud se divide en paquetes que pasan por varias redes y routers hasta encontrar la dirección de la nube.',
      nodes: [{ id: 'device', a: 0, b: 0.3 }, { id: 'internet', a: 0.65 }],
      segs: [{ path: 'p1', dir: 'f', kind: 'req', label: 'Solicitud', a: 0, b: 1 }]
    },
    {
      title: 'Llega a la infraestructura del proveedor', focus: 'cloud', dur: 2600, cloud: true,
      text: 'Los paquetes entran al centro de datos del proveedor. A partir de aquí, la solicitud ya está dentro de la nube.',
      nodes: [{ id: 'internet', a: 0, b: 0.35 }, { id: 'entry', a: 0.8 }],
      segs: [{ path: 'p2', dir: 'f', kind: 'req', label: 'Solicitud', a: 0, b: 1 }]
    },
    {
      title: 'La solicitud es recibida y dirigida', focus: 'entry', dur: 3200, cloud: true,
      text: 'El servicio de entrada revisa la petición, elige un servidor disponible y se la entrega para que la procese.',
      nodes: [{ id: 'entry', a: 0, b: 0.9 }, { id: 'app', a: 0.9 }],
      segs: [{ path: 'p3', dir: 'f', kind: 'req', label: 'Solicitud', a: 0.3, b: 1 }]
    },
    {
      title: 'El servidor procesa la solicitud', focus: 'app', dur: 3000, cloud: true,
      text: 'El programa interpreta la petición y detecta que necesita los datos de la persona y su foto de perfil.',
      nodes: [{ id: 'app', a: 0 }],
      segs: []
    },
    {
      title: 'Consulta a la base de datos', focus: 'db', dur: 4400, cloud: true,
      text: 'El servidor pregunta por los datos de la persona (nombre, preferencias…). La base de datos los busca y devuelve el resultado. Si hubiera que guardar un cambio, también se haría aquí.',
      nodes: [{ id: 'app', a: 0, b: 0.4 }, { id: 'db', a: 0.4, b: 0.62 }, { id: 'app', a: 0.92 }],
      segs: [
        { path: 'p4', dir: 'f', kind: 'req', label: 'Consulta', a: 0, b: 0.4 },
        { path: 'p4', dir: 'r', kind: 'res', label: 'Datos', a: 0.62, b: 1 }
      ]
    },
    {
      title: 'Obtención de archivos en el almacenamiento', focus: 'storage', dur: 4400, cloud: true,
      text: 'Como el perfil incluye una foto, el servidor la pide al almacenamiento y este la entrega. Si la operación no necesitara archivos, este paso se omitiría.',
      nodes: [{ id: 'app', a: 0, b: 0.4 }, { id: 'storage', a: 0.4, b: 0.62 }, { id: 'app', a: 0.92 }],
      segs: [
        { path: 'p5', dir: 'f', kind: 'req', label: 'Pide archivo', a: 0, b: 0.4 },
        { path: 'p5', dir: 'r', kind: 'res', label: 'Archivo', a: 0.62, b: 1 }
      ]
    },
    {
      title: 'El servidor prepara la respuesta', focus: 'app', dur: 2800, cloud: true,
      text: 'Combina los datos y la foto en un resultado listo para mostrar, por ejemplo la página de perfil completa.',
      nodes: [{ id: 'app', a: 0 }],
      segs: []
    },
    {
      title: 'La respuesta regresa por Internet', focus: 'internet', dur: 5400, cloud: true,
      text: 'La respuesta sale por el servicio de entrada, cruza Internet por el camino de vuelta y se dirige al dispositivo del usuario.',
      nodes: [{ id: 'app', a: 0, b: 0.12 }, { id: 'entry', a: 0.3, b: 0.45 }, { id: 'internet', a: 0.62 }],
      segs: [
        { path: 'p3', dir: 'r', kind: 'res', label: 'Respuesta', a: 0, b: 0.3 },
        { path: 'p2', dir: 'r', kind: 'res', label: 'Respuesta', a: 0.3, b: 0.62 },
        { path: 'p6', dir: 'f', kind: 'res', label: 'Respuesta', a: 0.7, b: 1 }
      ]
    },
    {
      title: 'El usuario recibe el resultado', focus: 'response', dur: 3000, cloud: false,
      text: 'El dispositivo reúne los paquetes y muestra el perfil en pantalla. En la vida real, todo este recorrido ocurre en una fracción de segundo.',
      nodes: [{ id: 'response', a: 0 }],
      segs: []
    }
  ];
  const N = STEPS.length;
  const RESPONSE_FROM = 8; // pasos que pertenecen a la vuelta (para el color de la barra)

  /* =========================================================
     Diseños del diagrama (horizontal para pantallas anchas,
     vertical para pantallas estrechas)
     ========================================================= */
  const LAYOUTS = {
    wide: {
      vb: [1200, 640],
      nodes: {
        device: [40, 130], internet: [265, 260], entry: [500, 260], app: [740, 260],
        db: [990, 110], storage: [990, 410], response: [40, 390]
      },
      cloud: { x: 460, y: 30, w: 720, h: 580, label: [488, 64] },
      ext: [40, 108],
      paths: {
        p1: { d: 'M190 190 C240 190 225 300 265 300', ends: 'end' },
        p2: { d: 'M415 320 L500 320', ends: 'both' },
        p3: { d: 'M650 320 L740 320', ends: 'both' },
        p4: { d: 'M815 260 C815 170 925 170 990 170', ends: 'both' },
        p5: { d: 'M815 380 C815 470 925 470 990 470', ends: 'both' },
        p6: { d: 'M265 345 C225 345 240 450 190 450', ends: 'end' }
      }
    },
    tall: {
      vb: [520, 985],
      nodes: {
        device: [30, 30], response: [340, 30], internet: [185, 220], entry: [185, 425],
        app: [185, 590], db: [30, 800], storage: [340, 800]
      },
      cloud: { x: 10, y: 380, w: 500, h: 590, label: [58, 404] },
      ext: [30, 20],
      paths: {
        p1: { d: 'M105 150 C105 210 140 260 185 260', ends: 'end' },
        p2: { d: 'M260 340 L260 425', ends: 'both' },
        p3: { d: 'M260 545 L260 590', ends: 'both' },
        p4: { d: 'M225 710 C225 765 105 755 105 800', ends: 'both' },
        p5: { d: 'M295 710 C295 765 415 755 415 800', ends: 'both' },
        p6: { d: 'M335 260 C380 260 415 210 415 150', ends: 'end' }
      }
    }
  };

  /* =========================================================
     Iconos (caja de 48 x 48)
     ========================================================= */
  const ICONS = {
    device:
      '<rect x="8" y="7" width="32" height="24" rx="3"/><path d="M3 39h42M19 35h10"/>',
    internet:
      '<circle cx="24" cy="24" r="19"/><ellipse cx="24" cy="24" rx="8" ry="19"/><path d="M5 24h38M8 14h32M8 34h32"/>',
    entry:
      '<circle cx="8" cy="24" r="4"/><circle cx="40" cy="9" r="4"/><circle cx="40" cy="24" r="4"/><circle cx="40" cy="39" r="4"/>' +
      '<path d="M12 24h8M20 24c6 0 8-15 16-15M20 24h16M20 24c6 0 8 15 16 15"/>',
    app:
      '<rect x="6" y="6" width="36" height="15" rx="3"/><rect x="6" y="27" width="36" height="15" rx="3"/>' +
      '<circle class="led" cx="14" cy="13.5" r="1.8"/><circle class="led" cx="14" cy="34.5" r="1.8"/><path d="M22 13.5h14M22 34.5h14"/>',
    db:
      '<ellipse cx="24" cy="10" rx="16" ry="6"/><path d="M8 10v28c0 3.3 7.2 6 16 6s16-2.7 16-6V10M8 24c0 3.3 7.2 6 16 6s16-2.7 16-6"/>',
    storage:
      '<path d="M5 14a4 4 0 0 1 4-4h9l4 5h16a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M5 22h38"/>',
    response:
      '<rect x="5" y="7" width="38" height="34" rx="4"/><path d="M5 15h38"/><circle cx="16" cy="27" r="4"/><path d="M24 24h13M24 30h9"/>' +
      '<g class="badge"><circle class="badge-bg" cx="41" cy="41" r="8"/><path class="badge-check" d="M37 41l3 3 5-6"/></g>'
  };

  /* =========================================================
     Utilidades y estado
     ========================================================= */
  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function el(name, attrs = {}, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  const svg = $('diagram');
  const canvas = $('canvas');
  const panel = $('panel');
  const btnStart = $('btnStart');
  const btnPause = $('btnPause');
  const btnNext = $('btnNext');
  const btnReset = $('btnReset');
  const startLabel = $('startLabel');
  const progressStep = $('progressStep');
  const progressPct = $('progressPct');
  const segmentsBox = $('segments');

  const state = {
    step: -1,        // -1 = sin iniciar
    t: 0,            // milisegundos transcurridos dentro del paso
    playing: false,
    auto: true,      // true = encadena pasos; false = se detiene al terminar cada uno
    finished: false,
    selected: null   // componente elegido manualmente
  };

  let layoutName = null;
  let nodeEls = {};
  let zoneEl = null;
  let flows = {};
  let packet = null;
  let panelKey = '';

  /* =========================================================
     Construcción del diagrama
     ========================================================= */
  function build(name) {
    layoutName = name;
    const L = LAYOUTS[name];
    svg.dataset.layout = name;
    svg.setAttribute('viewBox', `0 0 ${L.vb[0]} ${L.vb[1]}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.innerHTML = '';
    nodeEls = {};
    flows = {};

    // Flechas
    const defs = el('defs', {}, svg);
    const marker = el('marker', {
      id: 'arrow', viewBox: '0 0 10 10', refX: 8, refY: 5,
      markerWidth: 14, markerHeight: 14, markerUnits: 'userSpaceOnUse',
      orient: 'auto-start-reverse'
    }, defs);
    el('path', { d: 'M1 1.5L9 5L1 8.5z', fill: '#94a3b8' }, marker);

    // Zona de la nube del proveedor (contenedor de servicios)
    const c = L.cloud;
    zoneEl = el('g', {
      class: 'zone', tabindex: 0, role: 'button', 'data-id': 'cloud',
      'aria-label': COMPONENTS.cloud.name
    }, svg);
    el('rect', { class: 'zone-box', x: c.x, y: c.y, width: c.w, height: c.h, rx: 26 }, zoneEl);
    const cloudIcon = el('g', {
      transform: `translate(${c.label[0] - 36}, ${c.label[1] - 19}) scale(1.15)`
    }, zoneEl);
    el('path', { class: 'zone-cloud-icon', d: 'M6.5 18a4.5 4.5 0 0 1-.4-8.98A6 6 0 0 1 17.6 8.5 4.8 4.8 0 0 1 17.5 18z' }, cloudIcon);
    const lbl = el('text', { class: 'zone-label', x: c.label[0], y: c.label[1] }, zoneEl);
    lbl.textContent = 'INFRAESTRUCTURA DEL PROVEEDOR DE NUBE';
    const sub = el('text', { class: 'zone-sub', x: c.label[0], y: c.label[1] + 18 }, zoneEl);
    sub.textContent = 'Centro de datos con servicios que trabajan juntos';
    if (name === 'tall') {
      lbl.textContent = 'PROVEEDOR DE NUBE';
      sub.textContent = 'Centro de datos y sus servicios';
    }

    // Etiqueta de zona externa
    const ext = el('text', { class: 'ext-label', x: L.ext[0], y: L.ext[1] }, svg);
    ext.textContent = 'FUERA DE LA NUBE';

    // Conexiones base
    const baseEls = {};
    for (const id in L.paths) {
      const p = L.paths[id];
      const attrs = { class: 'link', d: p.d };
      if (p.ends === 'both') attrs['marker-start'] = 'url(#arrow)';
      attrs['marker-end'] = 'url(#arrow)';
      baseEls[id] = el('path', attrs, svg);
    }

    // Trazos animados (se dibujan sobre las conexiones)
    STEPS.forEach((s) => s.segs.forEach((g) => {
      const key = g.path + g.dir;
      if (flows[key]) return;
      const f = el('path', { class: `flow ${g.kind}`, d: L.paths[g.path].d }, svg);
      flows[key] = { el: f, len: f.getTotalLength(), dir: g.dir };
    }));

    // Nodos
    for (const id in L.nodes) {
      const cmp = COMPONENTS[id];
      const [x, y] = L.nodes[id];
      const g = el('g', {
        class: `node ${cmp.zone}`, 'data-id': id, tabindex: 0, role: 'button',
        'aria-label': cmp.name, transform: `translate(${x},${y})`
      }, svg);
      g.innerHTML =
        `<rect class="ring" x="-5" y="-5" width="${NODE_W + 10}" height="${NODE_H + 10}" rx="21"/>` +
        `<rect class="card" width="${NODE_W}" height="${NODE_H}" rx="16"/>` +
        `<g class="icon" transform="translate(${NODE_W / 2 - 26},14) scale(1.08)">${ICONS[cmp.icon]}</g>` +
        `<text class="t1" x="${NODE_W / 2}" y="88" text-anchor="middle">${cmp.title}</text>` +
        `<text class="t2" x="${NODE_W / 2}" y="106" text-anchor="middle">${cmp.sub}</text>`;
      nodeEls[id] = g;
    }

    // Paquete de información en movimiento
    packet = el('g', { class: 'packet', visibility: 'hidden' }, svg);
    el('circle', { class: 'halo', r: 15, fill: '#2563eb' }, packet);
    el('circle', { class: 'core', r: 7, fill: '#2563eb', stroke: '#fff', 'stroke-width': 2.5 }, packet);
    const pill = el('g', {}, packet);
    el('rect', { class: 'pill-bg', rx: 11, height: 22, y: -37, fill: '#2563eb' }, pill);
    el('text', { class: 'pill-text', 'text-anchor': 'middle', y: -22 }, pill);

    bindSelection();
  }

  function bindSelection() {
    const targets = Object.entries(nodeEls).concat([['cloud', zoneEl]]);
    targets.forEach(([id, g]) => {
      g.addEventListener('click', () => select(id));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id); }
      });
    });
  }

  function select(id) {
    state.selected = id;
    frame();
  }

  function ensureLayout() {
    const w = canvas.clientWidth;
    if (!w) return;
    const wanted = w < 760 ? 'tall' : 'wide';
    if (wanted !== layoutName) {
      build(wanted);
      frame();
    }
  }

  /* =========================================================
     Panel de explicaciones
     ========================================================= */
  function renderPanel() {
    const s = state.step >= 0 ? STEPS[state.step] : null;
    const id = state.selected || (s ? s.focus : null);
    const key = `${state.step}|${state.selected}`;
    if (key === panelKey) return;
    panelKey = key;

    let html;
    if (!id) {
      html =
        '<div class="p-meta"><span class="chip">Introducción</span></div>' +
        '<h2>Cómo viaja una solicitud por la nube</h2>' +
        '<section><h3>Qué vas a ver</h3><p>Una persona hace una solicitud desde su dispositivo, esta cruza Internet, llega a la infraestructura de un proveedor de nube, usa sus servicios y regresa una respuesta.</p></section>' +
        '<section><h3>Cómo usarlo</h3><p>Presiona «Iniciar simulación» o avanza paso a paso. También puedes hacer clic en cualquier componente del diagrama para conocer qué es y para qué sirve.</p></section>' +
        '<section class="now"><h3>Ejemplo del recorrido</h3><p>Una persona abre su perfil en una aplicación. Para mostrarlo, la nube necesita sus datos y su foto.</p></section>';
    } else {
      const c = COMPONENTS[id];
      const isStepFocus = s && id === s.focus;
      const zoneChip = c.zone === 'cloud'
        ? '<span class="chip cloud">Nube del proveedor</span>'
        : '<span class="chip">Externo a la nube</span>';
      const stepChip = isStepFocus ? `<span class="chip step">Paso ${state.step + 1} de ${N}</span>` : '';
      const now = isStepFocus
        ? `<strong>${s.title}</strong>${s.text}`
        : c.during;
      html =
        `<div class="p-meta">${stepChip}${zoneChip}</div>` +
        `<h2>${c.name}</h2>` +
        `<section><h3>Qué es</h3><p>${c.what}</p></section>` +
        `<section><h3>Para qué sirve</h3><p>${c.purpose}</p></section>` +
        `<section class="now"><h3>Qué sucede en el recorrido</h3><p>${now}</p></section>`;
    }
    panel.innerHTML = html;
    panel.classList.remove('flash');
    void panel.offsetWidth;
    panel.classList.add('flash');
  }

  /* =========================================================
     Controles de la simulación
     ========================================================= */
  function enterStep(i) {
    state.step = i;
    state.t = 0;
    state.selected = null;
    state.finished = false;
  }

  function start() {
    if (state.playing) return;
    if (state.finished || state.step < 0) {
      enterStep(0);
      state.auto = true;
      state.playing = true;
      return;
    }
    state.auto = true;
    if (state.t >= STEPS[state.step].dur && state.step < N - 1) enterStep(state.step + 1);
    state.playing = true;
  }

  function pause() { state.playing = false; }

  function reset() {
    state.step = -1;
    state.t = 0;
    state.playing = false;
    state.auto = true;
    state.finished = false;
    state.selected = null;
    frame();
  }

  function next() {
    if (state.finished) return;
    if (state.step < 0) {
      enterStep(0);
      state.auto = false;
      state.playing = true;
      return;
    }
    const s = STEPS[state.step];
    if (state.t < s.dur) {
      // Termina el paso actual de inmediato y se detiene
      state.auto = false;
      state.t = s.dur;
      state.playing = false;
      if (state.step === N - 1) state.finished = true;
      return;
    }
    if (state.step < N - 1) {
      enterStep(state.step + 1);
      state.auto = false;
      state.playing = true;
    } else {
      state.finished = true;
    }
  }

  btnStart.addEventListener('click', () => { start(); frame(); });
  btnPause.addEventListener('click', () => { pause(); frame(); });
  btnNext.addEventListener('click', () => { next(); frame(); });
  btnReset.addEventListener('click', reset);

  /* =========================================================
     Dibujo de cada fotograma
     ========================================================= */
  function activeSet() {
    const set = new Set();
    if (state.step < 0) return set;
    const s = STEPS[state.step];
    const t = state.t / s.dur;
    s.nodes.forEach((n) => {
      if (t >= n.a && (n.b == null || t < n.b)) set.add(n.id);
    });
    if (s.cloud) set.add('cloud');
    return set;
  }

  function frame() {
    if (!packet) return;
    const cur = state.step;
    const active = activeSet();
    const running = cur >= 0 && !state.finished;

    // Estado visual de los componentes
    for (const id in nodeEls) {
      const g = nodeEls[id];
      g.classList.toggle('active', active.has(id));
      g.classList.toggle('dim', running && !active.has(id));
      g.classList.toggle('selected', state.selected === id);
      g.classList.toggle('received', id === 'response' && cur >= N - 1);
    }
    zoneEl.classList.toggle('active', active.has('cloud'));
    zoneEl.classList.toggle('selected', state.selected === 'cloud');

    // Tramos animados
    const info = {};
    for (let i = 0; i <= cur; i++) {
      const s = STEPS[i];
      const t = i < cur ? 1 : state.t / s.dur;
      s.segs.forEach((g) => {
        const raw = clamp((t - g.a) / (g.b - g.a), 0, 1);
        info[g.path + g.dir] = { raw, e: ease(raw), past: i < cur, seg: g };
      });
    }

    let live = null;
    for (const key in flows) {
      const f = flows[key];
      const d = info[key];
      if (!d || d.raw <= 0) { f.el.style.opacity = 0; continue; }
      const drawn = f.len * d.e;
      f.el.style.strokeDasharray = `${drawn} ${f.len + 4}`;
      f.el.style.strokeDashoffset = f.dir === 'f' ? 0 : -(f.len - drawn);
      f.el.style.opacity = d.past ? 0.3 : 1;
      if (!d.past && d.raw < 1) live = d;
    }

    // Paquete que viaja junto con la información
    if (live) {
      const f = flows[live.seg.path + live.seg.dir];
      const at = live.seg.dir === 'f' ? live.e * f.len : (1 - live.e) * f.len;
      const pt = f.el.getPointAtLength(at);
      const color = live.seg.kind === 'req' ? '#2563eb' : '#16a34a';
      const vbW = LAYOUTS[layoutName].vb[0];
      const label = live.seg.label;
      const w = label.length * 7.4 + 22;
      const px = clamp(pt.x, w / 2 + 6, vbW - w / 2 - 6);
      packet.setAttribute('visibility', 'visible');
      packet.querySelector('.halo').setAttribute('cx', pt.x);
      packet.querySelector('.halo').setAttribute('cy', pt.y);
      packet.querySelector('.halo').setAttribute('fill', color);
      const core = packet.querySelector('.core');
      core.setAttribute('cx', pt.x); core.setAttribute('cy', pt.y); core.setAttribute('fill', color);
      const pill = packet.querySelector('g');
      pill.setAttribute('transform', `translate(${px},${pt.y - 4})`);
      const bg = pill.querySelector('.pill-bg');
      bg.setAttribute('x', -w / 2); bg.setAttribute('width', w); bg.setAttribute('fill', color);
      pill.querySelector('.pill-text').textContent = label;
    } else {
      packet.setAttribute('visibility', 'hidden');
    }

    updateControls();
    renderPanel();
  }

  function updateControls() {
    const cur = state.step;
    const dur = cur >= 0 ? STEPS[cur].dur : 1;
    const progress = state.finished ? 1 : cur < 0 ? 0 : (cur + state.t / dur) / N;

    startLabel.textContent = state.finished ? 'Repetir simulación' : cur < 0 ? 'Iniciar simulación' : 'Continuar';
    btnStart.disabled = state.playing;
    btnPause.disabled = !state.playing;
    btnNext.disabled = state.finished;
    btnReset.disabled = cur < 0;

    progressStep.textContent = cur < 0
      ? 'Listo para comenzar'
      : `Paso ${cur + 1} de ${N} · ${STEPS[cur].title}`;
    const pct = Math.round(progress * 100);
    progressPct.textContent = `${pct} %`;
    segmentsBox.setAttribute('aria-valuenow', pct);

    const segs = segmentsBox.children;
    for (let i = 0; i < segs.length; i++) {
      let w = 0;
      if (state.finished || i < cur) w = 100;
      else if (i === cur) w = (state.t / dur) * 100;
      segs[i].firstChild.style.width = `${w}%`;
    }
  }

  /* =========================================================
     Bucle de animación
     ========================================================= */
  let last = null;
  function tick(ts) {
    if (last == null) last = ts;
    const dt = Math.min(ts - last, 64);
    last = ts;

    if (state.playing && state.step >= 0) {
      const s = STEPS[state.step];
      state.t += dt;
      if (state.t >= s.dur) {
        state.t = s.dur;
        if (state.step === N - 1) {
          state.finished = true;
          state.playing = false;
        } else if (state.auto) {
          enterStep(state.step + 1);
        } else {
          state.playing = false;
        }
      }
      frame();
    }
    requestAnimationFrame(tick);
  }

  /* =========================================================
     Inicio
     ========================================================= */
  STEPS.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'seg' + (i >= RESPONSE_FROM ? ' res' : '');
    seg.appendChild(document.createElement('i'));
    segmentsBox.appendChild(seg);
  });

  ensureLayout();
  if (!layoutName) build('wide');
  frame();
  requestAnimationFrame(tick);

  if ('ResizeObserver' in window) {
    new ResizeObserver(ensureLayout).observe(canvas);
  } else {
    window.addEventListener('resize', ensureLayout);
  }
})();
