// ai-text-enhancer.js
import { ImageUploader } from "./ImageUploader.js";
import { ToolBar } from "./ToolBar.js";
import { styles } from "../styles/styles.js";
import { MarkdownHandler } from "../services/markdown-handler.js";
import { createAPIClient } from "../services/api-client.js";
import { createCacheManager } from "../services/cache-manager.js";
import { ModelManager } from "../services/model-manager.js";
import { TRANSLATIONS } from "../constants/translations.js";
import { EditorAdapter } from "../services/editor-adapter.js";
import { Chat } from "./Chat.js";
import { getToolIcon } from "../services/icon-service.js";

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

    // Initialize cache manager
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1000, // 30 minutes
    });

    // Initialize components
    this.modelManager = new ModelManager();
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
              ${getToolIcon(response.action)}
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
          const chatComponent = this.shadowRoot.querySelector("ai-chat");
          if (chatComponent) {
            chatComponent.setAttribute("language", newValue);
          }
          this.updateTranslations();
        }
        break;
      case "image-url":
        if (this.isInitialized) {
          const imageUploader =
            this.shadowRoot.querySelector("ai-image-uploader");
          if (imageUploader) {
            imageUploader.setAttribute("image-url", newValue || "");
          }
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
    // Primero verificar que los elementos principales existen
    const modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.warn("Modal element not found");
      return;
    }

    // Modal trigger button
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");
    if (modalTrigger) {
      modalTrigger.onclick = () => {
        modal.classList.add("open");
        this.updateVisibleTools();
        if (this.responseHistory.length > 0) {
          this.renderResponseHistory();
        } else {
          this.updatePreview(this.translations.preview.placeholder);
        }
      };
    }

    // Close button
    const closeButton = this.shadowRoot.querySelector(".close-button");
    if (closeButton) {
      closeButton.onclick = () => {
        modal.classList.remove("open");
      };
    }

    // Click outside modal
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    };

    // Tabs
    const tabs = this.shadowRoot.querySelectorAll(".tab-button");
    const tabContents = this.shadowRoot.querySelectorAll(".tab-content");
    if (tabs.length && tabContents.length) {
      tabs.forEach((tab) => {
        tab.onclick = () => {
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");

          tabContents.forEach((content) => {
            content.style.display =
              content.dataset.tab === tab.dataset.tab ? "block" : "none";
          });
        };
      });
    }

    // Actions
    const actionButtons = this.shadowRoot.querySelectorAll(
      ".action-button[data-action]"
    );
    if (actionButtons.length) {
      actionButtons.forEach((action) => {
        action.onclick = () => this.handleAction(action.dataset.action);
      });
    }

    // Chat form
    const chatForm = this.shadowRoot.querySelector(".chat-form");
    if (chatForm) {
      chatForm.onsubmit = (e) => this.handleChatSubmit(e);
    }
  }

  updateVisibleTools() {
    const hasContent = Boolean(this.currentContent.trim());
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.setAttribute("has-content", hasContent.toString());
    }
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
            <div class="image-upload-section"></div>
              <div class="tools-container"></div>
              <div class="preview">${t.preview.placeholder}</div>

              <div class="chat-section">
                <ai-chat language="${this.language}"></ai-chat>
              </div>
        
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
        </div>
      </div>`;

    return template;
  }

  async connectedCallback() {
    try {
      // Crear y agregar el template
      const template = this.createTemplate();
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Esperar a que el DOM esté listo
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Initialize components
      const imageUploadSection = this.shadowRoot.querySelector(
        ".image-upload-section"
      );
      const toolsContainer = this.shadowRoot.querySelector(".tools-container");
      const chatComponent = this.shadowRoot.querySelector("ai-chat");

      // Setup image uploader
      const imageUploader = document.createElement("ai-image-uploader");
      if (this.getAttribute("image-url")) {
        imageUploader.setAttribute("image-url", this.getAttribute("image-url"));
      }
      imageUploader.addEventListener(
        "imagechange",
        this.handleImageChange.bind(this)
      );
      imageUploadSection.appendChild(imageUploader);

      // Setup toolbar
      const toolbar = document.createElement("ai-toolbar");
      toolbar.setAttribute("language", this.language);
      toolbar.setAttribute(
        "has-content",
        Boolean(this.currentContent.trim()).toString()
      );
      toolbar.addEventListener("toolaction", this.handleToolAction.bind(this));
      toolsContainer.appendChild(toolbar);

      // Setup chat event listener
      chatComponent.addEventListener(
        "chatMessage",
        this.handleChatMessage.bind(this)
      );

      const modal = this.shadowRoot.querySelector(".modal");
      if (!modal || !toolsContainer || !imageUploadSection) {
        throw new Error("Required elements not found in the DOM");
      }

      // Esperar a que los componentes hijos estén listos
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Inicializar componentes y enlazar eventos
      await this.initializeComponents();
      this.bindEvents();

      if (this.apiKey) {
        this.apiClient?.setApiKey(this.apiKey);
      }

      this.editorAdapter = new EditorAdapter(this.editorId);
    } catch (error) {
      console.error("Error initializing component:", error);
    }
  }

  handleImageChange(event) {
    const { file } = event.detail;
    this.productImage = file;
    this.productImageUrl = file ? null : this.getAttribute("image-url");
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

  async handleToolAction(event) {
    const action = event.detail?.action || event;
    try {
      await this.waitForInitialization();

      if (!this.apiKey || !this.apiClient) {
        this.updatePreview(this.translations.errors.apiKey);
        return;
      }

      const content = this.currentContent;
      let tempResponse;

      tempResponse = {
        id: Date.now(),
        action,
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };

      this.responseHistory.push(tempResponse);
      this.renderResponseHistory();

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
          const responseEntry = this.shadowRoot.querySelector(
            `[data-id="${tempResponse.id}"] .response-content`
          );
          if (responseEntry) {
            responseEntry.innerHTML =
              this.markdownHandler.convertToHTML(accumulatedText);
            preview.scrollTop = preview.scrollHeight;
          }
        }
      );

      tempResponse.content = completeText;
      this.renderResponseHistory();
      preview.scrollTop = preview.scrollHeight;

      this.cacheManager.set(action, content, completeText);
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      if (tempResponse) {
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

  async handleChatMessage(event) {
    const message = event.detail.message;

    if (!this.apiKey) {
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      // Generate a unique cache key for the chat
      const chatContent = `${this.currentContent}-${message}`;

      // Add user question to response history
      this.addResponseToHistory(
        "chat-question",
        `**${this.translations.chat.question}:** ${message}`
      );

      // Check cache first
      const cachedResponse = this.cacheManager.get("chat", chatContent);
      if (cachedResponse) {
        this.addResponseToHistory("chat-response", cachedResponse);
        return;
      }

      // Show typing indicator in preview
      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.push(tempResponse);
      this.renderResponseHistory();

      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message
      );

      // Remove typing indicator and add final response
      this.responseHistory = this.responseHistory.filter(
        (r) => r.id !== tempResponse.id
      );

      // Cache the response
      this.cacheManager.set("chat", chatContent, response);
      this.addResponseToHistory("chat-response", response);
    } catch (error) {
      console.error("Error:", error);
      this.addResponseToHistory("chat-error", `Error: ${error.message}`);
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
