let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const found = cart.find(p => p.name === product.name);
  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
}

function removeFromCart(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cart-summary');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let productTotal = 0;
  cartContainer.innerHTML = '';

  cart.forEach(item => {
    const subtotal = parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity;
    productTotal += subtotal;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        $${subtotal.toFixed(2)}
        <div>
          <button onclick="updateQuantity('${item.name}', -1)">-</button>
          ${item.quantity}
          <button onclick="updateQuantity('${item.name}', 1)">+</button>
          <button onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
      </div>
    `;
  });

  const shipping = 50;
  const vat = productTotal * 0.2;
  const grandTotal = productTotal + shipping + vat;

  cartContainer.innerHTML += `
    <hr>
    <p>Product Total: $${productTotal.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <p>VAT (20%): $${vat.toFixed(2)}</p>
    <strong>Grand Total: $${grandTotal.toFixed(2)}</strong>
  `;
}

function updateQuantity(name, change) {
  const item = cart.find(p => p.name === name);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(name);
  else saveCart();
  renderCart();
}

// Checkout
const form = document.getElementById('checkout-form');
if (form) {
  renderCart();
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alert('Please complete all required fields correctly.');
      return;
    }
    document.getElementById('confirmation-modal').classList.remove('hidden');
    const summary = document.getElementById('order-summary');
    summary.innerHTML = cart.map(item => `<p>${item.name} × ${item.quantity}</p>`).join('');
    cart = [];
    saveCart();
  });
}

// Order page
const finalSummary = document.getElementById('final-order-details');
if (finalSummary) {
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];
  finalSummary.innerHTML = lastOrder.map(item => `<p>${item.name} × ${item.quantity}</p>`).join('');
}

// Attach to Add to Cart buttons
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn')) {
    const productContainer = e.target.closest('.product-info');
    if (!productContainer) return;
    const name = productContainer.querySelector('h2').textContent;
    const price = productContainer.querySelector('.price').textContent;
    addToCart({ name, price });
    alert(`${name} added to cart.`);
  }
});

