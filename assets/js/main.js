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
//  HERO: stagger reveal al cargar
// ═══════════════════════════════════════════════════
document.querySelectorAll('.hero-stagger').forEach((el, i) => {
    setTimeout(() => el.classList.add('appeared'), 200 + i * 160);
});

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
        aboutText: '"Mi enfoque como desarrollador Full Stack nace de una premisa clara: transformar el caos operativo en procesos eficientes. No me limito a escribir código; identifico cuellos de botella y prototipo soluciones reales. Disfruto liderar desarrollos desde cero en entornos de alta incertidumbre, priorizando arquitecturas robustas y experiencias de usuario impecables. Valoro profundamente la retroalimentación de mi entorno de trabajo; escuchar diferentes perspectivas es clave para refinar mi lógica y maximizar el impacto de cada sistema."',
        techTitle: 'Stack Tecnológico', techSub: 'Herramientas Principales',
        techDesc: 'Tecnologías y lenguajes que utilizo para construir arquitecturas escalables, seguras y de alto rendimiento.',
        projTitle: 'Proyectos Destacados',
        proj1Demo: 'Ver Demo', proj2Repo: 'Ver Repositorio',
        proj1Preview: 'Gestión de Colas · Preview',
        proj1Title: 'Turnero — Gestión de Colas',
        proj1Desc: 'Sistema integral de gestión de turnos en tiempo real que digitaliza las filas de espera. Procesa conexiones simultáneas desde dispositivos móviles, tótems y pantallas de TV mediante WebSockets, garantizando velocidad y seguridad con un sistema de persistencia híbrida y acceso por roles.',
        proj2Preview: 'LocalPDF Hub · Preview',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Aplicación de escritorio offline para manipular documentos e imágenes directamente en el navegador. Su arquitectura cliente-servidor local garantiza privacidad total al procesar los archivos de forma local sin enviarlos a servidores externos.',
        expTitle: 'Experiencia',
        expRole: 'Desarrollador Full Stack Independiente',
        expOrg: 'Institución Médica / Sector Salud',
        expDate: '2025 — PRESENTE',
        expBullet1: 'Identifiqué cuellos de botella operativos y desarrollé proactivamente un sistema integral de gestión de colas desde cero.',
        expBullet2: 'Arquitecé una solución cliente-servidor en tiempo real (Node.js, Socket.IO) capaz de manejar tótems, pantallas de TV y dispositivos móviles simultáneamente.',
        expBullet3: 'Implementé un sistema de persistencia híbrida (SQLite + RAM) y autenticación JWT, garantizando alta disponibilidad y seguridad de los datos.',
        exp2Role: 'Creador y Desarrollador',
        exp2Org: 'LocalPDF Hub',
        exp2OrgBadge: '(Open Source)',
        exp2Date: '2025 — PRESENTE',
        exp2Bullet1: 'Lidero el desarrollo continuo de una aplicación de escritorio offline-first para manipular documentos sensibles, iterando nuevas funcionalidades para escalar el producto y garantizar la privacidad total.',
        exp2Bullet2: 'Arquitecté un monolito local escalable utilizando FastAPI y Vanilla JS, diseñado estructuralmente para integrar progresivamente nuevas herramientas de procesamiento sin depender de servidores externos.',
        exp2Bullet3: 'Automaticé conversiones complejas de .docx a PDF superando bloqueos nativos del sistema, y actualmente trabajo en la expansión del soporte multi-formato, manejo de colas de trabajo y optimización asíncrona.',
        contactTitle: 'Contacto',
        contactHeadline: 'Construyamos soluciones <span class="text-primary">eficientes</span>.',
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
        toastDemo: 'Demo de Turnero próximamente'
    },
    en: {
        navAbout: 'About', navStack: 'Stack', navProjects: 'Projects',
        navExp: 'Experience', navContact: 'Contact',
        heroBadge: 'Full Stack Developer & Systems Student (UBA)',
        heroDesc: 'I design and build secure, efficient, and visually intuitive software solutions. I specialize in crafting real-time architectures with Node.js and local processing tools with Python, integrating key metrics and prioritizing user privacy.',
        heroCta1: 'View Projects', heroCta2: 'Download CV', heroNavCv: 'Download CV',
        aboutTitle: 'About Me',
        aboutText: '"My approach as a Full Stack developer stems from a clear premise: transforming operational chaos into efficient processes. I don\'t just write code — I identify bottlenecks and prototype real solutions. I enjoy leading development from scratch in high-uncertainty environments, prioritizing robust architectures and impeccable user experiences. I deeply value feedback from my work environment; listening to different perspectives is key to refining my logic and maximizing the impact of every system."',
        techTitle: 'Tech Stack', techSub: 'Core Tools',
        techDesc: 'Technologies and languages I use to build scalable, secure, high-performance architectures.',
        projTitle: 'Featured Projects',
        proj1Demo: 'View Demo', proj2Repo: 'View Repository',
        proj1Preview: 'Queue Management · Preview',
        proj1Title: 'Turnero — Queue Management',
        proj1Desc: 'Comprehensive real-time queue management system that digitizes waiting lines. Processes simultaneous connections from mobile devices, totems, and TV screens via WebSockets, ensuring speed and security with hybrid persistence and role-based access.',
        proj2Preview: 'LocalPDF Hub · Preview',
        proj2Title: 'LocalPDF Hub',
        proj2Desc: 'Offline desktop application to manipulate documents and images directly in the browser. Its local client-server architecture ensures total privacy by processing files locally without sending them to external servers.',
        expTitle: 'Experience',
        expRole: 'Independent Full Stack Developer',
        expOrg: 'Medical Institution / Healthcare Sector',
        expDate: '2025 — PRESENT',
        expBullet1: 'Identified operational bottlenecks and proactively developed a comprehensive queue management system from scratch.',
        expBullet2: 'Architected a real-time client-server solution (Node.js, Socket.IO) capable of handling totems, TV screens, and mobile devices simultaneously.',
        expBullet3: 'Implemented a hybrid persistence system (SQLite + RAM) and JWT authentication, ensuring high availability and data security.',
        exp2Role: 'Creator and Developer',
        exp2Org: 'LocalPDF Hub',
        exp2OrgBadge: '(Open Source)',
        exp2Date: '2025 — PRESENT',
        exp2Bullet1: 'Lead the ongoing development of an offline-first desktop application for handling sensitive documents, iterating new features to scale the product and guarantee total privacy.',
        exp2Bullet2: 'Architected a scalable local monolith using FastAPI and Vanilla JS, structurally designed to progressively integrate new processing tools without relying on external servers.',
        exp2Bullet3: 'Automated complex .docx to PDF conversions overcoming native system blockers, currently working on expanding multi-format support, job queue handling, and async optimization.',
        contactTitle: 'Contact',
        contactHeadline: 'Let\'s build <span class="text-primary">efficient</span> solutions.',
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
        toastDemo: 'Turnero demo coming soon'
    }
};

