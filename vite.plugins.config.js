// vite.plugins.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

// Guardar lista de archivos existentes para no sobrescribirlos
const existingFiles = fs.existsSync("dist") ? fs.readdirSync("dist") : [];

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
        // Verificar que no se sobrescriban archivos existentes
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || "";
          // Si ya existe un archivo con este nombre, añadir sufijo
          if (existingFiles.includes(fileName)) {
            return fileName.replace(".", "-plugins.");
          }
          return fileName;
        },
      },
    },
    sourcemap: true,
    minify: "terser",
    emptyOutDir: false, // Importante: Esto evita que se eliminen archivos previos
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
