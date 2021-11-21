import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

process.env.VITE_HELLO = "World";
process.env.VITE_HELLO2 = "World2";

console.log("A", process.env.VITE_HELLO);
console.log("B", process.env.VITE_HELLO2);

export default defineConfig({
  plugins: [react()]
});
