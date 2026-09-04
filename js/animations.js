/**
 * SISTEMA DE ANIMACIONES, EFECTOS PARALLAX Y MOTOR DE SCROLL ULTRA FLUIDO
 * Gestiona: Apertura de Sobre, Lluvia de Estrellas, Parallax de Nubes,
 * Lazos en Esquinas, Desvanecimiento en Humo y Scroll Bidireccional de 120 FPS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initEnvelopeOpening();
  initUnifiedScrollEngine();
  initScrollCoordsHUD();
  createBackgroundSparkles();
});

/* ==========================================================================
   1. INTERSECTION OBSERVER PARA ANIMACIONES BIDIRECCIONALES (SCROLL UP Y DOWN)
   ========================================================================== */
function initScrollAnimations() {
  // Excluir elementos del hero para que se animen coordinadamente al abrir el sobre
  const animatedElements = Array.from(document.querySelectorAll(
    '.roll-up, .fade-in-up, .zoom-in, .reveal-left, .reveal-right, .reveal-down'
  )).filter(el => !el.closest('.hero-section'));

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.classList.add('is-visible'));
    revealHeroElements();
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '10px 0px -30px 0px',
    threshold: 0.08
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Al salir del campo de visión (tanto hacia arriba como hacia abajo),
        // se resetea para que vuelva a realizar su animación al volver a pasar por ella
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    scrollObserver.observe(element);
  });
}

/* ==========================================================================
   2. EXPERIENCIA INTERACTIVA DE APERTURA DE SOBRE CON IMAGEN
   ========================================================================== */
function initEnvelopeOpening() {
  const envelopeTrigger = document.getElementById('envelope-trigger');
  const envelopeImg = document.getElementById('envelope-img');
  const envelopeBtn = document.getElementById('envelope-btn');
  const envelopeOverlay = document.getElementById('envelope-overlay');

  if (!envelopeTrigger || !envelopeOverlay) {
    revealHeroElements();
    return;
  }

  const handleOpen = (e) => {
    if (e) e.stopPropagation();
    if (envelopeTrigger.classList.contains('is-bouncing-down')) return;

    // 1. Sonido sutil y elegante de apertura sintetizado nativamente
    playChimeSound();

    // 2. Animación del sobre (rebote y bajada rápida)
    envelopeTrigger.classList.add('is-bouncing-down');

    // 3. La invitación ingresa de inmediato mientras el sobre desciende
    setTimeout(() => {
      envelopeOverlay.classList.add('revealing');
      document.body.classList.remove('envelope-locked');
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';

      // Las tarjetas de la invitación entran con su efecto roll-up ágil
      revealHeroElements();

      // Recalcular posiciones del layout una vez liberada la altura del documento
      if (typeof window.measureLayoutEngine === 'function') {
        window.measureLayoutEngine();
      }

      // Iniciar música ambiental si está disponible
      if (typeof window.startAmbientMusic === 'function') {
        window.startAmbientMusic();
      }
    }, 70);

    // 4. Retirar completamente el overlay y el sobre para liberar toques
    setTimeout(() => {
      envelopeTrigger.style.visibility = 'hidden';
      envelopeOverlay.style.display = 'none';
      envelopeOverlay.style.pointerEvents = 'none';
    }, 650);
  };

  [envelopeTrigger, envelopeImg, envelopeBtn].forEach(element => {
    if (element) {
      element.addEventListener('click', handleOpen);
    }
  });

  envelopeTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  });
}

/* Revelación progresiva y elegante de los elementos del Hero */
function revealHeroElements() {
  const topIllustration = document.getElementById('hero-top-illustration');
  if (topIllustration) {
    topIllustration.classList.add('entering', 'is-visible');
    setTimeout(() => {
      topIllustration.classList.remove('entering');
    }, 850);
  }

  const heroElements = document.querySelectorAll('.hero-section .roll-up, .hero-section .fade-in-up, .hero-section .zoom-in');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, 80 + index * 90);
  });
}

/* ==========================================================================
   3. MOTOR DE SCROLL CENTRALIZADO (ZERO LAYOUT-THRASHING / 120 FPS FLUIDEZ)
   Unifica el fade de b1.webp, lluvia de estrellas, nubes, lazos, humo y HUD
   ========================================================================== */
