# AUDITORÍA — CV Online (Alan Roy Cuevas)

> Registro cronológico de cambios, aprobaciones y decisiones de arquitectura.  
> Mantenido exclusivamente por `auditor.md`.

---

## 📅 Log de Cambios

### [2026-03-28] — Corrección de paleta de color primario (Violeta)
**Autor:** frontend-dev.md  
**Tipo:** Style  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**  
Se cambió el color primario de `#DCB8FF` a `#A47FFF` (un violeta más profundo y lila). Este cambio se aplicó a todos los tokens de Tailwind y estilos CSS personalizados.

**Archivos modificados:**  
- `project/index.html` (tokens primary)

---

### [2026-03-28] — Cambio de branding: "CUEVAS" → "ROY"
**Autor:** frontend-dev.md  
**Tipo:** Style  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**  
Se reemplazó el texto del logo "CUEVAS" por "ROY" tanto en el navigation bar como en el footer, manteniendo el estilo minimalista. El nombre completo en el copyright permanece Alan Roy Cuevas.

**Archivos modificados:**  
- `project/index.html` (header nav logo, footer logo)

---

### [2026-03-28] — FASE 4: Implementación de Lógica en JavaScript
**Autor:** backend-dev.md  
**Tipo:** Feature  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**  
Implementación de:
1.  **EmailJS**: SDK cargado vía CDN y listo para integración final.
2.  **Form Validation**: Validación visual en tiempo real (borde rojo `#ff4d4d` y error labels).
3.  **Toasts**: Sistema de notificaciones emergentes (`#toast`).
4.  **Language Toggle**: Objeto `i18n` para cambiar todo el contenido entre ES/EN.
5.  **Dark Mode**: Funcionalidad con persistencia en `localStorage`.

**Archivos modificados:**  
- `project/index.html` (Sección `<script>` y bloque `<style>`)

---

### [2026-03-28] — FASE 5: QA & Testing Visual
**Autor:** tester.md  
**Tipo:** Test  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**  
Verificación completa de 8 puntos críticos (Hero, Dark Mode, Multilenguaje, Scroll Reveal, Validación Form, Envío Exitoso, CV Download Toast y Footer). Todos los tests pasaron (8/8).

**Archivos modificados:**  
- Ninguno. Ver capturas de pantalla en el historial de sesión.

---

