/* ═══════════════════════════════════════════════
   SISIMA GROUP ZAMBIA LIMITED — Main JavaScript
   ═══════════════════════════════════════════════ */

/* ══════════════════════════════════════
   AOS — Animate On Scroll
══════════════════════════════════════ */
AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 50 });

/* ══════════════════════════════════════
   HERO SWIPER — CLEAN CROSSFADE
   Images fade in/out (no slide push).
   4 s per slide, 900 ms fade transition.
   Text stacks in cleanly after each fade.
══════════════════════════════════════ */
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  effect: 'fade',
  fadeEffect: { crossFade: true },   // true = both slides visible during fade
  autoplay: {
    delay: 4000,                     // 4 s per slide
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  speed: 900,                        // 900 ms fade — smooth but not slow
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

/**
 * Replay CSS animations on text + image every time a slide becomes active.
 * Swiper re-uses DOM nodes in loop mode, so we need to re-trigger manually.
 */
function replayHeroAnimations(swiper) {
  const slide = swiper.slides[swiper.activeIndex];
  if (!slide) return;

  // Re-trigger text entrance animations
  slide.querySelectorAll('.hero-badge, h1, .hero-sub, .hero-tagline, .hero-btns')
    .forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

  // Re-trigger the zoom on the background image
  const img = slide.querySelector('img');
  if (img) {
    img.style.animation = 'none';
    void img.offsetWidth;
    img.style.animation = '';
  }
}

heroSwiper.on('slideChangeTransitionStart', replayHeroAnimations);
heroSwiper.on('afterInit', replayHeroAnimations);

// Stock swiper removed — cars now rendered as a CSS grid from cars.json

/* ══════════════════════════════════════
   NAVBAR — scroll state + progress bar
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  // Navbar background
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);

  // Scroll-to-top button visibility
  const st = document.getElementById('scroll-top');
  st.classList.toggle('visible', window.scrollY > 400);

  // Page progress bar
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = docH > 0 ? (window.scrollY / docH * 100) : 0;
  document.getElementById('page-progress').style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
let menuOpen = false;

document.getElementById('menu-btn').addEventListener('click', () => {
  menuOpen ? closeMobileMenu() : openMobileMenu();
});

function openMobileMenu() {
  menuOpen = true;
  const m  = document.getElementById('mobile-menu');
  const ic = document.getElementById('menu-icon');
  m.style.display = 'flex';
  requestAnimationFrame(() => m.classList.add('open'));
  ic.className = 'fa-solid fa-xmark text-lg';
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  menuOpen = false;
  const m  = document.getElementById('mobile-menu');
  const ic = document.getElementById('menu-icon');
  m.classList.remove('open');
  setTimeout(() => { m.style.display = 'none'; }, 400);
  ic.className = 'fa-solid fa-bars text-lg';
  document.body.style.overflow = '';
}

// Close on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMobileMenu();
});

/* ══════════════════════════════════════
   BEFORWARD WHATSAPP REFERENCE WIDGET
══════════════════════════════════════ */
function sendToWhatsApp() {
  const input = document.getElementById('beforward-input');
  const ref   = input.value.trim();

  if (!ref) {
    input.classList.add('border-red-500', 'ring-red-500/25', 'ring-2');
    input.focus();
    input.placeholder = 'Please enter a reference number first!';
    setTimeout(() => {
      input.classList.remove('border-red-500', 'ring-red-500/25', 'ring-2');
      input.placeholder = 'e.g. SIE-123456 or SBT-789012';
    }, 3000);
    return;
  }

  const msg = encodeURIComponent(
    `Hello SISIMA GROUP, my Be Forward / SBT Reference Number is: ${ref}`
  );
  window.open(`https://wa.me/260965528058?text=${msg}`, '_blank');
}

function clearInput() {
  const inp = document.getElementById('beforward-input');
  inp.value = '';
  inp.focus();
}

document.getElementById('beforward-input')
  .addEventListener('keydown', e => { if (e.key === 'Enter') sendToWhatsApp(); });

/* ══════════════════════════════════════
   STAT COUNTER ANIMATION
══════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const step     = target / (duration / 16);
    let   current  = 0;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// Trigger counters when stats section enters viewport
const firstStat = document.querySelector('.stat-number');
if (firstStat) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(firstStat.closest('section') || firstStat);
}

/* ══════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════ */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Close all open items
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-answer').classList.remove('open');
  });

  // Open the clicked item if it was closed
  if (!isOpen) {
    item.classList.add('open');
    answer.classList.add('open');
  }
}

