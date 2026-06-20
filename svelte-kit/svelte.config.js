import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $styles: "src/styles",
      $lib: "src/lib",
      $db: "src/db",
      $data: "src/data",
      $lambda: "src/lambda"
    }
  }
};

export default config;
