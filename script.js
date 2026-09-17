const PRODUCTS = {
  'kars-d192': {
    id: 'kars-d192',
    name: 'Kars Sewan anatolico vecchia manifattura cod. D 192',
    short: 'Kars Sewan anatolico',
    price: 1700,
    code: 'D 192',
    size: '190 × 141 cm',
    origin: 'Anatolia',
    category: 'Anatolici',
    image: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/whatsapp-image-2020-05-28-at-11.03.13-1_li.jpg',
    fallbackImage: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/whatsapp-image-2020-05-28-at-11.03.13-1_li-600x450.jpg',
    description: 'Tappeto prodotto in Anatolia (Asia Minore), a pelo intrecciato, con fondo Bordeaux. Può essere utilizzato anche come rivestimento murale.'
  },
  'shirvan-d159': {
    id: 'shirvan-d159',
    name: 'Shirvan antico caucasico cod. D 159',
    short: 'Shirvan antico caucasico',
    price: 4500,
    code: 'D 159',
    size: 'Misure nella scheda originale',
    origin: 'Caucaso',
    category: 'Caucasici',
    image: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/inkedimg_20181018_092746_li-scaled.jpg',
    fallbackImage: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/inkedimg_20181018_092746_li-scaled-600x450.jpg',
    description: 'Shirvan antico caucasico con fondo blu scuro, decorato con simbologie e tre medaglioni rossi e bianchi.'
  },
  'kilim-g017': {
    id: 'kilim-g017',
    name: 'Kilim Bakhtiari persiano antico cod. G017',
    short: 'Kilim Bakhtiari persiano antico',
    price: 1900,
    code: 'G017',
    size: 'Misure nella scheda originale',
    origin: 'Persia',
    category: 'Kilim',
    image: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/Progetto-senza-titolo-20-600x450.jpg',
    description: 'Kilim Bakhtiari persiano antico: una tipologia di tappeto persiano selezionata dalla collezione Vahid.'
  },
  'kashkuli-d069': {
    id: 'kashkuli-d069',
    name: 'Kashkuli persiano vecchia manifattura cod. D069',
    short: 'Kashkuli persiano',
    price: 1950,
    code: 'D069',
    size: 'Misure nella scheda originale',
    origin: 'Persia',
    category: 'Persiani',
    image: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/dsc00812_li-scaled.jpg',
    fallbackImage: 'https://vahidtappetirari.it/wp-content/uploads/2020/12/dsc00812_li-scaled-600x450.jpg',
    description: 'Kashkuli persiano di vecchia manifattura, fine e compatto, con fondo Bordeaux.'
  }
};

const CART_KEY = 'vahid-demo-cart-v4';
const RECENT_KEY = 'vahid-demo-recent-v2';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
}).format(n || 0);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || 'null');
    if (saved && Array.isArray(saved.items)) {
      return {
        ...saved,
        items: saved.items.filter(i => PRODUCTS[i.id]).map(i => ({ id: i.id, qty: 1 })),
        shippingMethod: saved.shippingMethod || 'italy',
        specialHandling: Boolean(saved.specialHandling) && (saved.shippingMethod || 'italy') === 'italy'
      };
    }
  } catch (e) {}
  return { items: [], shippingMethod: 'italy', specialHandling: false };
}

let state = loadState();
function persist() { localStorage.setItem(CART_KEY, JSON.stringify(state)); }
function cartQty() { return state.items.length; }
function subtotal() { return state.items.reduce((n, i) => n + (PRODUCTS[i.id]?.price || 0), 0); }
function shippingCost() {
  if (!state.items.length) return 0;
  if (state.shippingMethod === 'local') return 0;
  if (state.shippingMethod === 'whiteglove') return 42;
  return 24 + (state.specialHandling ? 18 : 0);
}
function shippingName() {
  if (state.shippingMethod === 'local') return 'Ritiro / consegna area Pescara';
  if (state.shippingMethod === 'whiteglove') return 'Consegna con cura speciale';
  return state.specialHandling ? 'Spedizione Italia + movimentazione speciale' : 'Spedizione Italia';
}
function total() { return subtotal() + shippingCost(); }

