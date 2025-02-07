// ai-text-enhancer.js

import { styles } from "./styles.js";
import { MarkdownHandler } from "./markdown-handler.js";
import { createAPIClient } from "./api-client.js";
import { createCacheManager } from "./cache-manager.js";
import { ModelManager } from "./model-manager.js";
import { TRANSLATIONS } from "./translations.js";
import { EditorAdapter } from "./editor-adapter.js";

class AITextEnhancer extends HTMLElement {
  constructor() {
    super();
    this.responseHistory = [];
    this.attachShadow({ mode: "open" });
    this.editorAdapter = null;
    this.currentAction = "improve";

    // Initialize cache manager
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1000, // 30 minutes
    });

    this.modelManager = new ModelManager();

    // Initialize components
    this.markdownHandler = new MarkdownHandler();
    this.enhancedText = "";
    this.chatMessages = [];
    this.isInitialized = false;
    this.productImage = null;

    // El control de uso ahora es opcional
    this.usageControl = null;
  }

  addResponseToHistory(action, content) {
    const response = {
      id: Date.now(),
      action,
      content,
      timestamp: new Date(),
    };
    this.responseHistory.push(response);
    this.renderResponseHistory();
  }

  renderResponseHistory() {
    const preview = this.shadowRoot.querySelector(".preview");
    preview.innerHTML = this.responseHistory
      .map(
        (response) => `
        <div class="response-entry" data-id="${response.id}">
          <div class="response-header">
            <div class="response-tool">
              ${this.getToolIcon(response.action)}
              ${this.translations.tools[response.action]}
            </div>
            <div class="response-timestamp">
              ${this.formatTimestamp(response.timestamp)}
            </div>
          </div>
          <div class="response-content">
            ${this.markdownHandler.convertToHTML(response.content)}
          </div>
          <div class="response-actions">
            <button class="response-action copy-button" data-response-id="${
              response.id
            }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
            <button class="response-action primary use-button" data-response-id="${
              response.id
            }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m5 12 5 5L20 7"></path>
              </svg>
              Use This
            </button>
          </div>
        </div>
      `
      )
      .join("");

    // Agregar event listeners después de renderizar
    this.addResponseEventListeners();
  }

  // Nuevo método para agregar event listeners
  addResponseEventListeners() {
    // Event listeners para botones de copiar
    this.shadowRoot.querySelectorAll(".copy-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const responseId = e.target.closest("button").dataset.responseId;
        this.copyToClipboard(responseId);
      });
    });

    // Event listeners para botones de usar
    this.shadowRoot.querySelectorAll(".use-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const responseId = e.target.closest("button").dataset.responseId;
        this.useResponse(responseId);
      });
    });
  }

  getToolIcon(action) {
    const icons = {
      improve: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
        </svg>
      `,
      summarize: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-minus">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/>
        </svg>
      `,
      expand: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-plus">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/>
          <path d="M12 7v6"/>
        </svg>
      `,
      paraphrase: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart">
          <path d="M21 6H3"/>
          <path d="M7 12H3"/>
          <path d="M7 18H3"/>
          <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
          <path d="M11 10v4h4"/>
        </svg>
      `,
      formal: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      `,
      casual: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" x2="9.01" y1="9" y2="9"/>
          <line x1="15" x2="15.01" y1="9" y2="9"/>
        </svg>
      `,
      generate: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      `,
    };

    // Si no existe el ícono para la acción, devolver el ícono de improve por defecto
    return icons[action] || icons.improve;
  }

  formatTimestamp(date) {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  static get observedAttributes() {
    return [
      "editor-id",
      "api-key",
      "api-provider",
      "api-model",
      "language",
      "prompt",
      "context",
      "image-url",
      "tenant-id",
      "user-id",
      "quota-endpoint",
    ];
  }

  // Getters for attributes
  get language() {
    return this.getAttribute("language") || "en";
  }

  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }

  get editorId() {
    return this.getAttribute("editor-id");
  }

  get apiKey() {
    return this.getAttribute("api-key");
  }

  get currentContent() {
    return this.editorAdapter?.getContent() || "";
  }

  get apiProvider() {
    return this.getAttribute("api-provider") || "openai";
  }

  get apiModel() {
    const model = this.getAttribute("api-model");
    try {
      // Validate model exists for current provider
      return this.modelManager.getModelConfig(model)?.id;
    } catch {
      // Return default model if specified model is invalid
      return this.modelManager.getDefaultModel();
    }
  }

  get imageUrl() {
    return this.getAttribute("image-url");
  }

  get context() {
    return this.getAttribute("context") || "";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "api-key":
        if (this.apiClient) {
          this.apiClient.setApiKey(newValue);
        } else if (!this.isInitialized) {
          // If component isn't initialized, reinitialize with new API key
          this.initializeComponents();
        }
        break;
      case "api-provider":
        if (this.isInitialized) {
          this.modelManager.setProvider(newValue);
          if (this.apiClient) {
            this.apiClient.setProvider(newValue);
            const defaultModel = this.modelManager.getDefaultModel();
            this.setAttribute("api-model", defaultModel);
          }
        }
        break;
      case "api-model":
        if (this.isInitialized && this.apiClient) {
          try {
            const modelConfig = this.modelManager.getModelConfig(newValue);
            this.apiClient.setModel(newValue);
          } catch (error) {
            console.warn(
              `Invalid model ${newValue} for provider ${this.apiProvider}`
            );
            const defaultModel = this.modelManager.getDefaultModel();
            this.setAttribute("api-model", defaultModel);
          }
        }
        break;
      case "language":
        if (this.isInitialized) {
          this.updateTranslations();
        }
        break;
      case "image-url":
        if (this.isInitialized) {
          console.log("Setting image URL:", newValue);
          this.handleImageUrlChange(newValue);
        }
        break;
    }

    // No ejecutar improve automáticamente cuando cambia editor-id
    if (name === "editor-id" && oldValue !== null) {
      this.handleToolAction("improve");
    }
  }

  updateTranslations() {
    // Actualizar textos en el modal
    const t = this.translations;

    // Botón principal
    this.shadowRoot.querySelector(".modal-trigger").textContent =
      t.modalTrigger;

    // Título del modal
    this.shadowRoot.querySelector(".modal-header h2").textContent =
      t.modalTitle;

    // Pestañas
    this.shadowRoot.querySelectorAll(".tab-button").forEach((tab) => {
      const tabKey = tab.dataset.tab;
      tab.textContent = t.tabs[tabKey];
    });

    // Botones de herramientas
    this.shadowRoot.querySelectorAll(".tool-button").forEach((tool) => {
      const actionKey = tool.dataset.action;
      tool.textContent = t.tools[actionKey];
    });

    // Botones de acción
    this.shadowRoot
      .querySelectorAll(".action-button[data-action]")
      .forEach((action) => {
        const actionKey = action.dataset.action;
        action.textContent = t.actions[actionKey];
      });

    // Placeholder del preview
    const preview = this.shadowRoot.querySelector(".preview");
    if (preview.textContent === TRANSLATIONS.en.preview.placeholder) {
      preview.textContent = t.preview.placeholder;
    }

    // Chat
    const chatInput = this.shadowRoot.querySelector(".chat-input");
    chatInput.placeholder = t.chat.placeholder;
    this.shadowRoot.querySelector(".chat-form button").textContent =
      t.chat.send;
  }

  bindEvents() {
    // Modal trigger
    this.shadowRoot.querySelector(".modal-trigger").onclick = () => {
      this.shadowRoot.querySelector(".modal").classList.add("open");
      this.updateVisibleTools();
      // Renderizar el historial existente en lugar de limpiar el preview
      if (this.responseHistory.length > 0) {
        this.renderResponseHistory();
      } else {
        this.updatePreview(this.translations.preview.placeholder);
      }
    };

    // Close button
    this.shadowRoot.querySelector(".close-button").onclick = () => {
      this.shadowRoot.querySelector(".modal").classList.remove("open");
    };

    // Click outside modal
    this.shadowRoot.querySelector(".modal").onclick = (e) => {
      if (e.target === this.shadowRoot.querySelector(".modal")) {
        this.shadowRoot.querySelector(".modal").classList.remove("open");
      }
    };

    // Tabs
    this.shadowRoot.querySelectorAll(".tab-button").forEach((tab) => {
      tab.onclick = () => {
        this.shadowRoot
          .querySelectorAll(".tab-button")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        this.shadowRoot.querySelectorAll(".tab-content").forEach((content) => {
          content.style.display =
            content.dataset.tab === tab.dataset.tab ? "block" : "none";
        });
      };
    });

    // Tools
    this.shadowRoot.querySelectorAll(".tool-button").forEach((tool) => {
      tool.onclick = () => {
        // Set active tool
        this.shadowRoot
          .querySelectorAll(".tool-button")
          .forEach((t) => t.classList.remove("active"));
        tool.classList.add("active");
        this.currentAction = tool.dataset.action;

        // Auto-generate when a tool is clicked if there's content
        if (this.currentContent.trim()) {
          this.handleToolAction(this.currentAction);
        }
      };
    });

    // Actions
    this.shadowRoot
      .querySelectorAll(".action-button[data-action]")
      .forEach((action) => {
        action.onclick = () => this.handleAction(action.dataset.action);
      });

    // Chat form
    this.shadowRoot.querySelector(".chat-form").onsubmit = (e) =>
      this.handleChatSubmit(e);

    // El botón improve/generate está en tools
    const improveButton = this.shadowRoot.querySelector(
      '[data-action="improve"]'
    );
    improveButton.onclick = () => {
      this.handleToolAction(this.currentAction);
    };
  }

  updateVisibleTools() {
    const hasContent = Boolean(this.currentContent.trim());
    const t = this.translations;
    const tools = this.shadowRoot.querySelectorAll(".tool-button");
    const improveButton = this.shadowRoot.querySelector(
      '[data-action="improve"]'
    );

    // Actualizar el texto e icono del botón improve/generate
    if (!hasContent) {
      improveButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
        ${t.actions.generate}
      `;
    } else {
      improveButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
        </svg>
        ${t.tools.improve}
      `;
    }

    // Mostrar/ocultar otras herramientas
    tools.forEach((tool) => {
      const action = tool.dataset.action;
      if (hasContent) {
        tool.style.display = "inline-flex"; // Mostrar todas las herramientas
      } else {
        // Cuando no hay contenido, solo mostrar el botón generate (improve transformado)
        tool.style.display = action === "improve" ? "inline-flex" : "none";
      }
    });
  }

  createTemplate() {
    const t = this.translations;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>${styles}</style>
      <button class="modal-trigger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-wand-sparkles"
        >
          <path
            d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"
          />
          <path d="m14 7 3 3" />
          <path d="M5 6v4" />
          <path d="M19 14v4" />
          <path d="M10 2v2" />
          <path d="M7 8H3" />
          <path d="M21 16h-4" />
          <path d="M11 3H9" />
        </svg>
        <span>${t.modalTrigger}</span>
      </button>
      
      <div class="modal">
        <div class="modal-content">
          <button class="close-button">×</button>
          <div class="modal-header">
            <h2>${t.modalTitle}</h2>
          </div>
          
          <div class="modal-body">
            <div class="editor-section">
            <!-- Add image upload section before tools -->
            <div class="image-upload">
              <div class="image-preview" id="imagePreview">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                  <line x1="16" y1="5" x2="22" y2="5"/>
                  <line x1="19" y1="2" x2="19" y2="8"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <button class="upload-button" id="uploadButton" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                  <line x1="16" y1="5" x2="22" y2="5"/>
                  <line x1="19" y1="2" x2="19" y2="8"/>
                </svg>
                Upload Product Image
              </button>
              <input type="file" id="imageInput" accept="image/*" style="display: none;">
            </div>
              <div class="tools">
                <button class="tool-button" data-action="improve">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>
                  ${t.tools.improve}
                </button>
                <button class="tool-button" data-action="summarize">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-minus"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 10h6"/></svg>
                  ${t.tools.summarize}
                </button>
                <button class="tool-button" data-action="expand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-plus"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 10h6"/><path d="M12 7v6"/></svg>
                  ${t.tools.expand}
                </button>
                <button class="tool-button" data-action="paraphrase">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart"><path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>
                  ${t.tools.paraphrase}
                </button>
                <button class="tool-button" data-action="formal">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  ${t.tools.formal}
                </button>
                <button class="tool-button" data-action="casual">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                  ${t.tools.casual}
                </button>
              </div>

              <div class="preview">${t.preview.placeholder}</div>
        
              <div class="actions">
                <button class="action-button" data-action="retry">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart"><path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>
                  ${t.actions.retry}
                </button>
                <button class="action-button success" data-action="insert">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-between-horizontal-start"><rect width="13" height="7" x="8" y="3" rx="1"/><path d="m2 9 3 3-3 3"/><rect width="13" height="7" x="8" y="14" rx="1"/></svg>                  ${t.actions.insert}
                </button>
                <button class="action-button primary" data-action="replace">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-replace"><path d="M14 4c0-1.1.9-2 2-2"/><path d="M20 2c1.1 0 2 .9 2 2"/><path d="M22 8c0 1.1-.9 2-2 2"/><path d="M16 10c-1.1 0-2-.9-2-2"/><path d="m3 7 3 3 3-3"/><path d="M6 10V5c0-1.7 1.3-3 3-3h1"/><rect width="8" height="8" x="2" y="14" rx="2"/></svg>
                  ${t.actions.replace}
                </button>
              </div>
            </div>
            
            <div class="chat-section">
              <div class="chat-container"></div>
              <form class="chat-form">
                <input type="text" class="chat-input" placeholder="${t.chat.placeholder}">
                <button type="submit" class="action-button primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    return template;
  }

  connectedCallback() {
    try {
      const template = this.createTemplate();
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.bindEvents();
      this.bindImageUploadEvents(); // Add this line
      this.initializeComponents();

      if (this.apiKey) {
        this.apiClient?.setApiKey(this.apiKey);
      }
    } catch (error) {
      console.error(this.translations.errors.initialization, error);
    }
    this.editorAdapter = new EditorAdapter(this.editorId);
  }

  async initializeComponents() {
    try {
      await this.markdownHandler.initialize();

      this.modelManager.setProvider(this.apiProvider);

      this.apiClient = createAPIClient({
        provider: this.apiProvider,
        model: this.apiModel,
        systemPrompt:
          this.getAttribute("prompt") ||
          "Actúa como un experto en redacción de descripciones de productos para tiendas en línea.\n\n" +
            "Tu tarea es generar o mejorar la descripción de un producto con un enfoque atractivo y persuasivo, destacando sus características principales, beneficios y posibles usos.\n\n" +
            "Si el usuario ya ha escrito una descripción: Mejórala manteniendo su esencia, pero haciéndola más clara, persuasiva y optimizada para ventas.\n\n" +
            "Si la descripción está vacía: Genera una nueva descripción atractiva, destacando características y beneficios. Usa un tono profesional y cercano, adaptado a una tienda en línea.\n\n" +
            "Si hay una imagen del producto, aprovecha los detalles visuales para enriquecer la descripción.\n\n" +
            "Si aplica, menciona información relevante del comercio para reforzar la confianza del comprador (envíos, garantía, atención al cliente, etc.).\n\n" +
            "Mantén el texto claro, sin repeticiones innecesarias, y optimizado para SEO si es posible.",
      });

      // Set API key if available
      if (this.apiKey) {
        this.apiClient.setApiKey(this.apiKey);
      }

      // Inicializar UsageControl solo si se proporciona quota-endpoint
      const quotaEndpoint = this.getAttribute("quota-endpoint");
      if (quotaEndpoint) {
        this.usageControl = createUsageControl({
          apiEndpoint: "/api/ai-enhancer/usage",
          quotaCheckEndpoint: quotaEndpoint,
          checkQuotaBeforeRequest: true,
        });
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing components:", error);
      throw error;
    }
  }

  async waitForInitialization() {
    if (this.isInitialized) return;

    const maxAttempts = 10;
    let attempts = 0;

    while (!this.isInitialized && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!this.isInitialized) {
      throw new Error("Component initialization timeout");
    }
  }

  bindImageUploadEvents() {
    const imagePreview = this.shadowRoot.querySelector("#imagePreview");
    const uploadButton = this.shadowRoot.querySelector("#uploadButton");
    const imageInput = this.shadowRoot.querySelector("#imageInput");

    uploadButton.onclick = () => imageInput.click();

    imageInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.productImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          // Create remove button with correct binding
          const removeBtn = document.createElement("button");
          removeBtn.className = "remove-image";
          removeBtn.textContent = "×";
          removeBtn.onclick = () => this.removeImage(); // Correct binding

          imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Product preview">
          `;
          imagePreview.appendChild(removeBtn);
          imagePreview.classList.add("has-image");
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Modificar el método handleToolAction
  async handleToolAction(action) {
    try {
      await this.waitForInitialization();

      if (!this.apiKey || !this.apiClient) {
        this.updatePreview(this.translations.errors.apiKey);
        return;
      }

      const content = this.currentContent;
      let tempResponse; // Declarar aquí para que esté en el scope correcto

      // Crear una nueva entrada temporal para la respuesta en curso
      tempResponse = {
        id: Date.now(),
        action,
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };

      // Agregar la entrada temporal al final del historial
      this.responseHistory.push(tempResponse); // Cambiado de unshift a push
      this.renderResponseHistory();

      // Hacer scroll hacia abajo para mostrar la nueva respuesta
      const preview = this.shadowRoot.querySelector(".preview");
      preview.scrollTop = preview.scrollHeight;

      let accumulatedText = "";

      const completeText = await this.apiClient.enhanceText(
        content,
        action,
        this.productImage || this.productImageUrl,
        "",
        (newContent) => {
          accumulatedText += newContent;
          // Actualizar solo el contenido de la respuesta temporal
          const responseEntry = this.shadowRoot.querySelector(
            `[data-id="${tempResponse.id}"] .response-content`
          );
          if (responseEntry) {
            responseEntry.innerHTML =
              this.markdownHandler.convertToHTML(accumulatedText);
            // Mantener el scroll abajo mientras se genera el contenido
            preview.scrollTop = preview.scrollHeight;
          }
        }
      );

      // Actualizar la respuesta temporal con el texto completo
      tempResponse.content = completeText;
      this.renderResponseHistory();
      // Asegurar que el scroll quede abajo después de actualizar
      preview.scrollTop = preview.scrollHeight;

      // Cachear la respuesta
      this.cacheManager.set(action, content, completeText);
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      if (tempResponse) {
        // Verificar si existe
        this.responseHistory = this.responseHistory.filter(
          (r) => r.id !== tempResponse.id
        );
      }
      this.renderResponseHistory();
      this.updatePreview(`Error: ${error.message}`);
    }
  }

  copyToClipboard(responseId) {
    const response = this.responseHistory.find(
      (r) => r.id === parseInt(responseId, 10)
    );
    if (response) {
      navigator.clipboard
        .writeText(response.content)
        .then(() => {
          // Mostrar feedback visual de copiado exitoso
          const button = this.shadowRoot.querySelector(
            `.copy-button[data-response-id="${responseId}"]`
          );
          const originalText = button.innerHTML;
          button.innerHTML = "✓ Copied!";
          setTimeout(() => (button.innerHTML = originalText), 2000);
        })
        .catch((err) => console.error("Error al copiar:", err));
    }
  }

  useResponse(responseId) {
    const response = this.responseHistory.find(
      (r) => r.id === parseInt(responseId, 10)
    );
    if (response) {
      this.setEditorContent(response.content, "replace");
      this.shadowRoot.querySelector(".modal").classList.remove("open");
    }
  }

  // Añadir este método a la clase AITextEnhancer
  async handleImageUrlChange(url) {
    console.log("handleImageUrlChange called with URL:", url); // Debug log

    if (!url) {
      console.log("No URL provided, removing image"); // Debug log
      this.removeImage();
      return;
    }

    const imagePreview = this.shadowRoot.querySelector("#imagePreview");
    console.log("Found imagePreview element:", imagePreview); // Debug log

    try {
      // Validar que la URL es accesible y es una imagen
      console.log("Attempting to fetch image from URL:", url); // Debug log
      const response = await fetch(url);
      console.log("Fetch response:", response); // Debug log

      const contentType = response.headers.get("content-type");
      console.log("Content type:", contentType); // Debug log

      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("La URL no corresponde a una imagen válida");
      }

      // Actualizar la vista previa
      console.log("Updating preview with image"); // Debug log
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-image";
      removeBtn.textContent = "×";
      removeBtn.onclick = () => this.removeImage();

      imagePreview.innerHTML = `
      <img src="${url}" alt="Product preview" onload="console.log('Image loaded successfully')" onerror="console.error('Image failed to load')">
    `;
      imagePreview.appendChild(removeBtn);
      imagePreview.classList.add("has-image");

      // Guardar la URL para uso posterior
      this.productImageUrl = url;
      this.productImage = null;

      console.log("Image URL set successfully:", this.productImageUrl);
    } catch (error) {
      console.error("Error loading image from URL:", error);
      this.updatePreview(`Error loading image: ${error.message}`);
    }
  }

  removeImage() {
    this.productImage = null;
    this.productImageUrl = null;
    this.setAttribute("image-url", ""); // Limpiar el atributo

    const imagePreview = this.shadowRoot.querySelector("#imagePreview");
    imagePreview.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
        <line x1="16" y1="5" x2="22" y2="5"/>
        <line x1="19" y1="2" x2="19" y2="8"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
    `;
    imagePreview.classList.remove("has-image");
  }

  async handleChatSubmit(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.value.trim();

    if (!message) return;

    this.addChatMessage("user", message);
    input.value = "";

    if (!this.apiKey) {
      this.addChatMessage(
        "assistant",
        "Error: API key not configured. Please provide a valid API key."
      );
      return;
    }

    try {
      // Generate a unique cache key for the chat
      const chatContent = `${this.currentContent}-${message}`;

      // Check cache first
      const cachedResponse = this.cacheManager.get("chat", chatContent);
      if (cachedResponse) {
        this.addChatMessage("assistant", cachedResponse);
        return;
      }

      // If not in cache, call API
      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message
      );

      // Cache the response
      this.cacheManager.set("chat", chatContent, response);

      this.addChatMessage("assistant", response);
    } catch (error) {
      console.error("Error:", error);
      this.addChatMessage("assistant", `Error: ${error.message}`);
    }
  }

  updatePreview(text) {
    const preview = this.shadowRoot.querySelector(".preview");
    try {
      if (this.responseHistory.length === 0) {
        const html = this.markdownHandler.convertToHTML(text);
        preview.innerHTML = html;
      }
      // Siempre actualizar enhancedText con el último contenido
      this.enhancedText = text;
      // Hacer scroll al final del contenido
      preview.scrollTop = preview.scrollHeight;
    } catch (error) {
      console.error("Error updating preview:", error);
      preview.textContent = text;
    }
  }

  setEditorContent(content, mode = "replace") {
    if (this.editorAdapter) {
      this.editorAdapter.setContent(content, mode);
    }
  }

  addChatMessage(role, content) {
    const container = this.shadowRoot.querySelector(".chat-container");
    const message = document.createElement("div");
    message.className = `chat-message ${role}`;

    try {
      message.innerHTML = this.markdownHandler.convertForChat(content);
    } catch (error) {
      console.error("Error formatting chat message:", error);
      message.textContent = content;
    }

    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }

  handleAction(action) {
    switch (action) {
      case "retry":
        this.handleToolAction("improve");
        break;
      case "insert":
        this.setEditorContent(this.enhancedText, "insert");
        this.shadowRoot.querySelector(".modal").classList.remove("open");
        break;
      case "replace":
        this.setEditorContent(this.enhancedText, "replace");
        this.shadowRoot.querySelector(".modal").classList.remove("open");
        break;
    }
  }
}

// Register the component
customElements.define("ai-text-enhancer", AITextEnhancer);
