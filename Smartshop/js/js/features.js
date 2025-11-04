// js/features.js

// --- Banner Slider ---
let bannerIndex = 0;
let bannerSlider;
let bannerItems;

function initBannerSlider() {
  bannerSlider = document.getElementById('banner-slider');
  bannerItems = bannerSlider.children;
  if (bannerItems.length === 0) return;

  document.getElementById('banner-next').addEventListener('click', nextBanner);
  document.getElementById('banner-prev').addEventListener('click', prevBanner);

  // Auto-slide
  setInterval(nextBanner, 5000);
}

function nextBanner() {
  bannerIndex = (bannerIndex + 1) % bannerItems.length;
  updateBanner();
}

function prevBanner() {
  bannerIndex = (bannerIndex - 1 + bannerItems.length) % bannerItems.length;
  updateBanner();
}

function updateBanner() {
  bannerSlider.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// --- Review Slider ---
let reviewIndex = 0;
let reviewSliderEl;
let totalReviewItems;

function initReviewSlider() {
  reviewSliderEl = document.getElementById('review-slider');
  // We duplicated items, so we only count the first half
  totalReviewItems = reviewSliderEl.children.length / 2;
  if (!totalReviewItems) return;

  document.getElementById('review-next').addEventListener('click', nextReview);
  document.getElementById('review-prev').addEventListener('click', prevReview);
}

function nextReview() {
  reviewIndex++;
  reviewSliderEl.style.transition = 'transform 0.5s ease-in-out';
  updateReviewSlider();
  
  // Magic loop
  if (reviewIndex >= totalReviewItems) {
    setTimeout(() => {
      reviewIndex = 0;
      reviewSliderEl.style.transition = 'none';
      updateReviewSlider();
    }, 500);
  }
}

function prevReview() {
  reviewIndex--;
  reviewSliderEl.style.transition = 'transform 0.5s ease-in-out';

  if (reviewIndex < 0) {
    reviewIndex = totalReviewItems - 1;
    reviewSliderEl.style.transition = 'none';
  }
  updateReviewSlider();
}

function updateReviewSlider() {
  const width = reviewSliderEl.children[0].clientWidth;
  reviewSliderEl.style.transform = `translateX(-${reviewIndex * width}px)`;
}

// --- Search and Filter ---
function initSearchAndFilter(products) {
  const searchInput = document.getElementById('search-input');
  const filterContainer = document.getElementById('category-filters');

  searchInput.addEventListener('input', () => filterProducts(products));
  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      // Manage active state
      filterContainer.querySelector('.bg-blue-500').classList.replace('bg-blue-500', 'bg-gray-200');
      e.target.classList.replace('bg-gray-200', 'bg-blue-500');
      
      filterProducts(products);
    }
  });
}

function filterProducts(products) {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const activeCategory = document.querySelector('#category-filters .bg-blue-500').textContent;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory = (activeCategory === 'All' || product.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

// --- Sticky Nav & Active Link Highlighting ---
function initActiveNavOnScroll() {
  const navLinks = document.querySelectorAll('#nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) { // 150px offset
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-link', 'text-blue-600');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active-link', 'text-blue-600');
      }
    });
    
    // Custom style for active link (Tailwind doesn't support this easily)
    if (!document.getElementById('active-link-style')) {
      const style = document.createElement('style');
      style.id = 'active-link-style';
      style.innerHTML = `.active-link { 
        font-weight: 700; 
        color: #2563EB; /* text-blue-600 */
        border-bottom: 2px solid #2563EB;
      }`;
      document.head.appendChild(style);
    }
  });
}

// --- Back to Top Button ---
function initBackToTopButton() {
  const btn = document.getElementById('back-to-top-btn');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Contact Form ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the form from really submitting
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (name && email) {
      showFormMessage(`Thank you, ${name}! We received your message.`);
      form.reset();
    } else {
      showFormMessage('Please fill out all fields.', true);
    }
  });
}