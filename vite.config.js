// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "AITextEnhancer",
      fileName: (format) => `ai-text-enhancer.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Asegúrate de que marked.js sea tratado como external
      external: ["marked"],
      output: {
        // Mantén los globals para UMD build
        globals: {
          marked: "marked",
        },
      },
    },
    minify: "terser",
    sourcemap: true,
  },
  plugins: [],
});
