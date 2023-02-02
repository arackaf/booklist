import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      //edge: true
    }),
    alias: {
      $styles: "src/styles",
      $lib: "src/lib",
      $data: "src/data",
      $lambda: "src/lambda"
    }
  }
};

export default config;