function addItem(id) {
  if (!PRODUCTS[id]) return;
  if (!state.items.some(i => i.id === id)) state.items.push({ id, qty: 1 });
  persist();
  renderCart();
  rememberRecent(id);
  openCart();
}
function removeItem(id) {
  state.items = state.items.filter(i => i.id !== id);
  persist();
  renderCart();
}

const cartDrawer = $('#cartDrawer');
const backdrop = $('#backdrop');
const cartCount = $('#cartCount');
const cartEmpty = $('#cartEmpty');
const cartContent = $('#cartContent');
const cartItems = $('#cartItems');
const cartSubtotal = $('#cartSubtotal');
const cartShipping = $('#cartShipping');
const cartTotal = $('#cartTotal');
const checkoutModal = $('#checkoutModal');
const payButton = $('#payButton');

function syncSpecialHandlingControls() {
  const enabled = state.shippingMethod === 'italy';
  const ids = ['#specialHandling', '#checkoutSpecialHandling'];
  ids.forEach(selector => {
    const input = $(selector);
    if (!input) return;
    input.checked = enabled && state.specialHandling;
    input.disabled = !enabled;
    input.setAttribute('aria-disabled', String(!enabled));
    const label = input.closest('label');
    if (label) label.style.opacity = enabled ? '' : '.45';
  });
}

function renderCart() {
  if (cartCount) cartCount.textContent = cartQty();
  const has = state.items.length > 0;
  if (cartEmpty) cartEmpty.hidden = has;
  if (cartContent) cartContent.hidden = !has;

  if (cartItems) {
    cartItems.innerHTML = has ? state.items.map(item => {
      const p = PRODUCTS[item.id];
      if (!p) return '';
      return `<div class="cart-item" data-id="${p.id}">
        <img src="${p.image}" data-fallback-src="${p.fallbackImage || ''}" alt="${p.short}">
        <div>
          <h4>${p.short}</h4>
          <small>Cod. ${p.code} · ${p.size}</small>
          <div class="qty"><span>1 pezzo unico</span><button class="remove-item" type="button" data-action="remove" aria-label="Rimuovi ${p.short} dal carrello">Rimuovi</button></div>
        </div>
        <strong>${money(p.price)}</strong>
      </div>`;
    }).join('') : '';
  }

  if (cartSubtotal) cartSubtotal.textContent = money(subtotal());
  if (cartShipping) cartShipping.textContent = shippingCost() ? money(shippingCost()) : 'Gratis';
  if (cartTotal) cartTotal.textContent = money(total());
  if (payButton) payButton.textContent = `Simula ordine · ${money(total())}`;

  const shippingSelect = $('#shippingMethod');
  if (shippingSelect) shippingSelect.value = state.shippingMethod;
  const checkoutShipping = $('#checkoutShipping');
  if (checkoutShipping) checkoutShipping.value = state.shippingMethod;

  syncSpecialHandlingControls();

  const checkoutTotal = $('#checkoutTotal');
  if (checkoutTotal) checkoutTotal.textContent = money(total());
  const checkoutShippingLabel = $('#checkoutShippingLabel');
  if (checkoutShippingLabel) checkoutShippingLabel.textContent = `${shippingName()} · ${shippingCost() ? money(shippingCost()) : 'Gratis'}`;
  installImageFallbacks();
}