function initUnifiedScrollEngine() {
  const topIllustration = document.getElementById('hero-top-illustration');
  const progressBar = document.getElementById('scroll-progress');
  const cloudTopWrapper = document.getElementById('cloud-top-wrapper');
  const leftBow = document.getElementById('screen-bow-left');
  const rightBow = document.getElementById('screen-bow-right');
  const locCard = document.getElementById('card-lugar-fecha');
  const photoBox = document.getElementById('hero-photo-box') || document.querySelector('.hero-photo-wrapper');
  const stars = Array.from(document.querySelectorAll('.parallax-star'));
  const hudPanel = document.getElementById('scroll-hud-panel');
  
  // Elementos del HUD
  const valScrollY = document.getElementById('hud-val-scrolly');
  const valScrollPct = document.getElementById('hud-val-scrollpct');
  const valViewport = document.getElementById('hud-val-viewport');
  const valPhoto = document.getElementById('hud-val-photo');
  const valCard = document.getElementById('hud-val-card');
  const valBows = document.getElementById('hud-val-bows');
  const valSmoke = document.getElementById('hud-val-smoke');

  // Asegurar que los lazos NUNCA intercepten toques
  if (leftBow) leftBow.style.pointerEvents = 'none';
  if (rightBow) rightBow.style.pointerEvents = 'none';

  // Cache de métricas del DOM para evitar layout-thrashing durante el scroll
  let cardTopDoc = 0;
  let cardHeight = 0;
  let photoTopDoc = 0;
  let photoHeight = 0;
  let docHeight = 0;
  let winHeight = window.innerHeight;
  let winWidth = window.innerWidth;

  const measureLayout = () => {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (locCard) {
      const cRect = locCard.getBoundingClientRect();
      cardTopDoc = cRect.top + currentScrollY;
      cardHeight = cRect.height;
    }
    if (photoBox) {
      const pRect = photoBox.getBoundingClientRect();
      photoTopDoc = pRect.top + currentScrollY;
      photoHeight = pRect.height;
    }
    docHeight = Math.max(document.documentElement.scrollHeight - winHeight, 1);
  };

  window.measureLayoutEngine = measureLayout;

  // Medición inicial y en redimensionamiento
  measureLayout();
  setTimeout(measureLayout, 300);
  setTimeout(measureLayout, 1000);

  window.addEventListener('resize', () => {
    measureLayout();
    renderScroll(window.pageYOffset || document.documentElement.scrollTop || 0);
  }, { passive: true });

  let isTicking = false;

  const renderScroll = (scrollTop) => {
    // 1. Barra de progreso superior
    if (progressBar) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
    }

    // 2. Ilustración decorativa b1.webp: desvanecimiento suave al bajar y reaparición al regresar
    if (topIllustration && topIllustration.classList.contains('is-visible')) {
      const fadeDistance = 140;
      const ratio = Math.min(Math.max(scrollTop / fadeDistance, 0), 1);
      topIllustration.style.opacity = (1 - ratio).toFixed(3);
      topIllustration.style.transform = `translate3d(0, ${(-ratio * 25).toFixed(1)}px, 0)`;
      topIllustration.style.pointerEvents = ratio >= 0.95 ? 'none' : 'auto';
    }

    // 3. Capa de Estrellas Parallax (star.webp) - Lluvia mágica infinita con movimiento fluido
    if (stars.length > 0) {
      const cycleH = winHeight + 140;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const baseTop = parseFloat(star.dataset.baseTop) || (i * 55);
        const speed = parseFloat(star.dataset.speed) || 0.25;

        // Desplazamiento parallax dinámico continuo según el scroll
        let relY = (baseTop - (scrollTop * speed)) % cycleH;
        if (relY < -70) {
          relY += cycleH;
        }

        // Suave deriva horizontal orgánica celestial
        const swayX = Math.sin((scrollTop * 0.003) + (i * 1.5)) * 8;

        star.style.transform = `translate3d(${swayX.toFixed(1)}px, ${relY.toFixed(1)}px, 0)`;
      }
    }

    // 4. Parallax de nubes transparentes (+8%)
    if (cloudTopWrapper) {
      const shiftClouds = (scrollTop * 0.08).toFixed(1);
      cloudTopWrapper.style.transform = `translate3d(0, ${shiftClouds}px, 0)`;
    }

    // 5. Lazos decorativos en esquinas (l2.webp)
    if (leftBow && rightBow && locCard) {
      const bowWidth = Math.min(Math.max(winWidth * 0.14, 60), 84);
      const cardViewportTop = cardTopDoc - scrollTop;
      const cardViewportBottom = cardViewportTop + cardHeight;
      const cardTopY = cardViewportTop - 20;

      const cardLeft = locCard.offsetLeft || (winWidth - Math.min(winWidth * 0.92, 540)) / 2;
      const cardWidth = locCard.offsetWidth || Math.min(winWidth * 0.92, 540);
      const targetLeftX = cardLeft - 10;
      const targetRightX = cardLeft + cardWidth - bowWidth + 10;

      const appearStart = 200;
      const appearComplete = 580;

      if (scrollTop < appearStart) {
        leftBow.style.opacity = '0';
        rightBow.style.opacity = '0';
        window._hudBowState = 'Ocultos';
      } else if (scrollTop >= appearStart && scrollTop < appearComplete) {
        const progress = (scrollTop - appearStart) / (appearComplete - appearStart);
        const currentOpacity = (progress * 0.70).toFixed(3);
        leftBow.style.opacity = currentOpacity;
        rightBow.style.opacity = currentOpacity;

        const currentScale = (0.85 + 0.40 * progress).toFixed(3);
        const rotLeft = (-10 * progress).toFixed(2);
        const rotRight = (10 * progress).toFixed(2);

        const startXLeft = -bowWidth * 0.4;
        const startXRight = winWidth - bowWidth * 0.6;

        const curXLeft = (startXLeft + (targetLeftX - startXLeft) * progress).toFixed(1);
        const curXRight = (startXRight + (targetRightX - startXRight) * progress).toFixed(1);
        const curY = cardTopY.toFixed(1);

        leftBow.style.transform = `translate3d(${curXLeft}px, ${curY}px, 0) scale(${currentScale}) rotate(${rotLeft}deg)`;
        rightBow.style.transform = `translate3d(${curXRight}px, ${curY}px, 0) scale(${currentScale}) rotate(${rotRight}deg)`;

        window._hudBowState = `Apareciendo (${Math.round(progress * 100)}%)`;
      } else {
        // En 580px en adelante: Asentados SOBRE la tarjeta
        if (cardViewportBottom < 80) {
          const exitProgress = Math.min(Math.max((80 - cardViewportBottom) / 80, 0), 1);
          const exitOpacity = Math.max(0.70 * (1 - exitProgress), 0).toFixed(3);
          leftBow.style.opacity = exitOpacity;
          rightBow.style.opacity = exitOpacity;
          window._hudBowState = exitOpacity <= 0.05 ? 'Desaparecidos con Tarjeta' : 'Saliendo de Pantalla';
        } else {
          leftBow.style.opacity = '0.70';
          rightBow.style.opacity = '0.70';
          window._hudBowState = 'Sobre la Tarjeta (580px+)';
        }

        const curXLeft = targetLeftX.toFixed(1);
        const curXRight = targetRightX.toFixed(1);
        const curY = cardTopY.toFixed(1);

        leftBow.style.transform = `translate3d(${curXLeft}px, ${curY}px, 0) scale(1.25) rotate(-10deg)`;
        rightBow.style.transform = `translate3d(${curXRight}px, ${curY}px, 0) scale(1.25) rotate(10deg)`;
      }
    }

    // 6. Efecto humo / nube foto del Hero
    if (photoBox) {
      const photoViewportBottom = photoTopDoc + photoHeight - scrollTop;
      const smokeThresholdStart = 260;
      const smokeThresholdEnd = 40;

      let smokeProgress = 0;
      if (photoViewportBottom <= smokeThresholdEnd) {
        smokeProgress = 1;
      } else if (photoViewportBottom < smokeThresholdStart) {
        smokeProgress = (smokeThresholdStart - photoViewportBottom) / (smokeThresholdStart - smokeThresholdEnd);
        smokeProgress = Math.min(Math.max(smokeProgress, 0), 1);
      }

      window._hudSmokeProgress = Math.round(smokeProgress * 100);

      if (smokeProgress <= 0) {
        photoBox.style.opacity = '1';
        photoBox.style.filter = 'none';
        photoBox.style.transform = 'none';
      } else {
        const opacity = Math.max((1 - smokeProgress * 1.15).toFixed(3), 0);
        const blurAmount = (smokeProgress * 14).toFixed(1);
        const scaleAmount = (1 + smokeProgress * 0.08).toFixed(3);
        const translateY = (-smokeProgress * 22).toFixed(1);

        photoBox.style.opacity = opacity;
        photoBox.style.filter = `blur(${blurAmount}px)`;
        photoBox.style.transform = `scale(${scaleAmount}) translate3d(0, ${translateY}px, 0)`;
        photoBox.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
      }
    }

    // 7. Actualización del panel HUD solo si está activo
    if (hudPanel && hudPanel.style.display !== 'none') {
      const pct = docHeight > 0 ? ((scrollTop / docHeight) * 100).toFixed(1) : '0.0';
      if (valScrollY) valScrollY.textContent = `${Math.round(scrollTop)} px`;
      if (valScrollPct) valScrollPct.textContent = `${pct}%`;
      if (valViewport) valViewport.textContent = `${winWidth} × ${winHeight}`;
      if (valPhoto) valPhoto.textContent = `T:${Math.round(photoTopDoc - scrollTop)} | B:${Math.round(photoTopDoc + photoHeight - scrollTop)}`;
      if (valCard) valCard.textContent = `Top: ${Math.round(cardTopDoc - scrollTop)} px`;
      if (valBows) valBows.textContent = window._hudBowState || 'Ocultos';
      if (valSmoke) {
        const smokeVal = window._hudSmokeProgress || 0;
        valSmoke.textContent = smokeVal > 0 ? `Humo: ${smokeVal}%` : '0% (Nítida)';
      }
    }
  };

  // Único listener de scroll para toda la aplicación (100% pasivo y fluido)
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        renderScroll(scrollTop);
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Render inicial al cargar
  renderScroll(window.pageYOffset || document.documentElement.scrollTop || 0);
}

