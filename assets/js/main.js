
// ═══════════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════════
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer;

function showToast(msgKey, icon = 'check_circle') {
    const translation = (typeof i18n !== 'undefined' && i18n[typeof currentLang !== 'undefined' ? currentLang : 'es']) ?
        (i18n[typeof currentLang !== 'undefined' ? currentLang : 'es'][msgKey] || msgKey) : msgKey;
    toastMsg.textContent = translation;
    toast.querySelector('.toast-icon').textContent = icon;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// Stat numbers in the page language: 4.300 / 4,9 in Spanish, 4,300 / 4.9 in English (also used by remix.js)
function formatCount(value, dec) {
    const es = (typeof currentLang !== 'undefined' ? currentLang : 'es') === 'es';
    if (dec) return es ? value.toFixed(1).replace('.', ',') : value.toFixed(1);
    const int = String(Math.round(value));
    return es ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : Number(int).toLocaleString('en-US');
}

// ═══════════════════════════════════════════════════
//  HERO: lo anima remix.js (GSAP)
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
//  NAV: shadow + scroll activo
// ═══════════════════════════════════════════════════
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('shadow-md', window.scrollY > 50);
}, { passive: true });

const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('nav .nav-link');

// Activa la sección que cruza la mitad de la pantalla (funciona aunque sea más alta que la ventana)
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('nav-link-active'));
            const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('nav-link-active');
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// ═══════════════════════════════════════════════════
//  MENÚ MÓVIL
// ═══════════════════════════════════════════════════
const btnMobile = document.getElementById('btn-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
function setMobileMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    btnMobile.setAttribute('aria-expanded', String(open));
    btnMobile.setAttribute('aria-label', open ? i18n[currentLang].ariaMenuOpen : i18n[currentLang].ariaMenuClosed);
    btnMobile.textContent = open ? 'close' : 'menu';
}
btnMobile.addEventListener('click', () => setMobileMenu(mobileMenu.classList.contains('hidden')));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobileMenu(false)));

// ═══════════════════════════════════════════════════
//  MODO OSCURO / CLARO
// ═══════════════════════════════════════════════════
const btnTheme = document.getElementById('btn-theme');
const htmlEl = document.documentElement;

// La preferencia guardada ya se aplicó en <head>; aquí solo se sincroniza el ícono
if (!htmlEl.classList.contains('dark')) btnTheme.textContent = 'light_mode';
btnTheme.setAttribute('aria-pressed', String(htmlEl.classList.contains('dark')));

btnTheme.addEventListener('click', () => {
    const isDark = htmlEl.classList.toggle('dark');
    btnTheme.textContent = isDark ? 'dark_mode' : 'light_mode';
    btnTheme.setAttribute('aria-pressed', String(isDark));
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* almacenamiento no disponible */ }
    showToast(isDark ? 'toastDark' : 'toastLight', isDark ? 'dark_mode' : 'light_mode');
});

// ═══════════════════════════════════════════════════
//  IDIOMA ES / EN
// ═══════════════════════════════════════════════════
const btnLang = document.getElementById('btn-language');
let currentLang = 'es';

