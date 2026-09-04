/**
 * LÓGICA PRINCIPAL DE LA INVITACIÓN
 * Configuración fácil de editar para el usuario (Fecha, Nombres, WhatsApp, Banco, Calendario)
 */

/* ==========================================================================
   1. DATOS EDITABLES DEL EVENTO (¡Modifica estos valores a tu gusto!)
   ========================================================================== */
const EVENT_CONFIG = {
  // Nombres de los festejados o anfitriones
  eventTitle: "Baby Shower de Lilith",
  hosts: "Camila & Mateo",
  
  // Fecha y hora del evento (Formato AAAA-MM-DDTHH:MM:SS)
  // Ejemplo: 25 de Octubre de 2026 a las 16:00
  targetDate: "2026-10-24T16:00:00",
  dateFormatted: "Sábado 24 de Octubre, 2026",
  timeFormatted: "4:00 PM",

  // Ubicación
  locationName: "Jardín de Eventos Las Terrazas",
  locationAddress: "Av. de las Palmeras #450, Col. Jardines, Ciudad",
  // Enlace directo a Google Maps
  googleMapsUrl: "https://maps.google.com/?q=Jardin+de+Eventos+Las+Terrazas",
  // Enlace a Waze
  wazeUrl: "https://waze.com/ul?q=Jardin+de+Eventos+Las+Terrazas",

  // Datos para Confirmación por WhatsApp (RSVP)
  // Coloca el número de teléfono con código de país sin el signo '+' (ej. 521XXXXXXXXXX para México)
  whatsappPhone: "5215512345678",

  // Datos Bancarios / Mesa de Regalos
  bankName: "BBVA México",
  bankBeneficiary: "Camila Valenzuela",
  bankClabe: "012180015487965412"
};

/* ==========================================================================
   2. INICIALIZACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalendarButton();
  initCopyClabe();
  initRsvpForm();
  initAudioPlayer();
});

/* ==========================================================================
   3. CONTADOR REGRESIVO DINÁMICO
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const eventTime = new Date(EVENT_CONFIG.targetDate).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = eventTime - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    setWithAnimation(daysEl, pad(days));
    setWithAnimation(hoursEl, pad(hours));
    setWithAnimation(minutesEl, pad(minutes));
    setWithAnimation(secondsEl, pad(seconds));
  }

  function setWithAnimation(element, newValue) {
    if (element.textContent !== newValue) {
      element.textContent = newValue;
      element.classList.remove('counter-tick');
      void element.offsetWidth; // Forzar reflow para reiniciar animación
      element.classList.add('counter-tick');
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. AGREGAR A GOOGLE CALENDAR
   ========================================================================== */
function initCalendarButton() {
  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const startIso = new Date(EVENT_CONFIG.targetDate).toISOString().replace(/-|:|\.\d\d\d/g, '');
    // Asumimos duración aproximada de 5 horas
    const endTimestamp = new Date(EVENT_CONFIG.targetDate).getTime() + (5 * 60 * 60 * 1000);
    const endIso = new Date(endTimestamp).toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(EVENT_CONFIG.eventTitle);
    const details = encodeURIComponent(`¡Celebración especial de ${EVENT_CONFIG.hosts}! Esperamos contar con tu presencia.`);
    const location = encodeURIComponent(`${EVENT_CONFIG.locationName}, ${EVENT_CONFIG.locationAddress}`);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;

    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ==========================================================================
   5. COPIAR CLABE / CUENTA BANCARIA
   ========================================================================== */
function initCopyClabe() {
  const btn = document.getElementById('btn-copy-clabe');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const textToCopy = EVENT_CONFIG.bankClabe;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback para navegadores antiguos
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      showToast('¡Número de cuenta / CLABE copiado al portapapeles!');
    } catch (err) {
      showToast('No se pudo copiar automáticamente. Puedes seleccionarlo manualmente.');
    }
  });
}

/* ==========================================================================
   6. CONFIRMACIÓN POR WHATSAPP (RSVP)
   ========================================================================== */
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('rsvp-name');
    const guestsSelect = document.getElementById('rsvp-guests');
    const attendanceSelect = document.getElementById('rsvp-attendance');
    const messageInput = document.getElementById('rsvp-note');

    const name = nameInput ? nameInput.value.trim() : '';
    const guests = guestsSelect ? guestsSelect.value : '1';
    const attendance = attendanceSelect ? attendanceSelect.value : 'si';
    const note = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      showToast('Por favor escribe tu nombre completo.');
      nameInput.focus();
      return;
    }

    let msg = '';
    if (attendance === 'si') {
      msg = `¡Hola ${EVENT_CONFIG.hosts}! 👋✨\n\nSoy *${name}* y confirmo con mucha alegría mi asistencia al *${EVENT_CONFIG.eventTitle}*.\n`;
      msg += `👥 *Total de asistentes:* ${guests} persona(s)\n`;
      if (note) {
        msg += `💌 *Mensaje/Deseos:* "${note}"\n`;
      }
      msg += `\n¡Nos vemos pronto para celebrar juntos! 🎉`;
    } else {
      msg = `¡Hola ${EVENT_CONFIG.hosts}! 👋\n\nSoy *${name}*. Muchísimas gracias por la invitación al *${EVENT_CONFIG.eventTitle}*, pero lamentablemente no podré asistir esta vez.\n`;
      if (note) {
        msg += `💌 *Mensaje:* "${note}"\n`;
      }
      msg += `\n¡Les mando un fuerte abrazo y les deseo lo mejor en este gran día! 💖`;
    }

    const whatsappUrl = `https://wa.me/${EVENT_CONFIG.whatsappPhone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ==========================================================================
   7. CONTROL DE MÚSICA AMBIENTAL
   ========================================================================== */
function initAudioPlayer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  const audio = new Audio();
  audio.src = 'assets/audio/ambient.mp3';
  audio.loop = true;
  audio.volume = 0.5;

  let isPlaying = false;
  let hasLocalAudioFile = true;

  audio.addEventListener('error', () => {
    // Si no hay archivo mp3 en assets/audio/ambient.mp3, no muestra alertas feas
    hasLocalAudioFile = false;
  });

  function toggleAudio() {
    if (!hasLocalAudioFile) {
      showToast('Coloca tu música en assets/audio/ambient.mp3 para escucharla aquí.');
      return;
    }

    if (isPlaying) {
      audio.pause();
      audioBtn.classList.remove('playing');
      audioBtn.setAttribute('title', 'Reproducir música');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        audioBtn.classList.add('playing');
        audioBtn.setAttribute('title', 'Pausar música');
        isPlaying = true;
      }).catch(() => {
        showToast('Toca la pantalla para permitir reproducir música.');
      });
    }
  }

  window.startAmbientMusic = function() {
    if (hasLocalAudioFile && !isPlaying) {
      audio.play().then(() => {
        audioBtn.classList.add('playing');
        isPlaying = true;
      }).catch(() => {
        // Política de autoplay del navegador
      });
    }
  };

  audioBtn.addEventListener('click', toggleAudio);
}

/* ==========================================================================
   8. MENSAJES TOAST / NOTIFICACIONES FLOTANTES
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
