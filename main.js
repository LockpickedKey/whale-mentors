/* ============================================================
   WHALE MENTORS — main.js
   Cursor-tracking blobs · Nav · Tabs · Scroll reveal · Form
   ============================================================ */

'use strict';

/* --- Cursor-tracking gradient blobs ----------------------- */
(function initBlobs() {
  const blobBlue = document.getElementById('blobBlue');
  const blobRed  = document.getElementById('blobRed');
  if (!blobBlue || !blobRed) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const HALF = 380; // half of blob size (760px / 2)

  let targetX = window.innerWidth  * 0.4;
  let targetY = window.innerHeight * 0.5;
  let blueX   = targetX;
  let blueY   = targetY;
  let redX    = window.innerWidth  * 0.75;
  let redY    = window.innerHeight * 0.2;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    // Blue blob follows cursor with slight lag
    blueX = lerp(blueX, targetX, 0.055);
    blueY = lerp(blueY, targetY, 0.055);

    // Red blob drifts to the opposite side
    redX = lerp(redX, window.innerWidth  - targetX, 0.03);
    redY = lerp(redY, window.innerHeight - targetY * 0.6, 0.03);

    blobBlue.style.transform = `translate(${blueX - HALF}px, ${blueY - HALF}px)`;
    blobRed.style.transform  = `translate(${redX  - HALF}px, ${redY  - HALF}px)`;

    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
    }
  }, { passive: true });

  tick();
})();


/* --- Mobile nav toggle ------------------------------------ */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('nav__links--open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    links.classList.toggle('nav__links--open', !isOpen);
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();


/* --- Tab switching ---------------------------------------- */
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
      const active = p.id === target;
      p.classList.toggle('tab-panel--active', active);
      p.hidden = !active;
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


/* --- Scroll-reveal (Intersection Observer) ---------------- */
(function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-child').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '-50px 0px',
    threshold: 0.08,
  });

  document.querySelectorAll('.reveal-child').forEach(el => observer.observe(el));
})();


/* --- Waitlist form ---------------------------------------- */
(function initForm() {
  const form = document.querySelector('.waitlist__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input  = form.querySelector('.waitlist__input');
    const btn    = form.querySelector('.waitlist__submit');
    const email  = input.value.trim();
    const re     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) {
      input.setCustomValidity('Please enter a valid email address.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');

    btn.textContent  = "You're on the list!";
    btn.disabled     = true;
    input.disabled   = true;
    btn.style.cssText = 'background:#16a34a;border-color:#16a34a;cursor:default;';

    // Announce to screen readers
    const msg = document.createElement('p');
    msg.setAttribute('role', 'status');
    msg.setAttribute('aria-live', 'polite');
    msg.style.cssText = 'position:absolute;left:-9999px';
    msg.textContent = 'You have been added to the waitlist.';
    form.appendChild(msg);
  });
})();


/* --- Smooth-scroll for anchor links ----------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#' ? document.body : document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* --- Nav shrink on scroll --------------------------------- */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.style.borderBottomColor = window.scrollY > 20
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.08)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
