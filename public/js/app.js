const api = '/api';
let productsCache = [];

function debounce(fn, wait = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  el.innerText = getCart().reduce((s, i) => s + i.qty, 0);
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}
function setWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}
function isWishlisted(id) {
  return getWishlist().includes(id);
}

function resolveImageUrl(image) {
  const url = image && String(image).trim();
  if (!url) return '/images/placeholder.png';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
}

function renderRatingStars(value) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  let html = '';
  for (let i = 1; i <= 5; i += 1) {
    html += `<span class="${i <= rating ? 'filled' : 'empty'}" aria-hidden="true">${i <= rating ? '★' : '☆'}</span>`;
  }
  return html;
}

function toggleWishlistItem(id) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(id);
  }
  setWishlist(wishlist);
  return wishlist.includes(id);
}

async function loadProducts() {
  const list = document.getElementById('products');
  if (!list) return;
  list.innerHTML = 'Loading...';
  try {
    const category = getCategoryQuery();
    const url = new URL(api + '/products', window.location.origin);
    if (category) url.searchParams.set('category', category);
    const products = await fetchJSON(url.toString());
    productsCache = products;
    renderProductList(productsCache);
    if (searchInput && searchInput.value.trim()) {
      applySearch(searchInput.value, false);
    }
    const categoryHeading = document.getElementById('category-heading');
    if (categoryHeading) {
      categoryHeading.textContent = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} products` : 'All products';
    }
  } catch (err) {
    list.innerHTML = '<p class="error-text">Failed to load products.</p>';
  }
}

let currentSearchQuery = '';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return escaped.replace(regex, '<mark>$1</mark>');
}

function setSearchQuery(q) {
  const params = new URLSearchParams(window.location.search);
  if (q) params.set('search', q); else params.delete('search');
  const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
  window.history.pushState({}, '', newUrl);
}

function getSearchQuery() {
  return new URLSearchParams(window.location.search).get('search') || '';
}

function getCategoryQuery() {
  return new URLSearchParams(window.location.search).get('category') || '';
}

function renderProductList(items) {
  const list = document.getElementById('products');
  if (!list) return;
  list.innerHTML = '';
  if (!items || !items.length) { list.innerHTML = '<p class="empty-state">No products found.</p>'; return; }
  items.forEach(p => {
    const imageUrl = resolveImageUrl(p.image);
    const stockText = p.stock > 0 ? `${p.stock} in stock` : 'Out of stock';
    const nameHtml = highlightText(p.name, currentSearchQuery);
    const cardDescription = p.shortDescription || p.description || 'High-quality item for your daily needs.';
    const descriptionHtml = highlightText(cardDescription, currentSearchQuery);
    const el = document.createElement('div');
    el.className = 'card product-card';
    el.dataset.id = p._id;
    const wishActive = isWishlisted(p._id) ? 'active' : '';
    el.innerHTML = `
      <div class="card-image">
        <img src="${imageUrl}" alt="${escapeHtml(p.name)}" onerror="this.onerror=null;this.src='/images/placeholder.png'" />
        <span class="stock-badge ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}">${stockText}</span>
      </div>
      <div class="card-body">
        <div class="card-copy">
          <h3>${nameHtml}</h3>
          <p>${descriptionHtml}</p>
          <div class="rating-stars" aria-label="Rating">${renderRatingStars(p.rating)}</div>
        </div>
        <div class="product-actions">
          <div class="product-meta">
            <span>$${p.price.toFixed(2)}</span>
            <span class="stock-label">${p.stock > 0 ? 'Ready to ship' : 'Unavailable'}</span>
          </div>
          <div class="button-group">
            <button class="wish-btn ${wishActive}" data-id="${p._id}" aria-label="Toggle wishlist">♥</button>
            <button class="cart-btn" data-id="${p._id}" ${p.stock === 0 ? 'disabled' : ''}>🛒 Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
  list.querySelectorAll('button.cart-btn').forEach(btn => btn.addEventListener('click', onAddToCart));
  list.querySelectorAll('button.wish-btn').forEach(btn => btn.addEventListener('click', onToggleWishlist));
  list.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', onShowProductDetails));
}

function applySearch(query, updateUrl = true) {
  currentSearchQuery = (query || '').trim();
  if (searchInput) {
    searchInput.value = currentSearchQuery;
  }
  if (updateUrl) setSearchQuery(currentSearchQuery);
  if (!currentSearchQuery) {
    renderProductList(productsCache);
    return;
  }
  const q = currentSearchQuery.toLowerCase();
  const filtered = productsCache.filter(p => {
    return (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
  });
  renderProductList(filtered);
}

const searchInput = document.getElementById('nav-search');
const searchClear = document.getElementById('nav-search-clear');
if (searchInput) {
  const onSearch = debounce(() => {
    applySearch(searchInput.value);
    if (searchClear) {
      searchClear.classList.toggle('hidden', !searchInput.value.trim());
    }
  }, 200);
  const initialQuery = getSearchQuery();
  if (initialQuery) {
    searchInput.value = initialQuery;
    if (searchClear) searchClear.classList.remove('hidden');
  } else {
    if (searchClear) searchClear.classList.add('hidden');
  }
  searchInput.addEventListener('input', onSearch);
}
if (searchClear) {
  searchClear.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchClear.classList.add('hidden');
      applySearch('');
    }
  });
}

