// js/main.js

// This "main" function runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  
    // 1. Load user balance from localStorage
    loadBalance();
    loadCartState();
    // 2. Fetch data
    // Use Promise.all to fetch products and reviews at the same time
    const [products, reviews] = await Promise.all([
      fetchProducts(),
      fetchReviews()
    ]);
    
    // 3. Store products in a global-like variable (if needed)
    // We pass it to the functions that need it instead
    
    // 4. Display UI elements
    displayProducts(products);
    displayReviews(reviews);
    
    // 5. Populate dynamic UI
    // Get unique categories from products
    const categories = ['All', ...new Set(products.map(p => p.category))];
    displayCategoryFilters(categories);
    
    // 6. Initialize all features
    initBannerSlider();
    initReviewSlider();
    initSearchAndFilter(products);
    initActiveNavOnScroll();
    initBackToTopButton();
    initContactForm();
  
    // 7. Setup all event listeners for dynamic content
    setupEventListeners();
  
    // 8. Calculate initial cart totals (to show 60.00 BDT)
    calculateTotals();
  });
  
  /**
   * Sets up all event listeners for the application.
   */
  function setupEventListeners() {
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    // --- Cart Toggling ---
    document.getElementById('open-cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    
    // --- Add Money ---
    document.getElementById('add-money-btn').addEventListener('click', addMoney);
    
    // --- Apply Coupon ---
    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);
  
    // --- Add to Cart (Event Delegation) ---
    // We listen on the parent 'product-list' for clicks.
    // This works even for products added dynamically.
    document.getElementById('product-list').addEventListener('click', (event) => {
      // Find the closest parent button with the correct class
      const cartButton = event.target.closest('.add-to-cart-btn');
      
      if (cartButton) {
        // Get product info from the 'data-' attributes
        const { productId, productTitle, productPrice, productImage } = cartButton.dataset;
        
        const product = {
          id: parseInt(productId), // Ensure ID is a number
          title: productTitle,
          price: parseFloat(productPrice), // Ensure price is a number
          image: productImage
        };
        
        addItemToCart(product);
      }
    });
    
   // --- Cart Quantity Controls (Event Delegation) ---
  document.getElementById('cart-items-container').addEventListener('click', (event) => {
    const incrementButton = event.target.closest('.cart-increment-btn');
    const decrementButton = event.target.closest('.cart-decrement-btn');
    
    if (incrementButton) {
      const { productId } = incrementButton.dataset;
      incrementCartItem(parseInt(productId));
      return; // Stop further checks
    }
    
    if (decrementButton) {
      const { productId } = decrementButton.dataset;
      decrementCartItem(parseInt(productId));
      return; // Stop further checks
    }
  });
  }