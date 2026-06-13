
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
        heroBadge: 'Desarrollador Full Stack & Estudiante de Sistemas (UBA)',
        heroDesc: 'Diseño y desarrollo soluciones de software seguras, eficientes y visualmente intuitivas. Me especializo en construir desde arquitecturas en tiempo real con Node.js hasta herramientas de procesamiento local con Python, integrando métricas clave y priorizando la privacidad del usuario.',
        heroCta1: 'Ver Proyectos', heroCta2: 'Descargar CV', heroNavCv: 'Descargar CV',
        aboutTitle: 'Sobre Mí',
        aboutText: '"Soy un estudiante apasionado por la tecnología y el desarrollo de sistemas. Me considero una persona práctica a la que le gusta organizar las cosas para hacer el trabajo más fácil. Tengo facilidad para adaptarme a los cambios, lo que me ayuda a resolver problemas reales y a trabajar bien con los demás."',
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
        expOrg: 'Institución Médica / Sector Salud',
        expDate: '2025 — PRESENTE',
        expBullet1: 'Desarrollé desde cero un sistema integral de gestión de turnos para optimizar el flujo de atención diaria, utilizando Node.js, Socket.IO y SQLite.',
        expBullet2: 'Implementé una solución en tiempo real que sincroniza tótems, pantallas de TV y dispositivos móviles de forma simultánea, asegurando un rendimiento estable y la protección de los datos.',
        expBullet3: 'Evolucioné el sistema de forma continua basándome en el feedback de los usuarios, logrando entregar una herramienta a medida, intuitiva y de fácil adaptación.',
        exp2Role: 'Creador y Desarrollador',
        exp2Org: 'LocalPDF Hub',
        exp2OrgBadge: '',
        exp2Date: '2025 — PRESENTE',
        exp2Bullet1: 'Lideré el desarrollo end-to-end de una aplicación web local en Python para procesamiento de PDFs, priorizando privacidad y funcionamiento offline.',
        exp2Bullet2: 'Diseñé una arquitectura modular (FastAPI + JavaScript, empaquetada con PyInstaller) que permite sumar herramientas de forma aislada sin acoplar funcionalidades.',
        exp2Bullet3: 'Desarrollé un conjunto de 10 herramientas de manipulación de documentos e incorporé mejoras continuas como soporte multi-formato (HEIC/HEIF), procesamiento batch, modo red para LAN, y UI multi-idioma con modo claro/oscuro.',
        contactTitle: 'Contacto',
        contactHeadlinePart1: 'Construyamos soluciones ',
        contactHeadlineSpan: 'eficientes',
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
        ariaProj2: 'Ver sitio web de LocalPDF Hub',
        ariaProj3: 'Ver sitio web de Key2Pad'
    },
    en: {
        navAbout: 'About', navStack: 'Stack', navProjects: 'Projects',
        navExp: 'Experience', navContact: 'Contact',
        heroBadge: 'Full Stack Developer & Systems Student (UBA)',
        heroDesc: 'I design and build secure, efficient, and visually intuitive software solutions. I specialize in crafting real-time architectures with Node.js and local processing tools with Python, integrating key metrics and prioritizing user privacy.',
        heroCta1: 'View Projects', heroCta2: 'Download CV', heroNavCv: 'Download CV',
        aboutTitle: 'About Me',
        aboutText: '"I am a student passionate about technology and systems development. I consider myself a practical person who likes to organize things to make work easier. I adapt well to change, which helps me solve real problems and collaborate effectively with others."',
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
        expOrg: 'Medical Institution / Healthcare Sector',
        expDate: '2025 — PRESENT',
        expBullet1: 'Built a comprehensive appointment management system from scratch to optimize daily patient flow, using Node.js, Socket.IO, and SQLite.',
        expBullet2: 'Implemented a real-time solution that synchronizes totems, TV screens, and mobile devices simultaneously, ensuring stable performance and data protection.',
        expBullet3: 'Continuously evolved the system based on user feedback, delivering a custom-built, intuitive, and easily adaptable tool.',
        exp2Role: 'Creator and Developer',
        exp2Org: 'LocalPDF Hub',
        exp2OrgBadge: '',
        exp2Date: '2025 — PRESENT',
        exp2Bullet1: 'Led end-to-end development of a local Python web application for PDF processing, prioritizing privacy and offline functionality.',
        exp2Bullet2: 'Designed a modular architecture (FastAPI + JavaScript, packaged with PyInstaller) that allows adding tools in isolation without coupling functionalities.',
        exp2Bullet3: 'Developed a suite of 10 document manipulation tools and shipped continuous improvements including multi-format support (HEIC/HEIF), batch processing, LAN network mode, and a multi-language UI with light/dark mode.',
        contactTitle: 'Contact',
        contactHeadlinePart1: 'Let\'s build ',
        contactHeadlineSpan: 'efficient',
        contactHeadlinePart2: ' solutions.',
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
    translateEl('btn-localpdf-site-text', t.proj2Site);
    translateEl('btn-key2pad-site-text', t.proj3Site);

    const disclaimer = document.getElementById('localpdf-disclaimer');
    if (disclaimer) disclaimer.textContent = t.disclaimerCarousel;

    // --- 6. EXPERIENCIA ---
    translateEl('experience-heading', t.expTitle);
    const expItems = document.querySelectorAll('#experience ol > li');
    // Experiencia 1
    if (expItems[0]) {
        const h3 = expItems[0].querySelector('h3');
        if (h3) h3.textContent = t.expRole;
        const org = expItems[0].querySelector('p.text-primary');
        if (org) org.textContent = t.expOrg;
        const time = expItems[0].querySelector('time');
        if (time) time.textContent = t.expDate;
        
        const bullets1 = expItems[0].querySelectorAll('ul[aria-label] li');
        const bulletTexts1 = [t.expBullet1, t.expBullet2, t.expBullet3];
        bullets1.forEach((li, i) => {
            const dot = li.querySelector('span');
            li.textContent = '';
            if (dot) li.appendChild(dot);
            li.append(' ' + bulletTexts1[i]);
        });
    }
    // Experiencia 2 (LocalPDF Hub) - SIN innerHTML (Creación de Nodos DOM)
    if (expItems[1]) {
        const h3 = expItems[1].querySelector('h3');
        if (h3) h3.textContent = t.exp2Role;
        const orgEl = expItems[1].querySelector('p.text-primary');
        if (orgEl) {
            orgEl.textContent = t.exp2Org;
            if (t.exp2OrgBadge) {
                const badge = document.createElement('span');
                badge.className = 'text-on-surface-variant ml-2';
                badge.textContent = t.exp2OrgBadge;
                orgEl.appendChild(badge);
            }
        }
        const time = expItems[1].querySelector('time');
        if (time) time.textContent = t.exp2Date;
        
        const bullets2 = expItems[1].querySelectorAll('ul[aria-label] li');
        const bulletTexts2 = [t.exp2Bullet1, t.exp2Bullet2, t.exp2Bullet3];
        bullets2.forEach((li, i) => {
            const dot = li.querySelector('span');
            li.textContent = '';
            if (dot) li.appendChild(dot);
            li.append(' ' + bulletTexts2[i]);
        });
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
    translateEl('btn-cv-nav', t.heroNavCv);
    translateEl('btn-cv-hero', t.heroNavCv);
    translateEl('btn-cv-mobile', t.heroNavCv);

    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (btnMobileMenu && mobileMenu) {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        btnMobileMenu.setAttribute('aria-label', isMenuOpen ? t.ariaMenuOpen : t.ariaMenuClosed);
    }

    // Traducir alt de imágenes de carruseles
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
//  CARRUSEL: LocalPDF Hub
// ═══════════════════════════════════════════════════
window.portfolioCarousels = window.portfolioCarousels || {};
window.portfolioCarousels.localpdf = (() => {
    const track = document.getElementById('localpdf-track');
    const btnPrev = document.getElementById('localpdf-prev');
    const btnNext = document.getElementById('localpdf-next');
    const dots = document.querySelectorAll('#localpdf-dots .carousel-dot');

    if (!track || !btnPrev || !btnNext) return null;

    const TOTAL = dots.length;   // 5 imágenes
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
})();

// ═══════════════════════════════════════════════════
//  CARRUSEL: Key2Pad
// ═══════════════════════════════════════════════════
window.portfolioCarousels.key2pad = (() => {
    const track = document.getElementById('key2pad-track');
    const btnPrev = document.getElementById('key2pad-prev');
    const btnNext = document.getElementById('key2pad-next');
    const dots = document.querySelectorAll('#key2pad-dots .carousel-dot');

    if (!track || !btnPrev || !btnNext) return null;

    const TOTAL = dots.length;   // 10 imágenes
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
})();

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
        document.body.style.overflow = 'hidden'; // Prevenir scroll de fondo
    }

    // Cerrar lightbox
    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
            
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
    const tracks = ['localpdf-track', 'key2pad-track'];
    tracks.forEach(trackId => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const images = track.querySelectorAll('img');
        images.forEach((img, index) => {
            img.classList.add('cursor-pointer'); // Feedback visual
            img.addEventListener('click', () => {
                const carouselKey = trackId.split('-')[0]; // 'localpdf' o 'key2pad'
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
