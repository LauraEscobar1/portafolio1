/* =========================================================================
   PORTFOLIO DATA — English
   Same order as lib/data.ts. Only the text fields are translated; links,
   images and colors come from the Spanish file.
   ========================================================================= */

export const SITE = {
  city: "Pasto, Colombia",
};

export const NAV = [
  { label: "About" },
  { label: "Off screen" },
  { label: "Education" },
  { label: "Stack" },
  { label: "Projects" },
  { label: "Experience" },
  { label: "Testimonials" },
];

export const EDUCATION = [
  {
    years: "In progress · 5th semester",
    title: "Software Engineering",
    place: "Universidad Cooperativa de Colombia · Pasto Campus",
    text: "I build software end to end: from the idea and the design to the code that ships to production.",
    chips: ["Web", "Mobile", "Desktop", "Databases", "Architecture", "Artificial intelligence"],
  },
  {
    years: "Languages",
    title: "Spanish · English",
    place: "Communication without borders",
    text: "I read technical documentation in English and communicate comfortably in everyday situations.",
    langs: [
      { name: "Spanish", level: "Native" },
      { name: "English", level: "B1" },
    ],
  },
];

export const TECH = [
  { cat: "FRONTEND", desc: "JavaScript library for building interfaces with reusable components and predictable state updates.", usage: "The interface of Solvia, my desktop app for managing requests, is built with React and TypeScript." },
  { cat: "FRONTEND", desc: "React framework with routing, server rendering and production-ready optimizations.", usage: "This portfolio is built with Next.js." },
  { cat: "LANGUAGE", desc: "JavaScript with static types: it catches errors before running and makes code easier to maintain.", usage: "I use it almost everywhere: TurnoSmart, Solvia, Fluxa and Karden Music Player." },
  { cat: "STYLING", desc: "Utility-first CSS framework to design quickly and consistently right in the markup.", usage: "Styling for Karden Music Player and the Solvia desktop app." },
  { cat: "MOBILE", desc: "Build native iOS and Android apps with React and a single codebase.", usage: "TurnoSmart, the mobile app that recovers freed-up medical appointments, is built with Expo and React Native." },
  { cat: "MOBILE", desc: "Modern language for Android; with Wear OS you build apps for smartwatches.", usage: "Sound Alert: a watch app that turns important sounds into visual alerts and vibrations." },
  { cat: "DATA", desc: "Backend as a service on PostgreSQL: authentication, database, storage and realtime.", usage: "Database, authentication, realtime and Edge Functions for TurnoSmart." },
  { cat: "BACKEND", desc: "Python framework for fast APIs, with data validation and automatic documentation.", usage: "The Solvia backend and the Quacktaclysm AI service." },
  { cat: "DATA", desc: "Robust open-source relational database with advanced SQL.", usage: "The database behind Fluxa and Solvia." },
  { cat: "DEVOPS", desc: "Packages apps into containers so they run the same in any environment.", usage: "I run PostgreSQL and pgAdmin with Docker Compose to develop Fluxa and Solvia." },
  { cat: "TOOLS", desc: "Version control and collaboration: branches, pull requests, reviews and deployments.", usage: "All my projects live on GitHub: branches, clear commits and complete READMEs." },
  { cat: "AI", desc: "Language models to bring artificial intelligence features into apps.", usage: "The AI in Solvia (flags at-risk requests) and TurnoSmart (prioritizes slots and predicts no-shows)." },
  { cat: "GAMES", desc: "Open-source game engine for 2D and 3D games.", usage: "Quacktaclysm, a 2D action game I made with Juliana Peñafiel." },
  { cat: "AI · DESIGN", desc: "Anthropic's AI assistant. With Claude Design I prototype interfaces and explore visual ideas before coding them.", usage: "I design my project screens with Claude Design and use it to review code and documentation." },
  { cat: "BACKEND", desc: "Node.js framework with TypeScript for modular APIs with dependency injection.", usage: "Fluxa, my personal finance REST API, with JWT auth, Swagger and tests." },
  { cat: "DESKTOP", desc: "Build lightweight desktop apps with web technologies and Rust.", usage: "Packages Solvia as a desktop app for Windows and macOS." },
];

