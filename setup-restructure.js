// setup-restructure.js
const fs = require("fs");
const path = require("path");

// Directory structure to create
const directories = [
  "src/AITextEnhancer/components",
  "src/AITextEnhancer/services",
  "src/AITextEnhancer/utils",
  "src/AITextEnhancer/styles/base",
  "src/AITextEnhancer/styles/components",
  "src/AITextEnhancer/styles/layout",
  "src/AITextEnhancer/constants",
  "src/AITextEnhancer/features"
];

// File moves mapping (source -> destination)
const fileMoves = {
  "src/components/AITextEnhancer/index.js": "src/AITextEnhancer/index.js",
  "src/components/AITextEnhancer/template.js": "src/AITextEnhancer/template.js",
  "src/components/ChatWithImage.js": "src/AITextEnhancer/components/ChatWithImage.js",
  "src/components/ResponseHistory.js": "src/AITextEnhancer/components/ResponseHistory.js",
  "src/components/ToolBar.js": "src/AITextEnhancer/components/ToolBar.js",
  "src/services/api-client.js": "src/AITextEnhancer/services/api-client.js",
  "src/services/cache-manager.js": "src/AITextEnhancer/services/cache-manager.js",
  "src/services/markdown-handler.js": "src/AITextEnhancer/services/markdown-handler.js",
  "src/services/model-manager.js": "src/AITextEnhancer/services/model-manager.js",
  "src/services/editor-adapter.js": "src/AITextEnhancer/services/editor-adapter.js",
  "src/services/token-manager.js": "src/AITextEnhancer/services/token-manager.js",
  "src/utils/dom-utils.js": "src/AITextEnhancer/utils/dom-utils.js",
  "src/utils/event-utils.js": "src/AITextEnhancer/utils/event-utils.js",
  "src/constants/translations.js": "src/AITextEnhancer/constants/translations.js",
  "src/components/AITextEnhancer/features/keyboard-navigation.js": "src/AITextEnhancer/features/keyboard-navigation.js",
  "src/components/AITextEnhancer/features/response-handlers.js": "src/AITextEnhancer/features/response-handlers.js",
  "src/components/AITextEnhancer/features/image-handlers.js": "src/AITextEnhancer/features/image-handlers.js"
};

// Import updates mapping
const importUpdates = {
  "src/AITextEnhancer/index.js": [
    { from: "../ResponseHistory.js", to: "./components/ResponseHistory.js" },
    { from: "../ChatWithImage.js", to: "./components/ChatWithImage.js" },
    { from: "../ToolBar.js", to: "./components/ToolBar.js" },
    { from: "../../services/token-manager.js", to: "./services/token-manager.js" },
    { from: "../../services/markdown-handler.js", to: "./services/markdown-handler.js" },
    { from: "../../services/api-client.js", to: "./services/api-client.js" },
    { from: "../../services/cache-manager.js", to: "./services/cache-manager.js" },
    { from: "../../services/model-manager.js", to: "./services/model-manager.js" },
    { from: "../../services/editor-adapter.js", to: "./services/editor-adapter.js" },
    { from: "../../utils/event-utils.js", to: "./utils/event-utils.js" },
    { from: "../../utils/dom-utils.js", to: "./utils/dom-utils.js" },
    { from: "../../constants/translations.js", to: "./constants/translations.js" }
  ]
};

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

async function setupNewStructure() {
  try {
    // Create directories
    console.log("Creating directories...");
    for (const dir of directories) {
      await fs.promises.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }

    // Move files
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

    // Update imports
    console.log("\nUpdating imports...");
    for (const [filePath, updates] of Object.entries(importUpdates)) {
      await updateImports(filePath, updates);
    }

    console.log("\nSetup completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Review the moved files and their imports");
    console.log("2. Run your test page to verify everything works");
    console.log("3. Delete the original files if everything is working correctly");
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  }
}

// Run the script
setupNewStructure();
