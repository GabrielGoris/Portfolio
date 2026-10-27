export type Lang = 'pt' | 'en'

const pt = {
  meta: {
    title: 'Gabriel Goris — Desenvolvedor Pleno',
    locale: 'pt-BR',
  },
  boot: {
    lines: ['GG-BIOS v1.0', 'Testando memória... OK', 'Carregando portfólio...'],
    skip: 'clique para pular',
  },
  shutdown: {
    message: 'Agora você pode desligar o computador com segurança.',
    restart: 'clique para religar',
  },
  ui: {
    start: 'Iniciar',
    shutdown: 'Desligar',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    close: 'Fechar',
    language: 'Idioma: Português (clique para English)',
  },
  files: {
    sobre: { icon: 'sobre.txt', title: 'sobre.txt — Bloco de Notas', task: 'sobre.txt' },
    newcad: { icon: 'NewCAD.exe', title: 'NewCAD.exe', task: 'NewCAD' },
    horizon: { icon: 'Horizon.exe', title: 'Horizon.exe', task: 'Horizon' },
    stack: { icon: 'stack', title: 'C:\\stack — Explorador', task: 'stack' },
    contato: { icon: 'contato.exe', title: 'contato.exe', task: 'contato' },
  },
  about: {
    label: 'Analista e Desenvolvedor de Sistemas · Pleno',
    p1: 'Há 2 anos desenvolvo o NewCAD, um CAD 3D para montar cenas de móveis planejados. Fora do trabalho, crio produtos próprios, como o Horizon, uma lista de desejos de jogos e filmes que roda na web e no Android.',
    p2: 'Do app mobile ao 3D: React, TypeScript, Three.js, Capacitor, deploy e CI.',
    hint: 'Clique nos ícones da área de trabalho para abrir os projetos.',
    openNewcad: 'abrir NewCAD',
    openHorizon: 'abrir Horizon',
    contact: 'contato',
  },
  newcad: {
    label: 'Profissional · 2 anos',
    desc: 'Software de CAD 3D para montar cenas de ambientes planejados, no estilo do Promob. Empresas de móveis planejados usam para projetar e apresentar o ambiente ao cliente.',
    chips: ['3D', 'Cenas', 'Móveis planejados'],
    sceneHint: 'arraste para girar · role para zoom · clique em um módulo',
    loading: 'carregando cena 3D...',
    noSelection: 'nenhum módulo selecionado',
    selected: 'Módulo',
    roleTitle: 'Meu papel',
    role: [
      'Detecção de colisão com SAT e encaixe magnético entre módulos.',
      'Otimização de raycasting: troquei o raycasting automático do R3F por uma implementação manual e condicional.',
      'Caça a vazamentos de memória no Three.js (dispose de geometrias, materiais e texturas).',
      'Motor de fórmulas com ordenação topológica para resolver dependências entre medidas.',
      'Sistema de margens de orçamento, filtros de materiais e módulos, e otimização de queries Prisma (N+1).',
      'Refatoração do sistema de luzes com PivotControls e eventos de cena granulares.',
    ],
    modules: {
      base: 'Balcão',
      sink: 'Balcão pia',
      drawers: 'Gaveteiro',
      upper: 'Aéreo',
      tall: 'Torre quente',
    },
  },
  horizon: {
    label: 'Projeto próprio · Web + Android',
    desc: 'Lista de desejos para guardar jogos, filmes e o que mais você quer consumir, e depois avaliar com nota. Disponível como site e empacotado como app Android.',
    site: 'abrir o site',
    code: 'código',
    tabs: ['Jogos', 'Filmes', 'Séries'],
    mockLabel: 'Tela do app Horizon com lista de desejos e notas',
  },
  stack: {
    folders: {
      front: '/front-end',
      mobile: '/mobile',
      api: '/api-e-entrega',
      three: '/3d',
    },
    status: (n: number) => `${n} itens`,
  },
  contact: {
    prompt: '> vamos conversar?',
    email: 'e-mail',
    missing: '[preencher em src/data/profile.ts]',
  },
}

export type Dict = typeof pt

const en: Dict = {
  meta: {
    title: 'Gabriel Goris — Software Developer',
    locale: 'en-US',
  },
  boot: {
    lines: ['GG-BIOS v1.0', 'Memory test... OK', 'Loading portfolio...'],
    skip: 'click to skip',
  },
  shutdown: {
    message: "It's now safe to turn off your computer.",
    restart: 'click to restart',
  },
  ui: {
    start: 'Start',
    shutdown: 'Shut down',
    minimize: 'Minimize',
    maximize: 'Maximize',
    close: 'Close',
    language: 'Language: English (click for Português)',
  },
  files: {
    sobre: { icon: 'about.txt', title: 'about.txt — Notepad', task: 'about.txt' },
    newcad: { icon: 'NewCAD.exe', title: 'NewCAD.exe', task: 'NewCAD' },
    horizon: { icon: 'Horizon.exe', title: 'Horizon.exe', task: 'Horizon' },
    stack: { icon: 'stack', title: 'C:\\stack — Explorer', task: 'stack' },
    contato: { icon: 'contact.exe', title: 'contact.exe', task: 'contact' },
  },
  about: {
    label: 'Systems Analyst & Developer · Mid-level',
    p1: "For 2 years I've been building NewCAD, a 3D CAD for designing custom furniture scenes. Outside work I build my own products, like Horizon, a wishlist for games and movies that runs on the web and on Android.",
    p2: 'From mobile apps to 3D: React, TypeScript, Three.js, Capacitor, deploy and CI.',
    hint: 'Click the desktop icons to open the projects.',
    openNewcad: 'open NewCAD',
    openHorizon: 'open Horizon',
    contact: 'contact',
  },
  newcad: {
    label: 'Professional · 2 years',
    desc: 'A 3D CAD for designing custom-built interiors, in the vein of Promob. Furniture companies use it to design rooms and present them to their clients.',
    chips: ['3D', 'Scenes', 'Custom furniture'],
    sceneHint: 'drag to orbit · scroll to zoom · click a module',
    loading: 'loading 3D scene...',
    noSelection: 'no module selected',
    selected: 'Module',
    roleTitle: 'My role',
    role: [
      'SAT-based collision detection and magnetic snapping between modules.',
      "Raycasting optimization: replaced R3F's automatic raycasting with a manual, conditional implementation.",
      'Hunting memory leaks in Three.js (disposing geometries, materials and textures).',
      'Formula engine with topological sort to resolve dependencies between measurements.',
      'Budget margin system, material and module filtering, and Prisma query optimization (N+1).',
      'Lights system refactor with PivotControls and granular scene events.',
    ],
    modules: {
      base: 'Base cabinet',
      sink: 'Sink cabinet',
      drawers: 'Drawer unit',
      upper: 'Wall cabinet',
      tall: 'Oven tower',
    },
  },
  horizon: {
    label: 'Side project · Web + Android',
    desc: 'A wishlist to keep track of games, movies and anything else you want to get to, then rate them. Available on the web and packaged as an Android app.',
    site: 'open the site',
    code: 'source',
    tabs: ['Games', 'Movies', 'Shows'],
    mockLabel: 'Horizon app screen with a wishlist and ratings',
  },
  stack: {
    folders: {
      front: '/front-end',
      mobile: '/mobile',
      api: '/api-and-delivery',
      three: '/3d',
    },
    status: (n: number) => `${n} items`,
  },
  contact: {
    prompt: "> let's talk?",
    email: 'email',
    missing: '[fill in src/data/profile.ts]',
  },
}

export const dictionaries: Record<Lang, Dict> = { pt, en }
