// Lenis smooth scrolling + GSAP ScrollTrigger reveal animations
(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function reveal(selector, vars, opts = {}) {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.fromTo(
        el,
        prefersReducedMotion ? {} : vars,
        {
          opacity: 1, y: 0, x: 0, rotateX: 0,
          duration: opts.duration || 0.9,
          ease: opts.ease || 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
  }

  function revealStagger(containerSelector, itemSelector, vars, opts = {}) {
    document.querySelectorAll(containerSelector).forEach((container) => {
      const items = container.querySelectorAll(itemSelector);
      if (!items.length) return;
      gsap.fromTo(
        items,
        prefersReducedMotion ? {} : vars,
        {
          opacity: 1, y: 0, x: 0, rotateX: 0,
          duration: opts.duration || 0.8,
          ease: opts.ease || 'power3.out',
          stagger: opts.stagger || 0.12,
          scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    reveal('.section-label, .section-title, .section-divider, .section-intro', { opacity: 0, y: 28 }, { duration: 0.7 });
    reveal('.two-col-text', { opacity: 0, y: 40 });
    reveal('.about-text', { opacity: 0, x: -40 });
    reveal('.about-img-wrapper', { opacity: 0, x: 40 });
    reveal('.contact-info', { opacity: 0, x: -36 });
    reveal('.contact-form-wrap', { opacity: 0, x: 36 });
    reveal('.broker-inner', { opacity: 0, y: 40 });
    reveal('.testi-slider', { opacity: 0, y: 36 });
    reveal('.portals-heading', { opacity: 0, y: 28 });

    revealStagger('.services-grid', '.service-card', { opacity: 0, y: 44, rotateX: 10 }, { stagger: 0.1 });
    revealStagger('.prop-grid', '.prop-card', { opacity: 0, y: 44, rotateX: 8 }, { stagger: 0.1 });
    revealStagger('.team-grid', '.team-card', { opacity: 0, y: 44 }, { stagger: 0.15 });
    revealStagger('.stats-grid', '> div', { opacity: 0, y: 30 }, { stagger: 0.1 });
    revealStagger('.portals-grid', '.portal-btn', { opacity: 0, y: 36 }, { stagger: 0.12 });
    revealStagger('[style*="grid-template-columns:repeat(3,1fr)"]', '.highlight-box', { opacity: 0, y: 36 }, { stagger: 0.1 });
    revealStagger('.content-block .two-col', '.highlight-box', { opacity: 0, y: 36 }, { stagger: 0.15 });

    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
      gsap.to('.slide.active', {
        backgroundPosition: '50% 65%',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
    const pageHero = document.querySelector('.page-hero-inner');
    if (pageHero && !prefersReducedMotion) {
      gsap.to(pageHero, {
        y: 60,
        ease: 'none',
        scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  });
})();

// Mobile nav: close on link click
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.mobile-nav').classList.remove('open'));
});

// Testimonial Slider (if present)
const track = document.getElementById('testiTrack');
const navEl = document.getElementById('testiNav');
if (track && navEl) {
  const total = track.children.length;
  let curTesti = 0;
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTesti(i);
    navEl.appendChild(d);
  }
  function goTesti(n) {
    track.style.transform = `translateX(-${n * 100}%)`;
    navEl.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === n));
    curTesti = n;
  }
  setInterval(() => goTesti((curTesti + 1) % total), 6000);
}

// Property Tabs
function switchTab(btn, panelId) {
  document.querySelectorAll('.prop-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.prop-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

// Formspree endpoint — replace YOUR_FORM_ID with the ID from your Formspree
// dashboard (formspree.io). The form is configured there to deliver to
// info@jacksonprentice.com; hannahtraul@gmail.com is added as a CC below.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const FORM_CC = 'hannahtraul@gmail.com';

function submitToFormspree(form, msgEl) {
  const data = new FormData(form);
  data.append('_cc', FORM_CC);
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
  })
    .then((res) => {
      if (res.ok) {
        if (msgEl) msgEl.style.display = 'block';
        form.reset();
      } else {
        alert('Something went wrong sending your message. Please call us at 202.841.8700 or email info@jacksonprentice.com directly.');
      }
    })
    .catch(() => {
      alert('Something went wrong sending your message. Please call us at 202.841.8700 or email info@jacksonprentice.com directly.');
    });
}

// Broker signup
function handleSignup(e) {
  e.preventDefault();
  submitToFormspree(e.target, document.getElementById('signup-msg'));
}

// Contact form
function handleContact(e) {
  e.preventDefault();
  submitToFormspree(e.target, document.getElementById('contact-msg'));
}
