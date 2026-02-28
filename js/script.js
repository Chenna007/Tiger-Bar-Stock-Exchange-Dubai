// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX - 6 + 'px';
  cursor.style.top = mouseY - 6 + 'px';
});
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX - 18 + 'px';
  follower.style.top = followerY - 18 + 'px';
  requestAnimationFrame(animateFollower);
})();

// ── Sticky Nav ──
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 80);
});

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    // move focus to close button for keyboard users
    if (mobileClose) mobileClose.focus();
  });
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileMenu);
  mobileClose.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { mobileClose.click(); } });
}
function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

// video modal removed — video now embedded directly in the entertainment section

// ── Ticker Tape ──
const tickerData = [
  { sym: 'TIGER-GIN', price: '65', change: '+12.5%', up: true },
  { sym: 'WINGS-BBQ', price: '62', change: '+8.2%', up: true },
  { sym: 'FRIES-TRUFFLE', price: '45', change: '-3.1%', up: false },
  { sym: 'MOMOS-CRYSTAL', price: '58', change: '+15.6%', up: true },
  { sym: 'PASTA-ALFREDO', price: '85', change: '+4.4%', up: true },
  { sym: 'ROSE-FIZZ', price: '75', change: '+21.3%', up: true },
  { sym: 'LAVA-CAKE', price: '48', change: '-1.8%', up: false },
  { sym: 'SHISHA-SPECIAL', price: '120', change: '+5.7%', up: true },
  { sym: 'TIGER-WHISKY', price: '70', change: '+9.9%', up: true },
  { sym: 'ONION-RINGS', price: '38', change: '-0.5%', up: false },
];
const track = document.getElementById('tickerTrack');
const makeItems = () => tickerData.map(d =>
  `<div class="ticker-item">
    <span style="font-weight:700">${d.sym}</span>
    <span>AED ${d.price}</span>
    <span class="${d.up ? 'up' : 'down'}">${d.up ? '▲' : '▼'} ${d.change}</span>
    <span style="opacity:0.3">|</span>
  </div>`
).join('');
if (track) {
  track.innerHTML = makeItems() + makeItems();
}

// ── Scroll Reveal ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Review Counter Animation ──
const countEl = document.getElementById('reviewCount');
if (countEl) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        let current = 0;
        const target = 2868;
        const step = target / 80;
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          countEl.textContent = Math.round(current).toLocaleString();
          if (current >= target) clearInterval(interval);
        }, 20);
        countObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  countObserver.observe(countEl);
}

// ── Live Price Flicker ──
if (document.querySelectorAll('.item-price').length > 0) {
  setInterval(() => {
    document.querySelectorAll('.item-price').forEach(el => {
      const text = el.textContent.trim();
      const num = parseInt(text.replace(/[^0-9-]/g, ''), 10);
      if (isNaN(num)) return;
      const delta = (Math.random() - 0.45) * 3;
      const newVal = Math.max(30, Math.round(num + delta));
      // preserve any surrounding text (e.g., 'AED ')
      el.textContent = text.replace(/\d[\d,]*/g, newVal.toString());
      el.style.color = delta > 0 ? '#27AE60' : '#C0392B';
      setTimeout(() => el.style.color = 'var(--gold)', 600);
    });
  }, 3000);
}

// ── Reservation Modal ──
const reserveModal = document.getElementById('reserveModal');
const modalClose = document.getElementById('modalClose');

function openReserveModal(e) {
  if (e) e.preventDefault();
  if (reserveModal) {
    reserveModal.style.display = 'flex';
    setTimeout(() => reserveModal.classList.add('open'), 10);
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
}

function closeReserveModal() {
  if (reserveModal) {
    reserveModal.classList.remove('open');
    setTimeout(() => {
      reserveModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 400);
  }
}

if (modalClose) {
  modalClose.addEventListener('click', closeReserveModal);
}

// Close on outside click
if (reserveModal) {
  reserveModal.addEventListener('click', (e) => {
    if (e.target === reserveModal) closeReserveModal();
  });
}

// Form Submission handling (Web3Forms)
const reserveForm = document.getElementById('reserveForm');
if (reserveForm) {
  reserveForm.addEventListener('submit', function (e) {
    // Optionally add custom validation or success handling here
    // Web3Forms works by default with the action attribute, 
    // but you can use fetch for a better UX (no redirect).

    // For now, we'll let it redirect to the Web3Forms success page 
    // as requested (User will add API key later).
  });
}

