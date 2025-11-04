// js/cart.js

let cart = []; // Array of cart item objects
let currentCoupon = '';

// Constants for charges
const DELIVERY_CHARGE = 50.00;
const SHIPPING_COST = 10.00;

/**
 * Adds a product to the cart or increments its quantity.
 * @param {Object} product - The product object (from the button's data attributes).
 */
/**
 * Saves a completed order to the user's localStorage.
 * This creates a simple "order history".
 */
const HISTORY_KEY = 'smartShopOrderHistory';
// js/cart.js
const CART_KEY = 'smartShopCartState'; // Key for localStorage
// Array of cart item objects
// ... (rest of the file)
function saveOrderToHistory(cartItems, orderTotals) {
  try {
    // 1. Get the existing history, or create a new empty array
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    
    // 2. Create the new order object
    const newOrder = {
      orderId: new Date().getTime(), // Simple unique ID
      date: new Date().toISOString(), // Standard date format
      
      // Create deep copies to prevent data from changing
      // when the main cart is cleared.
      items: JSON.parse(JSON.stringify(cartItems)),
      totals: JSON.parse(JSON.stringify(orderTotals))
    };
    
    // 3. Add the new order to the start of the history
    history.unshift(newOrder); // 'unshift' adds to the beginning
    
    // 4. Save the updated history back to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    console.log('Order saved to history:', newOrder);
    
  } catch (error) {
    console.error('Failed to save order history:', error);
  }
}
function addItemToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    // Add product to cart with quantity 1
    cart.push({ ...product, quantity: 1 });
  }
  
  calculateTotals(); // Recalculate after adding
  openCart(); // Show the cart
}

/**
 * Removes an item completely from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeItemFromCart(productId) {
  cart = cart.filter(item => item.id != productId);
  calculateTotals(); // Recalculate after removing
}

/**
 * Applies a coupon code.
 */
function applyCoupon() {
  const couponInput = document.getElementById('coupon-input');
  const code = couponInput.value.trim().toUpperCase();
  
  if (code === 'SMART10') {
    currentCoupon = 'SMART10';
    alert('Coupon "SMART10" applied!');
  } else {
    currentCoupon = '';
    alert('Invalid coupon code.');
  }
  
  calculateTotals(); // Recalculate with the new coupon status
}

/**
 * Calculates all totals and updates the UI.
 * This function also returns the calculated totals.
 * @returns {Object} An object containing total, subtotal, discount, etc.
 */
function calculateTotals() {
  // 1. Calculate Subtotal
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // 2. Calculate Discount
  let discount = 0;
  if (currentCoupon === 'SMART10' && subtotal > 0) {
    discount = subtotal * 0.10; // 10% discount
  }
  
  // 3. Calculate Final Total
  // Only add charges if there's something in the cart
  const charges = (subtotal > 0) ? (DELIVERY_CHARGE + SHIPPING_COST) : 0;
  const total = subtotal + charges - discount;
  
  // 4. Check against balance
  const balance = getCurrentBalance();
  const overBalance = isOverBalance(total);
  
  // 5. Update UI
  // Send all data to the UI functions
  const totalsData = {
    subtotal: subtotal,
    delivery: (subtotal > 0) ? DELIVERY_CHARGE : 0,
    shipping: (subtotal > 0) ? SHIPPING_COST : 0,
    discount: discount,
    total: total
  };
  
  updateCartUI(cart, totalsData);
  showBalanceWarning(overBalance);
  saveCartState();
  // Return the data so other functions (like checkout) can use it
  return totalsData;
}

/**
 * Clears the cart, resets the coupon, and recalculates.
 */
function clearCart() {
  cart = [];
  currentCoupon = ''; // Reset coupon
  document.getElementById('coupon-input').value = ''; // Clear input
  calculateTotals(); // Update UI to show empty cart
}

/**
 * Handles the checkout process.
 */
function handleCheckout() {
  // 1. Get current totals and balance
  const totals = calculateTotals(); // Run calculation again to get fresh data
  const balance = getCurrentBalance();
  
  // 2. Check if cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add products to checkout.");
    return;
  }
  
  // 3. Check if over balance
  if (isOverBalance(totals.total)) {
    alert("Checkout failed: Total exceeds your available balance.");
    return;
  }
  
  // 4. All checks passed! Process payment.
  deductFromBalance(totals.total);
  saveOrderToHistory(cart, totals);
  // 5. Show success message
  alert(`Purchase complete!
  
Total Paid: ${totals.total.toFixed(2)} BDT
New Balance: ${getCurrentBalance().toFixed(2)} BDT
  
Thank you for shopping with SmartShop!`);
  
  // 6. Clear the cart
  clearCart();
  
  // 7. Close the cart sidebar
  closeCart();
}
/**
 * Increments the quantity of an item already in the cart.
 * @param {number} productId - The ID of the product to increment.
 */
function incrementCartItem(productId) {
    const item = cart.find(item => item.id == productId);
    if (item) {
      item.quantity++;
    }
    calculateTotals(); // Recalculate totals
  }
  
  /**
   * Decrements the quantity of an item. If quantity reaches 0, removes it.
   * @param {number} productId - The ID of the product to decrement.
   */
  function decrementCartItem(productId) {
    const item = cart.find(item => item.id == productId);
    
    if (item) {
      item.quantity--;
      
      if (item.quantity === 0) {
        // Use the existing remove function
        removeItemFromCart(item.id);
      } else {
        // Just recalculate if item is still in cart
        calculateTotals();
      }
    }
  }
  /**
 * Saves the current cart and coupon to localStorage.
 */
function saveCartState() {
    const state = {
      cartItems: cart,
      couponCode: currentCoupon
    };
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  }
  
  /**
   * Loads the cart and coupon from localStorage.
   */
  function loadCartState() {
    const savedState = JSON.parse(localStorage.getItem(CART_KEY));
    
    if (savedState) {
      cart = savedState.cartItems || [];
      currentCoupon = savedState.couponCode || '';
      
      // Also update the coupon input field if a coupon was loaded
      if (currentCoupon) {
        document.getElementById('coupon-input').value = currentCoupon;
      }
    }
  }