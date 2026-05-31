const checkoutApi = '/api';

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function loadCheckout() {
  const cart = getCart();

  const itemsContainer = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');

  if (!cart.length) {
    itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;

  itemsContainer.innerHTML = '';

  cart.forEach((item) => {
    const qty = item.qty || 1;

    const subtotal = Number(item.price) * qty;

    total += subtotal;

    itemsContainer.innerHTML += `
      <div class="checkout-item">
        <img 
  src="${item.image}" 
  alt="${item.name}"
  onerror="this.style.display='none'"
  />

        <div>
          <h3>${item.name}</h3>
          <p>${qty} × ${formatPrice(item.price)}</p>
        </div>

        <strong>${formatPrice(subtotal)}</strong>
      </div>
    `;
  });

  totalEl.textContent = formatPrice(total);
}
document
  .getElementById('checkout-submit')
  .addEventListener('click', () => {

    alert('Order placed successfully!');

    localStorage.removeItem('cart');
  });
  
loadCheckout();