### [2026-03-29] — FASE 6 (Post-Deploy): Refactorización y Fixes Visuales
**Autor:** auditor.md  
**Tipo:** Fix / Refactor  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**  
1. **Fix visual:** Se corrigió un bug en el padding del `#tech` cerrando correctamente la etiqueta `<section>`.
2. **Translation Fix:** Se expandió masivamente el scope del objeto `i18n` para traducir toda la sección `#projects` (títulos, descripciones y badges).
3. **Refactor:** Extracción completa de estilos locales a `assets/css/style.css` y lógica JavaScript a `assets/js/main.js` para limpiar el entry point.
4. **Git Wipe:** Limpieza total del historial en GitHub a un solo commit y actualización de GitHub Pages finalizada.
5. **UI Focus Fix:** Se eliminó el "ring" de enfoque por defecto (borde azul) inyectado por el plugin HTML-forms de tailwind en la sección de contacto, forzando la visualización del color primario (violeta) en el borde inferior a través del archivo CSS.
6. **Header Logo Fix:** El enlace frontal "ROY" de la barra de navegación apunta ahora a `#hero` para redirigir suavemente hasta la cima absoluta del documento.
7. **Light/Dark Mode Refactor:** Se reemplazó el tipado fuerte de HEX codes en la configuración de Tailwind por variables dinámicas CSS (ej. `var(--primary)`). Se construyó una paleta temática Light Mode customizada, basada en recomendaciones de calma, confianza y tonos pasteles grises/blancos cálidos, evitando encandilamiento. El tema claro ahora alterna limpiamente al presionar el ícono de sol/luna. 
8. **UI Project Cards Hover:** Se eliminó la sombra global con el borde duro (`box-shadow: 0 -3px 0 0`) sobre el `<article>` completo de los proyectos que causaba un manchón de color detrás del texto transparente. Ahora, el efecto hover está localizado exclusivamente en la **imagen principal (`.project-placeholder`)**, la cual recibe un escalado sutil (`scale(1.02)`), elevación (`translateY(-4px)`) y un borde+glow dinámico. La visual es ahora sumamente clean y profesional.
9. **UI Timeline Pulse Fix:** El anillo exterior del nodo "Presente" en Experiencia tenía un color "fantasma" sin relación al diseño. Ocurría porque Tailwind no lograba extraer la opacidad del color al transformarlo en Variable CSS (`ring-primary/20`). Lo reemplacé reescribiendo la clase base en `style.css` usando `color-mix(in srgb, var(--primary) 20%, transparent)` de forma nativa. Ahora es 100% fiel al morado/violeta en uso.
10. **Mobile Nav Scroll Fix:** Se solucionó el "glitch" que ocurría en móvil donde la barra de navegación `<nav>` se subía a medias (y quedaba "cortada" o saltando) al hacer *scroll*. Se debía a un bug conocido de Chrome/iOS Safari al combinar `backdrop-filter` con posicionamiento fijo y la clase `transition-all`. Se aplicó `transform-gpu` (forzar aceleración por hardware con `translate3d(0,0,0)`) y se limitó la transición explícitamente a sombras y fondos (`transition-[box-shadow,background-color]`).
11. **Mobile UI - Expand More Icon:** El ícono animado `expand_more` en la sección Hero no se centraba correctamente en móviles. Se solucionó moviendo la clase `animate-bounce` directamente al `span` interno para evitar conflictos de sobreescritura con la propiedad `transform` (`-translate-x-1/2`) en el contenedor posicionado absoluto.
12. **Mobile UI - Toasts Centering:** Las notificaciones (Toasts) aparecían desalineadas/pegadas a la derecha en pantallas pequeñas. Se agregó un *media query* en el archivo principal CSS (`max-width: 768px`) para centrarlas estrictamente asignando `left: 50%` y ajustando la transformación mediante `translate(-50%, ...)`.
13. **Toasts Multi-Language Fix:** Se reportaba que los mensajes de eventos ("Tema claro activado", "Mensaje enviado", etc.) no se traducían en vivo si estabas interactuando con la vista o no utilizaban la clave de diccionario correcta al accionar el traductor. Se reestructuró la función `applyLang()` en `main.js` para interceptar notificaciones flotantes abiertas en tiempo real y convertirlas de forma limpia, y se validó el correcto funcionamiento de `showToast()` alimentado por llaves del diccionario `i18n`.
11. **Mobile UI Polishing & Toasts i18n:** El ícono `expand_more` no se centraba en móviles porque la clase `animate-bounce` reescribía su transform X local; se movió a una etiqueta `span` anidada. Los Toasts de notificación ahora se centran automáticamente al 50% de la pantalla en dispositivos chicos usando Media Queries (`max-width: 768px`). Además, se modificó la API de `showToast()` para que intercepte variables del objeto `i18n` (en tiempo de ejecución), garantizando que todos los *toasts* aparezcan traducidos al instante si cambias entre EN/ES.

**Archivos modificados:**  
- `index.html`
- `assets/js/main.js`
- `assets/css/style.css`
- Repositorio Git limpio

---

### [2026-03-29] — Sesión de Features: Carrusel, Interactividad y Pulido Visual
**Autor:** auditor.md  
**Tipo:** feat / style / fix  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**

1. **i18n — Traducción de comentarios:** Se tradujeron al español todos los comentarios del código en `index.html`, `style.css` y `main.js` (bloques `//`, `<!-- -->` y `/* */`).

2. **Carrusel LocalPDF Hub:** Se reemplazó el placeholder estático del proyecto LocalPDF Hub por un carrusel de imágenes reales (`assets/img/LocalPDF_Hub/1–5.png`) con:
   - Navegación por botones `‹` / `›` (aparecen al hacer hover)
   - Indicadores tipo dot (clickeables)
   - Avance automático cada 4 segundos
   - Soporte táctil / swipe (umbral 40px)
   - Soporte de teclado (`←` / `→`)
   - Resolución óptima recomendada: **1280×720** (el contenedor max ~864px)

