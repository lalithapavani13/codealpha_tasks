function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const linkCart = document.getElementById('cart-count');
  if (!linkCart) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  linkCart.textContent = count;
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText || '');
    throw new Error(`Request failed ${res.status} ${body}`);
  }
  return res.json();
}

function resolveImageUrl(image) {
  const url = String(image || '').trim();
  if (!url) return '/images/placeholder.png';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
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

function idFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[0] === 'product') return parts[1];
  const query = new URLSearchParams(window.location.search);
  if (query.has('id')) return query.get('id');
  return null;
}

async function loadProduct() {
  const id = idFromPath();
  const titleEl = document.getElementById('product-title');
  const descriptionEl = document.getElementById('product-description');
  const priceEl = document.getElementById('product-price');
  const stockEl = document.getElementById('product-stock');
  const availabilityEl = document.getElementById('product-availability');
  const ratingEl = document.getElementById('product-rating');
  const imageEl = document.getElementById('product-image');
  const addBtn = document.getElementById('add-to-cart');

  if (!id) {
    if (titleEl) titleEl.textContent = 'Product not found';
    if (descriptionEl) descriptionEl.textContent = 'Unable to identify the product from the URL.';
    return;
  }

  try {
    const product = await fetchJSON(`${api}/products/${encodeURIComponent(id)}`);
    if (imageEl) imageEl.src = resolveImageUrl(product.image);
    if (titleEl) titleEl.textContent = product.name || 'Untitled product';
    if (descriptionEl) descriptionEl.textContent = product.description || 'No description available.';
    if (priceEl) priceEl.textContent = `$${(product.price || 0).toFixed(2)}`;
    if (ratingEl) ratingEl.innerHTML = renderRatingStars(product.rating);
    if (stockEl) stockEl.textContent = (product.stock || 0) > 0 ? `${product.stock} available` : 'Out of stock';
    if (availabilityEl) availabilityEl.textContent = (product.stock || 0) > 0 ? 'Ready to ship' : 'Unavailable';

    if (addBtn) {
      addBtn.disabled = (product.stock || 0) === 0;
      addBtn.addEventListener('click', () => {
        const cart = getCart();
        const prodId = product._id || product.id || id;
        const found = cart.find((item) => item.product === prodId);
        if (found) {
  found.qty += 1;
} else {
  cart.push({
    product: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    qty: 1
  });
}
        setCart(cart);
        updateCartCount();
        alert('Added to cart');
      });
    }
  } catch (err) {
    console.error('Product load error:', err);
    if (titleEl) titleEl.textContent = 'Unable to load product';
    if (descriptionEl) descriptionEl.textContent = err.message || 'Please try again later.';
    if (priceEl) priceEl.textContent = '$0.00';
    if (stockEl) stockEl.textContent = '';
    if (availabilityEl) availabilityEl.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  updateCartCount();
});