function onAddToCart(e) {
  e.stopPropagation();
  const id = e.target.dataset.id;
  const cart = getCart();
  const found = cart.find(i=>i.product===id);
  if (found) {
  found.qty += 1;
} else {
  const product = products.find(p => p._id === id);

  cart.push({
    product: id,
    name: product.name,
    price: product.price,
    image: product.image,
    qty: 1
  });
}
  setCart(cart);
}

function onToggleWishlist(e) {
  e.stopPropagation();
  const btn = e.target;
  const id = btn.dataset.id;
  const nowWishlisted = toggleWishlistItem(id);
  btn.classList.toggle('active', nowWishlisted);
}

function onShowProductDetails(e) {
  if (e.target.closest('button')) return;
  const card = e.currentTarget;
  const id = card.dataset.id;
  // Navigate to dedicated product page
  window.location = `/product/${id}`;
}

function openProductModal(product) {
  const modal = document.getElementById('product-modal');
  document.getElementById('product-modal-image').src = resolveImageUrl(product.image);
  document.getElementById('product-modal-title').textContent = product.name;
  document.getElementById('product-modal-rating').innerHTML = renderRatingStars(product.rating);
  document.getElementById('product-modal-description').textContent = product.description || 'No description available for this product.';
  document.getElementById('product-modal-price').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('product-modal-stock').textContent = product.stock > 0 ? `${product.stock} available` : 'Out of stock';
  document.getElementById('product-modal-availability').textContent = product.stock > 0 ? 'Ready to ship' : 'Unavailable';
  document.getElementById('product-modal-image').onerror = function () { this.onerror = null; this.src = '/images/placeholder.png'; };
  modal.classList.remove('hidden');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.classList.add('hidden');
}

function toggleCart() {
  const cartPanel = document.getElementById('cart-panel');

  if (!cartPanel) {
    window.location.href = '/cart.html';
    return;
  }

  cartPanel.classList.toggle('hidden');
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items');
  if (!list) return;
  list.innerHTML = '';
  const cart = getCart();
  if (!cart.length) { list.innerHTML = '<li>Cart empty</li>'; return }
  cart.forEach(item => {
    const li = document.createElement('li'); li.innerText = `${item.product} x ${item.qty}`; list.appendChild(li);
  });
}

async function placeOrder() {
  const cart = getCart(); if (!cart.length) return alert('Cart empty');
  const address = document.getElementById('address').value || '';
  const token = localStorage.getItem('token');
  try {
    const res = await fetchJSON(api + '/orders', { method:'POST', headers: { 'Content-Type':'application/json', 'Authorization': token?`Bearer ${token}`:'' }, body: JSON.stringify({ items: cart, address }) });
    alert('Order placed'); setCart([]); renderCart();
  } catch (err) { alert('Order failed'); }
}

const linkCartEl = document.getElementById('link-cart');
if (linkCartEl) linkCartEl.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
const placeOrderEl = document.getElementById('place-order');
if (placeOrderEl) placeOrderEl.addEventListener('click', placeOrder);
const linkHomeEl = document.getElementById('link-home');
if (linkHomeEl) linkHomeEl.addEventListener('click', e => { e.preventDefault(); window.location = '/'; });
const linkLoginEl = document.getElementById('link-login');
if (linkLoginEl) linkLoginEl.addEventListener('click', (e) => { e.preventDefault(); window.location = '/login.html'; });
const heroBtn = document.getElementById('hero-shop');
if (heroBtn) {
  heroBtn.addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const productModal = document.getElementById('product-modal');
const productModalClose = document.getElementById('product-modal-close');
const productModalBackdrop = document.getElementById('product-modal-backdrop');
function initProductModal() {
  if (!productModal) return;

  if (productModalClose) {
    productModalClose.addEventListener('click', closeProductModal);
  }
  if (productModalBackdrop) {
    productModalBackdrop.addEventListener('click', closeProductModal);
  }
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
      closeProductModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
  });
}

initProductModal();
updateCartCount();
loadProducts();