const i18n = {
    es: {
        navAbout: 'Sobre Mí', navStack: 'Stack', navProjects: 'Proyectos',
        navExp: 'Experiencia', navContact: 'Contacto',
        heroBadge: 'Desarrollador · Agentic Engineering',
        heroCta1: 'Ver Proyectos', heroCta2: 'Descargar CV', heroNavCv: 'Descargar CV',
        heroQuote: 'El código se reescribe; tu determinación permanece intacta',
        aboutTitle: 'Sobre Mí',
        pageTitle: 'Alan Roy Cuevas - Desarrollador de software | Agentic Engineering y tiempo real',
        aboutText: 'Construyo software que se usa todos los días y las herramientas para hacerlo con Agentic Engineering. Diseño la solución y tomo las decisiones; dirijo a los agentes de IA que la ejecutan, reviso su trabajo y nada se da por terminado sin una prueba que lo confirme. Me apasionan los sistemas en tiempo real, las apps que cuidan la privacidad y resolver problemas reales.',
        techTitle: 'Stack Tecnológico', techSub: 'Herramientas Principales',
        techDesc: 'Tecnologías y lenguajes que utilizo para construir arquitecturas escalables, seguras y de alto rendimiento.',
        projTitle: 'Proyectos Destacados',
        proj1Demo: 'Solicitar Demo', proj2Site: 'Ver en GitHub',
        proj1Title: 'Turnero - Gestión de Colas',
        proj1Desc: 'Sistema integral de gestión de turnos en tiempo real que digitaliza las filas de espera. Procesa conexiones simultáneas desde dispositivos móviles, tótems y pantallas de TV mediante WebSockets, garantizando velocidad y seguridad con un sistema de persistencia híbrida y acceso por roles.',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Aplicación de escritorio offline para manipular documentos e imágenes directamente en el navegador. Su arquitectura cliente-servidor local garantiza privacidad total al procesar los archivos de forma local sin enviarlos a servidores externos.',
        proj3Title: 'Key2Pad - Teclado a Gamepad',
        proj3Desc: 'Software de emulación nativa (XInput) que permite jugar cualquier título de PC sin necesidad de hardware adicional. Transforma inputs físicos en señales analógicas reales mediante drivers de bajo nivel, ofreciendo una experiencia altamente personalizable con perfiles dedicados y un overlay de interacción directa.',
        proj3Site: 'Ver Sitio Web',
        expTitle: 'Experiencia',
        expRole: 'Desarrollador de software independiente',
        expOrg: 'Turnero - Gestión de Colas',
        expContext: 'Institución Médica / Sector Salud - Obra social privada',
        expDate: '2025 - PRESENTE',
        expBullet1: 'Desarrollé desde cero un sistema integral de gestión de turnos para optimizar el flujo de atención diaria, utilizando Node.js, Socket.IO y SQLite.',
        expBullet2: 'Implementé una solución en tiempo real que sincroniza tótems, pantallas de TV y dispositivos móviles de forma simultánea, asegurando un rendimiento estable y la protección de los datos.',
        expBullet3: 'Evolucioné el sistema de forma continua basándome en el feedback de los usuarios, logrando entregar una herramienta a medida, intuitiva y de fácil adaptación.',
        expBullet4: 'El sistema gestionó de forma autónoma a más de 4.200 pacientes mensuales distribuidos en 12 servicios activos, logrando una tasa de satisfacción del 4,9/5 según los reportes analíticos generados. ',
        expReportLink: 'Ver reporte generado por Turnero - Gestión de Colas.',
        exp3Org: 'NEXUS - Desarrollo con agentes de IA',
        exp3Bullet1: 'Diseñé un entorno para desarrollar con agentes de IA en el que ningún cambio se da por bueno sin una prueba automática que lo verifique.',
        exp3Bullet2: 'Construí su servidor MCP propio (memoria, backlog y verificación) y una memoria semántica con LanceDB.',
        exp3Bullet3: 'Antes de tocar código, cada plan pasa por agentes revisores que pueden pedir cambios o rechazarlo. Hoy lo uso en todos mis proyectos.',
        exp2Org: 'LocalPDF Hub',
        exp2Bullet1: 'Lideré el desarrollo end-to-end de una aplicación web local en Python para procesamiento de PDFs, priorizando privacidad y funcionamiento offline.',
        exp2Bullet2: 'Diseñé una arquitectura modular (FastAPI + JavaScript, empaquetada con PyInstaller) que permite sumar herramientas de forma aislada sin acoplar funcionalidades.',
        exp2Bullet3: 'Desarrollé un conjunto de 13 herramientas de manipulación de documentos e incorporé mejoras continuas como soporte multi-formato (HEIC/HEIF), unión de varios archivos en un solo PDF, modo red para LAN, y UI multi-idioma con modo claro/oscuro.',
        contactTitle: 'Contacto',
        contactHeadlinePart1: '¿Tenés algún proyecto en mente? ',
        contactHeadlineSpan: 'Hablemos',
        contactHeadlinePart2: '.',
        contactDesc: 'Estoy abierto a nuevos desafíos técnicos, propuestas laborales o charlas sobre arquitectura de software.',
        contactLocation: 'Buenos Aires, Argentina / Remoto',
        contactLabelName: 'Nombre', contactPlaceholderName: 'Tu nombre completo',
        contactLabelEmail: 'Email', contactPlaceholderEmail: 'tu@email.com',
        contactLabelMsg: 'Mensaje', contactPlaceholderMsg: '¿En qué te puedo ayudar?',
        contactBtn: 'Enviar Mensaje',
        footerCopy: `© ${new Date().getFullYear()} Alan Roy Cuevas. Todos los derechos reservados.`,
        langToast: 'Idioma: Español',
        toastDark: 'Tema oscuro activado',
        toastLight: 'Tema claro activado',
        toastFormErr: 'Completá todos los campos correctamente',
        toastFormOk: 'Mensaje enviado con éxito',
        toastFormFail: 'Error al enviar. Intentá de nuevo.',
        toastMoreProjects: 'Próximamente más proyectos',
        moreProjectsBtn: 'Ver Más Proyectos',
        toastDemo: 'Completá el formulario para solicitar la demo',
        introScroll: 'Hacé scroll para descubrir',
        carouselScreen: 'pantalla',
        lightboxFallback: 'Captura de pantalla',
        submitSending: 'Enviando...',
        submitNormal: 'Enviar Mensaje',
        ariaLang: 'Cambiar idioma',
        ariaTheme: 'Cambiar tema claro/oscuro',
        ariaMenuOpen: 'Cerrar menú de navegación',
        ariaMenuClosed: 'Abrir menú de navegación',
        ariaCvNav: 'Descargar CV de Alan Roy Cuevas',
        ariaCvHero: 'Descargar CV en PDF',
        ariaLboxClose: 'Cerrar visor',
        ariaLboxPrev: 'Imagen anterior',
        ariaLboxNext: 'Imagen siguiente',
        ariaLbox: 'Visor de imágenes',
        ariaProj1: 'Solicitar demo de Turnero - Gestión de Colas',
        proj1Features: 'Ver Características',
        ariaProj1Features: 'Ver características de Turnero - Gestión de Colas',
        featuresTitle: 'Características',
        featuresIntro: 'Sistema completo de turnos y filas de atención: el cliente saca su turno, espera sentado y la pantalla lo llama al puesto correspondiente. Todo en tiempo real y adaptable a cualquier rubro.',
        ariaFeaturesClose: 'Cerrar características',
        turneroFeatures: [
            { icon: 'confirmation_number', title: 'Para el cliente', items: [
                'Tótem de autoatención: elige el servicio, ingresa su DNI y recibe su turno con código QR.',
                'Impresión de ticket desde el tótem.',
                'Turnos desde el celular, sin papel: ve su lugar en la fila y el tiempo estimado.',
                'Aviso "¡Es tu turno!" en el celular con el puesto al que tiene que ir.',
                'Calificación de la atención al finalizar.'
            ] },
            { icon: 'tv', title: 'Sala de espera', items: [
                'Pantalla de llamados en tiempo real con aviso sonoro.',
                'Historial de últimos llamados y puesto de destino.',
                'Modo cartelería con imágenes y mensajes propios entre llamados.',
                'Cada pantalla puede mostrar solo los servicios que le corresponden.'
            ] },
            { icon: 'support_agent', title: 'Para el equipo', items: [
                'Panel por puesto: llamar al siguiente, volver a llamar, derivar, devolver a la fila, marcar ausente y finalizar.',
                'Varios puestos atendiendo el mismo servicio sin llamar dos veces al mismo cliente.',
                'Admisión manual para cargar turnos desde el mostrador.',
                'Chat interno entre puestos y notificaciones programadas.'
            ] },
            { icon: 'monitoring', title: 'Gestión y reportes', items: [
                'Tablero en tiempo real: turnos del día, espera y atención promedio, ausentismo y demanda por hora.',
                'Reportes por mes y por semana con exportación a CSV e impresión/PDF.',
                'Servicios, horarios por día, personal y roles configurables desde el panel.',
                'Marca, logo, colores y terminología adaptables a cada rubro.'
            ] },
            { icon: 'shield_lock', title: 'Seguridad', items: [
                'Acceso por roles: administrador, operador, admisión, tótem y pantalla.',
                'Sesiones con JWT revocables al cambiar permisos o contraseña.',
                'Protección CSRF y bloqueo temporal ante intentos fallidos de acceso.',
                'Registro de seguridad de accesos y cambios de configuración.'
            ] },
            { icon: 'dns', title: 'Tecnología e instalación', items: [
                'Node.js, Express, Socket.IO y SQLite con migraciones versionadas.',
                'Funciona en red local sin internet, en Windows o macOS, o en la nube con Docker/VPS o Railway.',
                'Copias de seguridad, restauración y recuperación del administrador.',
                'Más de 370 tests automáticos y guías de instalación paso a paso.'
            ] }
        ],
        ariaProj2: 'Ver LocalPDF Hub en GitHub',
        ariaProj3: 'Ver sitio web de Key2Pad',
        imageWord: 'Imagen', carouselOf: 'Capturas de', carouselRole: 'carrusel', dotsLabel: 'Selector de imagen',
        navLabel: 'Navegación principal', socialLabel: 'Redes sociales', techListLabel: 'Lista de tecnologías',
        exp1ListLabel: 'Logros y responsabilidades en Turnero', exp2ListLabel: 'Logros y responsabilidades en LocalPDF Hub', exp3ListLabel: 'Logros y responsabilidades en NEXUS',
        formLabel: 'Formulario de contacto', thumbsLabel: 'Capturas', logoLabel: 'ROY, ir al inicio', footerTopLabel: 'ROY, volver al inicio',
        linkedinLabel: 'LinkedIn de Alan Roy Cuevas', githubLabel: 'GitHub de Alan Roy Cuevas', moreProjectsLabel: 'Ver Más Proyectos (próximamente)',
        errRequired: 'Completá este campo.', errEmail: 'Ingresá un email válido, por ejemplo nombre@dominio.com.', errCaptcha: 'Marcá la casilla "No soy un robot".',
        formPrivacy: 'Tus datos se usan solo para responderte. El envío se procesa con EmailJS.',
        motionPause: 'Pausar animaciones', motionPlay: 'Reanudar animaciones', themeDark: 'Modo oscuro',
        carouselPause: 'Pausar carrusel', carouselPlay: 'Reanudar carrusel', skipLink: 'Saltar al contenido',
        statPatients: 'pacientes por mes', statServices: 'servicios activos',
        statRating: 'satisfacción sobre 5', statTools: 'herramientas de documentos', statMcp: 'herramientas en su servidor MCP',
        moreSoon1: 'Más', moreSoon2: 'pronto.'
    },
    en: {
        navAbout: 'About', navStack: 'Stack', navProjects: 'Projects',
        navExp: 'Experience', navContact: 'Contact',
        heroBadge: 'Developer · Agentic Engineering',
        heroCta1: 'View Projects', heroCta2: 'Download CV', heroNavCv: 'Download CV',
        heroQuote: 'Code is rewritten; your determination remains intact',
        aboutTitle: 'About Me',
        pageTitle: 'Alan Roy Cuevas - Software Developer | Agentic Engineering and real time',
        aboutText: 'I build software people use every day, and the tools to do it with Agentic Engineering. I design the solution and make the decisions; I direct the AI agents that carry it out, review their work, and nothing counts as done until a test confirms it. I love real-time systems, apps that protect privacy and solving real problems.',
        techTitle: 'Tech Stack', techSub: 'Core Tools',
        techDesc: 'Technologies and languages I use to build scalable, secure, high-performance architectures.',
        projTitle: 'Featured Projects',
        proj1Demo: 'Request Demo', proj2Site: 'View on GitHub',
        proj1Title: 'Turnero - Queue Management',
        proj1Desc: 'Comprehensive real-time queue management system that digitizes waiting lines. Processes simultaneous connections from mobile devices, totems, and TV screens via WebSockets, ensuring speed and security with hybrid persistence and role-based access.',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Offline desktop application to manipulate documents and images directly in the browser. Its local client-server architecture ensures total privacy by processing files locally without sending them to external servers.',
        proj3Title: 'Key2Pad - Keyboard to Gamepad',
        proj3Desc: 'Native emulation software (XInput) that allows playing any PC title without the need for additional hardware. Transforms physical inputs into real analog signals using low-level drivers, offering a highly customizable experience with dedicated profiles and a direct interaction overlay.',
        proj3Site: 'View Website',
        expTitle: 'Experience',
        expRole: 'Independent Software Developer',
        expOrg: 'Turnero - Queue Management',
        expContext: 'Medical Institution / Healthcare Sector - Private Health Insurance',
        expDate: '2025 - PRESENT',
        expBullet1: 'Built a comprehensive appointment management system from scratch to optimize daily patient flow, using Node.js, Socket.IO, and SQLite.',
        expBullet2: 'Implemented a real-time solution that synchronizes totems, TV screens, and mobile devices simultaneously, ensuring stable performance and data protection.',
        expBullet3: 'Continuously evolved the system based on user feedback, delivering a custom-built, intuitive, and easily adaptable tool.',
        expBullet4: 'The system autonomously managed over 4,200 monthly patients distributed across 12 active services, achieving a 4.9/5 satisfaction rate according to generated analytics reports. ',
        expReportLink: 'View report generated by Turnero - Queue Management.',
        exp3Org: 'NEXUS - Building with AI agents',
        exp3Bullet1: 'Designed an environment for building software with AI agents where no change counts as done until an automated test verifies it.',
        exp3Bullet2: 'Built its own MCP server (memory, backlog and verification) and a semantic memory on LanceDB.',
        exp3Bullet3: 'Before any code is touched, every plan goes through reviewer agents that can ask for changes or reject it. Today I use it in all my projects.',
        exp2Org: 'LocalPDF Hub',
        exp2Bullet1: 'Led end-to-end development of a local Python web application for PDF processing, prioritizing privacy and offline functionality.',
        exp2Bullet2: 'Designed a modular architecture (FastAPI + JavaScript, packaged with PyInstaller) that allows adding tools in isolation without coupling functionalities.',
        exp2Bullet3: 'Developed a suite of 13 document manipulation tools and shipped continuous improvements including multi-format support (HEIC/HEIF), merging several files into one PDF, LAN network mode, and a multi-language UI with light/dark mode.',
        contactTitle: 'Contact',
        contactHeadlinePart1: 'Do you have a project in mind? ',
        contactHeadlineSpan: 'Let\'s talk',
        contactHeadlinePart2: '.',
        contactDesc: 'I\'m open to new technical challenges, job proposals, or conversations about software architecture.',
        contactLocation: 'Buenos Aires, Argentina / Remote',
        contactLabelName: 'Name', contactPlaceholderName: 'Your full name',
        contactLabelEmail: 'Email', contactPlaceholderEmail: 'you@email.com',
        contactLabelMsg: 'Message', contactPlaceholderMsg: 'How can I help you?',
        contactBtn: 'Send Message',
        footerCopy: `© ${new Date().getFullYear()} Alan Roy Cuevas. All rights reserved.`,
        langToast: 'Language: English',
        toastDark: 'Dark mode activated',
        toastLight: 'Light mode activated',
        toastFormErr: 'Please fill all fields correctly',
        toastFormOk: 'Message sent successfully',
        toastFormFail: 'Error sending. Try again.',
        toastMoreProjects: 'More projects coming soon',
        moreProjectsBtn: 'View More Projects',
        toastDemo: 'Fill out the form to request the demo',
        introScroll: 'Scroll to discover',
        carouselScreen: 'screen',
        lightboxFallback: 'Screenshot',
        submitSending: 'Sending...',
        submitNormal: 'Send Message',
        ariaLang: 'Change language',
        ariaTheme: 'Toggle light/dark theme',
        ariaMenuOpen: 'Close navigation menu',
        ariaMenuClosed: 'Open navigation menu',
        ariaCvNav: 'Download CV – Alan Roy Cuevas',
        ariaCvHero: 'Download CV as PDF',
        ariaLboxClose: 'Close viewer',
        ariaLboxPrev: 'Previous image',
        ariaLboxNext: 'Next image',
        ariaLbox: 'Image viewer',
        ariaProj1: 'Request Demo – Turnero (Queue Management)',
        proj1Features: 'View Features',
        ariaProj1Features: 'View Features – Turnero (Queue Management)',
        featuresTitle: 'Features',
        featuresIntro: 'A complete ticketing and queue system: customers take a ticket, wait seated and the screen calls them to the right desk. Everything in real time and adaptable to any business.',
        ariaFeaturesClose: 'Close features',
        turneroFeatures: [
            { icon: 'confirmation_number', title: 'For customers', items: [
                'Self-service kiosk: pick a service, enter an ID number and get a ticket with a QR code.',
                'Ticket printing from the kiosk.',
                'Paperless tickets on the phone: see your place in line and the estimated wait.',
                '"It\'s your turn!" alert on the phone with the desk to go to.',
                'Service rating at the end.'
            ] },
            { icon: 'tv', title: 'Waiting room', items: [
                'Real-time call screen with sound alert.',
                'Recent calls history with the destination desk.',
                'Digital signage mode with your own images and messages between calls.',
                'Each screen can show only the services assigned to it.'
            ] },
            { icon: 'support_agent', title: 'For the team', items: [
                'Desk panel: call next, recall, transfer, return to queue, mark absent and finish.',
                'Several desks serving the same service without calling the same customer twice.',
                'Manual front-desk admission.',
                'Internal chat between desks and scheduled notifications.'
            ] },
            { icon: 'monitoring', title: 'Management & reports', items: [
                'Real-time dashboard: tickets of the day, average wait and service time, no-shows and hourly demand.',
                'Monthly and weekly reports with CSV export and print/PDF.',
                'Services, daily schedules, staff and roles configurable from the panel.',
                'Brand, logo, colors and terminology adaptable to each business.'
            ] },
            { icon: 'shield_lock', title: 'Security', items: [
                'Role-based access: admin, operator, admission, kiosk and display.',
                'JWT sessions revoked when permissions or passwords change.',
                'CSRF protection and temporary lockout after failed sign-in attempts.',
                'Security log of sign-ins and configuration changes.'
            ] },
            { icon: 'dns', title: 'Technology & setup', items: [
                'Node.js, Express, Socket.IO and SQLite with versioned migrations.',
                'Runs offline on a local network on Windows or macOS, or in the cloud with Docker/VPS or Railway.',
                'Backups, restore and administrator recovery.',
                'Over 370 automated tests and step-by-step setup guides.'
            ] }
        ],
        ariaProj2: 'View LocalPDF Hub on GitHub',
        ariaProj3: 'View Website – Key2Pad',
        imageWord: 'Image', carouselOf: 'Screenshots of', carouselRole: 'carousel', dotsLabel: 'Image selector',
        navLabel: 'Main navigation', socialLabel: 'Social networks', techListLabel: 'Technology list',
        exp1ListLabel: 'Achievements and responsibilities at Turnero', exp2ListLabel: 'Achievements and responsibilities at LocalPDF Hub', exp3ListLabel: 'Achievements and responsibilities at NEXUS',
        formLabel: 'Contact form', thumbsLabel: 'Screenshots', logoLabel: 'ROY, back to top', footerTopLabel: 'ROY, back to top',
        linkedinLabel: 'LinkedIn of Alan Roy Cuevas', githubLabel: 'GitHub of Alan Roy Cuevas', moreProjectsLabel: 'View More Projects (coming soon)',
        errRequired: 'Please fill in this field.', errEmail: 'Enter a valid email, for example name@domain.com.', errCaptcha: 'Please check "I\'m not a robot".',
        formPrivacy: 'Your data is only used to reply to you. Sending is handled by EmailJS.',
        motionPause: 'Pause animations', motionPlay: 'Resume animations', themeDark: 'Dark mode',
        carouselPause: 'Pause carousel', carouselPlay: 'Resume carousel', skipLink: 'Skip to content',
        statPatients: 'patients per month', statServices: 'active services',
        statRating: 'satisfaction out of 5', statTools: 'document tools', statMcp: 'tools in its MCP server',
        moreSoon1: 'More', moreSoon2: 'soon.'
    }
};

