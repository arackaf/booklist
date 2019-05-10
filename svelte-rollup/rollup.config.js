import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";

import babel from "rollup-plugin-babel";

const production = true || !process.env.ROLLUP_WATCH;

const plugins = [
  svelte({
    legacy: true,
    // enable run-time checks when not in production
    dev: !production,
    // we'll extract any component CSS out into
    // a separate file — better for performance
    css: css => {
      css.write("public/bundle.css");
    }
  }),

  babel({
    exclude: "node_modules/**",
    presets: ["@babel/preset-react"]
  }),

  replace({
    "process.env.NODE_ENV": JSON.stringify("production")
  }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration —
  // consult the documentation for details:
  // https://github.com/rollup/rollup-plugin-commonjs
  resolve(),
  commonjs(),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser()
];

export default [
  {
    input: "src/main-react.js",
    output: {
      format: "iife",
      name: "app",
      file: "public/bundle.js"
    },
    plugins
  }
];