export const PROJECTS: { kind: string; desc: string; tags?: string[]; credit?: string; links?: string[] }[] = [
  {
    kind: "Mobile app",
    desc: "When someone cancels a medical appointment, TurnoSmart offers the slot to the best-fitting patient on the waiting list and explains why. The clinic sees how many appointments it recovers and the no-show risk.",
    links: ["Download APK", "GitHub"],
  },
  {
    kind: "Desktop app",
    desc: "Smart request management for companies and universities: owners, statuses, SLA alerts and an AI that spots delays before they happen. With installers for Windows and macOS.",
    links: ["Windows (.exe)", "macOS (.dmg)", "GitHub"],
  },
  {
    kind: "Wear OS",
    desc: "A watch app for people with hearing difficulties: it listens to the surroundings, uses AI to recognize a siren, a doorbell or a car horn, and turns it into a visual alert and a vibration.",
    tags: ["Kotlin", "Wear OS", "YAMNet", "REST API"],
    links: ["Download APK", "GitHub"],
  },
  {
    kind: "2D video game",
    desc: "An action game with a sword-wielding duck, three bosses and choices that change the difficulty and the ending. An optional AI service adapts the player profile.",
    credit: "In collaboration with Juliana Peñafiel Melo",
    links: ["GitHub"],
  },
  {
    kind: "REST API",
    desc: "Personal finance API: income and expenses by category, monthly budgets with alerts, savings goals and a monthly summary. Documented with Swagger and covered by tests.",
    links: ["GitHub"],
  },
  {
    kind: "Web music player",
    desc: "A music player with playlists built on doubly linked lists, M3U file import and an MVC architecture.",
    tags: ["TypeScript", "Tailwind CSS", "Data structures"],
    links: ["View live", "GitHub"],
  },
  {
    kind: "Web app",
    desc: "A calendar for voice care and vocal health: every day suggests a habit and a tip. Built together with a speech therapist.",
    credit: "With Carolina Daza, speech therapist",
    links: ["View live"],
  },
];

export const EXPERIENCE_INTRO =
  "In my projects I have built complete products: from understanding the problem and designing the interface to the database, the API, the artificial intelligence and the deployment.";

export const EXPERIENCE_AREAS = [
  { title: "Web and desktop development", text: "Modern, fast and accessible interfaces." },
  { title: "Mobile and watch apps", text: "Apps for Android, iOS and Wear OS." },
  { title: "Backend and REST APIs", text: "Secure, documented and tested APIs." },
  { title: "Applied artificial intelligence", text: "AI that solves a real problem, not just decoration." },
  { title: "Video games", text: "Mechanics, bosses and player choices." },
  { title: "Working with real people", text: "Gathering requirements, documenting, explaining and teamwork.", tools: ["Communication", "Documentation", "Teamwork"] },
];

export const TESTIMONIALS = [
  {
    text: "I had the privilege of supporting Laura while she created GlycoWatch, an app designed for people with diabetes. From the very beginning I was impressed by her curiosity, her perseverance and how seriously she researched every detail. Laura doesn't stop at the idea: she turns it into something that works and can help many people. I'm sure she will go very far.",
    role: "Former principal · Institución Educativa Nuestro Señor del Río, Chiles",
  },
  {
    text: "With VozSalud, Laura turned what I do in my practice into a tool anyone can use every day. She listened carefully, asked everything she needed to understand and took care of every detail so it would be clear and friendly. Working with her was very easy.",
    role: "Speech therapist · Universidad María Cano",
  },
  {
    text: "Laura is one of those people who truly commit. She's organized, keeps her promises and has enormous patience to explain technical things in a simple way. She also brings creativity to everything she does: she always finds a way to make ideas look and work better.",
    role: "Environmental engineer",
  },
];

export const SECTION_LABELS = ["About", "Off screen", "Education", "Stack", "Projects", "Experience", "Testimonials", "Contact"];