function applyLang(lang, notify = true) {
    const t = i18n[lang];
    window.remixBeforeLang?.();
    document.documentElement.lang = lang;
    document.title = t.pageTitle;

    // Helper robusto sin innerHTML (prevención de XSS)
    function translateEl(id, text, attr = null) {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[i18n Warning] Element with ID "${id}" was not found.`);
            return;
        }
        if (attr) {
            el.setAttribute(attr, text);
        } else {
            el.textContent = text;
        }
    }

    // --- 1. NAVEGACIÓN ---
    const nl = document.querySelectorAll('nav .nav-link');
    if (nl[0]) nl[0].textContent = t.navAbout;
    if (nl[1]) nl[1].textContent = t.navStack;
    if (nl[2]) nl[2].textContent = t.navProjects;
    if (nl[3]) nl[3].textContent = t.navExp;
    if (nl[4]) nl[4].textContent = t.navContact;

    document.querySelectorAll('#mobile-menu a[href^="#"]').forEach((a, i) => {
        a.textContent = [t.navAbout, t.navStack, t.navProjects, t.navExp, t.navContact][i];
    });

    // --- 2. HERO ---
    const introIndicator = document.querySelector('#intro-scroll-indicator span:first-child');
    if (introIndicator && t.introScroll) introIndicator.textContent = t.introScroll;

    const heroBadgeEl = document.getElementById('hero-badge');
    if (heroBadgeEl) heroBadgeEl.textContent = t.heroBadge;

    translateEl('txt-btn-projects', t.heroCta1);
    translateEl('txt-btn-cv', t.heroCta2);
    translateEl('hero-quote-text', t.heroQuote);

    // --- 3. SOBRE MÍ ---
    translateEl('about-heading', t.aboutTitle);
    const aboutTextEl = document.getElementById('about-text');
    if (aboutTextEl) aboutTextEl.textContent = t.aboutText;

    // --- 4. STACK ---
    translateEl('tech-heading', t.techTitle);
    translateEl('tech-subheading', t.techSub);
    translateEl('tech-description', t.techDesc);

    // --- 5. PROYECTOS ---
    translateEl('projects-heading', t.projTitle);
    const projectTitles = document.querySelectorAll('#projects article h3');
    if (projectTitles[0]) projectTitles[0].textContent = t.proj1Title;
    if (projectTitles[1]) projectTitles[1].textContent = t.proj2Title;
    if (projectTitles[2]) projectTitles[2].textContent = t.proj3Title;
    const projectDescs = document.querySelectorAll('#projects article p.leading-relaxed');
    if (projectDescs[0]) projectDescs[0].textContent = t.proj1Desc;
    if (projectDescs[1]) projectDescs[1].textContent = t.proj2Desc;
    if (projectDescs[2]) projectDescs[2].textContent = t.proj3Desc;

    // CTAs de Proyectos traducidos de forma segura en spans
    translateEl('btn-turnero-demo-text', t.proj1Demo);
    translateEl('btn-turnero-features-text', t.proj1Features);
    translateEl('btn-turnero-features', t.ariaProj1Features, 'aria-label');
    if (window.portfolioFeatures) window.portfolioFeatures.render(t);
    translateEl('btn-localpdf-site-text', t.proj2Site);
    translateEl('btn-key2pad-site-text', t.proj3Site);

    // --- 6. EXPERIENCIA ---
    translateEl('experience-heading', t.expTitle);
    // The first <li> of the list is the timeline decoration
    const expItems = document.querySelectorAll('#experience ol > li:not(.timeline-line)');
    // Experiencia (Padre único)
    if (expItems[0]) {
        const h3 = expItems[0].querySelector('h3');
        if (h3) h3.textContent = t.expRole;
        const time = expItems[0].querySelector('time');
        if (time) time.textContent = t.expDate;
        
        translateEl('exp1-org', t.expOrg);
        translateEl('exp1-context', t.expContext);
        const ul1 = document.getElementById('exp1-bullets');
        if (ul1) {
            const bullets1 = ul1.querySelectorAll('li');
            const bulletTexts1 = [t.expBullet1, t.expBullet2, t.expBullet3];
            bullets1.forEach((li, i) => {
                // Solo alterar las primeras 3 viñetas dinámicas originales
                if(i < 3) {
                    const dot = li.querySelector('span');
                    li.textContent = '';
                    if (dot) li.appendChild(dot);
                    li.append(' ' + bulletTexts1[i]);
                }
            });
            translateEl('exp1-bullet4-text', t.expBullet4);
            translateEl('exp1-report-link', t.expReportLink);
        }
        
        translateEl('exp3-org', t.exp3Org);
        const ul3 = document.getElementById('exp3-bullets');
        if (ul3) {
            const bulletTexts3 = [t.exp3Bullet1, t.exp3Bullet2, t.exp3Bullet3];
            ul3.querySelectorAll('li').forEach((li, i) => {
                const dot = li.querySelector('span');
                li.textContent = '';
                if (dot) li.appendChild(dot);
                li.append(' ' + bulletTexts3[i]);
            });
        }

        translateEl('exp2-org', t.exp2Org);
        const ul2 = document.getElementById('exp2-bullets');
        if (ul2) {
            const bullets2 = ul2.querySelectorAll('li');
            const bulletTexts2 = [t.exp2Bullet1, t.exp2Bullet2, t.exp2Bullet3];
            bullets2.forEach((li, i) => {
                const dot = li.querySelector('span');
                li.textContent = '';
                if (dot) li.appendChild(dot);
                li.append(' ' + bulletTexts2[i]);
            });
        }
    }

    // --- 7. CONTACTO ---
    translateEl('contact-heading', t.contactTitle);
    translateEl('contact-headline-part1', t.contactHeadlinePart1);
    translateEl('contact-headline-span', t.contactHeadlineSpan);
    translateEl('contact-headline-part2', t.contactHeadlinePart2);
    translateEl('contact-desc', t.contactDesc);
    translateEl('contact-location', t.contactLocation);
    translateEl('contact-name-label', t.contactLabelName);
    translateEl('contact-email-label', t.contactLabelEmail);
    translateEl('contact-message-label', t.contactLabelMsg);
    
    const inputName = document.getElementById('contact-name');
    if (inputName) inputName.placeholder = t.contactPlaceholderName;
    const inputEmail = document.getElementById('contact-email');
    if (inputEmail) inputEmail.placeholder = t.contactPlaceholderEmail;
    const inputMsg = document.getElementById('contact-message');
    if (inputMsg) inputMsg.placeholder = t.contactPlaceholderMsg;
    
    translateEl('btn-submit-text', t.contactBtn);

    // --- 8. FOOTER ---
    const footerText = document.querySelector('footer p.font-body');
    if (footerText) footerText.textContent = t.footerCopy;

    const moreProjLabel = document.getElementById('btn-more-projects-label');
    if (moreProjLabel) moreProjLabel.textContent = t.moreProjectsBtn;

    // --- 9. ACCESIBILIDAD (ARIA LABELS) Y BOTÓN CV ---
    translateEl('btn-language', t.ariaLang, 'aria-label');
    translateEl('btn-theme', t.ariaTheme, 'aria-label');
    translateEl('btn-cv-nav', t.ariaCvNav, 'aria-label');
    translateEl('btn-cv-hero', t.ariaCvHero, 'aria-label');
    translateEl('btn-cv-mobile', t.ariaCvNav, 'aria-label');
    translateEl('btn-turnero-demo', t.ariaProj1, 'aria-label');
    translateEl('btn-localpdf-site', t.ariaProj2, 'aria-label');
    translateEl('btn-key2pad-site', t.ariaProj3, 'aria-label');

    // Traducir texto visible de los botones de descarga de CV
    translateEl('txt-btn-cv-nav', t.heroNavCv);
    translateEl('txt-btn-cv-mobile', t.heroNavCv);

    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (btnMobileMenu && mobileMenu) {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        btnMobileMenu.setAttribute('aria-label', isMenuOpen ? t.ariaMenuOpen : t.ariaMenuClosed);
    }

    // Traducir alt de imágenes de carruseles
    const turneroImages = document.querySelectorAll('#turnero-track img');
    turneroImages.forEach((img, i) => {
        img.alt = `Turnero – ${t.carouselScreen} ${i + 1}`;
    });
    const localpdfImages = document.querySelectorAll('#localpdf-track img');
    localpdfImages.forEach((img, i) => {
        img.alt = `LocalPDF Hub – ${t.carouselScreen} ${i + 1}`;
    });
    const key2padImages = document.querySelectorAll('#key2pad-track img');
    key2padImages.forEach((img, i) => {
        img.alt = `Key2Pad – ${t.carouselScreen} ${i + 1}`;
    });

    // Visor de capturas y contadores (remix)
    translateEl('shot-close', t.ariaLboxClose, 'aria-label');
    translateEl('skip-link', t.skipLink);
    translateEl('main-nav', t.navLabel, 'aria-label');
    translateEl('social-nav', t.socialLabel, 'aria-label');
    translateEl('logo-link', t.logoLabel, 'aria-label');
    translateEl('footer-top-link', t.footerTopLabel, 'aria-label');
    translateEl('link-linkedin', t.linkedinLabel, 'aria-label');
    translateEl('link-github', t.githubLabel, 'aria-label');
    translateEl('btn-more-projects', t.moreProjectsLabel, 'aria-label');
    translateEl('exp1-bullets', t.exp1ListLabel, 'aria-label');
    translateEl('exp2-bullets', t.exp2ListLabel, 'aria-label');
    translateEl('exp3-bullets', t.exp3ListLabel, 'aria-label');
    translateEl('contact-form', t.formLabel, 'aria-label');
    translateEl('shot-thumbs', t.thumbsLabel, 'aria-label');
    translateEl('form-privacy', t.formPrivacy);
    translateEl('btn-theme', t.themeDark, 'aria-label');
    const techList = document.querySelector('#tech ul');
    if (techList) techList.setAttribute('aria-label', t.techListLabel);
    [['turnero', 'Turnero'], ['localpdf', 'LocalPDF Hub'], ['key2pad', 'Key2Pad']].forEach(([key, name]) => {
        const region = document.getElementById(`${key}-carousel`);
        if (region) { region.setAttribute('aria-label', `${t.carouselOf} ${name}`); region.setAttribute('aria-roledescription', t.carouselRole); }
        translateEl(`${key}-prev`, t.ariaLboxPrev, 'aria-label');
        translateEl(`${key}-next`, t.ariaLboxNext, 'aria-label');
        translateEl(`${key}-dots`, t.dotsLabel, 'aria-label');
        document.querySelectorAll(`#${key}-dots .carousel-dot`).forEach((dot, i) => dot.setAttribute('aria-label', `${t.imageWord} ${i + 1}`));
    });
    document.querySelectorAll('.field-error:not([hidden])').forEach((el) => {
        const input = document.getElementById(el.id.replace(/-error$/, ''));
        if (input) validateField(input);
    });
    window.remixSyncMotion?.();
    Object.values(window.portfolioCarousels || {}).forEach((c) => c?.syncToggle?.());
    translateEl('shot-prev', t.ariaLboxPrev, 'aria-label');
    translateEl('shot-next', t.ariaLboxNext, 'aria-label');
    translateEl('stat-patients', t.statPatients);
    translateEl('stat-services', t.statServices);
    translateEl('stat-rating', t.statRating);
    translateEl('stat-tools', t.statTools);
    translateEl('stat-mcp', t.statMcp);
    document.querySelectorAll('[data-count]').forEach((el) => {
        el.textContent = formatCount(parseFloat(el.dataset.value ?? el.dataset.count), el.dataset.format === 'dec');
    });
    setCaptchaLang();
    translateEl('more-soon-1', t.moreSoon1);
    translateEl('more-soon-2', t.moreSoon2);

    // Retraducir el toast visible si lo hay
    const toastContainer = document.getElementById('toast');
    if (toastContainer && toastContainer.classList.contains('show')) {
        const toastMsgEl = document.getElementById('toast-msg');
        if (toastMsgEl) {
            const currText = toastMsgEl.textContent;
            const otherLang = lang === 'es' ? 'en' : 'es';
            const foundKey = Object.keys(i18n[otherLang]).find(k => i18n[otherLang][k] === currText);
            if (foundKey && t[foundKey]) {
                toastMsgEl.textContent = t[foundKey];
            }
        }
    }

    window.remixAfterLang?.();
    if (notify) showToast('langToast', 'language');
}

