import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      runtime: "edge",
      regions: ["iad1"]
    }),
    alias: {
      $lib: "src/lib"
    }
  }
};

export default config;
