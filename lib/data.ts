/* =========================================================================
   DATOS DEL PORTAFOLIO (español)
   La versión en inglés de los textos está en lib/data.en.ts.
   ========================================================================= */

export const SITE = {
  name: "Laura Escobar",
  fullName: "Laura Sofía Escobar",
  city: "Pasto, Colombia",
  /** Tu foto del hero (en public/). */
  heroPhoto: "/laura-sticker.webp" as string | null,
  heroPhotoAlt: "Laura Sofía Escobar",
  cv: "/cv-laura-escobar.pdf",
};

export const CONTACT = {
  email: "laurasofiaa.ec@gmail.com",
  linkedin: { label: "in/laura-sofia-escobar", href: "https://www.linkedin.com/in/laura-sofia-escobar-7b2259438" },
  github: { label: "@LauraEscobar1", href: "https://github.com/LauraEscobar1" },
};

export const NAV = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "fuera", label: "Fuera de pantalla" },
  { id: "formacion", label: "Formación" },
  { id: "stack", label: "Stack" },
  { id: "proyectos", label: "Proyectos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "testimonios", label: "Testimonios" },
];

/* ---------- Paleta ---------- */
export const C = {
  frost: "#E6F1FA",
  pistachio: "#B9C255",
  denim: "#5798D7",
  navy: "#12263F",
  ink: "#0E1E33",
  accent: "#2F6FB0",
  white: "#FFFFFF",
};

/* ---------- Formación ---------- */
export const EDUCATION = [
  {
    n: "01",
    kind: "carrera" as const,
    years: "En curso · 5.º semestre",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Campus Pasto",
    text: "Construyo software de punta a punta: desde la idea y el diseño hasta el código que llega a producción.",
    chips: ["Web", "Móvil", "Escritorio", "Bases de datos", "Arquitectura", "Inteligencia artificial"],
    bg: C.pistachio,
  },
  {
    n: "02",
    kind: "idiomas" as const,
    years: "Idiomas",
    title: "Español · Inglés",
    place: "Comunicación sin fronteras",
    text: "Leo documentación técnica en inglés y me comunico con soltura en situaciones cotidianas.",
    langs: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "B1" },
    ],
    bg: "#BCD7F1",
  },
];

/* ---------- Stack ---------- */
export type Tech = {
  name: string;
  mono: string;
  cat: string;
  desc: string;
  /** Proyecto o caso donde la usaste. */
  usage: string;
  bg: string;
  fg: string;
  chip: string;
  chipFg: string;
};

const SKINS = [
  { bg: C.white, fg: C.navy, chip: C.pistachio, chipFg: C.ink },
  { bg: C.navy, fg: C.frost, chip: C.denim, chipFg: C.ink },
  { bg: C.pistachio, fg: C.ink, chip: C.navy, chipFg: C.frost },
  { bg: C.frost, fg: C.navy, chip: C.navy, chipFg: C.frost },
];


