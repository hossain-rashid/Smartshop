// js/api.js

const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products';
const REVIEWS_URL = './assets/data/reviews.json';

/**
 * Fetches all products from the FakeStoreAPI.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
async function fetchProducts() {
  try {
    const response = await fetch(FAKE_STORE_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Could not fetch products:", error);
    // Return empty array or handle error as needed
    return [];
  }
}

/**
 * Fetches all reviews from the local JSON file.
 * @returns {Promise<Array>} A promise that resolves to an array of reviews.
 */
async function fetchReviews() {
  try {
    const response = await fetch(REVIEWS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error("Could not fetch reviews:", error);
    return [];
  }
}