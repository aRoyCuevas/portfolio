// Tailwind build: npm run build:css (output: assets/css/tailwind.css)
const plugin = (name) => require(process.env.TW_MODULES ? `${process.env.TW_MODULES}/${name}` : name);
const base = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "white": "var(--core-white-text)",
                        "secondary": "var(--secondary)",
                        "on-surface-variant": "var(--on-surface-variant)",
                        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
                        "on-surface": "var(--on-surface)",
                        "surface-container-lowest": "var(--surface-container-lowest)",
                        "on-secondary": "var(--on-secondary)",
                        "primary-fixed": "var(--primary-fixed)",
                        "on-error": "var(--on-error)",
                        "tertiary-container": "var(--tertiary-container)",
                        "surface-container": "var(--surface-container)",
                        "tertiary": "var(--tertiary)",
                        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
                        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
                        "tertiary-fixed": "var(--tertiary-fixed)",
                        "surface-container-low": "var(--surface-container-low)",
                        "surface-container-highest": "var(--surface-container-highest)",
                        "on-background": "var(--on-background)",
                        "on-primary-container": "var(--on-primary-container)",
                        "inverse-primary": "var(--inverse-primary)",
                        "inverse-surface": "var(--inverse-surface)",
                        "inverse-on-surface": "var(--inverse-on-surface)",
                        "primary-container": "var(--primary-container)",
                        "on-secondary-container": "var(--on-secondary-container)",
                        "on-error-container": "var(--on-error-container)",
                        "surface-variant": "var(--surface-variant)",
                        "on-primary": "var(--on-primary)",
                        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
                        "primary": "var(--primary)",
                        "secondary-fixed": "var(--secondary-fixed)",
                        "surface-bright": "var(--surface-bright)",
                        "secondary-container": "var(--secondary-container)",
                        "outline-variant": "var(--outline-variant)",
                        "error-container": "var(--error-container)",
                        "surface-container-high": "var(--surface-container-high)",
                        "on-primary-fixed": "var(--on-primary-fixed)",
                        "on-secondary-fixed": "var(--on-secondary-fixed)",
                        "error": "var(--error)",
                        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
                        "surface-tint": "var(--surface-tint)",
                        "outline": "var(--outline)",
                        "surface": "var(--surface)",
                        "on-tertiary-container": "var(--on-tertiary-container)",
                        "background": "var(--background)",
                        "surface-dim": "var(--surface-dim)",
                        "primary-fixed-dim": "var(--primary-fixed-dim)",
                        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
                        "on-tertiary": "var(--on-tertiary)"
                    },
                    fontFamily: {
                        "headline": ["Space Grotesk"],
                        "body": ["Manrope"],
                        "label": ["Space Grotesk"]
                    },
                    borderRadius: { "DEFAULT": "0.125rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                },
            },
        };
// Colors are CSS variables: without this, modifiers like bg-surface/70 generate nothing
const withAlpha = (value) => ({ opacityValue }) => (opacityValue === undefined ? value : `color-mix(in srgb, ${value} calc(${opacityValue} * 100%), transparent)`);
for (const [name, value] of Object.entries(base.theme.extend.colors)) base.theme.extend.colors[name] = withAlpha(value);
// Generic fallback so a failed web font never drops to Times
for (const [name, stack] of Object.entries(base.theme.extend.fontFamily || {})) base.theme.extend.fontFamily[name] = [...stack, 'sans-serif'];
module.exports = {
    content: ['./index.html', './assets/js/main.js', './assets/js/remix.js'],
    ...base,
    plugins: [plugin('@tailwindcss/forms'), plugin('@tailwindcss/container-queries')],
};