function openCart() {
  if (!cartDrawer) return;
  renderCart();
  cartDrawer.classList.add('open');
  backdrop?.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer?.classList.remove('open');
  backdrop?.classList.remove('show');
  cartDrawer?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$$('.add-to-cart').forEach(btn => btn.addEventListener('click', () => addItem(btn.dataset.productId || btn.closest('[data-product-id]')?.dataset.productId)));
$('#cartTrigger')?.addEventListener('click', openCart);
$('#closeCart')?.addEventListener('click', closeCart);
backdrop?.addEventListener('click', closeCart);
$('#continueShopping')?.addEventListener('click', closeCart);
cartItems?.addEventListener('click', e => {
  const action = e.target.dataset.action;
  if (action !== 'remove') return;
  const row = e.target.closest('.cart-item');
  if (row) removeItem(row.dataset.id);
});

function setShippingMethod(value) {
  state.shippingMethod = value;
  if (value !== 'italy') state.specialHandling = false;
  persist();
  renderCart();
}
$('#shippingMethod')?.addEventListener('change', e => setShippingMethod(e.target.value));
$('#checkoutShipping')?.addEventListener('change', e => setShippingMethod(e.target.value));
$('#specialHandling')?.addEventListener('change', e => {
  state.specialHandling = state.shippingMethod === 'italy' && e.target.checked;
  persist();
  renderCart();
});
$('#checkoutSpecialHandling')?.addEventListener('change', e => {
  state.specialHandling = state.shippingMethod === 'italy' && e.target.checked;
  persist();
  renderCart();
});

$('#checkoutTrigger')?.addEventListener('click', () => {
  if (!state.items.length) return;
  closeCart();
  renderCart();
  checkoutModal?.showModal();
  requestAnimationFrame(() => $('#closeCheckout')?.focus());
});
$('#closeCheckout')?.addEventListener('click', () => checkoutModal?.close());
checkoutModal?.addEventListener('click', e => {
  const r = checkoutModal.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) checkoutModal.close();
});
$('#checkoutForm')?.addEventListener('submit', e => {
  e.preventDefault();
  $('#checkoutForm').parentElement.hidden = true;
  $('.checkout-summary-pane').hidden = true;
  $('#successState').hidden = false;
  state.items = [];
  persist();
  renderCart();
});
$('#resetDemo')?.addEventListener('click', () => {
  checkoutModal?.close();
  location.reload();
});
$('#cardNumber')?.addEventListener('input', e => {
  const v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});

function rememberRecent(id) {
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) {}
  recent = [id, ...recent.filter(x => x !== id)].slice(0, 4);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  renderRecent();
}
function renderRecent() {
  const wrap = $('#recentProducts');
  if (!wrap) return;
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) {}
  const section = wrap.closest('.recent-section');
  if (!ids.length) {
    wrap.innerHTML = '';
    if (section) section.hidden = true;
    return;
  }
  if (section) section.hidden = false;
  wrap.innerHTML = ids.filter(id => PRODUCTS[id]).map(id => {
    const p = PRODUCTS[id];
    return `<article class="recent-card"><img src="${p.image}" data-fallback-src="${p.fallbackImage || ''}" alt="${p.short}" loading="lazy"><div><span>${p.category}</span><h3>${p.short}</h3><strong>${money(p.price)}</strong><button class="text-button quick-view" type="button" data-product-id="${p.id}">Vista rapida</button></div></article>`;
  }).join('');
  $$('#recentProducts .quick-view').forEach(b => b.addEventListener('click', () => openQuickView(b.dataset.productId)));
  installImageFallbacks();
}

const quickModal = $('#quickViewModal');
let lastQuickFocus = null;
function openQuickView(id) {
  const p = PRODUCTS[id];
  if (!p || !quickModal) return;
  lastQuickFocus = document.activeElement;
  rememberRecent(id);
  const image = $('#quickImage');
  image.src = p.image;
  image.dataset.fallbackSrc = p.fallbackImage || '';
  image.alt = p.short;
  $('#quickCategory').textContent = `${p.category} · ${p.origin}`;
  $('#quickTitle').textContent = p.name;
  $('#quickMeta').textContent = `Cod. ${p.code} · ${p.size}`;
  $('#quickDescription').textContent = p.description;
  $('#quickPrice').textContent = money(p.price);
  const add = $('#quickAdd');
  add.dataset.productId = id;
  quickModal.showModal();
  installImageFallbacks();
  requestAnimationFrame(() => $('#quickClose')?.focus());
}
function closeQuickView() {
  quickModal?.close();
  lastQuickFocus?.focus?.();
}
$$('.quick-view').forEach(btn => btn.addEventListener('click', () => openQuickView(btn.dataset.productId)));
$('#quickClose')?.addEventListener('click', closeQuickView);
$('#quickAdd')?.addEventListener('click', e => {
  quickModal?.close();
  addItem(e.currentTarget.dataset.productId);
});
quickModal?.addEventListener('click', e => {
  const r = quickModal.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeQuickView();
});

