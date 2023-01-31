import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      external: ["@aws-sdk/client-lambda"]
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