btnLang.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyLang(currentLang);
    try { localStorage.setItem('lang', currentLang); } catch (e) { /* almacenamiento no disponible */ }
});

// ═══════════════════════════════════════════════════
//  VER DEMO: Turnero
// ═══════════════════════════════════════════════════
const btnDemo = document.getElementById('btn-turnero-demo');
if (btnDemo) {
    btnDemo.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.remixScrollTo) window.remixScrollTo('#contact');
        else document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        showToast('toastDemo', 'mail');
    });
}

// ═══════════════════════════════════════════════════
//  BLOQUEO DE SCROLL DE FONDO
// ═══════════════════════════════════════════════════
// <html> lleva overflow-x-hidden: es el contenedor de scroll de la página,
// así que bloquear solo <body> no detiene el fondo.
function lockPageScroll(locked) {
    const value = locked ? 'hidden' : '';
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
    window.remixPause?.(locked);
}

// ═══════════════════════════════════════════════════
//  VENTANA: Características de Turnero
// ═══════════════════════════════════════════════════
window.portfolioFeatures = (() => {
    const modal = document.getElementById('features-modal');
    const panel = document.getElementById('features-panel');
    const btnOpen = document.getElementById('btn-turnero-features');
    const btnClose = document.getElementById('features-close');
    const groups = document.getElementById('features-groups');
    if (!modal || !panel || !btnOpen || !btnClose || !groups) return null;

    // --- Render (textContent only, no innerHTML) ---
    function render(t) {
        document.getElementById('features-kicker').textContent = t.proj1Title;
        document.getElementById('features-title').textContent = t.featuresTitle;
        document.getElementById('features-intro').textContent = t.featuresIntro;
        btnClose.setAttribute('aria-label', t.ariaFeaturesClose);
        groups.replaceChildren(...t.turneroFeatures.map((group) => {
            const section = document.createElement('section');
            const heading = document.createElement('h4');
            heading.className = 'flex items-center gap-3 font-headline text-lg text-white font-bold mb-4';
            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined text-primary text-2xl';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = group.icon;
            heading.append(icon, document.createTextNode(group.title));
            const list = document.createElement('ul');
            list.className = 'space-y-2.5';
            group.items.forEach((text) => {
                const item = document.createElement('li');
                item.className = 'flex gap-3 font-body text-sm leading-relaxed text-on-surface-variant';
                const check = document.createElement('span');
                check.className = 'material-symbols-outlined text-primary text-lg leading-5 shrink-0';
                check.setAttribute('aria-hidden', 'true');
                check.textContent = 'check';
                const label = document.createElement('span');
                label.textContent = text;
                item.append(check, label);
                list.appendChild(item);
            });
            section.append(heading, list);
            return section;
        }));
    }

    // --- Open / close ---
    let closeTimer;
    function open() {
        clearTimeout(closeTimer);
        Object.values(window.portfolioCarousels || {}).forEach((c) => c && c.pause());
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        panel.scrollTop = 0;
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            panel.classList.remove('scale-95');
        });
        lockPageScroll(true);
        btnClose.focus();
    }

    function close() {
        modal.classList.add('opacity-0');
        panel.classList.add('scale-95');
        closeTimer = setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            lockPageScroll(false);
            Object.values(window.portfolioCarousels || {}).forEach((c) => c && c.resume());
            btnOpen.focus();
        }, 300);
    }

    btnOpen.addEventListener('click', open);
    btnClose.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        // Focus stays inside: close button <-> scrollable panel
        if (e.key === 'Tab') {
            e.preventDefault();
            (document.activeElement === btnClose ? panel : btnClose).focus();
        }
    });

    panel.setAttribute('tabindex', '0');
    render(i18n[currentLang]);
    return { render, open, close };
})();