function applyLang(lang) {
    const t = i18n[lang];
    document.documentElement.lang = lang;

    // Navegación
    const nl = document.querySelectorAll('nav .nav-link');
    nl[0].textContent = t.navAbout;
    nl[1].textContent = t.navStack;
    nl[2].textContent = t.navProjects;
    nl[3].textContent = t.navExp;
    nl[4].textContent = t.navContact;
    document.querySelector('#btn-mobile-menu').closest('div').previousElementSibling
        .querySelectorAll('a[role="menuitem"]').forEach((a, i) => {
            a.textContent = [t.navAbout, t.navStack, t.navProjects, t.navExp, t.navContact][i];
        });
    document.querySelectorAll('a[aria-label]').forEach(a => {
        if (a.textContent.trim() === i18n[lang === 'es' ? 'en' : 'es'].heroNavCv)
            a.textContent = t.heroNavCv;
    });

    // Hero (Encabezado)
    document.querySelector('.hero-stagger.font-headline.text-primary').textContent = t.heroBadge;
    document.querySelector('.hero-stagger.font-body').textContent = t.heroDesc;
    const heroBtns = document.querySelectorAll('.hero-stagger a');
    if (heroBtns[0]) heroBtns[0].textContent = t.heroCta1;
    if (heroBtns[1]) heroBtns[1].textContent = t.heroCta2;

    // Sobre Mí
    document.getElementById('about-heading').textContent = t.aboutTitle;
    document.querySelector('#about p.reveal').textContent = t.aboutText;

    // Tecnologías (Stack)
    document.getElementById('tech-heading').textContent = t.techTitle;
    document.querySelector('#tech p.reveal.delay-150').textContent = t.techSub;
    document.querySelector('#tech p.reveal.delay-300').textContent = t.techDesc;

    // Proyectos
    document.getElementById('projects-heading').textContent = t.projTitle;
    const projectPreviews = document.querySelectorAll('#projects article .absolute .font-headline.text-xs');
    if (projectPreviews[0]) projectPreviews[0].textContent = t.proj1Preview;
    if (projectPreviews[1]) projectPreviews[1].textContent = t.proj2Preview;
    const projectTitles = document.querySelectorAll('#projects article h3');
    if (projectTitles[0]) projectTitles[0].textContent = t.proj1Title;
    if (projectTitles[1]) projectTitles[1].textContent = t.proj2Title;
    const projectDescs = document.querySelectorAll('#projects article p.leading-relaxed');
    if (projectDescs[0]) projectDescs[0].textContent = t.proj1Desc;
    if (projectDescs[1]) projectDescs[1].textContent = t.proj2Desc;
    const demoLinks = document.querySelectorAll('#projects article a');
    if (demoLinks[0]) { demoLinks[0].childNodes[0].textContent = t.proj1Demo + ' '; }
    if (demoLinks[1]) { demoLinks[1].childNodes[0].textContent = t.proj2Repo + ' '; }

    // Experiencia
    document.getElementById('experience-heading').textContent = t.expTitle;
    const expItems = document.querySelectorAll('#experience ol > li');
    // Primera experiencia
    if (expItems[0]) {
        expItems[0].querySelector('h3').textContent = t.expRole;
        expItems[0].querySelector('p.text-primary').textContent = t.expOrg;
        expItems[0].querySelector('time').textContent = t.expDate;
        const bullets1 = expItems[0].querySelectorAll('ul[aria-label] li');
        const bulletTexts1 = [t.expBullet1, t.expBullet2, t.expBullet3];
        bullets1.forEach((li, i) => {
            const dot = li.querySelector('span');
            li.textContent = '';
            li.appendChild(dot);
            li.append(' ' + bulletTexts1[i]);
        });
    }
    // Segunda experiencia (LocalPDF Hub)
    if (expItems[1]) {
        expItems[1].querySelector('h3').textContent = t.exp2Role;
        const orgEl = expItems[1].querySelector('p.text-primary');
        orgEl.innerHTML = t.exp2Org + ' <span class="text-on-surface-variant">' + t.exp2OrgBadge + '</span>';
        expItems[1].querySelector('time').textContent = t.exp2Date;
        const bullets2 = expItems[1].querySelectorAll('ul[aria-label] li');
        const bulletTexts2 = [t.exp2Bullet1, t.exp2Bullet2, t.exp2Bullet3];
        bullets2.forEach((li, i) => {
            const dot = li.querySelector('span');
            li.textContent = '';
            li.appendChild(dot);
            li.append(' ' + bulletTexts2[i]);
        });
    }

    // Contacto
    document.getElementById('contact-heading').textContent = t.contactTitle;
    document.querySelector('#contact .font-headline.text-5xl').innerHTML = t.contactHeadline;
    document.querySelector('#contact p.text-xl').textContent = t.contactDesc;
    document.querySelector('label[for="contact-name"]').textContent = t.contactLabelName;
    document.getElementById('contact-name').placeholder = t.contactPlaceholderName;
    document.querySelector('label[for="contact-email"]').textContent = t.contactLabelEmail;
    document.getElementById('contact-email').placeholder = t.contactPlaceholderEmail;
    document.querySelector('label[for="contact-message"]').textContent = t.contactLabelMsg;
    document.getElementById('contact-message').placeholder = t.contactPlaceholderMsg;
    document.querySelector('#contact-form button[type="submit"]').textContent = t.contactBtn;

    // Pie de página (Footer)
    document.querySelector('footer p.font-body').textContent = t.footerCopy;

    // Botón ver más proyectos
    const moreProjLabel = document.getElementById('btn-more-projects-label');
    if (moreProjLabel) moreProjLabel.textContent = t.moreProjectsBtn;

    // Retraducir el toast visible si lo hay
    const toastContainer = document.getElementById('toast');
    if (toastContainer.classList.contains('show')) {
        const toastMsgEl = document.getElementById('toast-msg');
        const currText = toastMsgEl.textContent;
        const otherLang = lang === 'es' ? 'en' : 'es';
        const foundKey = Object.keys(i18n[otherLang]).find(k => i18n[otherLang][k] === currText);
        if (foundKey && t[foundKey]) {
            toastMsgEl.textContent = t[foundKey];
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
    btnDemo.addEventListener('click', () => {
        showToast('toastDemo', 'schedule');
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
emailjs.init('5jV8d_imrYVzIc3-W');

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
    const originalText = submitBtn.textContent;
    submitBtn.textContent = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Sending...' : 'Enviando...';
    submitBtn.style.opacity = '0.7';

    try {
        const _0x1a = 'c2VydmljZV8zNzFwemNj';
        const _0x2b = 'dGVtcGxhdGVfYWc5OWpwaQ==';

        // Llamada real a EmailJS:
        await emailjs.sendForm(atob(_0x1a), atob(_0x2b), form);

        form.reset();
        showToast('toastFormOk', 'check_circle');
    } catch (err) {
        console.error('EmailJS Error:', err);
        showToast('toastFormFail', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '';
    }
});

// ═══════════════════════════════════════════════════
//  CARRUSEL: LocalPDF Hub
// ═══════════════════════════════════════════════════
(() => {
    const track = document.getElementById('localpdf-track');
    const btnPrev = document.getElementById('localpdf-prev');
    const btnNext = document.getElementById('localpdf-next');
    const dots = document.querySelectorAll('#localpdf-dots .carousel-dot');

    if (!track || !btnPrev || !btnNext) return;

    const TOTAL = dots.length;   // 5 imágenes
    const AUTO_MS = 4000;          // avance automático cada 4 s
    let current = 0;
    let autoTimer;

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
    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), AUTO_MS); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    // --- Soporte táctil / swipe ---
    let touchStartX = 0;
    track.parentElement.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.parentElement.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { resetAuto(); goTo(current + (dx < 0 ? 1 : -1)); }
    }, { passive: true });

    // --- Teclado (cuando el carrusel tiene foco) ---
    track.parentElement.setAttribute('tabindex', '0');
    track.parentElement.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1); }
        if (e.key === 'ArrowLeft') { resetAuto(); goTo(current - 1); }
    });
})();
