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

    // Animated stat count-up
    document.querySelectorAll('.stat-num').forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const end = parseFloat(match[1]);
      const suffix = match[2];
      const obj = { val: 0 };
      const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: end,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = obj.val.toFixed(decimals) + suffix; },
          });
        },
      });
    });

    // Mouse-tracked 3D tilt + glow on cards
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.service-card, .prop-card, .team-card, .highlight-box, .testi-card, .portal-btn').forEach((card) => {
        card.classList.add('tilt-target');
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', `${px * 100}%`);
          card.style.setProperty('--my', `${py * 100}%`);
          gsap.to(card, {
            rotateY: (px - 0.5) * 10,
            rotateX: (0.5 - py) * 10,
            duration: 0.4,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    }

    // Nav shadow state on scroll
    const navBar = document.querySelector('nav');
    if (navBar) {
      ScrollTrigger.create({
        start: 'top -10',
        end: 99999,
        onUpdate: (self) => navBar.classList.toggle('scrolled', self.scroll() > 10),
      });
    }

    // Sprinkle ambient floating blobs into every major section for constant subtle motion
    document.querySelectorAll('section, .content-block, .stats-band, .portals, .broker-signup').forEach((sec, i) => {
      if (sec.querySelector('.ambient-blob')) return;
      ['b1', 'b2', 'b3'].forEach((cls, j) => {
        if ((i + j) % 2 === 0 && j < 2) {
          const blob = document.createElement('div');
          blob.className = `ambient-blob ${cls}`;
          sec.appendChild(blob);
        }
      });
    });

    // Section dividers grow in from 0 width when scrolled into view
    document.querySelectorAll('.section-divider, .hero-line, .page-hero-line').forEach((el) => {
      gsap.fromTo(
        el,
        prefersReducedMotion ? {} : { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });

    // Magnetic pull on primary buttons
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.btn-green, .btn-outline, .btn-dark').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    // Subtle parallax drift on property card images while scrolling past
    if (!prefersReducedMotion) {
      document.querySelectorAll('.prop-img img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: img.closest('.prop-card') || img, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }

    // Slow continuous rotation on the footer logo mark for ambient motion
    document.querySelectorAll('.footer-logo-icon').forEach((el) => {
      if (!prefersReducedMotion) {
        gsap.to(el, { rotateY: 360, duration: 18, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      }
    });
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
