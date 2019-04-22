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

export default new LocalStorage();
