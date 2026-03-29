// ═══════════════════════════════════════════════════
        //  UTILIDADES
        // ═══════════════════════════════════════════════════
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        let toastTimer;

        function showToast(msg, icon = 'check_circle') {
            toastMsg.textContent = msg;
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
        //  MENU MOBILE
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
        //  DARK / LIGHT MODE
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
            showToast(isDark ? 'Tema oscuro activado' : 'Tema claro activado', isDark ? 'dark_mode' : 'light_mode');
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
                expTitle: 'Experiencia',
                expRole: 'Desarrollador Full Stack Independiente',
                expOrg: 'Institución Médica / Sector Salud',
                expDate: '2025 — PRESENTE',
                expBullet1: 'Identifiqué cuellos de botella operativos y desarrollé proactivamente un sistema integral de gestión de colas desde cero.',
                expBullet2: 'Arquitecé una solución cliente-servidor en tiempo real (Node.js, Socket.IO) capaz de manejar tótems, pantallas de TV y dispositivos móviles simultáneamente.',
                expBullet3: 'Implementé un sistema de persistencia híbrida (SQLite + RAM) y autenticación JWT, garantizando alta disponibilidad y seguridad de los datos.',
                contactTitle: 'Contacto',
                contactHeadline: 'Construyamos soluciones <span class="text-primary">eficientes</span>.',
                contactDesc: 'Estoy abierto a nuevos desafíos técnicos, propuestas laborales o charlas sobre arquitectura de software.',
                contactLabelName: 'Nombre', contactPlaceholderName: 'Tu nombre completo',
                contactLabelEmail: 'Email', contactPlaceholderEmail: 'tu@email.com',
                contactLabelMsg: 'Mensaje', contactPlaceholderMsg: '¿En qué te puedo ayudar?',
                contactBtn: 'Enviar Mensaje',
                footerCopy: '© 2026 Alan Roy Cuevas. Todos los derechos reservados.',
                langToast: 'Idioma: Español'
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
                expTitle: 'Experience',
                expRole: 'Independent Full Stack Developer',
                expOrg: 'Medical Institution / Healthcare Sector',
                expDate: '2025 — PRESENT',
                expBullet1: 'Identified operational bottlenecks and proactively developed a comprehensive queue management system from scratch.',
                expBullet2: 'Architected a real-time client-server solution (Node.js, Socket.IO) capable of handling totems, TV screens, and mobile devices simultaneously.',
                expBullet3: 'Implemented a hybrid persistence system (SQLite + RAM) and JWT authentication, ensuring high availability and data security.',
                contactTitle: 'Contact',
                contactHeadline: 'Let\'s build <span class="text-primary">efficient</span> solutions.',
                contactDesc: 'I\'m open to new technical challenges, job proposals, or conversations about software architecture.',
                contactLabelName: 'Name', contactPlaceholderName: 'Your full name',
                contactLabelEmail: 'Email', contactPlaceholderEmail: 'you@email.com',
                contactLabelMsg: 'Message', contactPlaceholderMsg: 'How can I help you?',
                contactBtn: 'Send Message',
                footerCopy: '© 2026 Alan Roy Cuevas. All rights reserved.',
                langToast: 'Language: English'
            }
        };

        function applyLang(lang) {
            const t = i18n[lang];
            document.documentElement.lang = lang;

            // Nav
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

            // Hero
            document.querySelector('.hero-stagger.font-headline.text-primary').textContent = t.heroBadge;
            document.querySelector('.hero-stagger.font-body').textContent = t.heroDesc;
            const heroBtns = document.querySelectorAll('.hero-stagger a');
            if (heroBtns[0]) heroBtns[0].textContent = t.heroCta1;
            if (heroBtns[1]) heroBtns[1].textContent = t.heroCta2;

            // About
            document.getElementById('about-heading').textContent = t.aboutTitle;
            document.querySelector('#about p.reveal').textContent = t.aboutText;

            // Tech
            document.getElementById('tech-heading').textContent = t.techTitle;
            document.querySelector('#tech p.reveal.delay-150').textContent = t.techSub;
            document.querySelector('#tech p.reveal.delay-300').textContent = t.techDesc;

            // Projects
            document.getElementById('projects-heading').textContent = t.projTitle;
            document.querySelector('#projects article:nth-of-type(1) a[aria-label]').textContent = '';
            document.querySelector('#projects article:nth-of-type(1) a .material-symbols-outlined:not([aria-hidden="true"])');
            const demoLinks = document.querySelectorAll('#projects article a');
            if (demoLinks[0]) { demoLinks[0].childNodes[0].textContent = t.proj1Demo + ' '; }
            if (demoLinks[1]) { demoLinks[1].childNodes[0].textContent = t.proj2Repo + ' '; }

            // Experience
            document.getElementById('experience-heading').textContent = t.expTitle;
            document.querySelector('#experience h3').textContent = t.expRole;
            document.querySelector('#experience p.text-primary').textContent = t.expOrg;
            document.querySelector('#experience time').textContent = t.expDate;
            const bullets = document.querySelectorAll('#experience ul[aria-label] li');
            const bulletTexts = [t.expBullet1, t.expBullet2, t.expBullet3];
            bullets.forEach((li, i) => {
                const dot = li.querySelector('span');
                li.textContent = '';
                li.appendChild(dot);
                li.append(' ' + bulletTexts[i]);
            });

            // Contact
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

            // Footer
            document.querySelector('footer p.font-body').textContent = t.footerCopy;

            showToast(t.langToast, 'language');
        }

        btnLang.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            applyLang(currentLang);
        });

        // ═══════════════════════════════════════════════════
        //  DOWNLOAD CV
        // ═══════════════════════════════════════════════════
        document.querySelectorAll('a[aria-label*="CV"], a[aria-label*="cv"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Cuando exista el PDF real: btn.href = 'cv-alan-roy-cuevas.pdf'; btn.download = true;
                showToast('CV próximamente disponible', 'schedule');
            });
        });

        // ═══════════════════════════════════════════════════
        //  FORMULARIO: validación + EmailJS
        // ═══════════════════════════════════════════════════
        // Configurar EmailJS (reemplazar con credenciales reales)
        // emailjs.init('TU_PUBLIC_KEY');

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
                showToast('Completa todos los campos correctamente', 'error');
                return;
            }

            // Deshabilitar botón durante envío
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.opacity = '0.7';

            try {
                // Con EmailJS real:
                // await emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form);

                // Simulación de envío (eliminar cuando EmailJS esté configurado)
                await new Promise(r => setTimeout(r, 1200));

                form.reset();
                showToast('Mensaje enviado con éxito', 'check_circle');
            } catch (err) {
                console.error(err);
                showToast('Error al enviar. Intentá de nuevo.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '';
            }
        });
