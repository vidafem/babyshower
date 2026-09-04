# 💌 Invitación Digital Interactiva & Responsive

Una web de invitación digital prémium, 100% adaptable a todos los dispositivos móviles, tabletas y ordenadores, con animaciones fluidas de scroll (roll-up), apertura interactiva tipo sobre con sello de cera, confirmación por WhatsApp (RSVP), contador regresivo y soporte para miniatura en WhatsApp (Open Graph).

---

## 📁 Estructura del Proyecto y Carpetas de Recursos

```text
shower/
├── index.html                  # Estructura de la web, textos y metaetiquetas para WhatsApp
├── vercel.json                 # Configuración de despliegue y caché para Vercel
├── css/
│   ├── style.css               # Sistema de diseño, colores, fuentes, glassmorphism y responsive
│   └── animations.css          # Animaciones (roll-up en 3D, destellos dorados, transiciones)
├── js/
│   ├── main.js                 # Datos del evento (fecha, nombres, WhatsApp, banco, calendario)
│   └── animations.js           # Efectos de apertura de sobre, scroll observer y partículas
└── assets/
    ├── fonts/                  # Coloca aquí tus fuentes (.woff2, .ttf, .otf)
    ├── images/                 # Tus fotos y elementos PNG transparentes (sellos, flores, etc.)
    ├── backgrounds/            # Fondos de pantalla, texturas de lino, acuarelas
    ├── icons/                  # Iconos SVG para vestimenta, mapas, calendario
    ├── audio/                  # Coloca aquí tu música 'ambient.mp3'
    └── og/                     # Imagen 'preview.jpg' (1200x630px) para vista previa en WhatsApp
```

---

## ✏️ ¿Cómo Personalizar tu Invitación?

### 1. Cambiar Nombres, Fecha, WhatsApp y Banco
Abre el archivo [js/main.js](file:///c:/Users/ADMIN/Downloads/shower/js/main.js) y edita los valores en la sección superior `EVENT_CONFIG`:

```javascript
const EVENT_CONFIG = {
  eventTitle: "Baby Shower de Lilith",
  hosts: "Camila & Mateo",
  targetDate: "2026-10-24T16:00:00", // Año-Mes-DíaTHora:Minuto:Segundo
  dateFormatted: "Sábado 24 de Octubre, 2026",
  timeFormatted: "4:00 PM",
  locationName: "Jardín de Eventos Las Terrazas",
  locationAddress: "Av. de las Palmeras #450, Col. Jardines",
  googleMapsUrl: "https://maps.google.com/?q=Tu+Lugar",
  wazeUrl: "https://waze.com/ul?q=Tu+Lugar",
  whatsappPhone: "5215512345678",    // Tu número con código de país (sin el signo +)
  bankName: "BBVA México",
  bankBeneficiary: "Camila Valenzuela",
  bankClabe: "012180015487965412"    // Número de cuenta o CLABE para copiar en 1 clic
};
```

### 2. Cambiar Fotos y Elementos
- **Foto Principal del Hero**: Reemplaza el archivo [assets/images/portrait.jpg](file:///c:/Users/ADMIN/Downloads/shower/assets/images/portrait.jpg) con tu fotografía favorita.
- **Fondo de Pantalla y Nubes Parallax**: El fondo utiliza [assets/backgrounds/bg_clean.jpg](file:///c:/Users/ADMIN/Downloads/shower/assets/backgrounds/bg_clean.jpg) como textura base y las nubes en capas transparentes independientes [assets/backgrounds/clouds_top.png](file:///c:/Users/ADMIN/Downloads/shower/assets/backgrounds/clouds_top.png) y [assets/backgrounds/clouds_bottom.png](file:///c:/Users/ADMIN/Downloads/shower/assets/backgrounds/clouds_bottom.png).

### 3. Música de Fondo
Coloca tu melodía favorita en formato `.mp3` dentro de `assets/audio/` con el nombre `ambient.mp3`. La invitación incluye un botón flotante en la esquina inferior derecha para pausar y reanudar la música.

---

## 📱 ¿Cómo Funciona la Miniatura de WhatsApp (Open Graph Preview)?

En [index.html](file:///c:/Users/ADMIN/Downloads/shower/index.html) se encuentran las metaetiquetas que leen WhatsApp, Facebook, iMessage y Twitter:

```html
<meta property="og:title" content="¡Estás Invitado! • Baby Shower de Lilith 👶✨">
<meta property="og:description" content="Acompáñanos a celebrar la llegada de nuestro mayor tesoro. Toca aquí para ver todos los detalles.">
<meta property="og:image" content="https://tu-proyecto.vercel.app/assets/og/preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

> [!IMPORTANT]
> WhatsApp exige que la imagen mida idealmente **1200 x 630 píxeles** (o 600 x 315 px) y pese **menos de 300 KB**.
> Ya hemos dejado configurada una imagen de prueba optimizada en [assets/og/preview.jpg](file:///c:/Users/ADMIN/Downloads/shower/assets/og/preview.jpg).
> Cuando tengas la URL de Vercel (por ejemplo `https://invitacion-lilith.vercel.app`), cambia el valor de `content` de `og:image` por esa URL completa con `https://`.

---

## 🚀 Despliegue en GitHub y Vercel (Cuando estés listo)

1. **Subir a GitHub**:
   - Inicializa tu repositorio: `git init`
   - Agrega los archivos: `git add .`
   - Realiza tu commit: `git commit -m "Invitación lista"`
   - Conéctalo con tu repositorio en GitHub y haz `git push`.

2. **Desplegar en Vercel**:
   - Entra en [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en **"Add New Project"** e importa este repositorio.
   - En *Framework Preset*, selecciona **Other** (es un proyecto estático HTML/CSS/JS puro ultrarrápido).
   - Haz clic en **"Deploy"**. En 10 segundos tendrás tu enlace público HTTPS listo para compartir con tus invitados.