const RAW_TECH: Omit<Tech, "bg" | "fg" | "chip" | "chipFg">[] = [
  { name: "React", mono: "Re", cat: "FRONTEND", desc: "Librería de JavaScript para construir interfaces con componentes reutilizables y un estado que se actualiza de forma predecible.", usage: "La interfaz de Solvia, mi app de escritorio para gestionar solicitudes, está hecha en React con TypeScript." },
  { name: "Next.js", mono: "Nx", cat: "FRONTEND", desc: "Framework sobre React con rutas, renderizado en el servidor y optimizaciones listas para producción.", usage: "Este portafolio está construido con Next.js." },
  { name: "TypeScript", mono: "TS", cat: "LENGUAJE", desc: "JavaScript con tipos estáticos: detecta errores antes de ejecutar y hace el código más fácil de mantener.", usage: "Lo uso en casi todo: TurnoSmart, Solvia, Fluxa y Karden Music Player." },
  { name: "Tailwind CSS", mono: "Tw", cat: "ESTILOS", desc: "Framework de CSS basado en utilidades para diseñar rápido y de forma consistente directamente en el marcado.", usage: "Estilos de Karden Music Player y de la app de escritorio de Solvia." },
  { name: "React Native", mono: "RN", cat: "MÓVIL", desc: "Permite crear apps nativas para iOS y Android con React y una sola base de código.", usage: "TurnoSmart, la app móvil que recupera citas médicas liberadas, está hecha con Expo y React Native." },
  { name: "Kotlin · Wear OS", mono: "Kt", cat: "MÓVIL", desc: "Lenguaje moderno para Android; con Wear OS se construyen apps para relojes inteligentes.", usage: "Sound Alert: una app para reloj que convierte sonidos importantes en alertas visuales y vibraciones." },
  { name: "Supabase", mono: "Sb", cat: "DATOS", desc: "Backend como servicio sobre PostgreSQL: autenticación, base de datos, almacenamiento y tiempo real.", usage: "Base de datos, autenticación, tiempo real y Edge Functions de TurnoSmart." },
  { name: "FastAPI", mono: "Fa", cat: "BACKEND", desc: "Framework de Python para crear APIs rápidas, con validación de datos y documentación automática.", usage: "El backend de Solvia y el servicio de IA de Quacktaclysm." },
  { name: "PostgreSQL", mono: "Pg", cat: "DATOS", desc: "Base de datos relacional de código abierto, robusta y con SQL avanzado.", usage: "La base de datos de Fluxa y de Solvia." },
  { name: "Docker", mono: "Dk", cat: "DEVOPS", desc: "Empaqueta aplicaciones en contenedores para que corran igual en cualquier entorno.", usage: "Levanto PostgreSQL y pgAdmin con Docker Compose para desarrollar Fluxa y Solvia." },
  { name: "Git · GitHub", mono: "Gt", cat: "HERRAMIENTAS", desc: "Control de versiones y colaboración: ramas, pull requests, revisiones y despliegues.", usage: "Todos mis proyectos viven en GitHub: ramas, commits claros y READMEs completos." },
  { name: "DeepSeek", mono: "Ds", cat: "IA", desc: "Modelos de lenguaje para integrar funciones de inteligencia artificial dentro de las aplicaciones.", usage: "La IA de Solvia (detecta solicitudes en riesgo) y de TurnoSmart (prioriza cupos y predice inasistencias)." },
  { name: "Godot", mono: "Gd", cat: "VIDEOJUEGOS", desc: "Motor de videojuegos de código abierto para crear juegos 2D y 3D.", usage: "Quacktaclysm, un videojuego 2D de acción que hice con Juliana Peñafiel." },
  { name: "Claude", mono: "Cl", cat: "IA · DISEÑO", desc: "Asistente de IA de Anthropic. Con Claude Design prototipo interfaces y explora ideas visuales antes de programarlas.", usage: "Diseño las pantallas de mis proyectos con Claude Design y lo uso para revisar código y documentación." },
  { name: "NestJS", mono: "Ns", cat: "BACKEND", desc: "Framework de Node.js con TypeScript para construir APIs ordenadas por módulos, con inyección de dependencias.", usage: "Fluxa, mi API REST de finanzas personales, con autenticación JWT, Swagger y pruebas." },
  { name: "Tauri", mono: "Ta", cat: "ESCRITORIO", desc: "Crea apps de escritorio ligeras usando tecnologías web y Rust.", usage: "Empaqueta Solvia como app de escritorio para Windows y macOS." },
];

export const TECH: Tech[] = RAW_TECH.map((t, k) => ({ ...t, ...SKINS[k % 4] }));

/** Posición x/y de cada tarjeta voladora (en px a 1440 de ancho). */
export const FLY_SPOTS: [number, number][] = [
  [-430, -210], [380, -250], [-180, 180], [520, 120], [-600, 40], [120, -300], [300, 260],
  [-420, 260], [600, -80], [-80, -160], [-560, -280], [200, 40], [460, 300], [-260, -40], [40, 290], [-640, 200],
];

