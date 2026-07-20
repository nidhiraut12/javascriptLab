const products = [
  { id: 'shirt', name: 'Classic Shirt', price: 800, icon: '✦', color: 'lilac' },
  { id: 'jeans', name: 'Everyday Jeans', price: 1200, icon: '⌁', color: 'yellow' },
  { id: 'shoes', name: 'Cloud Shoes', price: 2500, icon: '◈', color: 'pink' },
  { id: 'watch', name: 'Minimal Watch', price: 1800, icon: '◷', color: 'green' },
  { id: 'cap', name: 'Weekend Cap', price: 600, icon: '◒', color: 'orange' },
  { id: 'bag', name: 'Daily Bag', price: 900, icon: '▱', color: 'blue' },
  { id: 'belt', name: 'Leather Belt', price: 400, icon: '⎯', color: 'peach' }
];

const money = value => `₹${value.toLocaleString('en-IN')}`;
const getCart = () => JSON.parse(localStorage.getItem('styleCornerCart') || '[]');
const saveCart = cart => localStorage.setItem('styleCornerCart', JSON.stringify(cart));

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function addToCart(id) {
  const cart = getCart();
  const current = cart.find(item => item.id === id);
  current ? current.quantity++ : cart.push({ id, quantity: 1 });
  saveCart(cart);
  updateCartCount();
  showToast('Added to your bag ✦');
}

function renderProducts() {
  const list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-art ${product.color}"><span>${product.icon}</span></div>
      <div class="product-details"><h3>${product.name}</h3><p>${money(product.price)}</p></div>
      <button class="add-button" data-id="${product.id}">Add to bag <span>+</span></button>
    </article>`).join('');
  list.addEventListener('click', event => {
    const button = event.target.closest('.add-button');
    if (button) addToCart(button.dataset.id);
  });
}

function cartDetails() {
  return getCart().map(item => ({ ...products.find(product => product.id === item.id), quantity: item.quantity }));
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const items = cartDetails();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  container.innerHTML = items.length ? items.map(item => `
    <article class="cart-item">
      <div class="cart-art product-art ${item.color}"><span>${item.icon}</span></div>
      <div class="cart-item-info"><h3>${item.name}</h3><p>${money(item.price)} each</p></div>
      <div class="quantity-control"><button data-action="decrease" data-id="${item.id}" aria-label="Reduce quantity">−</button><span>${item.quantity}</span><button data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button></div>
      <strong>${money(item.price * item.quantity)}</strong>
      <button class="remove-button" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
    </article>`).join('') : `<div class="empty-cart"><div>🛍</div><h3>Your bag is waiting.</h3><p>Add a few favourites to see them here.</p><a class="primary-button" href="index.html">Shop products</a></div>`;
  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('total').textContent = money(subtotal);
  document.getElementById('calculate-bill').disabled = !items.length;
  document.getElementById('generate-bill').disabled = !items.length;
}

function changeQuantity(id, action) {
  let cart = getCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  if (action === 'increase') item.quantity++;
  if (action === 'decrease') item.quantity--;
  if (action === 'remove' || item.quantity < 1) cart = cart.filter(entry => entry.id !== id);
  saveCart(cart); updateCartCount(); renderCart();
}

function showInvoice() {
  const items = cartDetails();
  const invoice = document.getElementById('invoice');
  if (!items.length) return;
  const name = document.getElementById('customer-name').value.trim() || 'Valued Customer';
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  invoice.hidden = false;
  invoice.innerHTML = `<div class="invoice-header"><div><p class="eyebrow">STYLE CORNER</p><h2>Shopping Bill</h2></div><span>${new Date().toLocaleDateString('en-IN')}</span></div><p class="invoice-customer">Billed to <strong>${name}</strong></p><div class="invoice-items">${items.map(item => `<div><span>${item.name} <small>× ${item.quantity}</small></span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}</div><div class="invoice-total"><span>Total paid</span><strong>${money(total)}</strong></div><p class="invoice-note">Thank you for shopping with us. Wear it your way ✦</p>`;
  invoice.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(); renderProducts(); renderCart();
  document.getElementById('cart-items')?.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button) changeQuantity(button.dataset.id, button.dataset.action);
  });
  document.getElementById('calculate-bill')?.addEventListener('click', showInvoice);
  document.getElementById('generate-bill')?.addEventListener('click', () => window.print());
});
