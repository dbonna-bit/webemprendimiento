# Albany Giraldo Decor — Landing Page

Sitio web estático, responsive, seguro y listo para publicar.
**No requiere instalación**: solo abre `index.html` o súbelo a tu hosting.

---

## 📁 Estructura del proyecto

```
albany-giraldo-decor/
├── index.html          ← Página principal (todas las secciones unificadas)
├── css/
│   └── styles.css      ← Estilos personalizados
├── js/
│   └── main.js         ← Lógica: menú, formulario, scroll, animaciones, rate-limit
├── img/
│   ├── favicon/
│   │   └── favicon.svg ← Favicon "AG" (genera apple-touch-icon.png si lo necesitas)
│   └── projects/       ← Carpeta sugerida para fotos reales de proyectos
├── vercel.json         ← Headers de seguridad para Vercel
├── _headers            ← Headers de seguridad para Netlify
└── README.md           ← Este archivo
```

---

## ✅ Checklist de personalización antes de publicar

Busca en el código los comentarios `<!-- CAMBIAR: ... -->` y `// CAMBIAR: ...` y reemplaza cada uno. Aquí está la lista completa:

### 1. Formspree (CRÍTICO — el formulario no funcionará sin esto)
- **Archivo:** `js/main.js`
- **Línea ~10:** `const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xABCDEFG';`
- **Cómo:**
  1. Ve a [https://formspree.io](https://formspree.io) y crea una cuenta (plan gratuito alcanza para empezar).
  2. Crea un nuevo formulario y copia el endpoint que te da (algo como `https://formspree.io/f/abcdwxyz`).
  3. Reemplaza `xABCDEFG` con tu ID real.
  4. En el panel de Formspree, configura el email de destino (donde quieres recibir los mensajes).

### 2. WhatsApp (3 lugares)
- **`index.html`** — sección CTA (botón "Escribir por WhatsApp")
- **`index.html`** — botón flotante (`#whatsapp-btn`)
- Reemplaza `573000000000` por el número real del cliente con formato internacional sin `+` ni espacios. Ejemplo: `573201234567` para `+57 320 123 4567`.

### 3. Datos de contacto (`index.html`)
- **Teléfono:** `+57 300 000 0000` (también en el `tel:` y en la política de privacidad)
- **Email:** `info@albanygiraldodecor.com` (también en el `mailto:` y en la política)
- **Dirección:** "Bogotá, Colombia" → si tienen una dirección física específica
- **JSON-LD** (al inicio del `<head>`): actualiza `telephone` y dirección

### 4. Dominio (cuando lo compren)
- **`index.html`** — todas las URLs que dicen `https://albanygiraldodecor.com/`:
  - `<link rel="canonical">`
  - `og:url`
  - `og:image`
  - JSON-LD (`url`)

### 5. Imagen Open Graph (para compartir en redes)
- Crear una imagen `1200×630 px` y subirla a `img/og-image.jpg`.
- Actualizar los `meta og:image` y `twitter:image`.

### 6. Logo (opcional)
- En el `<nav>` y en el footer está el texto "Albany Giraldo Decor" como logo.
- Si tienes un logo PNG/SVG, agrégalo en `img/logo.png` y reemplaza el texto por:
  ```html
  <img src="img/logo.png" alt="Albany Giraldo Decor" class="h-10">
  ```

### 7. Redes sociales
- **Instagram** ya está real: `https://www.instagram.com/albanygiraldo.decor/`
- **Facebook** y **Pinterest** están como `#`. Reemplaza con los links reales (3 lugares en `index.html`: contacto, footer).

### 8. Fotos de proyectos (img/projects/)
- Las imágenes actuales son de Stitch (URLs de Google). Cuando tengas las fotos reales:
  1. Súbelas a `img/projects/` (sugerido: `apt-rosales.jpg`, `cocina.jpg`, `oficinas.jpg`, `bano.jpg`, `dormitorio.jpg`, `restaurante.jpg`).
  2. Reemplaza los `src` en `index.html` por las rutas locales.
- Recomendación: imágenes `1200×1500 px` (proporción 4:5) optimizadas en formato `.webp` o `.jpg` (~150 KB).

### 9. Foto de la fundadora
- Sección "Sobre Nosotros": reemplaza la imagen por una foto profesional de Albany.
- Tamaño sugerido: `900×1200 px` (proporción 3:4).

### 10. Foto del hero
- Imagen de fondo en el `<header id="inicio">`. Cambia a `img/hero.jpg` (sugerido: `2400×1600 px`).

### 11. Favicon iOS (opcional)
- El SVG en `img/favicon/favicon.svg` funciona en todos los navegadores modernos.
- Para iOS antiguo, genera `apple-touch-icon.png` (180×180 px) desde el SVG con cualquier herramienta online.

---

## 🚀 Publicar el sitio

### Opción A — Vercel (recomendado, gratuito y rápido)

1. Crea cuenta en [vercel.com](https://vercel.com).
2. Instala la CLI: `npm i -g vercel` (o conecta tu repo de GitHub).
3. Desde la carpeta del proyecto: `vercel`. Sigue las indicaciones.
4. Para producción: `vercel --prod`.
5. Los headers de seguridad (`vercel.json`) se aplican automáticamente.

### Opción B — Netlify (también gratuito)

1. Crea cuenta en [netlify.com](https://netlify.com).
2. Arrastra la carpeta del proyecto al dashboard ("Drag & drop your site folder").
3. Listo. Los headers (`_headers`) se aplican automáticamente.

### Opción C — GoDaddy (hosting tradicional)

1. Compra hosting + dominio en GoDaddy.
2. Entra al **cPanel** → **File Manager** → carpeta `public_html/`.
3. Sube **todos** los archivos y carpetas del proyecto (puedes comprimir en ZIP y descomprimir allí).
4. Verifica que `index.html` quede en la raíz de `public_html/`.
5. **Importante:** `vercel.json` y `_headers` NO funcionan en GoDaddy (esos son de Vercel/Netlify). Si quieres aplicar los headers de seguridad en GoDaddy, crea un archivo `.htaccess` en `public_html/` con este contenido:

   ```apache
   <IfModule mod_headers.c>
     Header set X-Frame-Options "DENY"
     Header set X-Content-Type-Options "nosniff"
     Header set Referrer-Policy "strict-origin-when-cross-origin"
     Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
     Header set X-XSS-Protection "1; mode=block"
     Header set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
   </IfModule>
   ```

6. Configura tu dominio en GoDaddy apuntando al hosting (suele ser automático).
7. Activa **HTTPS gratuito** desde el panel de GoDaddy (Let's Encrypt).

---

## 📧 Cambiar el email destino del formulario

El email donde llegan los mensajes se configura **dentro de Formspree**, no en el código.

1. Entra a tu panel en [formspree.io](https://formspree.io).
2. Selecciona tu formulario → **Settings** → **Notification email**.
3. Cambia o agrega los destinatarios.
4. Si quieres validar emails con dominio personalizado, configura el dominio en Formspree.

---

## 📊 Agregar Google Analytics (GA4)

1. Ve a [analytics.google.com](https://analytics.google.com) y crea una propiedad GA4.
2. Copia tu **ID de medición** (formato `G-XXXXXXXXXX`).
3. Pega el siguiente código justo **antes del `</head>`** en `index.html`:

   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

4. Reemplaza `G-XXXXXXXXXX` por tu ID real (en los 2 lugares).
5. Publica de nuevo y verifica en Google Analytics → **Tiempo real**.

---

## 🔒 Seguridad implementada

- **Validación frontend** del formulario (campos requeridos, formato email, longitud mensaje).
- **Sanitización XSS** de todos los inputs antes de enviar (`sanitizeInput()` en `main.js`).
- **Honeypot anti-spam** (`name="_gotcha"`).
- **Rate-limiting** en frontend: bloquea el botón 60s tras envío exitoso, con persistencia en `sessionStorage`.
- **Headers de seguridad** para Vercel (`vercel.json`) y Netlify (`_headers`).
- **`rel="noopener noreferrer"`** en todos los links con `target="_blank"`.
- **Política de privacidad** modal según Ley 1581/2012 y Decreto 1377/2013 de Colombia.
- **HTTPS forzado** vía `Strict-Transport-Security` (automático en Vercel/Netlify).

---

## 🎨 Personalización visual rápida

Toda la paleta vive en `css/styles.css` (variables CSS al inicio):

```css
:root {
    --ink: #1A1A1A;       /* Texto principal */
    --charcoal: #2C2C2C;  /* Headers, fondos oscuros */
    --gold: #B8956A;      /* Acento dorado */
    --bronze: #8B7355;    /* Separadores */
    --cream: #F5F0EB;     /* Fondo beige */
    --mute: #6B6B6B;      /* Texto secundario */
}
```

Cámbialas y todo el sitio actualiza al instante.

---

## ❓ Soporte

¿Tienes dudas sobre cómo personalizar? Contacta al desarrollador o consulta los comentarios `<!-- CAMBIAR: ... -->` directamente en el código.

**Versión:** Demo 1.0 — 2026