/* ---------- Proyectos ---------- */
export const PROJECTS: {
  title: string;
  year: string;
  kind: string;
  desc: string;
  tags: string[];
  image: string;
  /** Botones del proyecto: código, demo en vivo, APK, instaladores… */
  links: { label: string; href: string; primary?: boolean }[];
  credit?: string;
  bg: string;
  fg: string;
  orb: string;
}[] = [
  {
    title: "TurnoSmart", year: "2026", kind: "App móvil", image: "/proyectos/turnosmart.jpg",
    desc: "Cuando alguien cancela una cita médica, TurnoSmart ofrece ese cupo al paciente de la lista de espera que mejor encaja y le explica por qué. El consultorio ve cuántas citas recupera y el riesgo de inasistencia.",
    tags: ["Expo", "React Native", "Supabase", "DeepSeek"],
    links: [
      { label: "Descargar APK", href: "https://github.com/LauraEscobar1/TurnoSmart/releases/latest", primary: true },
      { label: "GitHub", href: "https://github.com/LauraEscobar1/TurnoSmart" },
    ],
    bg: "#0f1c2a", fg: "#94bce3", orb: "#5980a6",
  },
  {
    title: "Solvia", year: "2026", kind: "App de escritorio", image: "/proyectos/solvia.jpg",
    desc: "Gestión inteligente de solicitudes para empresas y universidades: responsables, estados, alertas por SLA y una IA que detecta los atrasos antes de que pasen. Con instaladores para Windows y macOS.",
    tags: ["Tauri", "React", "FastAPI", "DeepSeek"],
    links: [
      { label: "Windows (.exe)", href: "https://github.com/LauraEscobar1/Solvia/releases/download/v1.0.1/Solvia_1.0.0_x64-setup.exe", primary: true },
      { label: "macOS (.dmg)", href: "https://github.com/LauraEscobar1/Solvia/releases/download/v1.0.1/Solvia_1.0.0_universal.dmg", primary: true },
      { label: "GitHub", href: "https://github.com/LauraEscobar1/Solvia" },
    ],
    bg: "#121417", fg: "#d7f53b", orb: "#3e3480",
  },
  {
    title: "Sound Alert", year: "2026", kind: "Wear OS", image: "/proyectos/soundalert.jpg",
    desc: "Una app para reloj pensada para personas con dificultades auditivas: escucha el entorno, reconoce con IA una sirena, un timbre o una bocina, y lo convierte en una alerta visual y una vibración.",
    tags: ["Kotlin", "Wear OS", "YAMNet", "API REST"],
    links: [
      { label: "Descargar APK", href: "https://github.com/LauraEscobar1/SoundAlert/releases/download/v1.0.0/SoundAlert.apk", primary: true },
      { label: "GitHub", href: "https://github.com/LauraEscobar1/SoundAlert" },
    ],
    bg: "#1d0a12", fg: "#f2a7c3", orb: "#f03a2e",
  },
  {
    title: "Quacktaclysm", year: "2026", kind: "Videojuego 2D", image: "/proyectos/quacktaclysm.jpg",
    desc: "Un juego de acción con un pato espadachín, tres jefes y decisiones que cambian la dificultad y el final. Un servicio de IA opcional ajusta el perfil del jugador.",
    tags: ["Godot 4", "GDScript", "FastAPI"],
    credit: "En colaboración con Juliana Peñafiel Melo",
    links: [{ label: "GitHub", href: "https://github.com/Juls2212/Quacktaclysm", primary: true }],
    bg: "#16141c", fg: "#ffd64d", orb: "#e08f3a",
  },
  {
    title: "Fluxa", year: "2026", kind: "API REST", image: "/proyectos/fluxa.jpg",
    desc: "API de finanzas personales: ingresos y gastos por categoría, presupuestos mensuales con alertas, metas de ahorro y un resumen del mes. Documentada con Swagger y con pruebas.",
    tags: ["NestJS", "TypeScript", "PostgreSQL", "JWT"],
    links: [{ label: "GitHub", href: "https://github.com/LauraEscobar1/Fluxa_Gestor_Financiero-", primary: true }],
    bg: "#0b1914", fg: "#3ee0a1", orb: "#f5c84c",
  },
  {
    title: "Karden", year: "2026", kind: "Reproductor web", image: "/proyectos/karden.jpg",
    desc: "Un reproductor de música con playlists construidas sobre listas doblemente enlazadas, importación de archivos M3U y arquitectura MVC.",
    tags: ["TypeScript", "Tailwind CSS", "Estructuras de datos"],
    links: [
      { label: "Ver en vivo", href: "https://karden-music.vercel.app/", primary: true },
      { label: "GitHub", href: "https://github.com/LauraEscobar1/KARDEN-Music-Player" },
    ],
    bg: "#100c0c", fg: "#ff2a2a", orb: "#1db954",
  },
  {
    title: "VozSalud", year: "2026", kind: "App web", image: "/proyectos/vozsalud.jpg",
    desc: "Un calendario para el cuidado y la salud de la voz: cada día propone un hábito y una recomendación. Lo hice junto a una fonoaudióloga.",
    tags: ["HTML", "CSS", "JavaScript"],
    credit: "Con Carolina Daza, fonoaudióloga",
    links: [{ label: "Ver en vivo", href: "https://vozsalud.vercel.app/", primary: true }],
    bg: "#0e1a19", fg: "#9fd8cb", orb: "#e7a8bd",
  },
];

