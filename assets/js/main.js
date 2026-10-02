
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

// ═══════════════════════════════════════════════════
//  HERO: Intro scroll scrubbing (Sticky)
// ═══════════════════════════════════════════════════
const mainNav = document.querySelector('nav');
const heroElements = document.querySelectorAll('.hero-stagger');
const scrollIndicator = document.getElementById('intro-scroll-indicator');

mainNav.style.transition = 'none';
mainNav.style.opacity = '0';
mainNav.style.transform = 'translateY(-100%)';
mainNav.style.pointerEvents = 'none';

heroElements.forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.classList.remove('appeared');
});

const asciiBg = document.getElementById('ascii-bg');

function handleScrubbing() {
    const scrollY = window.scrollY;
    // El efecto dura exactamente el alto de la pantalla (100vh)
    const maxScroll = window.innerHeight; 
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    
    // Aplicar desenfoque dinámico al fondo ASCII (de 0px a 2px)
    if (asciiBg) {
        asciiBg.style.filter = `blur(${progress * 2}px)`;
    }
    
    // Nav
    mainNav.style.opacity = progress.toString();
    mainNav.style.transform = `translateY(${-100 + (progress * 100)}%)`;
    mainNav.style.pointerEvents = progress > 0.8 ? 'auto' : 'none';
    
    // Textos
    heroElements.forEach((el, index) => {
        const startThreshold = index * 0.08; 
        const localProgress = Math.min(1, Math.max(0, (progress - startThreshold) / (1 - startThreshold)));
        
        el.style.opacity = localProgress.toString();
        el.style.transform = `translateY(${40 - (localProgress * 40)}px)`;
    });
    
    if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - (progress * 2.5)).toString();
    }
}

window.addEventListener('scroll', handleScrubbing, { passive: true });
window.addEventListener('resize', handleScrubbing, { passive: true });
handleScrubbing();

// ═══════════════════════════════════════════════════
//  NAV: shadow + scroll activo
// ═══════════════════════════════════════════════════
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('shadow-md', window.scrollY > 50);
});

const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('nav .nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('nav-link-active'));
            const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('nav-link-active');
        }
    });
}, { threshold: 0.35 });
sections.forEach(s => navObserver.observe(s));

// ═══════════════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════════════
//  PARALLAX blobs hero
// ═══════════════════════════════════════════════════
const blobA = document.getElementById('blob-a');
const blobB = document.getElementById('blob-b');
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (blobA) blobA.style.transform = `translateY(${y * 0.12}px)`;
    if (blobB) blobB.style.transform = `translateY(${y * -0.08}px)`;
}, { passive: true });

// ═══════════════════════════════════════════════════
//  MENÚ MÓVIL
// ═══════════════════════════════════════════════════
const btnMobile = document.getElementById('btn-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
btnMobile.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    mobileMenu.setAttribute('aria-hidden', isOpen);
    btnMobile.setAttribute('aria-expanded', !isOpen);
    btnMobile.textContent = isOpen ? 'menu' : 'close';
});
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
        btnMobile.setAttribute('aria-expanded', 'false');
        btnMobile.textContent = 'menu';
    });
});

// ═══════════════════════════════════════════════════
//  MODO OSCURO / CLARO
// ═══════════════════════════════════════════════════
const btnTheme = document.getElementById('btn-theme');
const htmlEl = document.documentElement;

// Restaurar preferencia guardada
if (localStorage.getItem('theme') === 'light') {
    htmlEl.classList.remove('dark');
    btnTheme.textContent = 'light_mode';
}

