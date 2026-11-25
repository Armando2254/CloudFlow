(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const W = 150;            // ancho de un componente
  const H = 96;             // alto de un componente
  const VB = [1360, 760];   // tamaño del lienzo SVG
  const KIND = { req: '#2563eb', res: '#16a34a', int: '#7c3aed' };

  /* =========================================================
     Iconos (caja de 48 x 48)
     ========================================================= */
  const ICONS = {
    laptop:   '<rect x="8" y="7" width="32" height="24" rx="3"/><path d="M3 39h42M19 35h10"/>',
    project:  '<path d="M5 12a3 3 0 0 1 3-3h10l4 5h18a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M19 24l-5 5 5 5M29 24l5 5-5 5"/>',
    internet: '<circle cx="24" cy="24" r="19"/><ellipse cx="24" cy="24" rx="8" ry="19"/><path d="M5 24h38M8 14h32M8 34h32"/>',
    account:  '<circle cx="24" cy="16" r="8"/><path d="M8 42c0-9 7-15 16-15s16 6 16 15"/>',
    console:  '<rect x="5" y="8" width="38" height="32" rx="4"/><path d="M5 17h38M13 26l5 4-5 4M22 34h10"/>',
    platform: '<path d="M6 14h8M22 14h20M6 24h22M36 24h6M6 34h12M26 34h16"/><circle cx="18" cy="14" r="4"/><circle cx="32" cy="24" r="4"/><circle cx="22" cy="34" r="4"/>',
    storage:  '<path d="M5 14a4 4 0 0 1 4-4h9l4 5h16a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M5 22h38"/>',
    compute:  '<rect x="6" y="6" width="36" height="15" rx="3"/><rect x="6" y="27" width="36" height="15" rx="3"/><circle class="led" cx="14" cy="13.5" r="1.8"/><circle class="led" cx="14" cy="34.5" r="1.8"/><path d="M22 13.5h14M22 34.5h14"/>',
    db:       '<ellipse cx="24" cy="10" rx="16" ry="6"/><path d="M8 10v28c0 3.3 7.2 6 16 6s16-2.7 16-6V10M8 24c0 3.3 7.2 6 16 6s16-2.7 16-6"/>',
    monitor:  '<path d="M6 6v36h36"/><path d="M13 32l9-10 7 6 11-15"/>',
    dc:       '<path d="M8 42V10l16-5 16 5v32M4 42h40"/><path d="M16 17h4M28 17h4M16 25h4M28 25h4M16 33h4M28 33h4"/>',
    srv:      '<rect x="8" y="5" width="32" height="11" rx="2"/><rect x="8" y="19" width="32" height="11" rx="2"/><rect x="8" y="33" width="32" height="11" rx="2"/><circle class="led" cx="14" cy="10.5" r="1.6"/><circle class="led" cx="14" cy="24.5" r="1.6"/><circle class="led" cx="14" cy="38.5" r="1.6"/><path d="M22 10.5h12M22 24.5h12M22 38.5h12"/>',
    pnet:     '<rect x="17" y="5" width="14" height="10" rx="2"/><rect x="4" y="33" width="14" height="10" rx="2"/><rect x="30" y="33" width="14" height="10" rx="2"/><path d="M24 15v9M11 33v-9h26v9"/>',
    pstor:    '<rect x="5" y="12" width="38" height="24" rx="4"/><circle cx="17" cy="24" r="6"/><circle class="led" cx="17" cy="24" r="1.6"/><path d="M30 20h8M30 26h8"/>'
  };

  /* =========================================================
     Componentes estándar del diagrama
     ========================================================= */
  const NODES = {
    // Desarrollador
    pc:       { x: 50,   y: 90,  area: 'dev',  icon: 'laptop',   t1: 'Computadora',    t2: 'del desarrollador' },
    project:  { x: 250,  y: 90,  area: 'dev',  icon: 'project',  t1: 'Proyecto web',   t2: 'Archivos locales' },
    internet: { x: 250,  y: 290, area: 'dev',  icon: 'internet', t1: 'Internet',       t2: 'Acceso a la red' },
    account:  { x: 50,   y: 520, area: 'dev',  icon: 'account',  t1: 'Cuenta',         t2: 'en el proveedor',    ghost: 'Aún sin crear' },
    console:  { x: 250,  y: 520, area: 'dev',  icon: 'console',  t1: 'Consola',        t2: 'de administración',  ghost: 'Aún sin acceso' },
    // Recursos virtuales del cliente
    storage:  { x: 531,  y: 290, area: 'res',  icon: 'storage',  t1: 'Almacenamiento', t2: 'Archivos del sitio', ghost: 'Por crear' },
    compute:  { x: 727,  y: 290, area: 'res',  icon: 'compute',  t1: 'Cómputo',        t2: 'Máquina virtual',    ghost: 'Por crear' },
    db:       { x: 923,  y: 290, area: 'res',  icon: 'db',       t1: 'Base de datos',  t2: 'Datos de la app',    ghost: 'Por crear' },
    monitor:  { x: 1119, y: 290, area: 'res',  icon: 'monitor',  t1: 'Monitoreo',      t2: 'Métricas y consumo', ghost: 'Por activar' },
    // Infraestructura física
    dc:       { x: 531,  y: 600, area: 'phys', icon: 'dc',       t1: 'Centros de datos', t2: 'Edificios y energía' },
    srv:      { x: 727,  y: 600, area: 'phys', icon: 'srv',      t1: 'Servidores',     t2: 'Hardware físico' },
    pnet:     { x: 923,  y: 600, area: 'phys', icon: 'pnet',     t1: 'Redes',          t2: 'Cables y equipos' },
    pstor:    { x: 1119, y: 600, area: 'phys', icon: 'pstor',    t1: 'Discos',         t2: 'Almacenamiento físico' }
  };

  /* =========================================================
     Conexiones
     both: flecha en ambos extremos · plain: línea sin flecha · nobase: no se dibuja fija
     ========================================================= */
  const PATHS = {
    a:   { d: 'M125 186 C125 270 190 338 250 338' },                 // computadora -> Internet
    b:   { d: 'M325 186 V290' },                                     // proyecto -> Internet
    c:   { d: 'M400 310 H445 V131 H485', both: true },               // Internet <-> plataforma
    d:   { d: 'M400 338 H531' },                                     // Internet -> almacenamiento
    e:   { d: 'M325 520 V386', both: true },                         // consola <-> Internet
    f:   { d: 'M200 568 H250' },                                     // cuenta -> consola
    s:   { d: 'M681 338 H727' },                                     // almacenamiento -> cómputo
    pp:  { d: 'M1315 131 H1328 V640 H1315' },                        // plataforma -> infraestructura física
    k1:  { d: 'M606 177 V290' },  k2: { d: 'M802 177 V290' },        // plataforma -> recursos
    k3:  { d: 'M998 177 V290' },  k4: { d: 'M1194 177 V290', both: true },
    u1:  { d: 'M606 560 V520' },  u2: { d: 'M802 560 V520' },        // infraestructura física -> recursos
    u3:  { d: 'M998 560 V520' },  u4: { d: 'M1194 560 V520' },
    n1:  { d: 'M606 386 V418', plain: true }, n2: { d: 'M802 386 V418', plain: true },
    n3:  { d: 'M998 386 V418', plain: true }, n4: { d: 'M1194 386 V418', plain: true },
    bab: { d: 'M606 386 V441 H802 V386', nobase: true },            // almacenamiento -> cómputo por la red
    bbc: { d: 'M802 386 V441 H998 V386', nobase: true },            // cómputo -> base de datos por la red
    pub: { d: 'M511 441 H445 V365 H400' }                            // red -> Internet (dirección pública)
  };

  /* =========================================================
     Contenido educativo de cada componente
     ========================================================= */
  const AREA = {
    dev: 'Área del desarrollador',
    prov: 'Proveedor de nube',
    res: 'Recursos del cliente (virtuales)',
    phys: 'Infraestructura física'
  };

  const COMP = {
    dev: {
      area: 'dev', name: 'Área del desarrollador',
      what: 'Todo lo que pertenece a quien contrata los servicios: su computadora, su proyecto y su acceso al proveedor.',
      owner: 'El desarrollador, que es el cliente del proveedor.',
      purpose: 'Es desde donde el cliente toma las decisiones: qué contratar, cómo configurarlo y qué publicar.',
      sim: 'Aquí empiezan todas las acciones de la simulación (flechas azules).'
    },
    provider: {
      area: 'prov', name: 'Proveedor de nube',
      what: 'Una empresa (como AWS, Azure o Google Cloud) que construye y opera una enorme infraestructura de cómputo y la ofrece como servicio a través de Internet.',
      owner: 'El proveedor.',
      purpose: 'Permite que cualquier persona alquile cómputo, datos y almacenamiento sin comprar ni mantener equipos propios.',
      sim: 'Recibe las solicitudes del desarrollador, asigna recursos y mantiene todo funcionando.'
    },
    resources: {
      area: 'res', name: 'Recursos virtuales del cliente',
      what: 'Son los servicios que el desarrollador crea en la nube: cómputo, base de datos, almacenamiento, red y monitoreo. Existen como software que corre sobre equipos físicos compartidos.',
      owner: 'El cliente los contrata y configura. El proveedor mantiene la tecnología que los sostiene.',
      purpose: 'Dan al proyecto un lugar donde ejecutarse, sin que el cliente vea ni toque el hardware.',
      sim: 'Aparecen vacíos (línea punteada) y se van creando cuando el desarrollador los solicita y el proveedor los asigna.'
    },
    physical: {
      area: 'phys', name: 'Infraestructura física',
      what: 'Los edificios, servidores, redes y discos reales que hay detrás de la nube, repartidos en centros de datos de distintas regiones.',
      owner: 'Solo el proveedor. El cliente nunca la administra.',
      purpose: 'Aporta la capacidad real que, mediante virtualización, se reparte entre muchos clientes a la vez.',
      sim: 'Existe desde el inicio. El proveedor reserva una parte para el cliente en el paso 5 y la mantiene durante el paso 10.'
    },
    pc: {
      area: 'dev', name: 'Computadora del desarrollador',
      what: 'El equipo donde se programa y se prueba el sitio web antes de publicarlo.',
      owner: 'El desarrollador.',
      purpose: 'Es el punto de partida: desde aquí se accede a la consola y se suben los archivos.',
      sim: 'Origina el registro, el inicio de sesión y todas las configuraciones.'
    },
    project: {
      area: 'dev', name: 'Proyecto web local',
      what: 'Los archivos del sitio guardados en la computadora: páginas HTML, estilos CSS, código JavaScript e imágenes.',
      owner: 'El desarrollador.',
      purpose: 'Es lo que se quiere publicar. Mientras solo exista aquí, nadie más puede verlo.',
      sim: 'En el paso 7 sus archivos viajan por Internet hasta el almacenamiento del proveedor.'
    },
    internet: {
      area: 'dev', name: 'Acceso a Internet',
      what: 'La conexión que une la computadora del desarrollador con el proveedor de nube.',
      owner: 'Los proveedores de servicio de Internet y los operadores de red; no el proveedor de nube.',
      purpose: 'Es el camino por el que viajan registros, órdenes de configuración y archivos.',
      sim: 'Todas las flechas entre el área del desarrollador y la nube pasan por aquí.'
    },
    account: {
      area: 'dev', name: 'Cuenta del proveedor de nube',
      what: 'Es la identidad del cliente en la nube: reúne sus credenciales, permisos, recursos y facturación.',
      owner: 'El proveedor la aloja y el cliente la controla.',
      purpose: 'Garantiza que cada cliente solo vea y administre lo suyo, y permite saber cuánto consume.',
      sim: 'Se crea en el paso 2 y sirve para iniciar sesión en el paso 3.'
    },
    console: {
      area: 'dev', name: 'Consola de administración',
      what: 'Un panel web (también existen herramientas de línea de comandos) donde el cliente ve y gestiona sus recursos.',
      owner: 'El proveedor la ofrece y el cliente la usa.',
      purpose: 'Permite crear, configurar, vigilar y eliminar servicios sin tocar ningún equipo físico.',
      sim: 'Cada orden del desarrollador sale de aquí hacia la plataforma.'
    },
    platform: {
      area: 'prov', name: 'Plataforma de administración y gestión de recursos',
      what: 'El "cerebro" del proveedor: software que recibe las órdenes de los clientes, comprueba permisos y coordina la creación, el uso y el cobro de recursos.',
      owner: 'El proveedor.',
      purpose: 'Convierte una solicitud hecha en la consola en recursos reales, usando la infraestructura física disponible.',
      sim: 'Recibe las solicitudes del desarrollador y decide dónde y cómo crear los recursos.'
    },
    storage: {
      area: 'res', name: 'Almacenamiento de archivos',
      what: 'Un servicio para guardar archivos: imágenes, documentos, copias de seguridad o los propios archivos del sitio.',
      owner: 'El cliente decide qué guarda y quién accede. El proveedor garantiza que los datos se conserven.',
      purpose: 'Conserva los archivos de forma duradera y los entrega cuando se necesitan.',
      sim: 'Se crea en el paso 5 y recibe los archivos del proyecto en el paso 7.'
    },
    compute: {
      area: 'res', name: 'Cómputo (máquina virtual)',
      what: 'Un servidor virtual: una porción de un servidor físico que se comporta como una computadora independiente.',
      owner: 'El cliente lo configura. El proveedor administra el hardware y la virtualización.',
      purpose: 'Ejecuta la aplicación del desarrollador y procesa lo que esta necesita.',
      sim: 'Se crea en el paso 5 y queda preparado para ejecutar el proyecto en el paso 7.'
    },
    db: {
      area: 'res', name: 'Base de datos',
      what: 'Un servicio que guarda información organizada, como usuarios, productos o mensajes.',
      owner: 'El cliente define los datos y los accesos. El proveedor puede encargarse del mantenimiento técnico.',
      purpose: 'Permite que la aplicación consulte y guarde datos de forma ordenada y segura.',
      sim: 'Se crea en el paso 5 y se conecta con la aplicación en el paso 8.'
    },
    network: {
      area: 'res', name: 'Red virtual del cliente',
      what: 'Una red privada creada por software que conecta los recursos del cliente entre sí y define cuáles son accesibles desde Internet.',
      owner: 'El cliente la configura. El proveedor la hace funcionar sobre sus redes físicas.',
      purpose: 'Mantiene aislados y protegidos los servicios, y habilita solo las conexiones que el cliente permite.',
      sim: 'Se crea al configurar en el paso 6, conecta los servicios en el 8 y muestra la dirección pública en el 9.'
    },
    monitor: {
      area: 'res', name: 'Monitoreo y administración',
      what: 'Herramientas que miden el uso de cada recurso: procesador, memoria, tráfico, errores y costo.',
      owner: 'El proveedor ofrece las herramientas y el cliente las usa para decidir.',
      purpose: 'Ayudan a detectar problemas, ajustar recursos y controlar cuánto se gasta.',
      sim: 'En el paso 10 envía métricas a la consola y el desarrollador decide qué modificar.'
    },
    dc: {
      area: 'phys', name: 'Centros de datos',
      what: 'Edificios con miles de equipos, energía de respaldo, enfriamiento y seguridad física, ubicados en distintas regiones.',
      owner: 'Solo el proveedor.',
      purpose: 'Alojan el hardware y lo mantienen funcionando día y noche.',
      sim: 'Aquí se reserva capacidad en el paso 5, y el proveedor los mantiene en el paso 10.'
    },
    srv: {
      area: 'phys', name: 'Servidores físicos',
      what: 'Computadoras de alto rendimiento montadas en bastidores (racks) dentro de los centros de datos.',
      owner: 'Solo el proveedor.',
      purpose: 'Aportan procesador y memoria que se reparten entre muchos clientes mediante virtualización.',
      sim: 'Una parte de su capacidad se convierte en la máquina virtual del cliente.'
    },
    pnet: {
      area: 'phys', name: 'Redes físicas',
      what: 'Cables, conmutadores y enrutadores que conectan los servidores entre sí y con Internet.',
      owner: 'Solo el proveedor.',
      purpose: 'Permiten que los recursos se comuniquen con rapidez y que el centro de datos se conecte al mundo.',
      sim: 'Transportan, sin que el cliente lo vea, el tráfico de su red virtual.'
    },
    pstor: {
      area: 'phys', name: 'Discos y equipos de almacenamiento',
      what: 'Discos y unidades físicas que guardan los datos reales, con copias para que no se pierdan si uno falla.',
      owner: 'Solo el proveedor.',
      purpose: 'Respaldan físicamente la base de datos y el almacenamiento de archivos del cliente.',
      sim: 'Una parte de su capacidad se asigna a la base de datos y al almacenamiento del cliente.'
    }
  };

  /* =========================================================
     Pasos de la simulación
     segs : tramos animados (path, dir 'f' = sentido del trazado / 'r' = inverso,
            kind req|res|int, a/b = ventana dentro del paso de 0 a 1)
     nodes: componentes resaltados · zones: áreas resaltadas
     x    : posición horizontal a la que se desplaza el lienzo en pantallas angostas
     ========================================================= */
  const STEPS = [
    {
      title: 'Elección del proveedor', dur: 3600, x: 200,
      dev: 'Tiene su sitio web terminado en su computadora y necesita publicarlo. En lugar de comprar y mantener servidores propios, decide usar un proveedor de nube como AWS, Azure o Google Cloud.',
      prov: 'Todavía no interviene. Su infraestructura ya existe y está lista para atender a miles de clientes distintos.',
      nodes: [{ id: 'pc', a: 0 }],
      zones: [{ id: 'provider', a: 0.55 }],
      segs: []
    },
    {
      title: 'Registro', dur: 5400, x: 400,
      dev: 'Entra al sitio del proveedor, escribe sus datos y acepta las condiciones de uso. Normalmente también registra un método de pago.',
      prov: 'Verifica los datos y crea la cuenta del cliente: un espacio aislado donde solo él puede crear recursos y donde se registra lo que consume.',
      nodes: [{ id: 'pc', a: 0, b: 0.3 }, { id: 'internet', a: 0.22, b: 0.4 }, { id: 'platform', a: 0.58, b: 0.8 }, { id: 'account', a: 0.8 }],
      zones: [],
      segs: [
        { path: 'a', dir: 'f', kind: 'req', label: 'Registro', a: 0, b: 0.3 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Registro', a: 0.3, b: 0.6 }
      ]
    },
    {
      title: 'Consola de administración', dur: 7600, x: 400,
      dev: 'Inicia sesión con su cuenta desde el navegador de su computadora y entra a la consola, el panel desde donde gestionará todos sus recursos.',
      prov: 'La plataforma comprueba su identidad y sus permisos, y le muestra únicamente lo que le pertenece.',
      nodes: [{ id: 'account', a: 0, b: 0.25 }, { id: 'console', a: 0.25, b: 0.48 }, { id: 'internet', a: 0.45, b: 0.55 }, { id: 'platform', a: 0.72, b: 0.82 }, { id: 'internet', a: 0.82, b: 0.92 }, { id: 'console', a: 0.95 }],
      zones: [],
      segs: [
        { path: 'f', dir: 'f', kind: 'req', label: 'Credenciales', a: 0, b: 0.25 },
        { path: 'e', dir: 'f', kind: 'req', label: 'Inicia sesión', a: 0.3, b: 0.5 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Inicia sesión', a: 0.5, b: 0.72 },
        { path: 'c', dir: 'r', kind: 'res', label: 'Acceso concedido', a: 0.75, b: 0.88 },
        { path: 'e', dir: 'r', kind: 'res', label: 'Acceso concedido', a: 0.88, b: 1 }
      ]
    },
    {
      title: 'Creación de recursos', dur: 6200, x: 700,
      dev: 'Elige y solicita los servicios que necesita: un servidor virtual para ejecutar la aplicación, una base de datos y almacenamiento para los archivos.',
      prov: 'La plataforma recibe el pedido y valida que la cuenta tenga permiso y que los datos sean correctos (región, tamaño, tipo de servicio).',
      nodes: [{ id: 'console', a: 0, b: 0.25 }, { id: 'internet', a: 0.15, b: 0.35 }, { id: 'platform', a: 0.5 }, { id: 'storage', a: 0.65 }, { id: 'compute', a: 0.65 }, { id: 'db', a: 0.65 }],
      zones: [{ id: 'resources', a: 0.65 }],
      segs: [
        { path: 'e', dir: 'f', kind: 'req', label: 'Solicita recursos', a: 0, b: 0.25 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Solicita recursos', a: 0.25, b: 0.5 }
      ]
    },
    {
      title: 'Asignación de infraestructura', dur: 10000, x: 900,
      dev: 'Espera unos segundos mientras sus recursos se preparan. No elige ni toca ningún equipo físico.',
      prov: 'La plataforma busca capacidad libre en sus centros de datos y reserva una parte de sus servidores y discos. Con software de virtualización crea los recursos y avisa que ya están listos.',
      nodes: [
        { id: 'platform', a: 0, b: 0.22 },
        { id: 'dc', a: 0.2, b: 0.72 }, { id: 'srv', a: 0.2, b: 0.72 }, { id: 'pnet', a: 0.2, b: 0.72 }, { id: 'pstor', a: 0.2, b: 0.72 },
        { id: 'storage', a: 0.42, b: 0.54 }, { id: 'compute', a: 0.54, b: 0.66 }, { id: 'db', a: 0.66, b: 0.74 },
        { id: 'internet', a: 0.72, b: 0.88 }, { id: 'console', a: 0.93 }
      ],
      zones: [{ id: 'physical', a: 0.18, b: 0.72 }, { id: 'resources', a: 0.4, b: 0.74 }],
      segs: [
        { path: 'pp', dir: 'f', kind: 'int', label: 'Reserva capacidad', a: 0, b: 0.2 },
        { path: 'u1', dir: 'f', kind: 'int', label: 'Asigna', a: 0.3, b: 0.42 },
        { path: 'u2', dir: 'f', kind: 'int', label: 'Asigna', a: 0.42, b: 0.54 },
        { path: 'u3', dir: 'f', kind: 'int', label: 'Asigna', a: 0.54, b: 0.66 },
        { path: 'c', dir: 'r', kind: 'res', label: 'Recursos listos', a: 0.72, b: 0.86 },
        { path: 'e', dir: 'r', kind: 'res', label: 'Recursos listos', a: 0.86, b: 1 }
      ]
    },
    {
      title: 'Configuración', dur: 7600, x: 800,
      dev: 'Ajusta sus recursos: define quién puede acceder a ellos (permisos), crea su red virtual y decide qué conexiones están permitidas.',
      prov: 'Aplica cada configuración: crea la red virtual aislada del cliente y hace cumplir las reglas de acceso que él definió.',
      nodes: [{ id: 'console', a: 0, b: 0.2 }, { id: 'internet', a: 0.12, b: 0.28 }, { id: 'platform', a: 0.4, b: 0.7 }, { id: 'network', a: 0.72 }],
      zones: [{ id: 'resources', a: 0.7 }],
      segs: [
        { path: 'e', dir: 'f', kind: 'req', label: 'Permisos y red', a: 0, b: 0.2 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Permisos y red', a: 0.2, b: 0.4 }
      ]
    },
    {
      title: 'Carga del proyecto', dur: 8400, x: 500,
      dev: 'Sube desde su computadora los archivos del sitio (HTML, CSS, JavaScript, imágenes) y los deja listos para ejecutarse.',
      prov: 'El servicio de almacenamiento guarda los archivos de forma duradera y el recurso de cómputo queda preparado para ejecutar la aplicación con ellos.',
      nodes: [{ id: 'project', a: 0, b: 0.28 }, { id: 'internet', a: 0.2, b: 0.38 }, { id: 'storage', a: 0.55, b: 0.7 }, { id: 'compute', a: 0.85 }],
      zones: [],
      segs: [
        { path: 'b', dir: 'f', kind: 'req', label: 'Archivos del sitio', a: 0, b: 0.28 },
        { path: 'd', dir: 'f', kind: 'req', label: 'Archivos del sitio', a: 0.28, b: 0.55 },
        { path: 's', dir: 'f', kind: 'int', label: 'Prepara la ejecución', a: 0.65, b: 0.85 }
      ]
    },
    {
      title: 'Conexión de servicios', dur: 10000, x: 800,
      dev: 'Indica a la aplicación dónde están la base de datos y el almacenamiento, y permite esa comunicación dentro de su red.',
      prov: 'La red virtual enruta el tráfico entre los tres servicios de forma privada, sin exponerlos directamente a Internet.',
      nodes: [{ id: 'console', a: 0, b: 0.13 }, { id: 'internet', a: 0.08, b: 0.2 }, { id: 'platform', a: 0.26, b: 0.38 }, { id: 'network', a: 0.38 }, { id: 'storage', a: 0.38, b: 0.55 }, { id: 'compute', a: 0.55, b: 0.8 }, { id: 'db', a: 0.8 }],
      zones: [{ id: 'resources', a: 0.38 }],
      segs: [
        { path: 'e', dir: 'f', kind: 'req', label: 'Configura conexiones', a: 0, b: 0.13 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Configura conexiones', a: 0.13, b: 0.26 },
        { path: 'bab', dir: 'f', kind: 'int', label: 'Conexión privada', a: 0.38, b: 0.66 },
        { path: 'bbc', dir: 'f', kind: 'int', label: 'Conexión privada', a: 0.66, b: 0.94 }
      ]
    },
    {
      title: 'Publicación', dur: 9000, x: 700,
      dev: 'Configura el acceso público al sitio y obtiene una dirección (URL) para que otras personas puedan visitarlo. Si quiere, después la asocia a un dominio propio.',
      prov: 'Asigna una dirección pública, la conecta con la aplicación y abre solo los accesos necesarios. A partir de aquí, el sitio ya está disponible en Internet.',
      nodes: [{ id: 'console', a: 0, b: 0.14 }, { id: 'internet', a: 0.1, b: 0.22 }, { id: 'platform', a: 0.28, b: 0.36 }, { id: 'network', a: 0.36, b: 0.52 }, { id: 'internet', a: 0.68, b: 0.78 }, { id: 'console', a: 0.9 }],
      zones: [],
      segs: [
        { path: 'e', dir: 'f', kind: 'req', label: 'Configura el acceso', a: 0, b: 0.14 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Configura el acceso', a: 0.14, b: 0.28 },
        { path: 'pub', dir: 'f', kind: 'res', label: 'Dirección pública', a: 0.5, b: 0.72 },
        { path: 'e', dir: 'r', kind: 'res', label: 'Dirección pública', a: 0.72, b: 0.92 }
      ]
    },
    {
      title: 'Administración continua', dur: 11000, x: 800,
      dev: 'Revisa métricas y consumo desde la consola y ajusta recursos cuando hace falta: más capacidad, menos gasto o nuevos servicios.',
      prov: 'Mide el uso de cada recurso y lo cobra. Además mantiene toda la infraestructura física (energía, enfriamiento, redes y reemplazo de equipos) sin que el cliente intervenga.',
      nodes: [
        { id: 'monitor', a: 0, b: 0.14 }, { id: 'platform', a: 0.14, b: 0.28 }, { id: 'internet', a: 0.26, b: 0.4 },
        { id: 'console', a: 0.4, b: 0.62 }, { id: 'internet', a: 0.5, b: 0.66 }, { id: 'platform', a: 0.72, b: 0.8 },
        { id: 'dc', a: 0.82 }, { id: 'srv', a: 0.82 }, { id: 'pnet', a: 0.82 }, { id: 'pstor', a: 0.82 }
      ],
      zones: [{ id: 'physical', a: 0.82 }],
      segs: [
        { path: 'k4', dir: 'r', kind: 'res', label: 'Métricas y consumo', a: 0, b: 0.14 },
        { path: 'c', dir: 'r', kind: 'res', label: 'Métricas y consumo', a: 0.14, b: 0.28 },
        { path: 'e', dir: 'r', kind: 'res', label: 'Métricas y consumo', a: 0.28, b: 0.4 },
        { path: 'e', dir: 'f', kind: 'req', label: 'Ajusta recursos', a: 0.5, b: 0.6 },
        { path: 'c', dir: 'f', kind: 'req', label: 'Ajusta recursos', a: 0.6, b: 0.72 },
        { path: 'pp', dir: 'f', kind: 'int', label: 'Mantiene el hardware', a: 0.8, b: 0.96 }
      ]
    }
  ];
  const N = STEPS.length;

  // Momento en que aparece (deja de ser punteado) cada componente: [paso, fracción del paso]
  const APPEAR = {
    account: [1, 0.8], console: [2, 0.25],
    storage: [4, 0.42], compute: [4, 0.54], db: [4, 0.66],
    network: [5, 0.72], monitor: [9, 0], address: [8, 0.38]
  };

  /* =========================================================
     Utilidades y estado
     ========================================================= */
  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function mk(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in (attrs || {})) node.setAttribute(k, attrs[k]);
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
    step: -1,         // -1 = sin iniciar
    t: 0,             // milisegundos transcurridos dentro del paso
    playing: false,
    auto: true,       // true = encadena pasos; false = se detiene al terminar cada uno
    finished: false,
    selected: null    // componente elegido con un clic
  };

  const nodeEls = {};
  const zoneEls = {};
  const flows = {};
  const ghostText = {};
  const wasGhost = {};
  let packet = null;
  let addrEl = null;
  let panelKey = '';
  let scrolledFor = -2;

  function created(id) {
    const ap = APPEAR[id];
    if (!ap) return true;
    const cur = state.step;
    if (cur < 0) return false;
    if (cur > ap[0]) return true;
    return cur === ap[0] && state.t / STEPS[cur].dur >= ap[1];
  }

  /* =========================================================
     Construcción del diagrama
     ========================================================= */
  function addZone(id, cls, x, y, w, h, rx, label, sub, lx, ly, inline) {
    const g = mk('g', { class: `zone ${cls}`, tabindex: 0, role: 'button', 'data-id': id, 'aria-label': COMP[id].name }, svg);
    mk('rect', { class: 'zone-box', x, y, width: w, height: h, rx }, g);
    const t = mk('text', { class: 'zlabel', x: lx, y: ly }, g);
    t.textContent = label;
    if (sub) {
      const s = mk('text', { class: 'zsub', x: inline ? lx + inline : lx, y: inline ? ly : ly + 19 }, g);
      s.textContent = sub;
    }
    zoneEls[id] = g;
    return g;
  }

  function nodeInner(n) {
    return `<rect class="ring" x="-5" y="-5" width="${W + 10}" height="${H + 10}" rx="21"/>` +
      `<rect class="card" width="${W}" height="${H}" rx="16"/>` +
      `<g class="icon" transform="translate(${W / 2 - 24},10) scale(1)">${ICONS[n.icon]}</g>` +
      `<text class="t1" x="${W / 2}" y="73" text-anchor="middle">${n.t1}</text>` +
      `<text class="t2" x="${W / 2}" y="90" text-anchor="middle">${n.t2}</text>`;
  }

  function build() {
    svg.setAttribute('viewBox', `0 0 ${VB[0]} ${VB[1]}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Marcador de flecha
    const defs = mk('defs', {}, svg);
    const marker = mk('marker', {
      id: 'arrow', viewBox: '0 0 10 10', refX: 8, refY: 5,
      markerWidth: 14, markerHeight: 14, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse'
    }, defs);
    mk('path', { d: 'M1 1.5L9 5L1 8.5z', fill: '#94a3b8' }, marker);

    // Áreas
    addZone('dev', 'dev', 20, 20, 410, 720, 26, 'DESARROLLADOR', 'El cliente que contrata y configura los servicios', 46, 62);

    const prov = addZone('provider', 'provider', 460, 20, 880, 720, 26, 'PROVEEDOR DE NUBE', 'Administra la plataforma y toda la infraestructura física', 520, 52);
    const ci = mk('g', { transform: 'translate(484,32) scale(1.15)' }, prov);
    mk('path', { class: 'zone-cloud-icon', d: 'M6.5 18a4.5 4.5 0 0 1-.4-8.98A6 6 0 0 1 17.6 8.5 4.8 4.8 0 0 1 17.5 18z' }, ci);
    prov.querySelector('.zsub').setAttribute('y', 70);
    prov.querySelector('.zsub').setAttribute('x', 484);
    prov.querySelector('.zlabel').setAttribute('x', 520);

    addZone('resources', 'resources', 485, 215, 830, 305, 18,
      'RECURSOS VIRTUALES DEL CLIENTE', '· los contrata y configura el cliente', 511, 502, 255);
    addZone('physical', 'physical', 485, 560, 830, 160, 18,
      'INFRAESTRUCTURA FÍSICA', '· la construye y mantiene solo el proveedor', 511, 588, 190);

    // Conexiones fijas
    for (const id in PATHS) {
      const p = PATHS[id];
      if (p.nobase) continue;
      const attrs = { class: 'link', d: p.d };
      if (!p.plain) {
        attrs['marker-end'] = 'url(#arrow)';
        if (p.both) attrs['marker-start'] = 'url(#arrow)';
      }
      mk('path', attrs, svg);
    }

    // Trazos animados
    STEPS.forEach((s) => s.segs.forEach((g) => {
      const key = g.path + g.dir;
      if (flows[key]) return;
      const f = mk('path', { class: 'flow', d: PATHS[g.path].d }, svg);
      flows[key] = { el: f, len: f.getTotalLength(), dir: g.dir };
    }));

    // Componentes estándar
    for (const id in NODES) {
      const n = NODES[id];
      const g = mk('g', {
        class: `node ${n.area}`, 'data-id': id, tabindex: 0, role: 'button',
        'aria-label': COMP[id].name, transform: `translate(${n.x},${n.y})`
      }, svg);
      g.innerHTML = nodeInner(n);
      nodeEls[id] = g;
      if (n.ghost) ghostText[id] = [g.querySelector('.t2'), n.t2, n.ghost];
    }

    // Plataforma de administración (ancha)
    const pl = mk('g', {
      class: 'node prov', 'data-id': 'platform', tabindex: 0, role: 'button',
      'aria-label': COMP.platform.name, transform: 'translate(485,85)'
    }, svg);
    pl.innerHTML =
      '<rect class="ring" x="-5" y="-5" width="840" height="102" rx="21"/>' +
      '<rect class="card" width="830" height="92" rx="16"/>' +
      `<g class="icon" transform="translate(28,22) scale(1.05)">${ICONS.platform}</g>` +
      '<text class="t1" x="100" y="42">Plataforma de administración y gestión de recursos</text>' +
      '<text class="t2" x="100" y="66">Recibe las órdenes del cliente, valida permisos y asigna recursos</text>' +
      '<text class="tag" x="806" y="42" text-anchor="end">ADMINISTRADA POR EL PROVEEDOR</text>';
    nodeEls.platform = pl;

    // Red virtual (banda que conecta los recursos)
    const nw = mk('g', {
      class: 'node res', 'data-id': 'network', tabindex: 0, role: 'button',
      'aria-label': COMP.network.name, transform: 'translate(511,418)'
    }, svg);
    nw.innerHTML =
      '<rect class="ring" x="-5" y="-5" width="788" height="56" rx="19"/>' +
      '<rect class="card" width="778" height="46" rx="14"/>' +
      '<text class="t1" x="22" y="21" style="font-size:15px">Red virtual del cliente</text>' +
      '<text class="t2" x="22" y="38" style="font-size:12.5px">Conecta los servicios entre sí y controla el acceso desde Internet</text>' +
      '<g class="addr"><rect x="448" y="9" width="316" height="28" rx="14"/>' +
      '<text x="606" y="28" text-anchor="middle">https://mi-proyecto.ejemplo.com</text></g>';
    nodeEls.network = nw;
    addrEl = nw.querySelector('.addr');
    ghostText.network = [nw.querySelector('.t2'), 'Conecta los servicios entre sí y controla el acceso desde Internet', 'Aún sin configurar'];

    // Paquete de información en movimiento
    packet = mk('g', { class: 'packet', visibility: 'hidden' }, svg);
    mk('circle', { class: 'halo', r: 15, fill: '#2563eb' }, packet);
    mk('circle', { class: 'core', r: 7, fill: '#2563eb', stroke: '#fff', 'stroke-width': 2.5 }, packet);
    const pill = mk('g', {}, packet);
    mk('rect', { class: 'pill-bg', rx: 11, height: 24, y: -40, fill: '#2563eb' }, pill);
    mk('text', { class: 'pill-text', 'text-anchor': 'middle', y: -23 }, pill);

    // Selección con clic o teclado
    const targets = Object.values(nodeEls).concat(Object.values(zoneEls));
    targets.forEach((g) => {
      const id = g.getAttribute('data-id');
      g.addEventListener('click', () => { state.selected = id; frame(); });
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.selected = id; frame(); }
      });
    });
  }

  /* =========================================================
     Panel de explicaciones
     ========================================================= */
  function renderPanel() {
    const cur = state.step;
    const s = cur >= 0 ? STEPS[cur] : null;
    const sel = state.selected;
    const key = `${cur}|${sel}`;
    if (key === panelKey) return;
    panelKey = key;

    let html;
    if (sel) {
      const c = COMP[sel];
      html =
        `<div class="p-meta"><span class="chip ${c.area}">${AREA[c.area]}</span>${s ? `<span class="chip step">Paso ${cur + 1} de ${N}</span>` : ''}</div>` +
        `<h2>${c.name}</h2>` +
        `<section><h3>Qué es</h3><p>${c.what}</p></section>` +
        `<section><h3>Quién lo administra</h3><p>${c.owner}</p></section>` +
        `<section><h3>Para qué sirve</h3><p>${c.purpose}</p></section>` +
        `<section class="now"><h3>En la simulación</h3><p>${c.sim}</p></section>` +
        `<button type="button" class="back" data-back>← ${s ? 'Volver al paso actual' : 'Volver a la introducción'}</button>`;
    } else if (s) {
      html =
        `<div class="p-meta"><span class="chip step">Paso ${cur + 1} de ${N}</span></div>` +
        `<h2>${s.title}</h2>` +
        `<section class="box dev"><h3>Lo que hace el desarrollador</h3><p>${s.dev}</p></section>` +
        `<section class="box prov"><h3>Lo que hace el proveedor</h3><p>${s.prov}</p></section>` +
        '<p class="hint">Haz clic en cualquier componente del diagrama para ver qué es y quién lo administra.</p>';
    } else {
      html =
        '<div class="p-meta"><span class="chip">Introducción</span></div>' +
        '<h2>Del proyecto local a la nube</h2>' +
        '<section><h3>Qué vas a ver</h3><p>Una persona desarrolló un sitio web en su computadora y quiere publicarlo. La simulación muestra cómo contrata servicios de un proveedor de nube, los configura y los administra.</p></section>' +
        '<section><h3>Cómo leer el diagrama</h3><p>A la izquierda está el desarrollador. A la derecha, el proveedor: su plataforma de administración, los recursos virtuales que contrata el cliente y, abajo, la infraestructura física que solo el proveedor administra.</p></section>' +
        '<section class="now"><h3>Cómo usarlo</h3><p>Presiona «Iniciar simulación» o avanza paso a paso. Puedes hacer clic en cualquier componente para conocerlo.</p></section>';
    }
    panel.innerHTML = html;
    panel.classList.remove('flash');
    void panel.offsetWidth;
    panel.classList.add('flash');
  }

  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) { state.selected = null; frame(); }
  });

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
  function activeNow() {
    const nodes = new Set();
    const zones = new Set();
    if (state.step < 0) return { nodes, zones };
    const s = STEPS[state.step];
    const t = state.t / s.dur;
    const inWin = (w) => t >= w.a && (w.b == null || t < w.b);
    s.nodes.forEach((n) => { if (inWin(n)) nodes.add(n.id); });
    s.zones.forEach((z) => { if (inWin(z)) zones.add(z.id); });
    return { nodes, zones };
  }

  function scrollToFocus() {
    if (state.step === scrolledFor) return;
    scrolledFor = state.step;
    if (canvas.scrollWidth <= canvas.clientWidth + 4) return;
    const scale = svg.getBoundingClientRect().width / VB[0];
    const x = state.step < 0 ? 0 : STEPS[state.step].x * scale - canvas.clientWidth / 2;
    canvas.scrollTo({ left: Math.max(0, x), behavior: 'smooth' });
  }

  function frame() {
    if (!packet) return;
    const cur = state.step;
    const { nodes, zones } = activeNow();
    const running = cur >= 0 && !state.finished;

    // Componentes
    for (const id in nodeEls) {
      const g = nodeEls[id];
      const ghost = !!ghostText[id] && !created(id);
      const active = nodes.has(id);
      g.classList.toggle('ghost', ghost);
      g.classList.toggle('active', active);
      g.classList.toggle('dim', running && !ghost && !active);
      g.classList.toggle('selected', state.selected === id);
      if (ghostText[id]) {
        const [el, normal, ghostLabel] = ghostText[id];
        if (wasGhost[id] !== ghost) {
          el.textContent = ghost ? ghostLabel : normal;
          if (wasGhost[id] === true && !ghost) {
            g.classList.remove('born'); void g.getBoundingClientRect(); g.classList.add('born');
          }
          wasGhost[id] = ghost;
        }
      }
    }

    // Áreas
    for (const id in zoneEls) {
      zoneEls[id].classList.toggle('active', zones.has(id));
      zoneEls[id].classList.toggle('selected', state.selected === id);
    }

    // Dirección pública
    addrEl.classList.toggle('show', created('address'));

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
      f.el.style.stroke = KIND[d.seg.kind];
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
      const color = KIND[live.seg.kind];
      const label = live.seg.label;
      const w = label.length * 7.6 + 24;
      const px = clamp(pt.x, w / 2 + 6, VB[0] - w / 2 - 6);
      packet.setAttribute('visibility', 'visible');
      const halo = packet.querySelector('.halo');
      halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y); halo.setAttribute('fill', color);
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

    scrollToFocus();
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
  STEPS.forEach(() => {
    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.appendChild(document.createElement('i'));
    segmentsBox.appendChild(seg);
  });

  build();
  frame();
  requestAnimationFrame(tick);
})();