/* ---------- Experiencia ---------- */
export const EXPERIENCE_INTRO =
  "En mis proyectos he construido productos completos: desde entender el problema y diseñar la interfaz hasta la base de datos, la API, la inteligencia artificial y el despliegue.";

/** Áreas en las que tienes experiencia (general, no por persona). */
export const EXPERIENCE_AREAS = [
  { title: "Desarrollo web y de escritorio", text: "Interfaces modernas, rápidas y accesibles.", tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Tauri"] },
  { title: "Apps móviles y relojes", text: "Apps para Android, iOS y Wear OS.", tools: ["React Native", "Expo", "Kotlin", "Wear OS"] },
  { title: "Backend y APIs REST", text: "APIs seguras, documentadas y con pruebas.", tools: ["FastAPI", "NestJS", "PostgreSQL", "Supabase", "JWT", "Docker"] },
  { title: "Inteligencia artificial aplicada", text: "IA que resuelve un problema concreto, no de adorno.", tools: ["DeepSeek", "YAMNet", "TensorFlow Lite", "Claude"] },
  { title: "Videojuegos", text: "Mecánicas, jefes y decisiones del jugador.", tools: ["Godot", "GDScript"] },
  { title: "Trabajo con personas reales", text: "Levantar requisitos, documentar, explicar y trabajar en equipo.", tools: ["Comunicación", "Documentación", "Trabajo en equipo"] },
];

/* ---------- Testimonios ---------- */
export const TESTIMONIALS = [
  {
    text: "Tuve el privilegio de acompañar a Laura en la creación de GlycoWatch, una aplicación pensada para personas con diabetes. Desde el primer momento me impresionaron su curiosidad, su constancia y la seriedad con la que investigó cada detalle. Laura no se queda en la idea: la convierte en algo que funciona y que puede ayudar a muchas personas. Estoy seguro de que llegará muy lejos.",
    name: "José Ignacio Palma",
    role: "Exrector · Institución Educativa Nuestro Señor del Río, Chiles",
    bg: C.frost,
    rot: -1.5,
  },
  {
    text: "Con VozSalud, Laura convirtió lo que yo hago en consulta en una herramienta que cualquiera puede usar todos los días. Escuchó con atención, preguntó todo lo que necesitaba entender y cuidó cada detalle para que fuera claro y amable. Trabajar con ella fue muy fácil.",
    name: "Carolina Daza",
    role: "Fonoaudióloga · Universidad María Cano",
    bg: C.white,
    rot: 1,
  },
  {
    text: "Laura es de esas personas que se comprometen de verdad. Es organizada, cumple lo que promete y tiene una paciencia enorme para explicar las cosas técnicas de forma sencilla. Además le pone creatividad a todo lo que hace: siempre encuentra la manera de que las ideas se vean y funcionen mejor.",
    name: "Valentina Díaz Bernate",
    role: "Ingeniera ambiental",
    bg: C.frost,
    rot: -0.5,
  },
];

/* ---------- Navegación por escenas ---------- */
/**
 * Las secciones a las que se entra desde el inicio (o desde la torre).
 *  - bg: color de fondo de la sección.
 *  - enter: color con el que se abre el portal (el primer color de su animación de entrada).
 *  - card / cardFg: colores de su tarjeta en el inicio.
 */
export const SECTIONS = [
  { id: "sobre-mi", label: "Sobre mí", bg: C.frost, enter: C.frost, card: C.frost, cardFg: C.navy },
  { id: "fuera", label: "Fuera de la pantalla", bg: "#F6FAFD", enter: "#F6FAFD", card: C.white, cardFg: C.navy },
  { id: "formacion", label: "Formación", bg: C.frost, enter: C.white, card: C.pistachio, cardFg: C.ink },
  { id: "stack", label: "Stack", bg: C.denim, enter: C.denim, card: C.navy, cardFg: C.frost },
  { id: "proyectos", label: "Proyectos", bg: C.frost, enter: C.denim, card: C.denim, cardFg: C.ink },
  { id: "experiencia", label: "Experiencia", bg: C.white, enter: C.frost, card: C.white, cardFg: C.navy },
  { id: "testimonios", label: "Testimonios", bg: C.pistachio, enter: C.white, card: C.pistachio, cardFg: C.ink },
  { id: "contacto", label: "Contacto", bg: C.navy, enter: C.pistachio, card: C.navy, cardFg: C.frost },
] as const;
export type SectionId = (typeof SECTIONS)[number]["id"];