btnTheme.addEventListener('click', () => {
    const isDark = htmlEl.classList.toggle('dark');
    btnTheme.textContent = isDark ? 'dark_mode' : 'light_mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
        heroBadge: 'Desarrollador Full Stack',
        heroDesc: 'Diseño y desarrollo soluciones de software seguras, eficientes y visualmente intuitivas. Me especializo en construir desde arquitecturas en tiempo real con Node.js hasta herramientas de procesamiento local con Python, integrando métricas clave y priorizando la privacidad del usuario.',
        heroCta1: 'Ver Proyectos', heroCta2: 'Descargar CV', heroNavCv: 'Descargar CV',
        heroQuote: 'El código se reescribe; tu determinación permanece intacta',
        aboutTitle: 'Sobre Mí',
        aboutText: '"Soy un desarrollador apasionado por la tecnología y el análisis de sistemas. Me considero una persona práctica a la que le gusta optimizar procesos para hacer el trabajo más fácil. Tengo facilidad para adaptarme a los cambios, lo que me ayuda a resolver problemas reales y a trabajar bien con los demás."',
        techTitle: 'Stack Tecnológico', techSub: 'Herramientas Principales',
        techDesc: 'Tecnologías y lenguajes que utilizo para construir arquitecturas escalables, seguras y de alto rendimiento.',
        projTitle: 'Proyectos Destacados',
        proj1Demo: 'Solicitar Demo', proj2Site: 'Ver Sitio Web',
        proj1Preview: 'Gestión de Colas · Preview',
        proj1Title: 'Turnero — Gestión de Colas',
        proj1Desc: 'Sistema integral de gestión de turnos en tiempo real que digitaliza las filas de espera. Procesa conexiones simultáneas desde dispositivos móviles, tótems y pantallas de TV mediante WebSockets, garantizando velocidad y seguridad con un sistema de persistencia híbrida y acceso por roles.',
        proj2Preview: 'LocalPDF Hub · Preview',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Aplicación de escritorio offline para manipular documentos e imágenes directamente en el navegador. Su arquitectura cliente-servidor local garantiza privacidad total al procesar los archivos de forma local sin enviarlos a servidores externos.',
        proj3Title: 'Key2Pad — Teclado a Gamepad',
        proj3Desc: 'Software de emulación nativa (XInput) que permite jugar cualquier título de PC sin necesidad de hardware adicional. Transforma inputs físicos en señales analógicas reales mediante drivers de bajo nivel, ofreciendo una experiencia altamente personalizable con perfiles dedicados y un overlay de interacción directa.',
        proj3Site: 'Ver Sitio Web',
        expTitle: 'Experiencia',
        expRole: 'Desarrollador Full Stack Independiente',
        expOrg: 'Turnero — Gestión de Colas',
        expContext: 'Institución Médica / Sector Salud - Obra social privada',
        expDate: '2025 — PRESENTE',
        expBullet1: 'Desarrollé desde cero un sistema integral de gestión de turnos para optimizar el flujo de atención diaria, utilizando Node.js, Socket.IO y SQLite.',
        expBullet2: 'Implementé una solución en tiempo real que sincroniza tótems, pantallas de TV y dispositivos móviles de forma simultánea, asegurando un rendimiento estable y la protección de los datos.',
        expBullet3: 'Evolucioné el sistema de forma continua basándome en el feedback de los usuarios, logrando entregar una herramienta a medida, intuitiva y de fácil adaptación.',
        expBullet4: 'El sistema gestionó de forma autónoma a más de 4,300 pacientes mensuales distribuidos en 12 servicios activos, logrando una tasa de satisfacción del 4.9/5 según los reportes analíticos generados. ',
        expReportLink: 'Ver reporte generado por Turnero — Gestión de Colas.',
        exp2Org: 'LocalPDF Hub',
        exp2Bullet1: 'Lideré el desarrollo end-to-end de una aplicación web local en Python para procesamiento de PDFs, priorizando privacidad y funcionamiento offline.',
        exp2Bullet2: 'Diseñé una arquitectura modular (FastAPI + JavaScript, empaquetada con PyInstaller) que permite sumar herramientas de forma aislada sin acoplar funcionalidades.',
        exp2Bullet3: 'Desarrollé un conjunto de 10 herramientas de manipulación de documentos e incorporé mejoras continuas como soporte multi-formato (HEIC/HEIF), procesamiento batch, modo red para LAN, y UI multi-idioma con modo claro/oscuro.',
        contactTitle: 'Contacto',
        contactHeadlinePart1: '¿Tenés algún proyecto en mente? ',
        contactHeadlineSpan: 'Hablemos',
        contactHeadlinePart2: '.',
        contactDesc: 'Estoy abierto a nuevos desafíos técnicos, propuestas laborales o charlas sobre arquitectura de software.',
        contactLabelName: 'Nombre', contactPlaceholderName: 'Tu nombre completo',
        contactLabelEmail: 'Email', contactPlaceholderEmail: 'tu@email.com',
        contactLabelMsg: 'Mensaje', contactPlaceholderMsg: '¿En qué te puedo ayudar?',
        contactBtn: 'Enviar Mensaje',
        footerCopy: '© 2026 Alan Roy Cuevas. Todos los derechos reservados.',
        langToast: 'Idioma: Español',
        toastDark: 'Tema oscuro activado',
        toastLight: 'Tema claro activado',
        toastCv: 'CV próximamente disponible',
        toastFormErr: 'Completa todos los campos correctamente',
        toastFormOk: 'Mensaje enviado con éxito',
        toastFormFail: 'Error al enviar. Intentá de nuevo.',
        toastMoreProjects: 'Próximamente más proyectos',
        moreProjectsBtn: 'Ver Más Proyectos',
        toastDemo: 'Completá el formulario para solicitar la demo',
        disclaimerCarousel: 'Las imágenes pueden corresponder a versiones anteriores',
        introScroll: 'Haz scroll para descubrir',
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
        ariaProj2: 'Ver sitio web de LocalPDF Hub',
        ariaProj3: 'Ver sitio web de Key2Pad'
    },
    en: {
        navAbout: 'About', navStack: 'Stack', navProjects: 'Projects',
        navExp: 'Experience', navContact: 'Contact',
        heroBadge: 'Full Stack Developer',
        heroDesc: 'I design and build secure, efficient, and visually intuitive software solutions. I specialize in crafting real-time architectures with Node.js and local processing tools with Python, integrating key metrics and prioritizing user privacy.',
        heroCta1: 'View Projects', heroCta2: 'Download CV', heroNavCv: 'Download CV',
        heroQuote: 'Code is rewritten; your determination remains intact',
        aboutTitle: 'About Me',
        aboutText: '"I am a developer passionate about technology and systems analysis. I consider myself a practical person who likes to optimize processes to make work easier. I adapt well to change, which helps me solve real problems and collaborate effectively with others."',
        techTitle: 'Tech Stack', techSub: 'Core Tools',
        techDesc: 'Technologies and languages I use to build scalable, secure, high-performance architectures.',
        projTitle: 'Featured Projects',
        proj1Demo: 'Request Demo', proj2Site: 'View Website',
        proj1Preview: 'Queue Management · Preview',
        proj1Title: 'Turnero — Queue Management',
        proj1Desc: 'Comprehensive real-time queue management system that digitizes waiting lines. Processes simultaneous connections from mobile devices, totems, and TV screens via WebSockets, ensuring speed and security with hybrid persistence and role-based access.',
        proj2Preview: 'LocalPDF Hub · Preview',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Offline desktop application to manipulate documents and images directly in the browser. Its local client-server architecture ensures total privacy by processing files locally without sending them to external servers.',
        proj3Title: 'Key2Pad — Keyboard to Gamepad',
        proj3Desc: 'Native emulation software (XInput) that allows playing any PC title without the need for additional hardware. Transforms physical inputs into real analog signals using low-level drivers, offering a highly customizable experience with dedicated profiles and a direct interaction overlay.',
        proj3Site: 'View Website',
        expTitle: 'Experience',
        expRole: 'Independent Full Stack Developer',
        expOrg: 'Turnero — Queue Management',
        expContext: 'Medical Institution / Healthcare Sector - Private Health Insurance',
        expDate: '2025 — PRESENT',
        expBullet1: 'Built a comprehensive appointment management system from scratch to optimize daily patient flow, using Node.js, Socket.IO, and SQLite.',
        expBullet2: 'Implemented a real-time solution that synchronizes totems, TV screens, and mobile devices simultaneously, ensuring stable performance and data protection.',
        expBullet3: 'Continuously evolved the system based on user feedback, delivering a custom-built, intuitive, and easily adaptable tool.',
        expBullet4: 'The system autonomously managed over 4,300 monthly patients distributed across 12 active services, achieving a 4.9/5 satisfaction rate according to generated analytics reports. ',
        expReportLink: 'View report generated by Turnero — Queue Management.',
        exp2Role: 'Creator and Developer',
        exp2Org: 'LocalPDF Hub',
        exp2OrgBadge: '',
        exp2Date: '2025 — PRESENT',
        exp2Bullet1: 'Led end-to-end development of a local Python web application for PDF processing, prioritizing privacy and offline functionality.',
        exp2Bullet2: 'Designed a modular architecture (FastAPI + JavaScript, packaged with PyInstaller) that allows adding tools in isolation without coupling functionalities.',
        exp2Bullet3: 'Developed a suite of 10 document manipulation tools and shipped continuous improvements including multi-format support (HEIC/HEIF), batch processing, LAN network mode, and a multi-language UI with light/dark mode.',
        contactTitle: 'Contact',
        contactHeadlinePart1: 'Do you have a project in mind? ',
        contactHeadlineSpan: 'Let\'s talk',
        contactHeadlinePart2: '.',
        contactDesc: 'I\'m open to new technical challenges, job proposals, or conversations about software architecture.',
        contactLabelName: 'Name', contactPlaceholderName: 'Your full name',
        contactLabelEmail: 'Email', contactPlaceholderEmail: 'you@email.com',
        contactLabelMsg: 'Message', contactPlaceholderMsg: 'How can I help you?',
        contactBtn: 'Send Message',
        footerCopy: '© 2026 Alan Roy Cuevas. All rights reserved.',
        langToast: 'Language: English',
        toastDark: 'Dark mode activated',
        toastLight: 'Light mode activated',
        toastCv: 'CV coming soon',
        toastFormErr: 'Please fill all fields correctly',
        toastFormOk: 'Message sent successfully',
        toastFormFail: 'Error sending. Try again.',
        toastMoreProjects: 'More projects coming soon',
        moreProjectsBtn: 'View More Projects',
        toastDemo: 'Fill out the form to request the demo',
        disclaimerCarousel: 'Images may correspond to earlier versions',
        introScroll: 'Scroll to discover',
        carouselScreen: 'screen',
        lightboxFallback: 'Screenshot',
        submitSending: 'Sending...',
        submitNormal: 'Send Message',
        ariaLang: 'Change language',
        ariaTheme: 'Toggle light/dark theme',
        ariaMenuOpen: 'Close navigation menu',
        ariaMenuClosed: 'Open navigation menu',
        ariaCvNav: 'Download Alan Roy Cuevas CV',
        ariaCvHero: 'Download CV as PDF',
        ariaLboxClose: 'Close viewer',
        ariaLboxPrev: 'Previous image',
        ariaLboxNext: 'Next image',
        ariaLbox: 'Image viewer',
        ariaProj1: 'Request Turnero demo - Queue Management',
        proj1Features: 'View Features',
        ariaProj1Features: 'View Turnero features - Queue Management',
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
        ariaProj2: 'Visit LocalPDF Hub website',
        ariaProj3: 'Visit Key2Pad website'
    }
};

