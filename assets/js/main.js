/**
 * main.js
 * Runs after DOM is ready (sections are inlined - no fetch needed)
 */
(function () {
  'use strict';

  function init() {

    /* ── Navbar scroll state ── */
    const navbar = document.querySelector('.nd-navbar');
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ── Smooth scroll ── */
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        const collapse = document.querySelector('.nd-navbar .navbar-collapse');
        if (collapse && collapse.classList.contains('show') && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        }
      }
    });

    /* ── Calculator (2 sliders + annual billing toggle) ── */
    const usersRange   = document.getElementById('calc-users');
    const dataRange    = document.getElementById('calc-data');
    const annualToggle = document.getElementById('annual-toggle');
    const usersDisplay = document.getElementById('users-display');
    const dataDisplay  = document.getElementById('data-display');
    const priceEl      = document.getElementById('calc-price');
    const savingEl     = document.getElementById('calc-saving');

    function updateTrackFill(input, color) {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      const val = parseFloat(input.value);
      const pct = ((val - min) / (max - min) * 100).toFixed(1);
      input.style.background =
        `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`;
    }

    function updateCalculator() {
      if (!usersRange || !dataRange || !priceEl) return;

      const users    = parseInt(usersRange.value, 10);
      const dataGB   = parseInt(dataRange.value, 10);
      const isAnnual = annualToggle && annualToggle.checked;

      const monthly  = Math.round(75 + (users * 2) + (dataGB * 0.05));
      const saving   = Math.round(monthly * 0.25);
      const display  = isAnnual ? monthly - saving : monthly;

      /* Update slider labels */
      if (usersDisplay) usersDisplay.textContent = users + (users >= 200 ? '+' : '') + ' users';
      if (dataDisplay)  dataDisplay.textContent  = dataGB.toLocaleString() + ' GB';

      /* Update price */
      priceEl.textContent = '$' + display;

      if (savingEl) {
        if (isAnnual) {
          savingEl.textContent    = 'Saving $' + saving + '/mo with annual billing';
          savingEl.style.visibility = 'visible';
        } else {
          savingEl.style.visibility = 'hidden';
        }
      }

      updateTrackFill(usersRange, 'var(--accent-orange)');
      updateTrackFill(dataRange,  '#F5A623');
    }

    if (usersRange)   usersRange.addEventListener('input',  updateCalculator);
    if (dataRange)    dataRange.addEventListener('input',   updateCalculator);
    if (annualToggle) annualToggle.addEventListener('change', updateCalculator);
    updateCalculator();

    /* ── Testimonial carousel ── */
    const slides  = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    let current = 0;

    function showSlide(idx) {
      slides.forEach((s, i) => s.style.display = i === idx ? 'block' : 'none');
    }

    if (slides.length) {
      showSlide(0);
      if (nextBtn) nextBtn.addEventListener('click', () => { current = (current + 1) % slides.length; showSlide(current); });
      if (prevBtn) prevBtn.addEventListener('click', () => { current = (current - 1 + slides.length) % slides.length; showSlide(current); });
    }

    /* ── Scroll reveal (IntersectionObserver) ── */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.10 });

      document.querySelectorAll('.feature-card, .sector-card, .calc-card, .testimonial-card').forEach(el => {
        el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity .45s ease,transform .45s ease;';
        observer.observe(el);
      });
    }

    /* ── Bootstrap tooltips ── */
    if (window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => bootstrap.Tooltip.getOrCreateInstance(el));
    }
  }

  /* Run on DOMContentLoaded (no fetch/loader needed - content is inlined) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
