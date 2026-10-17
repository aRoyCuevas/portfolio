// --- Theme Init (before first paint) ---
// Saved choice wins; otherwise follow the system preference
try {
    const saved = localStorage.getItem('theme');
    const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefersLight)) document.documentElement.classList.remove('dark');
} catch (e) { /* storage unavailable */ }

// --- Hero Hold (avoids a flash before GSAP takes over) ---
if (!matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]motion=full\b/.test(location.search)) {
    document.documentElement.classList.add('remix-loading');
    setTimeout(() => document.documentElement.classList.remove('remix-loading'), 3000);
}