function applyLang(lang) {
    const t = i18n[lang];
    document.documentElement.lang = lang;

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

    document.querySelectorAll('#mobile-menu a[role="menuitem"]').forEach((a, i) => {
        a.textContent = [t.navAbout, t.navStack, t.navProjects, t.navExp, t.navContact][i];
    });

    // --- 2. HERO ---
    const introIndicator = document.querySelector('#intro-scroll-indicator span:first-child');
    if (introIndicator && t.introScroll) introIndicator.textContent = t.introScroll;

    const heroBadgeEl = document.querySelector('.hero-stagger.font-headline.text-primary');
    if (heroBadgeEl) heroBadgeEl.textContent = t.heroBadge;

    translateEl('txt-hero-description', t.heroDesc);
    translateEl('txt-btn-projects', t.heroCta1);
    translateEl('txt-btn-cv', t.heroCta2);
    translateEl('hero-quote-text', t.heroQuote);

    // --- 3. SOBRE MÍ ---
    translateEl('about-heading', t.aboutTitle);
    const aboutTextEl = document.querySelector('#about p.reveal');
    if (aboutTextEl) aboutTextEl.textContent = t.aboutText;

    // --- 4. STACK ---
    translateEl('tech-heading', t.techTitle);
    translateEl('tech-subheading', t.techSub);
    translateEl('tech-description', t.techDesc);

    // --- 5. PROYECTOS ---
    translateEl('projects-heading', t.projTitle);
    const projectPreviews = document.querySelectorAll('#projects article .absolute .font-headline.text-xs');
    if (projectPreviews[0]) projectPreviews[0].textContent = t.proj1Preview;
    if (projectPreviews[1]) projectPreviews[1].textContent = t.proj2Preview;
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

    const disclaimer = document.getElementById('localpdf-disclaimer');
    if (disclaimer) disclaimer.textContent = t.disclaimerCarousel;

    // --- 6. EXPERIENCIA ---
    translateEl('experience-heading', t.expTitle);
    const expItems = document.querySelectorAll('#experience ol > li');
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

    // Traducir atributos del Lightbox
    translateEl('lightbox', t.ariaLbox, 'aria-label');
    translateEl('lightbox-close', t.ariaLboxClose, 'aria-label');
    translateEl('lightbox-prev', t.ariaLboxPrev, 'aria-label');
    translateEl('lightbox-next', t.ariaLboxNext, 'aria-label');

    // Actualización del Lightbox visible en caliente
    const lbox = document.getElementById('lightbox');
    if (lbox && !lbox.classList.contains('hidden') && window.portfolioLightbox) {
        window.portfolioLightbox.updateActiveTranslation();
    }

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

    showToast('langToast', 'language');
}

