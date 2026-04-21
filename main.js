/* ============================================================
   main.js — Portfolio FLS
   ============================================================ */

/* ── Mobile menu ── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* ── Chiudi mobile menu cliccando fuori ── */
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  if (!e.target.closest('.site-header')) menu.classList.remove('open');
});

/* ── Spotlight mouse sulla hero ── */
(function initSpotlight() {
  const hero     = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let raf;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    cx = e.clientX - rect.left;
    cy = e.clientY - rect.top;
    if (!raf) raf = requestAnimationFrame(updateSpotlight);
  });

  hero.addEventListener('mouseleave', () => {
    cx = hero.offsetWidth / 2;
    cy = hero.offsetHeight / 2;
    if (!raf) raf = requestAnimationFrame(updateSpotlight);
  });

  function updateSpotlight() {
    spotlight.style.background =
      `radial-gradient(circle 480px at ${cx}px ${cy}px, rgba(255,255,255,0.09), transparent 70%)`;
    raf = null;
  }
})();

/* ── Parallax leggero sul testo bg hero ── */
(function initParallax() {
  const bgText = document.getElementById('heroBgText');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.18}px))`;
  }, { passive: true });
})();

/* ── Reveal staggered delle card al scroll ── */
(function initCardReveal() {
  const cards = document.querySelectorAll('.proj-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = parseInt(card.dataset.index) || 0;
        setTimeout(() => card.classList.add('visible'), index * 60);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, i) => {
    card.dataset.index = i;
    observer.observe(card);
  });
})();

/* ── Tilt 3D leggero sulle card al mousemove ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.proj-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
      const cy     = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = (-cy * 10).toFixed(2);
      const rotY   = ( cx * 10).toFixed(2);
      card.style.transform = `translateY(-5px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease';
    });
  });
})();

/* ── Reveal generico per elementi con [data-reveal] su tutte le pagine ── */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

/* ── Scroll progress bar ── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scrollBar';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: #0070C0; width: 0%; z-index: 9999;
    transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    const current = window.scrollY;
    bar.style.width = total > 0 ? `${(current / total) * 100}%` : '0%';
  }, { passive: true });
})();

/* ── Smooth reveal per immagini e sezioni (pagine interne) ── */
(function initSectionReveal() {
  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    [data-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }
    [data-reveal-delay="1"] { transition-delay: 0.1s; }
    [data-reveal-delay="2"] { transition-delay: 0.2s; }
    [data-reveal-delay="3"] { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  /* Aggiungi data-reveal automaticamente a strip-inner sulle pagine interne */
  if (!document.getElementById('hero')) {
    document.querySelectorAll('.strip-inner > *, .strip-inner .two-col').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
        if (i > 0) el.setAttribute('data-reveal-delay', Math.min(i, 3));
      }
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }
})();
