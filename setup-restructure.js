// setup-restructure.js
const fs = require("fs");
const path = require("path");

// Estructura de directorios a crear
const directories = [
  "src/components",
  "src/services",
  "src/utils",
  "src/styles/components",
  "src/constants",
];

// Mapeo completo de archivos a mover (origen -> destino)
const fileMoves = {
  "src/ai-text-enhancer.js": "src/components/AITextEnhancer.js",
  "src/api-client.js": "src/services/api-client.js",
  "src/cache-manager.js": "src/services/cache-manager.js",
  "src/markdown-handler.js": "src/services/markdown-handler.js",
  "src/model-manager.js": "src/services/model-manager.js",
  "src/editor-adapter.js": "src/services/editor-adapter.js",
  "src/usage-control.js": "src/services/usage-control.js",
  "src/model-selector.js": "src/components/ModelSelector.js",
  "src/styles.js": "src/styles/styles.js",
  "src/translations.js": "src/constants/translations.js",
  "src/model-config.js": "src/constants/model-config.js",
};

// Mapeo de actualizaciones de importaciones necesarias
const importUpdates = {
  "src/components/AITextEnhancer.js": [
    { from: "./api-client.js", to: "../services/api-client.js" },
    { from: "./cache-manager.js", to: "../services/cache-manager.js" },
    { from: "./markdown-handler.js", to: "../services/markdown-handler.js" },
    { from: "./model-manager.js", to: "../services/model-manager.js" },
    { from: "./editor-adapter.js", to: "../services/editor-adapter.js" },
    { from: "./translations.js", to: "../constants/translations.js" },
    { from: "./styles.js", to: "../styles/styles.js" },
    { from: "./model-config.js", to: "../constants/model-config.js" },
  ],
  "src/components/ModelSelector.js": [
    { from: "./model-config.js", to: "../constants/model-config.js" },
  ],
  "src/services/model-manager.js": [
    { from: "./model-config.js", to: "../constants/model-config.js" },
  ],
};

// Función para actualizar las importaciones en un archivo
async function updateImports(filePath, updates) {
  if (!fs.existsSync(filePath)) return;

  let content = await fs.promises.readFile(filePath, "utf8");

  updates.forEach(({ from, to }) => {
    const importRegex = new RegExp(`from ['"]${from}['"]`, "g");
    content = content.replace(importRegex, `from '${to}'`);
  });

  await fs.promises.writeFile(filePath, content, "utf8");
  console.log(`Updated imports in: ${filePath}`);
}

// Función principal
async function setupNewStructure() {
  try {
    // 1. Crear directorios
    console.log("Creating directories...");
    for (const dir of directories) {
      await fs.promises.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }

    // 2. Mover archivos
    console.log("\nMoving files...");
    for (const [src, dest] of Object.entries(fileMoves)) {
      if (fs.existsSync(src)) {
        await fs.promises.mkdir(path.dirname(dest), { recursive: true });
        await fs.promises.copyFile(src, dest);
        console.log(`Moved: ${src} -> ${dest}`);
      } else {
        console.warn(`Warning: Source file not found: ${src}`);
      }
    }

    // 3. Actualizar importaciones
    console.log("\nUpdating imports...");
    for (const [filePath, updates] of Object.entries(importUpdates)) {
      await updateImports(filePath, updates);
    }

    console.log("\nCreating utility files...");
    // 4. Crear archivos de utilidades
    const utilFiles = {
      "src/utils/dom-utils.js": `
export const createTemplate = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
};

export const attachShadowTemplate = (element, template) => {
  const shadow = element.attachShadow({ mode: 'open' });
  shadow.appendChild(template.content.cloneNode(true));
  return shadow;
};`,
      "src/utils/event-utils.js": `
export const createCustomEvent = (name, detail) => {
  return new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true
  });
};

export const dispatchCustomEvent = (element, name, detail) => {
  element.dispatchEvent(createCustomEvent(name, detail));
};`,
    };

    for (const [filePath, content] of Object.entries(utilFiles)) {
      await fs.promises.writeFile(filePath, content.trim(), "utf8");
      console.log(`Created: ${filePath}`);
    }

    // 5. Crear directorio para estilos de componentes
    await fs.promises.mkdir("src/styles/components", { recursive: true });

    console.log("\nSetup completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Review the moved files and their imports");
    console.log("2. Run your test page to verify everything works");
    console.log(
      "3. Delete the original files if everything is working correctly"
    );
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  }
}

// Ejecutar el script
setupNewStructure();