btnLang.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyLang(currentLang);
});

// ═══════════════════════════════════════════════════
//  VER DEMO: Turnero
// ═══════════════════════════════════════════════════
const btnDemo = document.getElementById('btn-turnero-demo');
if (btnDemo) {
    btnDemo.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
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
    function open() {
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
        setTimeout(() => {
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
emailjs.init({
    publicKey: '5jV8d_imrYVzIc3-W',
    blockHeadless: true,
    limitRate: {
        id: 'app',
        throttle: 10000 // 10 segundos
    }
});

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

function validateField(input) {
    const isEmpty = !input.value.trim();
    const isInvalidEmail = input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    const wrapper = input.closest('.relative');
    wrapper.classList.toggle('has-error', isEmpty || isInvalidEmail);
    return !isEmpty && !isInvalidEmail;
}

// Validación en tiempo real (blur)
form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        input.closest('.relative').classList.remove('has-error');
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll('.form-input')];
    const allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) {
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
            dot.setAttribute('aria-selected', active);
        });
    }

    // --- Controles botones ---
    btnPrev.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
    btnNext.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

    // --- Puntos clickeables ---
    dots.forEach((dot, i) => dot.addEventListener('click', () => { resetAuto(); goTo(i); }));

    // --- Avance automático ---
    function startAuto() { 
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), AUTO_MS); 
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

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

    // --- Teclado (cuando el carrusel tiene foco) ---
    track.parentElement.setAttribute('tabindex', '0');
    track.parentElement.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); resetAuto(); goTo(current + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); resetAuto(); goTo(current - 1); }
    });

    return {
        pause: () => clearInterval(autoTimer),
        resume: () => startAuto(),
        isClickPrevented: () => preventClick
    };
}