3. **Efecto hover carrusel:** Se aplicó el mismo efecto `scale(1.02) + translateY(-4px) + borde primario + glow` del placeholder de Turnero al `#localpdf-carousel` vía CSS.

4. **Botón "Ver Más Proyectos":** Se agregó un botón ghost centrado debajo de los proyectos con ícono `arrow_forward` que muestra un toast "Próximamente más proyectos" (bilingüe). Label traducible vía `applyLang()`.

5. **Botón "Ver Demo" (Turnero):** Convertido de `<a href="#">` a `<button>` para evitar navegación. Al hacer clic muestra toast "Demo de Turnero próximamente" (bilingüe). Sin scroll ni navegación.

6. **Dots del carrusel — Refinamiento visual:** Se refactorizaron los indicadores del carrusel de clases Tailwind sueltas a una clase CSS propia `carousel-dot` / `carousel-dot.dot-active`. Los dots inactivos ahora muestran un **círculo transparente con borde sutil** en `--on-surface-variant` (45% opacidad). El dot activo se rellena con `--primary`. Toda la lógica JS simplificada a un solo `classList.toggle('dot-active', active)`.

**Archivos modificados:**
- `index.html`
- `assets/js/main.js`
- `assets/css/style.css`
- `assets/img/LocalPDF_Hub/` ← nueva carpeta con 5 capturas

---

### [2026-03-29] — Integración Final de EmailJS y Pulido de Notificaciones
**Autor:** auditor.md / backend-dev.md  
**Tipo:** feat / integration / fix  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**
1. **EmailJS Real:** Se reemplazó la simulación por la integración real del servicio con los IDs `service_371pzcc` y `template_ag99jpi`. Los IDs fueron ofuscados en `main.js` usando Base64 para proteger la privacidad en el repositorio público.
2. **Sincronización de Campos:** Se armonizaron los atributos `name` en `index.html` (`contact-name`, `contact-email`, `contact-message`) con las variables de la plantilla en el dashboard de EmailJS para asegurar la correcta recepción de datos.
3. **Rediseño de Email:** Se creó un diseño de correo minimalista y profesional (estilo SaaS) con fondo blanco, bordes finos y acentos en el color púrpura oficial, optimizando la legibilidad en clientes como Gmail/Outlook.
4. **Git Sync:** Preparación para despliegue final en GitHub Pages tras verificar el flujo completo de contacto.

**Archivos modificados:**
- `index.html` (name attributes)
- `assets/js/main.js` (EmailJS logic & obfuscated IDs)
- `auditoria.md` (este log)

---

### [2026-03-29] — Implementación de Open Graph (LinkedIn Preview)
**Autor:** auditor.md  
**Tipo:** Feat / SEO  
**Estado:** ✅ Aprobado  
**Solicitado por:** usuario

**Descripción:**
1. **Generación de Imagen:** Se diseñó y generó una miniatura profesional (`assets/img/og-image.png`) con estética minimalista, fondo oscuro y acentos violetas para representar el perfil de Alan Roy Cuevas.
2. **Configuración Meta Tags:** Se integraron etiquetas `og:title`, `og:description`, `og:image`, `og:url` y `og:type` en `index.html`.
3. **Twitter Cards:** Se añadieron tags de Twitter con `summary_large_image` para maximizar el impacto visual en feeds sociales.

**Archivos modificados:**
- `index.html` (meta tags)
- `assets/img/og-image.png` (nueva imagen)
- `auditoria.md` (este log)

---

## 📊 Resumen de Estado

| Fase | Estado | Responsable |
|------|--------|-------------|
| 1 - HTML base | ✅ | `frontend-dev` |
| 2 - UI Upgrade | ✅ | `frontend-dev` |
| 3 - Animaciones | ✅ | `frontend-dev` |
| 4 - Lógica JS | ✅ | `backend-dev` |
| 5 - Testing | ✅ | `tester` |
| 6 - Deploy | ✅ | `auditor` |

