function formatPrice(value) {
  return `$${(value || 0).toFixed(2)}`;
}

async function fetchJSON(url, opts = {}) {
  const headers = opts.headers || {};
  const res = await fetch(url, { ...opts, headers: { Accept: 'application/json', ...headers } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

function renderOrders(orders) {
  const container = document.getElementById('orders-list');
  if (!orders.length) {
    container.innerHTML = '<p class="empty-state">You have no orders yet.</p>';
    return;
  }

  container.innerHTML = orders
    .map((order) => {
      const date = new Date(order.createdAt || Date.now()).toLocaleString();
      const items = (order.items || [])
        .map((item) => {
          const product = item.product || {};
          const name = typeof product === 'object' ? product.name || 'Product' : product || 'Product';
          const price = item.price || (product.price || 0);
          const qty = item.qty || item.quantity || 0;
          return `
            <div class="order-item">
              <div class="order-item-name">${name}</div>
              <div class="order-item-qty">Qty: ${qty}</div>
              <div class="order-item-price">${formatPrice(price)}</div>
            </div>`;
        })
        .join('');

      return `
        <article class="order-card">
          <header class="order-card-header">
            <strong>Order</strong>
            <time>${date}</time>
          </header>
          <section class="order-items">${items}</section>
          <footer class="order-meta">
            <div>Total: <strong>${formatPrice(order.total)}</strong></div>
            <div>Status: <span class="order-status">${order.status || 'Processing'}</span></div>
          </footer>
        </article>`;
    })
    .join('');
}

async function loadOrders() {
  const container = document.getElementById('orders-list');
  const token = localStorage.getItem('token');
  if (!token) {
    container.innerHTML = '<p class="empty-state">Please log in to view your orders.</p>';
    return;
  }

  try {
    const orders = await fetchJSON(`${api}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    renderOrders(orders);
  } catch (err) {
    container.innerHTML = `<p class="empty-state">${err.message || 'Unable to load orders'}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadOrders);
