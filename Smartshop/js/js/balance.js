// js/balance.js

// Use a constant for the localStorage key
const BALANCE_KEY = 'smartShopUserBalance';
const STARTING_BALANCE = 1000;

let currentBalance = STARTING_BALANCE;

/**
 * Loads the user's balance from localStorage, or sets it to default.
 */
function loadBalance() {
  const savedBalance = localStorage.getItem(BALANCE_KEY);
  if (savedBalance !== null) {
    currentBalance = parseFloat(savedBalance);
  } else {
    currentBalance = STARTING_BALANCE;
    localStorage.setItem(BALANCE_KEY, currentBalance);
  }
  updateBalanceUI(currentBalance);
}

/**
 * Adds 1000 to the user's balance and saves it.
 */
function addMoney() {
  currentBalance += 1000;
  localStorage.setItem(BALANCE_KEY, currentBalance);
  updateBalanceUI(currentBalance);
  
  // After adding money, re-check the cart totals
  // This will hide the warning if the new balance is sufficient
  calculateTotals();
}

/**
 * Gets the current balance.
 * @returns {number} The current balance.
 */
function getCurrentBalance() {
  return currentBalance;
}

/**
 * Checks if a total amount exceeds the current balance.
 * @param {number} totalAmount - The total cost of the cart.
 * @returns {boolean} True if the total is over balance, false otherwise.
 */
function isOverBalance(totalAmount) {
  return totalAmount > currentBalance;
}
/**
 * Deducts an amount from the user's balance and saves it.
 * @param {number} amount - The amount to deduct.
 */
function deductFromBalance(amount) {
    currentBalance -= amount;
    localStorage.setItem(BALANCE_KEY, currentBalance);
    updateBalanceUI(currentBalance);
  }