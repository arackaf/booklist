class LocalStorage {
  get(key, defaultValue = "") {
    if (!window.localStorage) return;

    let currentValue = localStorage.getItem(key);

    return currentValue || defaultValue;
  }
  set(key, value) {
    if (!window.localStorage) return;

    localStorage.setItem(key, value);
  }
}

const localStorageManager = new LocalStorage();

export default localStorageManager;

const FIVE_MINUTES = 60 * 5 * 1000;

const BOOK_LAMBDA_PRIME_KEY = "book-cover-lambda-prime";

export function needBookCoverPriming() {
  const lastPriming = +localStorageManager.get(BOOK_LAMBDA_PRIME_KEY);
  const now = +new Date();
  if (isNaN(lastPriming) || now - lastPriming >= FIVE_MINUTES) {
    localStorageManager.set(BOOK_LAMBDA_PRIME_KEY, now);
    return true;
  }

  return false;
}
