/* ============================================================
   WEB WEAVER STUDIO — main.js
   ============================================================ */

/* --- Mobile menu toggle --- */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    });
  });
}

/* --- Header shadow on scroll --- */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- Scroll progress bar --- */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', function () {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
}, { passive: true });

/* --- Fade-in on scroll (IntersectionObserver) with per-section stagger --- */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(function (el) {
    /* Only add JS-based delay when no CSS stagger class has been applied */
    if (!el.style.transitionDelay) {
      const siblings = Array.from(el.parentElement.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = ((idx % 5) * 0.08) + 's';
    }
    observer.observe(el);
  });
}

/* --- Active nav link on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(function (section) {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --- FAQ accordion (smooth max-height animation) --- */
document.querySelectorAll('.faq__item').forEach(function (item) {
  const btn    = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', function () {
    const isOpen = item.classList.contains('is-open');

    /* Close all others */
    document.querySelectorAll('.faq__item.is-open').forEach(function (openItem) {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      }
    });

    /* Toggle this one */
    item.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});
