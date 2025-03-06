// vite.config.js principal (para ai-text-enhancer)
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "AITextEnhancer",
      formats: ["es", "umd"],
      fileName: (format) => `ai-text-enhancer.${format}.js`,
    },
    rollupOptions: {
      external: ["marked"],
      output: {
        globals: {
          marked: "marked",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "ai-text-enhancer.css";
          }
          return assetInfo.name;
        },
      },
    },
    sourcemap: true,
    minify: "terser",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