/* ==========================================================================
   4. PANEL DE COORDENADAS DE SCROLL EN TIEMPO REAL (DEBUG HUD)
   ========================================================================== */
function initScrollCoordsHUD() {
  const toggleBtn = document.getElementById('scroll-hud-toggle-btn');
  const hudPanel = document.getElementById('scroll-hud-panel');
  const closeBtn = document.getElementById('hud-close-btn');

  if (!toggleBtn || !hudPanel) return;

  let isPanelOpen = false;

  const togglePanel = (show) => {
    isPanelOpen = typeof show === 'boolean' ? show : !isPanelOpen;
    hudPanel.style.display = isPanelOpen ? 'block' : 'none';
    toggleBtn.setAttribute('aria-expanded', isPanelOpen ? 'true' : 'false');
    toggleBtn.style.background = isPanelOpen ? 'rgba(212, 130, 150, 0.95)' : '';
    toggleBtn.style.color = isPanelOpen ? '#ffffff' : '';
  };

  toggleBtn.addEventListener('click', () => togglePanel());
  if (closeBtn) closeBtn.addEventListener('click', () => togglePanel(false));
}

/* ==========================================================================
   5. DESTELLOS DORADOS SUTILES EN EL FONDO
   ========================================================================== */
function createBackgroundSparkles() {
  const container = document.querySelector('.invitation-container');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle';
    sparkle.style.top = `${Math.random() * 95}%`;
    sparkle.style.left = `${Math.random() * 90 + 5}%`;
    sparkle.style.animationDelay = `${(Math.random() * 3).toFixed(1)}s`;
    sparkle.style.animationDuration = `${(2.5 + Math.random() * 2.5).toFixed(1)}s`;
    container.appendChild(sparkle);
  }
}

/* ==========================================================================
   6. GENERADOR DE SONIDO CELESTIAL NATIVO (SIN DEPENDENCIAS EXTERNAS)
   ========================================================================== */
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde mayor (Do, Mi, Sol, Do agudo)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 1.2);
    });
  } catch (e) {
    // Si el navegador bloquea audio context, continúa en silencio sin errores
  }
}
