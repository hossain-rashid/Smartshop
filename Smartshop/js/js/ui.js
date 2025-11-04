// js/ui.js

// --- Product UI ---

const productList = document.getElementById('product-list');
const categoryFilters = document.getElementById('category-filters');

/**
 * Displays all products on the page.
 * @param {Array} products - An array of product objects.
 */
function displayProducts(products) {
  productList.innerHTML = ''; // Clear loading or previous items
  if (products.length === 0) {
    productList.innerHTML = '<p class="text-gray-500 col-span-full text-center">No products found.</p>';
    return;
  }
  products.forEach(product => {
    productList.innerHTML += createProductCard(product);
  });
}

/**
 * Creates the HTML string for a single product card.
 * @param {Object} product - A product object.
 * @returns {string} The HTML string for the product card.
 */
function createProductCard(product) {
  // We add 'data-' attributes to the button to pass product info
  return `
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain mb-4 rounded">
      <h3 class="text-lg font-semibold truncate" title="${product.title}">
        ${product.title}
      </h3>
      <p class="text-gray-500 text-sm mb-2">${product.category}</p>
      <div class="flex justify-between items-center mb-4">
        <span class="text-xl font-bold text-blue-600">$${product.price.toFixed(2)}</span>
        <span class="text-yellow-500">
          <i class="fa-solid fa-star"></i> ${product.rating.rate} (${product.rating.count})
        </span>
      </div>
      <button 
        class="add-to-cart-btn bg-blue-500 text-white px-4 py-2 rounded mt-auto hover:bg-blue-600 transition-colors"
        data-product-id="${product.id}"
        data-product-title="${product.title}"
        data-product-price="${product.price}"
        data-product-image="${product.image}"
      >
        Add to Cart
      </button>
    </div>
  `;
}

/**
 * Creates and displays category filter buttons.
 * @param {Array} categories - An array of category strings.
 */
function displayCategoryFilters(categories) {
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg capitalize';
    button.textContent = category;
    categoryFilters.appendChild(button);
  });
}

// --- Review UI ---

const reviewSlider = document.getElementById('review-slider');

/**
 * Displays customer reviews in the slider.
 * @param {Array} reviews - An array of review objects.
 */
function displayReviews(reviews) {
  reviewSlider.innerHTML = '';
  reviews.forEach(review => {
    reviewSlider.innerHTML += createReviewCard(review);
  });
  // Duplicate for infinite scroll effect (if desired)
  reviews.forEach(review => {
    reviewSlider.innerHTML += createReviewCard(review);
  });
}

/**
 * Creates the HTML string for a single review card.
 * @param {Object} review - A review object.
 * @returns {string} The HTML string for the review card.
 */
function createReviewCard(review) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<i class="fa-solid fa-star ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}"></i>`;
  }
  
  return `
    <div class="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
        <div class="mb-4">
          ${stars}
        </div>
        <p class="text-gray-600 mb-4 flex-grow">"${review.comment}"</p>
        <div class="mt-auto">
          <p class="font-bold text-lg">${review.name}</p>
          <p class="text-sm text-gray-500">${review.date}</p>
        </div>
      </div>
    </div>
  `;
}

// --- Cart & Balance UI ---

const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptyMsg = document.getElementById('cart-empty-msg');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const deliveryChargeEl = document.getElementById('delivery-charge');
const shippingCostEl = document.getElementById('shipping-cost');
const discountEl = document.getElementById('discount');
const finalTotalEl = document.getElementById('final-total');
const balanceEl = document.getElementById('user-balance');
const balanceWarning = document.getElementById('balance-warning');

/**
 * Updates the entire cart UI (items and totals).
 * @param {Array} cart - The current cart array.
 * @param {Object} totals - An object with {subtotal, discount, total, delivery, shipping}.
 */
function updateCartUI(cart, totals) {
  // Update cart items
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.appendChild(cartEmptyMsg);
    cartEmptyMsg.classList.remove('hidden');
  } else {
    cartEmptyMsg.classList.add('hidden');
    cart.forEach(item => {
      cartItemsContainer.innerHTML += createCartItem(item);
    });
  }
  
  // Update cart count bubble
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.classList.toggle('hidden', totalItems === 0);

  // Update totals display
  subtotalEl.textContent = `${totals.subtotal.toFixed(2)} BDT`;
  deliveryChargeEl.textContent = `${totals.delivery.toFixed(2)} BDT`;
  shippingCostEl.textContent = `${totals.shipping.toFixed(2)} BDT`;
  discountEl.textContent = `- ${totals.discount.toFixed(2)} BDT`;
  finalTotalEl.textContent = `${totals.total.toFixed(2)} BDT`;
}

/**
 * Creates the HTML string for a single cart item.
 * @param {Object} item - A cart item object.
 * @returns {string} The HTML string for the cart item.
 */
/**
 * Creates the HTML string for a single cart item.
 * @param {Object} item - A cart item object.
 * @returns {string} The HTML string for the cart item.
 */
function createCartItem(item) {
    return `
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-4">
          <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded">
          <div>
            <h4 class="font-semibold truncate w-40">${item.title}</h4>
            <p class="text-gray-600">$${item.price.toFixed(2)}</p>
            <span class="font-bold text-lg">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            class="cart-decrement-btn bg-gray-200 text-gray-700 w-7 h-7 rounded-full font-bold hover:bg-gray-300"
            data-product-id="${item.id}"
          >
            -
          </button>
          <span class="font-semibold w-6 text-center">${item.quantity}</span>
          <button 
            class="cart-increment-btn bg-gray-200 text-gray-700 w-7 h-7 rounded-full font-bold hover:bg-gray-300"
            data-product-id="${item.id}"
          >
            +
          </button>
        </div>
      </div>
    `;
  }

/**
 * Updates the balance display.
 * @param {number} balance - The new balance.
 */
function updateBalanceUI(balance) {
  balanceEl.textContent = `${balance.toFixed(2)} BDT`;
}

/**
 * Shows or hides the balance warning message.
 * @param {boolean} show - Whether to show the warning.
 */
function showBalanceWarning(show) {
  balanceWarning.classList.toggle('hidden', !show);
}

// --- Contact Form UI ---
const formMessage = document.getElementById('form-message');

/**
 * Displays a message on the contact form.
 * @param {string} message - The message to display.
 * @param {boolean} [isError=false] - Whether the message is an error.
 */
function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.className = isError 
    ? 'mt-4 text-center text-lg text-red-600'
    : 'mt-4 text-center text-lg text-green-600';
  
  // Clear message after 3 seconds
  setTimeout(() => {
    formMessage.textContent = '';
  }, 3000);
}

// --- Cart Sidebar UI ---
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
  cartSidebar.classList.remove('translate-x-full');
  cartOverlay.classList.remove('hidden');
}

function closeCart() {
  cartSidebar.classList.add('translate-x-full');
  cartOverlay.classList.add('hidden');
}