// ═══════════════════════════════════════════════════
//  VER MÁS PROYECTOS
// ═══════════════════════════════════════════════════
const btnMoreProjects = document.getElementById('btn-more-projects');
if (btnMoreProjects) {
    btnMoreProjects.addEventListener('click', () => {
        showToast('toastMoreProjects', 'schedule');
    });
}

// ═══════════════════════════════════════════════════
//  FORMULARIO: validación + EmailJS
// ═══════════════════════════════════════════════════

// EmailJS Inicialización segura (OWASP A04:2021)
if (window.emailjs) emailjs.init({
    publicKey: '5jV8d_imrYVzIc3-W',
    blockHeadless: true,
    limitRate: {
        id: 'app',
        throttle: 10000 // 10 segundos
    }
});

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

// reCAPTCHA v2: EmailJS verifies it server-side, so a copied public key is useless without allowed
// origins (a paid option). The site key is public; the secret key lives only in the EmailJS template.
// Empty site key = no widget and the form works as before (the EmailJS check must be enabled only with a key here)
const RECAPTCHA_SITE_KEY = '6LfEGfMtAAAAAABkCbK0c8pj7ZH2AWayx8SWCd_r';
const captchaField = document.getElementById('contact-captcha-field');
const captchaBox = document.getElementById('contact-captcha');
const captchaError = document.getElementById('contact-captcha-error');
let captchaId = null;
let captchaTheme = null;
let captchaRequested = false;

