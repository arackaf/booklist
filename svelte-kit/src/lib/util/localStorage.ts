class LocalStorage {
  get(key: string, defaultValue = "") {
    if (!window.localStorage) return;

    let currentValue = localStorage.getItem(key);

    return currentValue || defaultValue;
  }
  set(key: string, value: string) {
    if (!window.localStorage) return;

    localStorage.setItem(key, value);
  }
}

const localStorageManager = new LocalStorage();

export default localStorageManager;
