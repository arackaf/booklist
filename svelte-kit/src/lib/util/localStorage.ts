class LocalStorage {
  get(key: string, defaultValue = "") {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;

    let currentValue = localStorage.getItem(key);

    return currentValue || defaultValue;
  }
  set(key: string, value: string) {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;

    localStorage.setItem(key, value);
  }
}

const localStorageManager = new LocalStorage();

export default localStorageManager;