/* ══════════════════════════════════════
   OUR STOCK — Load from Firebase Firestore
══════════════════════════════════════ */

// NOTE: This block runs as a regular script. Firebase is loaded via
// a separate <script type="module"> tag at the bottom of index.html.
// The module sets window.sisimaLoadStock so this code can call it.

let allCars    = [];
let activeFilter = 'all';

const STATUS_COLORS = {
  available: { bg: 'bg-green-500', label: 'IN STOCK' },
  reserved:  { bg: 'bg-amber-500', label: 'RESERVED' },
  arriving:  { bg: 'bg-blue-500',  label: 'ARRIVING SOON' },
  sold:      { bg: 'bg-red-500',   label: 'SOLD' },
};

const CATEGORY_LABELS = {
  all:       'All Vehicles',
  suv:       'SUVs',
  sedan:     'Sedans',
  hatchback: 'Hatchbacks',
  pickup:    'Pickups',
  van:       'Vans / MPVs',
  truck:     'Trucks',
  arriving:  'Arriving Soon',
};

// Called by the Firebase module once cars are fetched
window.renderStockFromFirebase = function(cars) {
  allCars = cars;
  const loading = document.getElementById('cars-loading');
  if (loading) loading.style.display = 'none';
  buildFilterButtons();
  renderOurCars(activeFilter);
};

function buildFilterButtons() {
  const visible = allCars.filter(c => c.status !== 'sold');
  const cats = ['all', ...new Set(visible.map(c => c.category))];
  const container = document.getElementById('stock-filters');
  if (!container) return;
  container.innerHTML = cats.map(cat => `
    <button onclick="filterOurCars('${cat}')"
      class="filter-btn ${cat === 'all' ? 'active' : ''} px-5 py-2 rounded-full text-sm font-semibold transition-all"
      data-filter="${cat}">
      ${CATEGORY_LABELS[cat] || cat}
    </button>
  `).join('');
}

function filterOurCars(category) {
  activeFilter = category;
  document.querySelectorAll('#stock-filters .filter-btn').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-filter') === category)
  );
  renderOurCars(category);
}
window.filterOurCars = filterOurCars;

function renderOurCars(category) {
  const grid  = document.getElementById('our-cars-grid');
  const empty = document.getElementById('cars-empty');
  if (!grid) return;

  const filtered = allCars.filter(car => {
    if (car.status === 'sold') return false;
    return category === 'all' || car.category === category;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  const st = STATUS_COLORS;
  grid.innerHTML = filtered.map(car => {
    const s = st[car.status] || st.available;
    const waMsg = encodeURIComponent(car.whatsapp_msg || `Hello SISIMA GROUP, I am interested in the ${car.name}.`);
    return `
    <div class="vehicle-card bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <div class="card-img relative">
        <img src="${car.image}" alt="${car.name}" onerror="this.src='images/logo.jpeg'"/>
        <span class="absolute top-2 left-2 ${s.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${s.label}</span>
        <span class="absolute top-2 right-2 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SISIMA</span>
      </div>
      <div class="card-body">
        <p class="card-cat">${(car.category||'').toUpperCase()} · ${car.year||''} · ${car.color||''}</p>
        <h4 class="card-title text-navy">${car.name}</h4>
        <p class="card-sub">${car.location||'Nakonde'} — ${car.description ? car.description.substring(0,60)+(car.description.length>60?'…':'') : ''}</p>
        <div class="card-specs">
          ${car.mileage      ? `<span class="card-spec"><i class="fa-solid fa-gauge-high text-sky-DEFAULT"></i> ${car.mileage}</span>` : ''}
          ${car.fuel         ? `<span class="card-spec"><i class="fa-solid fa-gas-pump text-sky-DEFAULT"></i> ${car.fuel}</span>` : ''}
          ${car.transmission ? `<span class="card-spec"><i class="fa-solid fa-sliders text-sky-DEFAULT"></i> ${car.transmission}</span>` : ''}
        </div>
        <a href="https://wa.me/260965528058?text=${waMsg}" target="_blank" class="card-btn">
          <i class="fa-solid fa-cart-shopping mr-1"></i> Inquire / Buy Now
        </a>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   ACTIVE NAV LINK on scroll
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--sky)' : '';
  });
}, { passive: true });