['turnero', 'localpdf', 'key2pad'].forEach((key) => {
    window.portfolioCarousels[key] = createCarousel(key);
});

// ═══════════════════════════════════════════════════
//  LIGHTBOX (GALERÍA PANTALLA COMPLETA)
// ═══════════════════════════════════════════════════
window.portfolioLightbox = (() => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightbox) return null;

    let currentImages = [];
    let currentIndex = 0;

    // Abrir lightbox
    function openLightbox(index) {
        // Pausar avance automático de todos los carruseles
        if (window.portfolioCarousels) {
            Object.values(window.portfolioCarousels).forEach(c => {
                if (c && typeof c.pause === 'function') c.pause();
            });
        }

        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.remove('hidden');
        // Pequeño delay para permitir que el display:flex se aplique antes de la transición de opacidad
        requestAnimationFrame(() => {
            lightbox.classList.remove('opacity-0');
            lightboxImg.classList.remove('scale-95');
            lightboxImg.classList.add('scale-100');
        });
        lockPageScroll(true); // Prevenir scroll de fondo
    }

    // Cerrar lightbox
    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lockPageScroll(false);
            
            // Reanudar avance automático de todos los carruseles
            if (window.portfolioCarousels) {
                Object.values(window.portfolioCarousels).forEach(c => {
                    if (c && typeof c.resume === 'function') c.resume();
                });
            }
        }, 300); // Coincide con la duración de la transición
    }

    // Actualizar traducción en caliente
    function updateActiveTranslation() {
        if (currentImages.length === 0) return;
        if (lightboxImg) {
            lightboxImg.alt = currentImages[currentIndex].alt;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = currentImages[currentIndex].alt || i18n[currentLang].lightboxFallback;
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
    }

    // Actualizar imagen mostrada
    function updateLightboxImage() {
        if (currentImages.length === 0) return;
        
        // Efecto fade suave
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxImg.alt = currentImages[currentIndex].alt;
            
            if (lightboxCaption) {
                lightboxCaption.textContent = currentImages[currentIndex].alt || i18n[currentLang].lightboxFallback;
            }
            
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    // Navegar
    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    // prevImage
    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }

    // Bindear clicks en las imágenes de los carruseles
    const tracks = ['turnero-track', 'localpdf-track', 'key2pad-track'];
    tracks.forEach(trackId => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const images = track.querySelectorAll('img');
        images.forEach((img, index) => {
            img.classList.add('cursor-pointer'); // Feedback visual
            img.addEventListener('click', () => {
                const carouselKey = trackId.split('-')[0]; // 'turnero', 'localpdf' o 'key2pad'
                const ctrl = window.portfolioCarousels ? window.portfolioCarousels[carouselKey] : null;
                
                // Si el carrusel indica que está en medio de un swipe (drag), evitar abrir el Lightbox
                if (ctrl && typeof ctrl.isClickPrevented === 'function' && ctrl.isClickPrevented()) {
                    return;
                }
                
                currentImages = Array.from(images); // Guardar contexto de qué carrusel se clickeó
                openLightbox(index);
            });
        });
    });

    // Eventos de botones UI
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Cerrar al clickear fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Soporte teclado con Focus Trapping
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        
        // Atrapar foco
        if (e.key === 'Tab') {
            const focusable = lightbox.querySelectorAll('button, [tabindex="0"]');
            if (focusable.length > 0) {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Soporte Swipe en móvil
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        if (lightbox.classList.contains('hidden')) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) nextImage();
            else prevImage();
        }
    }, { passive: true });

    return {
        open: openLightbox,
        close: closeLightbox,
        updateActiveTranslation: updateActiveTranslation
    };
})();
