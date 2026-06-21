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

// Broker signup
function handleSignup(e) {
  e.preventDefault();
  const msg = document.getElementById('signup-msg');
  if (msg) msg.style.display = 'block';
  e.target.reset();
}

// Contact form
function handleContact(e) {
  e.preventDefault();
  const msg = document.getElementById('contact-msg');
  if (msg) msg.style.display = 'block';
  e.target.reset();
}
