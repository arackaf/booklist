import { sveltekit } from "@sveltejs/kit/vite";

export default {
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.test.{js,ts}"],
    environment: "jsdom"
  }
};
