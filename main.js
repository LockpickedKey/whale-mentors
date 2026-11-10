'use strict';

/* ============================================================
   TICKER / PENCIL BAR
   ============================================================ */
(function initTicker() {
  const bar   = document.getElementById('tickerBar');
  const close = document.getElementById('tickerClose');
  const body  = document.body;
  if (!bar || !close) return;

  close.addEventListener('click', () => {
    bar.classList.add('is-hidden');
    body.classList.add('ticker-gone');
  });
})();


/* ============================================================
   MOBILE NAV
   ============================================================ */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    mobile.hidden = true;
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobile.hidden = open;
  });

  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobile.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();


/* ============================================================
   HERO — Vanta.js Waves background (watery)
   ============================================================ */
(function initVanta() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.getElementById('hero');
  if (!hero || !window.VANTA) return;

  VANTA.WAVES({
    el: hero,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x05215e,
    shininess: 20,
    waveHeight: 14,
    waveSpeed: 0.55,
    zoom: 0.85,
  });
})();


/* ============================================================
   TAB SWITCHING
   ============================================================ */
(function initTabs() {
  const buttons = document.querySelectorAll('[role="tab"]');
  const panels  = document.querySelectorAll('[role="tabpanel"]');
  if (!buttons.length) return;

  function activate(btn) {
    const target = btn.getAttribute('aria-controls');
    buttons.forEach(b => {
      b.setAttribute('aria-selected', 'false');
      b.classList.remove('tab--active');
    });
    panels.forEach(p => {
      const on = p.id === target;
      p.classList.toggle('tab-panel--active', on);
      p.hidden = !on;
    });
    btn.setAttribute('aria-selected', 'true');
    btn.classList.add('tab--active');
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => activate(btn));
    btn.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = buttons[(i + 1) % buttons.length];
      if (e.key === 'ArrowLeft')  next = buttons[(i - 1 + buttons.length) % buttons.length];
      if (e.key === 'Home')       next = buttons[0];
      if (e.key === 'End')        next = buttons[buttons.length - 1];
      if (next) { activate(next); next.focus(); e.preventDefault(); }
    });
  });
})();


/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach(item => {
    const btn = item.querySelector('.faq__q');
    const ans = item.querySelector('.faq__a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(it => {
        it.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        const a = it.querySelector('.faq__a');
        if (a) a.hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        ans.hidden = false;
      }
    });
  });
})();


/* ============================================================
   DIVIDER CUBE SCROLL ANIMATION
   ============================================================ */
(function initDividers() {
  const dividers = document.querySelectorAll('.sdivider');
  if (!dividers.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  dividers.forEach(d => obs.observe(d));
})();


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-child').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  document.querySelectorAll('.reveal-child').forEach(el => observer.observe(el));
})();


/* ============================================================
   WAITLIST FORM
   ============================================================ */
(function initForm() {
  const form = document.querySelector('.wl-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button[type="submit"]');
    const email = input.value.trim();
    const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) {
      input.setCustomValidity('Please enter a valid email address.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    btn.textContent   = "You're on the list!";
    btn.disabled      = true;
    input.disabled    = true;
    btn.style.cssText = 'background:#16a34a;border-color:#16a34a;cursor:default;';

    const msg = document.createElement('p');
    msg.setAttribute('role', 'status');
    msg.setAttribute('aria-live', 'polite');
    msg.style.cssText = 'position:absolute;left:-9999px';
    msg.textContent   = 'You have been added to the waitlist.';
    form.appendChild(msg);
  });
})();


/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