function setupShopFilters() {
  const grid = $('#productGrid');
  if (!grid) return;
  const search = $('#shopSearch');
  const origin = $('#originFilter');
  const sort = $('#sortSelect');
  let category = 'all';
  const empty = document.createElement('p');
  empty.className = 'shop-empty-state';
  empty.hidden = true;
  empty.textContent = 'Nessun tappeto corrisponde ai filtri selezionati.';
  empty.style.cssText = 'grid-column:1/-1;padding:56px 22px;text-align:center;border:1px solid rgba(28,21,17,.14);background:#fff;color:#75695f;font-family:var(--serif);font-size:28px;';
  grid.after(empty);

  function apply() {
    const q = (search?.value || '').trim().toLowerCase();
    const ori = origin?.value || 'all';
    const cards = $$('#productGrid .shop-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const matches = (!q || text.includes(q)) && (category === 'all' || card.dataset.category === category) && (ori === 'all' || card.dataset.origin === ori);
      card.hidden = !matches;
    });
    const visible = cards.filter(c => !c.hidden);
    const mode = sort?.value || 'featured';
    if (mode === 'price-asc') visible.sort((a, b) => +a.dataset.price - +b.dataset.price);
    if (mode === 'price-desc') visible.sort((a, b) => +b.dataset.price - +a.dataset.price);
    if (mode === 'name') visible.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, 'it'));
    visible.forEach(c => grid.appendChild(c));
    empty.hidden = visible.length !== 0;
    const count = $('#resultCount');
    if (count) count.textContent = `${visible.length} pezzi in selezione`;
  }

  $$('.category-chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.category-chip').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-pressed', 'true');
    category = chip.dataset.category;
    apply();
  }));
  search?.addEventListener('input', apply);
  origin?.addEventListener('change', apply);
  sort?.addEventListener('change', apply);
  apply();
}

function installImageFallbacks() {
  $$('img[data-fallback-src]').forEach(img => {
    if (img.dataset.fallbackBound === 'true') return;
    img.dataset.fallbackBound = 'true';
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallbackSrc;
      if (fallback && img.src !== fallback && img.dataset.fallbackTried !== 'true') {
        img.dataset.fallbackTried = 'true';
        img.src = fallback;
        return;
      }
      img.hidden = true;
    });
  });
}

function hardenClientFacingDemo() {
  document.querySelectorAll('button:not([type])').forEach(button => { button.type = 'button'; });
  $('#closeCart')?.setAttribute('aria-label', 'Chiudi carrello');
  $('#closeCheckout')?.setAttribute('aria-label', 'Chiudi checkout');
  $('#quickClose')?.setAttribute('aria-label', 'Chiudi vista rapida');
  $('#cartTrigger')?.setAttribute('aria-label', 'Apri carrello');
  $('#menuTrigger')?.setAttribute('aria-label', 'Apri menu');
  $('.nav')?.setAttribute('aria-label', 'Navigazione principale');

  const sourceLink = $('a[href*="vahidtappetirari.it/chi-siamo"]');
  if (sourceLink) {
    sourceLink.href = 'index.html#contatti';
    sourceLink.removeAttribute('target');
    sourceLink.removeAttribute('rel');
    sourceLink.textContent = 'Parla con Vahid →';
  }

  const form = $('#checkoutForm');
  if (form) form.setAttribute('autocomplete', 'off');
  const card = $('#cardNumber');
  if (card) {
    card.setAttribute('autocomplete', 'off');
    card.setAttribute('data-lpignore', 'true');
    card.placeholder = '0000 0000 0000 0000';
  }
  const paymentHeading = [...document.querySelectorAll('.checkout-form-pane h3')].find(el => el.textContent.toLowerCase().includes('pagamento'));
  if (paymentHeading) paymentHeading.textContent = 'Pagamento — solo simulazione';
}

