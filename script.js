// ---------- menu mobile ----------
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

// ---------- relógio do painel HUD (home) ----------
const scanClock = document.getElementById('scanClock');
if (scanClock) {
  const tick = () => {
    scanClock.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- abas do painel de escaneamento (home) ----------
const scanTabs = document.getElementById('scanTabs');
if (scanTabs) {
  const bodies = [0, 1, 2].map(i => document.getElementById('scanBody' + i));
  let current = 0;
  let autoTimer;

  const show = (idx) => {
    bodies.forEach((b, i) => { if (b) b.style.display = i === idx ? 'block' : 'none'; });
    [...scanTabs.children].forEach((btn, i) => btn.classList.toggle('active', i === idx));
    current = idx;
  };

  scanTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    show(Number(btn.dataset.panel));
    resetAuto();
  });

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => show((current + 1) % 3), 5000);
  };
  resetAuto();
}

// ---------- busca + filtros (páginas de catálogo) ----------
function initCatalog({ searchInputId, filtersId, cardSelector, cardCategoryAttr = 'data-category', cardNameAttr = 'data-name' }) {
  const input = document.getElementById(searchInputId);
  const filterWrap = document.getElementById(filtersId);
  const cards = () => document.querySelectorAll(cardSelector);
  let activeFilter = 'todos';

  const apply = () => {
    const term = (input?.value || '').trim().toLowerCase();
    cards().forEach(card => {
      const name = (card.getAttribute(cardNameAttr) || card.textContent).toLowerCase();
      const cat = card.getAttribute(cardCategoryAttr) || 'todos';
      const matchesTerm = name.includes(term);
      const matchesFilter = activeFilter === 'todos' || cat === activeFilter;
      card.style.display = (matchesTerm && matchesFilter) ? '' : 'none';
    });
  };

  input?.addEventListener('input', apply);

  if (filterWrap) {
    filterWrap.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      activeFilter = chip.dataset.filter;
      [...filterWrap.children].forEach(c => c.classList.toggle('active', c === chip));
      apply();
    });
  }
}
