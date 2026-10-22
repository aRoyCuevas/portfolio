// --- Remix: Portfolio Integration Test ---
(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, Flip, ScrollSmoother);

    const rand = gsap.utils.random;
    const navEl = document.querySelector('nav');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]motion=full\b/.test(location.search);
    let smoother = null;
    let horiz = null;
    let textCtx = null;
    let desktopMode = false;
    let firstBuild = true;
    let built = false;
    let linkFocus = false;
    const cleanups = [];

    // --- Hooks Used By main.js ---
    window.remixScrollTo = (target, instant = false) => {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return;
        // Pinned sections: go just past where their pin starts (element offsets point past the pin;
        // exactly at the start the horizontal track sits at progress 0 and the first card's entrances never fire)
        const pinned = ScrollTrigger.getAll().find((t) => t.pin === el);
        if (smoother) smoother.scrollTo(pinned ? pinned.start + 2 : el, !instant, pinned ? undefined : 'top top');
        else el.scrollIntoView({ behavior: reduced || instant ? 'auto' : 'smooth' });
        // Move keyboard focus with the view (2.4.3)
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        // The jump above already placed the view: ScrollSmoother must not re-scroll to the focused section
        linkFocus = true;
        el.focus({ preventScroll: true });
        linkFocus = false;
    };
    window.remixPause = (on) => smoother?.paused(on);
    window.remixBeforeLang = () => { textCtx?.revert(); textCtx = null; };
    window.remixAfterLang = () => {
        if (!built || reduced) return;
        textCtx = gsap.context(() => buildText(false));
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
    };

    // --- Anchor Links ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href');
        const el = id.length > 1 && document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        if (location.hash !== id) history.pushState(null, '', id);
        window.remixScrollTo(el);
    });
    addEventListener('popstate', () => {
        const el = location.hash.length > 1 && document.querySelector(location.hash);
        if (el) window.remixScrollTo(el);
    });

    // --- Click Effects (Ver Proyectos zooms into its own letters, Descargar CV flies to the downloads) ---
    // Fixed layer outside the smooth content: a transformed ancestor would break position: fixed
    const fxLayer = document.createElement('div');
    fxLayer.className = 'fx-layer';
    fxLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fxLayer);
    const busy = new WeakSet();
    const spawn = (cls, tag = 'div') => {
        const el = document.createElement(tag);
        el.className = cls;
        fxLayer.appendChild(el);
        return el;
    };
    const centerOf = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, r };
    };

    // Thickest point of a glyph: the scale that makes its stroke cover the screen, centered on it.
    // The char is drawn alone on a canvas sized like its DOM box (letter-spacing stays out of it)
    function coverPoint(span, font) {
        const box = span.getBoundingClientRect();
        const w = Math.ceil(box.width);
        const h = Math.ceil(box.height);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.font = font;
        const m = ctx.measureText(span.textContent);
        const baseline = (h - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
        ctx.fillText(span.textContent, 0, baseline);
        const data = ctx.getImageData(0, 0, w, h).data;
        const solid = (x, y) => data[(y * w + x) * 4 + 3] > 200;
        let best = null;
        for (let y = 1; y < h - 1; y += 2) {
            for (let x = 1; x < w - 1; x += 2) {
                if (!solid(x, y)) continue;
                let l = x; while (l > 0 && solid(l - 1, y)) l--;
                let r = x; while (r < w - 1 && solid(r + 1, y)) r++;
                let u = y; while (u > 0 && solid(x, u - 1)) u--;
                let d = y; while (d < h - 1 && solid(x, d + 1)) d++;
                // Scale at which the stroke around (x, y) reaches every screen edge
                const scale = Math.max(innerWidth / 2 / Math.min(x - l + 0.5, r - x + 0.5), innerHeight / 2 / Math.min(y - u + 0.5, d - y + 0.5));
                if (!best || scale < best.scale) best = { x, y, scale };
            }
        }
        return best;
    }

    function projectsZoom(btn, go) {
        const label = btn.querySelector('span') || btn;
        const cs = getComputedStyle(label);
        const K = 8;
        const bigSize = parseFloat(cs.fontSize) * K;
        // A big copy shrunk onto the button text: crisp while it grows
        const zoom = spawn('fx-zoom');
        Object.assign(zoom.style, { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: `${bigSize}px`, letterSpacing: `${parseFloat(cs.letterSpacing || 0) * K || 0}px` });
        // The label is uppercase by CSS: the copy (and the canvas) must draw the same glyphs
        const text = cs.textTransform === 'uppercase' ? label.textContent.trim().toUpperCase() : label.textContent.trim();
        const chars = [...text].map((ch) => {
            const s = document.createElement('span');
            s.textContent = ch;
            zoom.appendChild(s);
            return s;
        });
        const r = label.getBoundingClientRect();
        gsap.set(zoom, { left: r.left, top: r.top + (r.height - zoom.offsetHeight / K) / 2, transformOrigin: '0 0', scale: 1 / K });
        const font = `${cs.fontWeight} ${bigSize}px ${cs.fontFamily}`;
        // Measured at scale 1 (rects of the big copy), then shrunk back
        gsap.set(zoom, { scale: 1 });
        const zr = zoom.getBoundingClientRect();
        // The letter closest to the middle of the words: the zoom stays centered on the screen
        const mid = zr.left + zr.width / 2;
        const middle = chars.filter((s) => s.textContent.trim()).reduce((best, s) => {
            const r = s.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            return !best || d < best.d ? { s, d } : best;
        }, null).s;
        const p = coverPoint(middle, font);
        const sr = middle.getBoundingClientRect();
        const target = { px: sr.left - zr.left + p.x, py: sr.top - zr.top + p.y, scale: p.scale * 1.15 };
        gsap.set(zoom, { scale: 1 / K });
        const left = parseFloat(zoom.style.left);
        const top = parseFloat(zoom.style.top);
        gsap.set(label, { opacity: 0 });
        gsap.set(zoom, { '--tint': 0 });
        // Background blur under the text: the closer the zoom, the stronger
        const blur = spawn('fx-blur');
        fxLayer.insertBefore(blur, zoom);
        const cover = spawn('fx-cover');
        gsap.set(cover, { opacity: 0 });
        const W = innerWidth;
        const H = innerHeight;
        const textW = zoom.offsetWidth;
        const textH = zoom.offsetHeight;
        // Stage 1: the words travel to the exact center of the screen and grow to fill its width
        const sA = Math.min((W * 0.86) / textW, (H * 0.3) / textH);
        const xA = W / 2 - left - (sA * textW) / 2;
        const yA = H / 2 - top - (sA * textH) / 2;
        // Stage 2: exponential scale (steady flight into the letter); the thickest point of a stroke
        // slides from where it sits in the centered words to the screen center
        const fromX = left + xA + sA * target.px;
        const fromY = top + yA + sA * target.py;
        const state = { p: 0 };
        gsap.timeline({ onComplete: () => { zoom.remove(); blur.remove(); cover.remove(); gsap.set(label, { opacity: 1 }); } })
            .to(zoom, { scale: sA, x: xA, y: yA, '--tint': 1, duration: 0.6, ease: 'power3.inOut' })
            .fromTo(blur, { '--blur': 0 }, { '--blur': 4, duration: 0.6, ease: 'power1.in' }, 0)
            .to(state, {
                p: 1, duration: 0.85, ease: 'power2.in',
                onUpdate: () => {
                    const p = state.p;
                    const s = sA * Math.pow(target.scale / sA, p);
                    const cx = fromX + (W / 2 - fromX) * p;
                    const cy = fromY + (H / 2 - fromY) * p;
                    gsap.set(zoom, { scale: s, x: cx - left - s * target.px, y: cy - top - s * target.py });
                    blur.style.setProperty('--blur', 4 + 14 * p);
                },
            }, '+=0.08')
            // Inside the stroke: a flat cover of the same color replaces the giant text, the page jumps behind it
            .set(cover, { opacity: 1 })
            .add(() => { zoom.style.visibility = 'hidden'; go(); })
            .to(cover, { opacity: 0, duration: 0.55, ease: 'power2.out' }, '+=0.12')
            .to(blur, { '--blur': 0, opacity: 0, duration: 0.55, ease: 'power2.out' }, '<');
    }

    // Where the browser shows its downloads, seen from the page
    function downloadTarget() {
        const ua = navigator.userAgent;
        const W = innerWidth;
        const H = innerHeight;
        const iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (iOS) return { x: 44, y: H + 80 };                                   // bottom address bar, page menu on the left
        if (/Android/.test(ua)) return { x: W / 2, y: H + 80 };                 // download notice rises from the bottom
        if (/Firefox\//.test(ua)) return { x: W - 70, y: -70 };                 // toolbar, right
        if (/Edg\//.test(ua)) return { x: W - 150, y: -70 };                    // toolbar, right of the address bar
        const chrome = ua.match(/Chrome\/(\d+)/);
        if (chrome) return +chrome[1] >= 116 ? { x: W - 110, y: -70 } : { x: 90, y: H + 60 }; // bubble / old bottom shelf
        if (/Safari\//.test(ua)) return { x: W - 40, y: -70 };                  // toolbar, far right
        return { x: W - 80, y: -70 };
    }

    function cvFly(btn) {
        const { x, y } = centerOf(btn);
        const icon = btn.querySelector('.material-symbols-outlined');
        gsap.timeline()
            .to(btn, { scaleX: 1.08, scaleY: 0.88, duration: 0.1, ease: 'power2.out' })
            .to(btn, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1.2, 0.35)' });
        // Light, colorless shock: it only bends what is behind it
        const ring = spawn('fx-shock');
        gsap.set(ring, { left: x, top: y, width: 760, height: 760, xPercent: -50, yPercent: -50 });
        gsap.fromTo(ring, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.9, ease: 'expo.out', onComplete: () => ring.remove() });
        document.querySelectorAll('#hero-name .char, #hero-badge, #txt-hero-quote').forEach((el) => {
            const c = centerOf(el);
            if (c.r.bottom < 0 || c.r.top > innerHeight) return;
            const dx = c.x - x;
            const dy = c.y - y;
            const d = Math.hypot(dx, dy) || 1;
            const force = Math.max(0, 1 - d / 600) * 20;
            if (force < 1.5) return;
            gsap.timeline({ delay: d / 1600 })
                .to(el, { x: (dx / d) * force, y: (dy / d) * force, duration: 0.14, ease: 'power2.out' })
                .to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
        });
        // The file pops out of the button and arcs to the browser's downloads
        const file = spawn('fx-doc');
        const to = downloadTarget();
        const from = { x, y: y - 46 };
        const ctrl = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 180 };
        const fly = { t: 0 };
        gsap.set(file, { left: 0, top: 0, xPercent: -50, yPercent: -50, x, y, scale: 0 });
        gsap.timeline({ onComplete: () => file.remove() })
            .to(file, { y: from.y, scale: 1, rotation: -6, duration: 0.3, ease: 'back.out(2.5)' })
            .to(fly, {
                t: 1, duration: 0.85, ease: 'power2.in',
                onUpdate: () => {
                    const t = fly.t;
                    const u = 1 - t;
                    gsap.set(file, {
                        x: u * u * from.x + 2 * u * t * ctrl.x + t * t * to.x,
                        y: u * u * from.y + 2 * u * t * ctrl.y + t * t * to.y,
                        scale: 1 - 0.6 * t,
                        rotation: -6 + 20 * t,
                    });
                },
            }, '+=0.05');
        // Arrow drops while it travels, then a check
        if (icon) {
            gsap.timeline()
                .to(icon, { y: 5, duration: 0.14, repeat: 5, yoyo: true, ease: 'power1.inOut' })
                .add(() => { icon.textContent = 'check'; })
                .fromTo(icon, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1.4, 0.4)', immediateRender: false })
                .add(() => { icon.textContent = 'download'; }, '+=1.2')
                .fromTo(icon, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false });
        }
    }

    const projectsBtn = document.getElementById('txt-btn-projects')?.closest('a');
    projectsBtn?.addEventListener('click', (e) => {
        if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || busy.has(projectsBtn)) return;
        // Runs before the document anchor handler: the zoom ends inside a letter, the page jumps behind it
        e.preventDefault();
        e.stopPropagation();
        busy.add(projectsBtn);
        projectsZoom(projectsBtn, () => {
            if (location.hash !== '#projects') history.pushState(null, '', '#projects');
            window.remixScrollTo('#projects', true);
        });
        gsap.delayedCall(2, () => busy.delete(projectsBtn));
    });
    // The download itself is never delayed: only the effect plays on top
    document.querySelectorAll('a[download]').forEach((btn) => btn.addEventListener('click', () => {
        if (reduced || busy.has(btn)) return;
        busy.add(btn);
        cvFly(btn);
        gsap.delayedCall(2.8, () => busy.delete(btn));
    }));

    // --- Navigation Reveal (always reachable by keyboard) ---
    // Only moves off-screen: never visibility:hidden, and never hides while it holds focus
    function setNav(show) {
        if (!show && navEl.matches(':focus-within')) return;
        gsap.to(navEl, { yPercent: show ? 0 : -100, duration: 0.6, ease: show ? 'expo.out' : 'power2.in', overwrite: true });
    }
    navEl.addEventListener('focusin', () => setNav(true));

    // --- Accessible Split (paragraphs and spans can't carry aria-label) ---
    function splitForScreenReaders(el, vars) {
        const copy = document.createElement(el.tagName === 'P' ? 'p' : 'span');
        copy.className = 'sr-only';
        copy.textContent = el.textContent.replace(/\s+/g, ' ').trim();
        el.after(copy);
        const split = SplitText.create(el, { ...vars, aria: 'hidden' });
        return { split, cleanup: () => copy.remove() };
    }

    // --- Motion Control (WCAG 2.2.2: endless animations can be paused) ---
    const loops = new Set();
    let motionPaused = false;
    try { motionPaused = localStorage.getItem('motion') === 'paused'; } catch (e) { /* storage unavailable */ }
    // CSS loops (timeline pulse, scroll arrow) pause through this class
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    const motionBtn = document.getElementById('btn-motion');
    function registerLoop(anim, trigger) {
        loops.add(anim);
        if (motionPaused) anim.pause();
        // Off-screen loops stop working too
        if (trigger) {
            ScrollTrigger.create({
                trigger, start: 'top bottom', end: 'bottom top',
                onToggle: (self) => { if (!motionPaused) self.isActive ? anim.resume() : anim.pause(); },
                onRefresh: (self) => { if (!motionPaused && !self.isActive) anim.pause(); },
            });
        }
        return anim;
    }
    window.remixSyncMotion = () => {
        if (!motionBtn) return;
        const t = typeof i18n !== 'undefined' ? i18n[currentLang] : {};
        motionBtn.setAttribute('aria-pressed', String(motionPaused));
        motionBtn.setAttribute('aria-label', motionPaused ? (t.motionPlay || 'Reanudar animaciones') : (t.motionPause || 'Pausar animaciones'));
        motionBtn.textContent = motionPaused ? 'motion_photos_on' : 'motion_photos_pause';
    };
    motionBtn?.addEventListener('click', () => {
        motionPaused = !motionPaused;
        loops.forEach((anim) => (motionPaused ? anim.pause() : anim.resume()));
        document.documentElement.classList.toggle('motion-paused', motionPaused);
        try { localStorage.setItem('motion', motionPaused ? 'paused' : 'on'); } catch (e) { /* storage unavailable */ }
        window.remixSyncMotion();
    });

    // --- Static Layer (Not Translated) ---
    function buildStatic(isDesktop) {
        const ctaWrap = document.getElementById('txt-btn-projects').closest('a').parentElement;
        const ctas = [...ctaWrap.children];

        // Hero: intro
        const nameSplit = SplitText.create('#hero-name', { type: 'chars,words', charsClass: 'char' });
        let intro = null;
        if (firstBuild) {
            intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
                .from(nameSplit.chars, { yPercent: () => rand(-300, 300), rotation: () => rand(-120, 120), scale: () => rand(0, 3), opacity: 0, duration: 1.6, stagger: { each: 0.04, from: 'random' } }, 0.1)
                .from('#hero-badge', { letterSpacing: '2.4em', opacity: 0, duration: 1.6 }, 0.2)
                .from(ctas, { scale: 0, rotation: () => rand(-40, 40), duration: 1.4, ease: 'elastic.out(1, 0.45)', stagger: 0.12 }, 1)
                .from('#intro-scroll-indicator', { opacity: 0, y: 20, duration: 0.8 }, 1.5);
        }

        // Hero: zoom through the name
        if (isDesktop) {
            // Zoom into "ROY": ALAN and CUEVAS split apart, ROY ends centered on screen
            const royWord = nameSplit.words.find((w) => w.textContent.trim() === 'ROY') || nameSplit.words[0];
            const royChars = nameSplit.chars.filter((c) => royWord.contains(c));
            const sideWords = nameSplit.words.filter((w) => w !== royWord);
            royChars.forEach((c) => c.classList.add('zoom-char'));
            // Measured without transforms and relative to the pinned hero: a refresh mid-zoom
            // (resize, language) must not skew it
            const measure = () => {
                const h1 = document.getElementById('hero-name');
                const hero = document.getElementById('hero');
                const els = [h1, ...nameSplit.words, ...royChars];
                const saved = els.map((el) => el.style.transform);
                els.forEach((el) => { el.style.transform = 'none'; });
                const h = h1.getBoundingClientRect();
                const box = hero.getBoundingClientRect();
                const first = royChars[0].getBoundingClientRect();
                const last = royChars[royChars.length - 1].getBoundingClientRect();
                els.forEach((el, i) => { el.style.transform = saved[i]; });
                const w = last.right - first.left;
                const scale = Math.min((innerWidth * 0.8) / w, (innerHeight * 0.6) / first.height);
                // Fixed origin at the h1 center (GSAP does not re-read a function origin on refresh).
                // Offsets from that center hold even while the intro badge widens the h1 (centered text)
                const hcx = h.left + h.width / 2;
                const hcy = h.top + h.height / 2;
                const ox = first.left + w / 2 - hcx;
                const oy = first.top + first.height / 2 - hcy;
                return {
                    x: innerWidth / 2 - (hcx - box.left) - scale * ox,
                    y: innerHeight / 2 - (hcy - box.top) - scale * oy,
                    scale,
                    w,
                };
            };
            // Curtain: the hero stays pinned (no spacing) while the zoom plays over a spacer,
            // then "Sobre mí" slides up over it - the screen is never empty
            const ZOOM_SCREENS = 1.1;
            const spacer = document.createElement('div');
            spacer.className = 'hero-curtain-spacer';
            spacer.setAttribute('aria-hidden', 'true');
            spacer.style.height = `${ZOOM_SCREENS * 100}vh`;
            document.getElementById('hero').after(spacer);
            cleanups.push(() => spacer.remove());
            // One trigger pins and scrubs: a second trigger on the pinned hero would start after the pin
            const zoom = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: () => '+=' + innerHeight * (ZOOM_SCREENS + 1), pin: true, pinSpacing: false, scrub: 1, invalidateOnRefresh: true, refreshPriority: 2 } })
                .to('#hero-name', {
                    scale: () => measure().scale, x: () => measure().x, y: () => measure().y,
                    transformOrigin: '50% 50%', ease: 'power2.in', force3D: false, duration: 1,
                }, 0)
                .to(sideWords, { x: (i) => (i ? 1 : -1) * measure().w * 0.9, opacity: 0, ease: 'power1.in', duration: 0.6 }, 0.1)
                // The accent goes through a CSS variable: a recorded color would freeze the theme
                .fromTo(royChars, { '--zoom-mix': 0 }, { '--zoom-mix': 1, duration: 0.4 }, 0.6)
                .to(['#txt-hero-quote', ctaWrap], { yPercent: 300, opacity: 0, duration: 0.4 }, 0)
                .to('#blob-a', { scale: 3, x: '30vw', duration: 1 }, 0)
                .to('#blob-b', { scale: 2.5, x: '-30vw', duration: 1 }, 0)
                // While "Sobre mí" covers it (one screen of scroll), ROY drifts up slower than the
                // curtain, as if pushed by it
                .to('#hero-name', { y: () => measure().y - innerHeight * 0.45, ease: 'none', duration: 1 / ZOOM_SCREENS }, 1);
            // The intro also animates the opacity of the badge and the indicator: added while it runs, the
            // zoom recorded them at opacity 0 and scrolling back to the top left them invisible
            const fadeIntroParts = () => {
                zoom.to(['#hero-badge', '#intro-scroll-indicator'], { yPercent: 300, opacity: 0, duration: 0.4 }, 0);
                zoom.render(zoom.totalTime(), true, true);
            };
            if (intro) intro.eventCallback('onComplete', fadeIntroParts);
            else fadeIntroParts();
        }

        // Navigation appears after the hero
        gsap.set(navEl, { yPercent: -100 });
        // By progress, not isActive: isActive turns false on the last pixel and hid the nav at the bottom
        let navShown = null;
        const syncNav = (self) => {
            const show = self.progress > 0;
            if (show !== navShown) { navShown = show; setNav(show); }
        };
        ScrollTrigger.create({ start: () => innerHeight * (isDesktop ? 1.15 : 0.6), end: 'max', onUpdate: syncNav, onRefresh: syncNav });

        // Velocity skew on the stack cards (desktop)
        if (isDesktop) {
            const skewTo = gsap.quickTo(gsap.utils.toArray('#tech li'), 'skewY', { duration: 0.5, ease: 'power3' });
            let settleCall = null;
            ScrollTrigger.create({
                start: 0, end: 'max',
                onUpdate: (self) => {
                    skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -300));
                    settleCall?.kill();
                    settleCall = gsap.delayedCall(0.15, () => skewTo(0));
                },
            });
            cleanups.push(() => settleCall?.kill());
        }

        // Section labels
        ['#tech-heading', '#projects-heading', '#experience-heading', '#contact-heading'].forEach((sel) => {
            gsap.from(sel, { letterSpacing: '1.6em', opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: sel, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });

        // Stack: parallax cloud
        const techItems = gsap.utils.toArray('#tech li');
        gsap.from(['#tech-subheading', '#tech-description'], { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '#tech', start: 'top 75%' } });
        gsap.from(techItems, { scale: 0, rotation: () => rand(-90, 90), opacity: 0, duration: 1, ease: 'back.out(2)', stagger: { each: 0.05, from: 'random' }, scrollTrigger: { trigger: '#tech ul', start: 'top 85%' } });
        // Lag only: the float happens while scrolling and the grid settles aligned (a speed ≠ 1 left it uneven at rest)
        if (isDesktop && smoother) smoother.effects(techItems, { lag: (i) => (i % 3) * 0.12 });

        // Projects
        const track = document.getElementById('projects-track');
        const articles = gsap.utils.toArray('#projects-track > article');
        if (isDesktop) {
            // The circle reveals the track only: on the whole stage it cut the heading ("…JS DESTACADOS")
            // Same pace as before (screen covered near the end), then it grows to cover the whole track
            const circle = (r) => () => `circle(${r()}px at ${innerWidth / 2}px 100%)`;
            gsap.timeline({ scrollTrigger: { trigger: '#projects', start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } })
                .fromTo(track, { clipPath: circle(() => 0) }, { clipPath: circle(() => Math.hypot(innerWidth / 2, innerHeight)), ease: 'none', duration: 0.94 })
                .to(track, { clipPath: circle(() => track.scrollWidth + innerHeight), ease: 'none', duration: 0.06 });
            horiz = gsap.to(track, {
                x: () => -(track.scrollWidth - innerWidth), ease: 'none',
                scrollTrigger: { trigger: '#projects', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), pin: true, scrub: 1, invalidateOnRefresh: true },
            });
            articles.forEach((art) => {
                const along = { trigger: art, containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true };
                gsap.fromTo(art, { rotationY: -16, transformPerspective: 1400 }, { rotationY: 16, ease: 'none', scrollTrigger: along });
                gsap.fromTo(art.lastElementChild, { x: 140 }, { x: -140, ease: 'none', scrollTrigger: { ...along } });
                gsap.from(art.querySelectorAll('.flex-wrap > span'), { y: 40, scale: 0, rotation: () => rand(-30, 30), duration: 0.7, ease: 'back.out(3)', stagger: 0.08, scrollTrigger: { trigger: art, containerAnimation: horiz, start: 'left 70%', toggleActions: 'play none none reverse' } });
            });
            gsap.from('.h-end', { scale: 0.2, rotation: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.h-end', containerAnimation: horiz, start: 'left right', end: 'center center', scrub: true } });
        } else {
            horiz = null;
            articles.forEach((art, i) => gsap.from(art, { y: 100, rotation: i % 2 ? 3 : -3, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: art, start: 'top 85%' } }));
            gsap.from('.h-end', { scale: 0.5, opacity: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.h-end', start: 'top 85%' } });
        }

        // Experience
        gsap.fromTo('.timeline-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#experience ol', start: 'top 70%', end: 'bottom 70%', scrub: true } });
        gsap.from('#experience ol > li > div:nth-of-type(2)', { x: -200, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#experience ol', start: 'top 80%' } });
        gsap.from('.timeline-pulse', { scale: 0, duration: 1, ease: 'elastic.out(1.2, 0.3)', scrollTrigger: { trigger: '#experience ol', start: 'top 80%' } });
        gsap.utils.toArray('#experience .space-y-10 > div').forEach((block, i) => {
            const dx = isDesktop ? 220 : 60;
            gsap.from(block, { x: i % 2 ? dx : -dx, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: block, start: 'top 80%' } });
            gsap.from(block.querySelectorAll('li'), { x: 80, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: block, start: 'top 75%' } });
        });
        document.querySelectorAll('[data-count]').forEach((el) => {
            const target = parseFloat(el.dataset.count);
            const dec = el.dataset.format === 'dec';
            const counter = { val: 0 };
            // dataset.value lets a language switch reformat the number where it stands
            const show = () => { el.dataset.value = counter.val; el.textContent = formatCount(counter.val, dec); };
            show();
            gsap.to(counter, {
                val: target, duration: 2.4, ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 88%' },
                onUpdate: show,
                onStart: () => gsap.fromTo(el, { scale: 2.2, color: '#a47fff' }, { scale: 1, color: '', duration: 1.2, ease: 'elastic.out(1, 0.4)' }),
            });
        });

        // Contact
        registerLoop(gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 3.5, ease: 'sine.inOut' } })
            .to('#c-blob', { morphSVG: 'M100 10 C160 30 196 70 176 120 C160 170 120 196 80 180 C30 162 0 120 20 72 C36 34 60 0 100 10 Z' })
            .to('#c-blob', { morphSVG: 'M96 26 C150 8 196 54 186 104 C176 156 140 192 92 178 C44 164 6 140 14 92 C20 50 52 40 96 26 Z' }), '#contact');
        registerLoop(gsap.to('.contact-blob', { rotation: 360, duration: 40, repeat: -1, ease: 'none' }), '#contact');
        gsap.from('#contact-desc', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#contact-desc', start: 'top 85%' } });
        gsap.from('#contact address > div', { x: -120, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '#contact address', start: 'top 88%' } });
        gsap.from('#contact-form > *', { x: 140, rotation: 5, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '#contact-form', start: 'top 80%' } });
        gsap.from('footer > div > *', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: 'footer', start: 'top 95%' } });

        // Magnetic buttons (mouse only)
        if (isDesktop) {
            [...ctas, document.getElementById('btn-cv-nav')].forEach((el) => {
                if (!el) return;
                const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
                const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
                const move = (e) => {
                    if (e.pointerType !== 'mouse') return;
                    const r = el.getBoundingClientRect();
                    mx((e.clientX - r.left - r.width / 2) * 0.35);
                    my((e.clientY - r.top - r.height / 2) * 0.35);
                };
                const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
                el.addEventListener('pointermove', move);
                el.addEventListener('pointerleave', leave);
                cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
            });
        }
    }

    // --- Text Layer (Rebuilt On Language Change) ---
    function buildText(first) {
        const srCleanups = [];
        const accessible = (sel, vars) => { const r = splitForScreenReaders(document.querySelector(sel), vars); srCleanups.push(r.cleanup); return r.split; };

        const quote = accessible('#hero-quote-text', { type: 'words' });
        if (first) gsap.from(quote.words, { yPercent: 120, rotation: 10, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.04, delay: 1 });

        // About: title and quote build while the section rises, words follow the scroll,
        // then the key words light up
        const aboutTitle = SplitText.create('#about-heading', { type: 'chars' });
        const about = accessible('#about-text', { type: 'words', mask: 'words' });
        const KEY_WORDS = /^(construyo|agentic|engineering|decisiones|reviso|prueba|tiempo|privacidad|problemas|reales|build|decisions|review|test|real|privacy|problems)/i;
        const keyWords = about.words.filter((w) => KEY_WORDS.test(w.textContent.replace(/[^\p{L}]/gu, '')));
        keyWords.forEach((w) => w.classList.add('key-word'));
        gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top 92%', toggleActions: 'play none none reverse' } })
            .from(aboutTitle.chars, { yPercent: -260, rotation: () => rand(-90, 90), opacity: 0, ease: 'back.out(2.2)', stagger: { each: 0.05, from: 'center' }, duration: 0.9 }, 0)
            .from('.about-quote', { scale: 0, rotation: -200, opacity: 0, ease: 'back.out(1.8)', duration: 1.1 }, 0.15);
        gsap.from(about.words, {
            yPercent: 120, rotation: 12, opacity: 0, ease: 'power3.out', stagger: 0.035,
            scrollTrigger: { trigger: '#about-text', start: 'top 95%', end: desktopMode ? 'center 55%' : 'center 50%', scrub: 1 },
        });
        // Through a CSS variable: a recorded color froze the theme (dark text on the dark theme)
        gsap.fromTo(keyWords, { '--key-mix': 0 }, {
            '--key-mix': 1, ease: 'power2.out', stagger: 0.06,
            // No pin: the key words light up while reading, the next section follows right away
            scrollTrigger: { trigger: '#about-text', start: 'center 70%', end: 'bottom 40%', scrub: 1 },
        });

        gsap.utils.toArray('#projects-track article h3').forEach((h3) => {
            const split = SplitText.create(h3, { type: 'chars,words', mask: 'chars' });
            const st = desktopMode && horiz
                ? { trigger: h3.closest('article'), containerAnimation: horiz, start: 'left 70%', toggleActions: 'play none none reverse' }
                : { trigger: h3, start: 'top 96%', toggleActions: 'play none none reverse' }; // 96%: landing from "Ver Proyectos" leaves the title just under 88%
            gsap.from(split.chars, { yPercent: () => rand([-120, 120]), rotation: () => rand(-30, 30), duration: 0.8, ease: 'back.out(2)', stagger: 0.02, scrollTrigger: st });
        });

        const head = accessible('#contact-headline', { type: 'chars,words' });
        gsap.from(head.chars, {
            y: () => rand(-200, 200), x: () => rand(-200, 200), rotation: () => rand(-90, 90), opacity: 0, ease: 'power3.out',
            stagger: { each: 0.015, from: 'random' },
            scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 25%', scrub: 1 },
        });
        const wave = head.chars.filter((c) => c.closest('#contact-headline-span'));
        // yPercent, not y: y belongs to the scrubbed entrance, and the loop would take its random offset as origin
        const waveLoop = registerLoop(gsap.to(wave, { yPercent: -22, duration: 0.6, ease: 'sine.inOut', stagger: { each: 0.08, repeat: -1, yoyo: true } }), '#contact');

        return () => { loops.delete(waveLoop); srCleanups.forEach((fn) => fn()); };
    }

    // --- Shot Viewer (Flip From The Carousel) ---
    const shot = document.getElementById('shot');
    const figure = document.getElementById('shot-figure');
    const shotImg = document.getElementById('shot-img');
    const thumbs = document.getElementById('shot-thumbs');
    const shotTitle = document.getElementById('shot-title');
    let shotState = null;
    let titleSplit = null;

    function updateShotMeta() {
        const { images, index, tags } = shotState;
        document.getElementById('shot-meta').textContent = `${tags}  ·  ${index + 1} / ${images.length}`;
        shotImg.alt = images[index].alt;
        thumbs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
    }

    function openShot(key, index) {
        if (shotState) return;
        const source = document.getElementById(`${key}-carousel`);
        const article = source.closest('article');
        const images = [...document.querySelectorAll(`#${key}-track img`)];
        shotState = {
            key, index, images, source, article,
            tags: [...article.querySelectorAll('.flex-wrap > span')].map((s) => s.textContent.trim()).join(' '),
            trigger: document.activeElement,
        };

        source.dataset.flipId = 'shot';
        figure.dataset.flipId = 'shot';
        const state = Flip.getState(source);

        shotImg.src = images[index].src;
        // Revert the previous split first: reverting after writing restored the first project's title
        titleSplit?.revert();
        titleSplit = null;
        shotTitle.textContent = article.querySelector('h3').textContent.trim();
        thumbs.replaceChildren(...images.map((img, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', img.alt);
            const t = document.createElement('img');
            t.src = img.currentSrc || img.src;
            t.alt = '';
            b.append(t);
            b.addEventListener('click', () => goShot(0, i));
            return b;
        }));
        updateShotMeta();

        Object.values(window.portfolioCarousels || {}).forEach((c) => c?.pause());
        lockPageScroll(true);
        shot.hidden = false;
        gsap.set(source, { visibility: 'hidden' });
        gsap.set(figure, { visibility: 'visible' });

        const others = [...document.querySelectorAll('#projects-track > *')].filter((el) => el !== article);
        if (reduced) {
            gsap.from(shot, { opacity: 0, duration: 0.2 });
        } else {
            Flip.from(state, { targets: figure, duration: 0.95, ease: 'power4.inOut', scale: true });
            gsap.fromTo(shot, { backgroundColor: 'rgba(10,8,14,0)', backdropFilter: 'blur(0px)' }, { backgroundColor: 'rgba(10,8,14,.9)', backdropFilter: 'blur(18px)', duration: 0.6 });
            gsap.to(others, { y: () => rand(-700, 700), rotation: () => rand(-120, 120), scale: 0.5, opacity: 0, duration: 0.8, ease: 'power3.in', stagger: 0.05 });
            titleSplit = SplitText.create(shotTitle, { type: 'chars,words', mask: 'chars' });
            gsap.from(titleSplit.chars, { yPercent: () => rand([-120, 120]), rotation: () => rand(-40, 40), duration: 0.8, ease: 'back.out(2)', stagger: 0.02, delay: 0.5 });
            gsap.fromTo('#shot-meta', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.7 });
            gsap.fromTo(thumbs.children, { y: 80, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)', stagger: 0.04, delay: 0.6 });
            gsap.fromTo('.shot-btn', { scale: 0 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', stagger: 0.08, delay: 0.7 });
        }
        document.getElementById('shot-close').focus({ preventScroll: true });
    }

    function closeShot() {
        if (!shotState) return;
        const { key, index, source, article, trigger } = shotState;
        shotState = null;
        window.portfolioCarousels?.[key]?.goTo(index);

        const state = Flip.getState(figure);
        gsap.set(source, { visibility: 'visible' });
        gsap.set(figure, { visibility: 'hidden' });
        const others = [...document.querySelectorAll('#projects-track > *')].filter((el) => el !== article);
        const done = () => {
            shot.hidden = true;
            delete source.dataset.flipId;
            delete figure.dataset.flipId;
            gsap.set('.shot-info, #shot-thumbs, .shot-btn', { clearProps: 'opacity' });
            lockPageScroll(false);
            Object.values(window.portfolioCarousels || {}).forEach((c) => c?.resume());
            trigger?.focus?.({ preventScroll: true });
        };
        if (reduced) { done(); return; }
        Flip.from(state, { targets: source, duration: 0.85, ease: 'power4.inOut', scale: true });
        gsap.to('.shot-info, #shot-thumbs, .shot-btn', { opacity: 0, duration: 0.2 });
        gsap.to(shot, { backgroundColor: 'rgba(10,8,14,0)', backdropFilter: 'blur(0px)', duration: 0.6, onComplete: done });
        gsap.to(others, { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.05 });
    }

    function goShot(dir, to) {
        if (!shotState) return;
        const count = shotState.images.length;
        const next = to ?? (shotState.index + dir + count) % count;
        if (next === shotState.index) return;
        const d = to !== undefined ? Math.sign(to - shotState.index) : dir;
        shotState.index = next;
        updateShotMeta();
        const src = shotState.images[next].src;
        if (reduced) { shotImg.src = src; return; }
        gsap.timeline()
            .to(shotImg, { xPercent: -d * 50, rotation: -d * 8, scale: 0.85, opacity: 0, duration: 0.22, ease: 'power2.in' })
            .call(() => { shotImg.src = src; })
            .fromTo(shotImg, { xPercent: d * 60, rotation: d * 10, scale: 0.85, opacity: 0 }, { xPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' });
    }

    ['turnero', 'localpdf', 'key2pad'].forEach((key) => {
        const region = document.getElementById(`${key}-carousel`);
        region?.addEventListener('keydown', (e) => {
            if (e.target !== region || (e.key !== 'Enter' && e.key !== ' ')) return;
            e.preventDefault();
            openShot(key, window.portfolioCarousels?.[key]?.current?.() ?? 0);
        });
        document.querySelectorAll(`#${key}-track img`).forEach((img, i) => {
            img.addEventListener('click', () => {
                if (window.portfolioCarousels?.[key]?.isClickPrevented?.()) return;
                openShot(key, i);
            });
        });
    });
    document.getElementById('shot-close').addEventListener('click', closeShot);
    document.getElementById('shot-prev').addEventListener('click', () => goShot(-1));
    document.getElementById('shot-next').addEventListener('click', () => goShot(1));
    shot.addEventListener('click', (e) => { if (e.target === shot || e.target.classList.contains('shot-stage')) closeShot(); });
    document.addEventListener('keydown', (e) => {
        if (!shotState) return;
        if (e.key === 'Escape') closeShot();
        if (e.key === 'ArrowLeft') goShot(-1);
        if (e.key === 'ArrowRight') goShot(1);
        if (e.key === 'Tab') {
            const focusable = [...shot.querySelectorAll('button')];
            const i = focusable.indexOf(document.activeElement);
            const next = e.shiftKey ? (i <= 0 ? focusable.length - 1 : i - 1) : (i === focusable.length - 1 ? 0 : i + 1);
            e.preventDefault();
            focusable[next].focus();
        }
    });
    let touchX = 0;
    shot.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    shot.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) goShot(dx < 0 ? 1 : -1);
    }, { passive: true });

    // --- Boot ---
    if (reduced) {
        built = true;
        document.documentElement.classList.remove('remix-loading');
        return;
    }

    // --- Focus Inside The Pinned Horizontal Track ---
    // The browser can't scroll a transformed track into view: drive the page scroll instead
    function focusInTrack(el) {
        if (!(el instanceof Element)) return false;
        const article = el.closest('#projects-track > *');
        if (!article || !horiz || !smoother) return false;
        document.getElementById('projects').scrollLeft = 0;
        const st = horiz.scrollTrigger;
        const distance = st.end - st.start;
        const offset = gsap.utils.clamp(0, distance, article.offsetLeft - innerWidth * 0.1);
        smoother.scrollTo(st.start + offset, false);
        return true;
    }
    gsap.set(navEl, { yPercent: -100 });
    // A link with #section: the browser jumped before pins and spacers existed, so jump again once they do
    let bootTarget = null;
    try { bootTarget = location.hash.length > 1 ? document.querySelector(location.hash) : null; } catch (e) { /* not a selector */ }
    document.fonts.ready.then(() => {
        const mm = gsap.matchMedia();
        mm.add({ isDesktop: '(min-width: 1024px) and (pointer: fine)', isLight: '(max-width: 1023px), (pointer: coarse)' }, (ctx) => {
            const { isDesktop } = ctx.conditions;
            desktopMode = isDesktop;
            document.documentElement.classList.toggle('remix-desktop', isDesktop);
            if (isDesktop) {
                smoother = ScrollSmoother.create({
                    wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.4, effects: true,
                    onFocusIn: (instance, event) => !linkFocus && !focusInTrack(event.target),
                });
            }
            buildStatic(isDesktop);
            textCtx = gsap.context(() => buildText(firstBuild));
            firstBuild = false;
            // Pins created out of page order (about is built after projects): sort, then measure
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
            built = true;
            document.documentElement.classList.remove('remix-loading');
            if (bootTarget) {
                const target = bootTarget;
                bootTarget = null;
                requestAnimationFrame(() => window.remixScrollTo(target, true));
            }
            return () => {
                cleanups.splice(0).forEach((fn) => fn());
                loops.clear();
                textCtx?.revert();
                textCtx = null;
                smoother = null;
                horiz = null;
                document.documentElement.classList.remove('remix-desktop');
            };
        });
    });
})();
