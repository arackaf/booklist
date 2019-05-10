import App from "./books/App.svelte";

const app = new App({
  target: document.body,
  props: {}
});

export default app;

function useLocalStorage(key, value) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}

function useLocalStorageState(key, defaultValue) {
  const store = writeable(localStorage.getItem(key));
  return derived;

  const stored = localStorage.getItem(key);
  const [value, setValue] = useState(stored ? JSON.parse(stored) : defaultValue);
  useLocalStorage(key, value);
  return [value, setValue];
}
