import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [tailwindcss(), sveltekit()]
};