function setCaptchaError(on) {
    captchaError.hidden = !on;
    captchaError.textContent = on ? i18n[currentLang].errCaptcha : '';
}

// Theme and size are fixed when it renders: a fresh slot is rendered each time
function renderCaptcha() {
    if (!window.grecaptcha?.render) return;
    const slot = document.createElement('div');
    captchaBox.replaceChildren(slot);
    captchaTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    captchaId = grecaptcha.render(slot, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: captchaTheme,
        size: captchaBox.clientWidth < 304 ? 'compact' : 'normal',
        callback: () => setCaptchaError(false),
    });
    setCaptchaLang();
}

// The script fixes the language once: an unanswered widget is reloaded in the page language
function setCaptchaLang() {
    if (captchaId === null || grecaptcha.getResponse(captchaId)) return;
    const frame = captchaBox.querySelector('iframe');
    if (!frame) return;
    const url = new URL(frame.src);
    if (url.searchParams.get('hl') === currentLang) return;
    url.searchParams.set('hl', currentLang);
    frame.src = url.href;
}

// ~450 KB that only the form needs: requested when the contact section gets close or a field gets focus
function loadCaptcha() {
    if (captchaRequested) return;
    captchaRequested = true;
    window.onCaptchaReady = renderCaptcha;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onCaptchaReady&render=explicit&hl=${currentLang}`;
    script.async = true;
    document.head.appendChild(script);
}

if (RECAPTCHA_SITE_KEY && captchaField) {
    captchaField.hidden = false;
    const nearForm = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        nearForm.disconnect();
        loadCaptcha();
    }, { rootMargin: '1200px 0px' });
    nearForm.observe(document.getElementById('contact'));
    form.addEventListener('focusin', loadCaptcha);
    // A theme switch re-renders the widget while it is still unanswered
    new MutationObserver(() => {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        if (captchaId !== null && theme !== captchaTheme && !grecaptcha.getResponse(captchaId)) renderCaptcha();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function validateField(input) {
    const isEmpty = !input.value.trim();
    const isInvalidEmail = input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    const wrapper = input.closest('.relative');
    wrapper.classList.toggle('has-error', isEmpty || isInvalidEmail);
    input.setAttribute('aria-invalid', String(isEmpty || isInvalidEmail));
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
        const failed = isEmpty || isInvalidEmail;
        errorEl.hidden = !failed;
        errorEl.textContent = failed ? (isEmpty ? i18n[currentLang].errRequired : i18n[currentLang].errEmail) : '';
        if (failed) input.setAttribute('aria-describedby', errorEl.id);
        else input.removeAttribute('aria-describedby');
    }
    return !isEmpty && !isInvalidEmail;
}

// Validación en tiempo real (blur)
form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        input.closest('.relative').classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
        input.removeAttribute('aria-describedby');
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Honeypot: bots fill the hidden field; pretend success and send nothing
    if (form.querySelector('#contact-extra')?.value) {
        form.reset();
        showToast('toastFormOk', 'check_circle');
        return;
    }
    const inputs = [...form.querySelectorAll('.form-input')];
    const allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) {
        showToast('toastFormErr', 'error');
        return;
    }
    // sendForm carries the widget's g-recaptcha-response field; an unanswered (or not yet loaded) widget would be rejected
    if (RECAPTCHA_SITE_KEY && captchaField && (captchaId === null || !grecaptcha.getResponse(captchaId))) {
        loadCaptcha();
        setCaptchaError(true);
        showToast('toastFormErr', 'error');
        return;
    }

    // Deshabilitar botón durante envío
    submitBtn.disabled = true;
    submitBtn.textContent = i18n[currentLang].submitSending;
    submitBtn.style.opacity = '0.7';

    try {
        const serviceId = 'service_371pzcc';
        const templateId = 'template_ag99jpi';
        if (!window.emailjs) throw new Error('EmailJS no disponible');
        await emailjs.sendForm(serviceId, templateId, form);
        form.reset();
        showToast('toastFormOk', 'check_circle');
    } catch (err) {
        console.error('EmailJS Error:', err);
        showToast('toastFormFail', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = i18n[currentLang].submitNormal;
        submitBtn.style.opacity = '';
        // Each token is valid once
        if (captchaId !== null) grecaptcha.reset(captchaId);
    }
});

// ═══════════════════════════════════════════════════
//  CARRUSELES DE PROYECTOS (Turnero, LocalPDF Hub, Key2Pad)
// ═══════════════════════════════════════════════════
window.portfolioCarousels = window.portfolioCarousels || {};
function createCarousel(key) {
    const track = document.getElementById(`${key}-track`);
    const btnPrev = document.getElementById(`${key}-prev`);
    const btnNext = document.getElementById(`${key}-next`);
    const dots = document.querySelectorAll(`#${key}-dots .carousel-dot`);

    if (!track || !btnPrev || !btnNext) return null;

    const TOTAL = dots.length;
    const AUTO_MS = 4000;          // avance automático cada 4 s
    let current = 0;
    let autoTimer;
    let preventClick = false;

    // --- Función principal de ir a un slide ---
    function goTo(index) {
        current = (index + TOTAL) % TOTAL;
        track.style.transform = `translateX(-${current * 100}%)`;

        dots.forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle('dot-active', active);
            if (active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    // --- Controles botones ---
    btnPrev.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
    btnNext.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

    // --- Puntos clickeables ---
    dots.forEach((dot, i) => dot.addEventListener('click', () => { resetAuto(); goTo(i); }));

    // --- Avance automático ---
    let userPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hoverPaused = false;
    let modalPaused = false;
    function startAuto() {
        clearInterval(autoTimer);
        if (userPaused || hoverPaused || modalPaused || document.hidden) return;
        autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    // --- Pausa: botón visible, hover/foco y pestaña oculta ---
    const toggle = document.getElementById(`${key}-toggle`);
    function syncToggle() {
        if (!toggle) return;
        const t = i18n[currentLang];
        toggle.setAttribute('aria-pressed', String(userPaused));
        toggle.setAttribute('aria-label', userPaused ? t.carouselPlay : t.carouselPause);
        toggle.querySelector('span').textContent = userPaused ? 'play_arrow' : 'pause';
    }
    if (toggle) toggle.addEventListener('click', () => { userPaused = !userPaused; syncToggle(); startAuto(); });
    const box = track.parentElement;
    box.addEventListener('mouseenter', () => { hoverPaused = true; clearInterval(autoTimer); });
    box.addEventListener('mouseleave', () => { hoverPaused = false; startAuto(); });
    box.addEventListener('focusin', () => { hoverPaused = true; clearInterval(autoTimer); });
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) { hoverPaused = false; startAuto(); } });
    document.addEventListener('visibilitychange', startAuto);
    syncToggle();

    // --- Soporte táctil / swipe ---
    let touchStartX = 0;
    track.parentElement.addEventListener('touchstart', e => { 
        touchStartX = e.changedTouches[0].clientX; 
        preventClick = false;
    }, { passive: true });
    track.parentElement.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { 
            resetAuto(); 
            goTo(current + (dx < 0 ? 1 : -1));
            preventClick = true;
            setTimeout(() => preventClick = false, 150);
        }
    }, { passive: true });

    // --- Carga diferida: al acercarse el carrusel, cargar todas sus imágenes ---
    // (las que quedan fuera del recorte del carrusel no se cargarían solas con loading="lazy")
    const preloadObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        track.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
        preloadObserver.disconnect();
    }, { rootMargin: '300px 0px' });
    preloadObserver.observe(track.parentElement);

    // --- Teclado (cuando el carrusel tiene foco) ---
    track.parentElement.setAttribute('tabindex', '0');
    track.parentElement.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); resetAuto(); goTo(current + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); resetAuto(); goTo(current - 1); }
    });

    return {
        goTo: (i) => { resetAuto(); goTo(i); },
        syncToggle,
        pause: () => { modalPaused = true; clearInterval(autoTimer); },
        resume: () => { modalPaused = false; startAuto(); },
        current: () => current,
        isClickPrevented: () => preventClick
    };
}

['turnero', 'localpdf', 'key2pad'].forEach((key) => {
    window.portfolioCarousels[key] = createCarousel(key);
});

// ═══════════════════════════════════════════════════
//  VISOR DE CAPTURAS: lo maneja remix.js (Flip)
// ═══════════════════════════════════════════════════
window.portfolioLightbox = null;

// ═══════════════════════════════════════════════════
//  IDIOMA GUARDADO
// ═══════════════════════════════════════════════════
// Se aplica al final para que la ventana de características y el visor ya existan.
try { if (localStorage.getItem('lang') === 'en') currentLang = 'en'; } catch (e) { /* almacenamiento no disponible */ }
applyLang(currentLang, false);
