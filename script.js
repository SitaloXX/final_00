// ============================================================
// PUIME RESTAURANT - MAIN JAVASCRIPT
// ============================================================

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize app
function initializeApp() {
  updateCartCount();
  displayCart();
  setupNavLinks();
  initGalleryCarousel();
  updateActiveLink(window.location.hash.slice(1) || 'home');
}

function setupNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const pageName = this.dataset.page || this.id.replace(/^nav-/, '');
      if (pageName) {
        updateActiveLink(pageName);
      }
      const navMenu = document.getElementById('nav');
      if (navMenu && navMenu.classList.contains('show')) {
        toggleMenu();
      }
    });
  });

  const bookBtn = document.getElementById('reservation-link');
  if (bookBtn) {
    bookBtn.addEventListener('click', function(event) {
      event.preventDefault();
      showPage('reservation');
      window.location.hash = 'reservation';
    });
  }
}

function updateActiveLink(pageName) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });
}

function initGalleryCarousel() {
  const carousel = document.querySelector('.gallery-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevBtn = carousel.querySelector('.carousel-control.prev');
  const nextBtn = carousel.querySelector('.carousel-control.next');
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  carousel.appendChild(dots);

  let currentIndex = 0;

  function updateSlide(index) {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });
    dots.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('active', buttonIndex === index);
    });
    currentIndex = index;
  }

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.setAttribute('type', 'button');
    dot.setAttribute('aria-label', `Gallery slide ${slideIndex + 1}`);
    dot.addEventListener('click', () => updateSlide(slideIndex));
    dots.appendChild(dot);
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlide(nextIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      updateSlide(nextIndex);
    });
  }

  updateSlide(0);
}

// ============================================================
// PAGE NAVIGATION
// ============================================================

function showPage(pageName) {
  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  updateActiveLink(pageName);

  const navMenu = document.getElementById('nav');
  if (navMenu && navMenu.classList.contains('show')) {
    toggleMenu();
  }
}

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================

function toggleMenu() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('show');
}

// Close menu when a link is clicked
document.addEventListener('click', function(event) {
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');
  
  if (nav && nav.classList.contains('show')) {
    if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
      nav.classList.remove('show');
    }
  }
});

// ============================================================
// CART MANAGEMENT
// ============================================================

function addToCart(itemName, price) {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === itemName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: itemName,
      price: price,
      quantity: 1
    });
  }

  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  // Show feedback
  showNotification(`${itemName} added to cart!`);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function updateCartQuantity(itemId, quantity) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function displayCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartMsg = document.getElementById('empty-cart-msg');
  const checkoutSection = document.getElementById('checkout-section');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (emptyCartMsg) emptyCartMsg.style.display = 'block';
    if (checkoutSection) checkoutSection.style.display = 'none';
    if (cartTotal) cartTotal.innerHTML = 'Total: Rs. 0';
    return;
  }

  if (emptyCartMsg) emptyCartMsg.style.display = 'none';
  if (checkoutSection) checkoutSection.style.display = 'block';

  let html = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <br><small>Rs. ${item.price} each</small>
        </div>
        <div>
          <input type="number" min="1" value="${item.quantity}" 
                 onchange="updateCartQuantity(${item.id}, this.value)" 
                 style="width: 60px; padding: 8px; border: 1px solid var(--border-gold); border-radius: 4px; background: var(--card-dark); color: white;">
        </div>
        <div>
          <strong>Rs. ${itemTotal}</strong>
        </div>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;
  if (cartTotal) cartTotal.innerHTML = `Total: Rs. ${total}`;

  // Update hidden input fields
  document.getElementById('itemsInput').value = JSON.stringify(cart);
  document.getElementById('totalInput').value = total;
}

// ============================================================
// FORM SUBMISSIONS
// ============================================================

// Reservation Form Submission
function submitReservation(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    date: formData.get('date'),
    time: formData.get('time'),
    guests: formData.get('guests'),
    message: formData.get('message')
  };

  // Send to server
  fetch('save_reservation.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data)
  })
  .then(response => response.text())
  .then(result => {
    console.log('Reservation Response:', result);
    showNotification('Reservation confirmed! We will contact you soon.', 'success');
    event.target.reset();
    setTimeout(() => showPage('home'), 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error processing reservation. Please try again.', 'error');
  });
}

// Order Form Submission
function submitOrder(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    customer_name: formData.get('customer_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    payment_method: formData.get('payment_method'),
    items: formData.get('items'),
    total: formData.get('total')
  };

  // Send to server
  fetch('save_order.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data)
  })
  .then(response => response.text())
  .then(result => {
    console.log('Order Response:', result);
    showNotification('Order placed successfully! Thank you for ordering.', 'success');
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    event.target.reset();
    setTimeout(() => showPage('home'), 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error placing order. Please try again.', 'error');
  });
}

// Contact Form Submission
function submitContact(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  // For now, just show a success message
  showNotification('Message sent successfully! We will contact you soon.', 'success');
  event.target.reset();
}

// ============================================================
// NOTIFICATIONS
// ============================================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  input[type="number"] {
    font-family: Arial, sans-serif;
  }
`;
document.head.appendChild(style);

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Get cart total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    displayCart();
  }
}

// ============================================================
// HASH-BASED ROUTING
// ============================================================

window.addEventListener('hashchange', function() {
  const page = window.location.hash.slice(1) || 'home';
  showPage(page);
});

// Initial page load
window.addEventListener('load', function() {
  const page = window.location.hash.slice(1) || 'home';
  showPage(page);
});