function setupResilientAutoplay() {
  const videos = $$('video[autoplay]');
  if (!videos.length) return;

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => Boolean(motionQuery?.matches);

  const prepareVideo = video => {
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  };

  const tryPlay = video => {
    if (reducedMotion() || document.hidden) return;
    prepareVideo(video);
    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  videos.forEach(video => {
    prepareVideo(video);
    if (reducedMotion()) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }
    video.addEventListener('loadeddata', () => tryPlay(video), { passive: true });
    video.addEventListener('canplay', () => tryPlay(video), { passive: true });
  });

  if (reducedMotion()) return;

  const retryAll = () => videos.forEach(tryPlay);
  const intersection = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) tryPlay(entry.target);
    });
  }, { rootMargin: '160px 0px', threshold: .01 }) : null;

  videos.forEach(video => {
    intersection?.observe(video);
    tryPlay(video);
  });

  window.addEventListener('pageshow', retryAll, { passive: true });
  window.addEventListener('focus', retryAll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) retryAll();
  });
  document.addEventListener('pointerdown', retryAll, { once: true, passive: true });
  document.addEventListener('touchend', retryAll, { once: true, passive: true });
  document.addEventListener('keydown', retryAll, { once: true });
  [250, 1000, 2500].forEach(delay => setTimeout(retryAll, delay));

  motionQuery?.addEventListener?.('change', () => {
    if (reducedMotion()) videos.forEach(video => video.pause());
    else retryAll();
  });
}

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .1 });
$$('.reveal').forEach(el => observer.observe(el));

$('#menuTrigger')?.addEventListener('click', () => $('.site-header')?.classList.toggle('menu-open'));
$$('.nav a').forEach(a => a.addEventListener('click', () => $('.site-header')?.classList.remove('menu-open')));

const menuTrigger = $('#menuTrigger');
const cartTrigger = $('#cartTrigger');
let lastCartFocus = null;
menuTrigger?.setAttribute('aria-expanded', 'false');
menuTrigger?.addEventListener('click', () => menuTrigger.setAttribute('aria-expanded', String($('.site-header')?.classList.contains('menu-open'))));
cartCount?.setAttribute('aria-live', 'polite');
$('#resultCount')?.setAttribute('aria-live', 'polite');
cartTrigger?.addEventListener('click', () => {
  lastCartFocus = document.activeElement;
  requestAnimationFrame(() => $('#closeCart')?.focus());
});
$('#closeCart')?.addEventListener('click', () => lastCartFocus?.focus?.());
$$('.nav a').forEach(a => a.addEventListener('click', () => menuTrigger?.setAttribute('aria-expanded', 'false')));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (cartDrawer?.classList.contains('open')) {
    closeCart();
    lastCartFocus?.focus?.();
  }
  if ($('.site-header')?.classList.contains('menu-open')) {
    $('.site-header').classList.remove('menu-open');
    menuTrigger?.setAttribute('aria-expanded', 'false');
    menuTrigger?.focus();
  }
});

// Keep product-card images synchronized with the catalog source and attach a fallback.
$$('[data-product-id]').forEach(node => {
  const p = PRODUCTS[node.dataset.productId];
  const img = node.querySelector?.('img');
  if (p && img) {
    img.src = p.image;
    if (p.fallbackImage) img.dataset.fallbackSrc = p.fallbackImage;
  }
});

hardenClientFacingDemo();
setupResilientAutoplay();
renderCart();
renderRecent();
setupShopFilters();
installImageFallbacks();