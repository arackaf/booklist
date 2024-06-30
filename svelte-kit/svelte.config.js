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
      $styles: "src/styles",
      $lib: "src/lib",
      $db: "src/db",
      $data: "src/data",
      $lambda: "src/lambda"
    }
  }
};

export default config;
