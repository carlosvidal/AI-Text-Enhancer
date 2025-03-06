// vite.plugins.config.js (para ai-text-enhancer-plugins)
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/plugins/index.js"),
      name: "AITextEnhancerPlugins",
      formats: ["es", "umd"],
      fileName: (format) => `ai-text-enhancer-plugins.${format}.js`,
    },
    rollupOptions: {
      external: ["marked"],
      output: {
        globals: {
          marked: "marked",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
    outDir: "dist", // Asegura que se guarde en el mismo directorio
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
