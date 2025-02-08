// ai-text-enhancer.js
import { ImageUploader } from "./ImageUploader.js";
import { ToolBar } from "./ToolBar.js";
import { MarkdownHandler } from "../services/markdown-handler.js";
import { createAPIClient } from "../services/api-client.js";
import { createCacheManager } from "../services/cache-manager.js";
import { ModelManager } from "../services/model-manager.js";
import { TRANSLATIONS } from "../constants/translations.js";
import { EditorAdapter } from "../services/editor-adapter.js";
import { Chat } from "./Chat.js";
import { getToolIcon } from "../services/icon-service.js";

// 1. Imports base
import { variables } from "../styles/base/variables.js";
import { animations } from "../styles/base/animations.js";

// 2. Imports componentes
import { modalTriggerStyles } from "../styles/components/modal-trigger.js";
import { chatStyles } from "../styles/components/chat.js";
import { imageUploaderStyles } from "../styles/components/image-uploader.js";
import { imagePreviewStyles } from "../styles/components/image-preview.js";
import { toolbarStyles } from "../styles/components/toolbar.js";
import { modelSelectorStyles } from "../styles/components/model-selector.js";

// 3. Imports layout
import { modalStyles } from "../styles/layout/modal.js";
import { previewStyles } from "../styles/layout/preview.js";

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
    if (!preview) return;

    // Mostrar la imagen inicial del parámetro si existe y no ha sido reemplazada
    let content = "";
    if (this.productImageUrl && !this.productImage) {
      content = this.renderImagePreview(this.productImageUrl, true);
    }

    // Agregar el resto del historial
    content += this.responseHistory
      .map(
        (response) => `
        <div class="response-entry" data-id="${response.id}">
          <div class="response-header">
            <div class="response-tool">
              ${getToolIcon(response.action)}
              ${this.translations.tools[response.action] || response.action}
            </div>
            <div class="response-timestamp">
              ${this.formatTimestamp(response.timestamp)}
            </div>
          </div>
          <div class="response-content">
            ${
              response.action === "image-upload"
                ? response.content
                : this.markdownHandler.convertToHTML(response.content)
            }
          </div>
          ${
            response.action !== "image-upload"
              ? this.renderResponseActions(response)
              : ""
          }
        </div>
      `
      )
      .join("");

    preview.innerHTML = content;
    this.addResponseEventListeners();
  }

  renderResponseActions(response) {
    const t = this.translations;

    if (response.action === "chat-question") {
      return `
        <div class="response-actions">
          <button class="response-action edit-button" data-response-id="${
            response.id
          }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            ${t.actions.edit || "Edit"}
          </button>
        </div>
      `;
    }

    if (response.action === "chat-error") {
      return "";
    }

    return `
      <div class="response-actions">
        <button class="response-action retry-button" data-response-id="${
          response.id
        }" data-action="${response.action}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
            <path d="M11 10v4h4"/>
          </svg>
          ${t.actions.retry || "Retry"}
        </button>
        <button class="response-action copy-button" data-response-id="${
          response.id
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          ${t.actions.copy || "Copy"}
        </button>
        <button class="response-action primary use-button" data-response-id="${
          response.id
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 12 5 5L20 7"></path>
          </svg>
          ${t.actions.use || "Use This"}
        </button>
      </div>
    `;
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

    // Event listeners para botones de retry
    this.shadowRoot.querySelectorAll(".retry-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const responseBtn = e.target.closest("button");
        const action = responseBtn.dataset.action;
        this.handleToolAction(action);
      });
    });

    // Event listeners para botones de edición
    this.shadowRoot.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const responseId = e.target.closest("button").dataset.responseId;
        this.editChatQuestion(responseId);
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

    // Chat form
    const chatForm = this.shadowRoot.querySelector(".chat-form");
    if (chatForm) {
      chatForm.onsubmit = (e) => this.handleChatSubmit(e);
    }

    // Manejar el botón de upload
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    const imageInput = this.shadowRoot.querySelector("#image-upload");

    if (uploadButton && imageInput) {
      uploadButton.onclick = () => imageInput.click();
      imageInput.onchange = (e) => this.handleImageChange(e);
    }

    // Manejar el botón de eliminar imagen usando delegación de eventos
    this.shadowRoot.addEventListener("click", (e) => {
      const removeButton = e.target.closest(".image-preview-remove");
      if (removeButton) {
        this.removeImage();
      }
    });
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
      <style>
        ${variables}
        ${animations}
        ${modalTriggerStyles}
        ${modalStyles}
        ${previewStyles}
        ${imagePreviewStyles}
        
        :host {
          display: inline-block;
          font-family: var(--ai-font-sans);
          position: relative;
        }
  
        .editor-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
  
        .chat-section {
          border-top: 1px solid var(--ai-border);
          margin-top: 1rem;
          padding-top: 1rem;
        }
  
        .tools-container {
          margin-bottom: 1rem;
        }
  
        .preview {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: var(--ai-background);
          border-radius: var(--ai-radius);
        }

         .initial-image {
          border-color: var(--ai-primary);
          background: var(--ai-background-light);
          position: relative;
        }

        .initial-image::before {
          content: 'Initial image';
          position: absolute;
          top: -0.75rem;
          left: 1rem;
          background: var(--ai-background);
          padding: 0 0.5rem;
          font-size: 0.75rem;
          color: var(--ai-primary);
          border-radius: var(--ai-radius-sm);
        }

        .initial-image .image-preview-label {
          color: var(--ai-primary);
          font-weight: 500;
        }
      </style>
  
      <button class="modal-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
          <path d="m14 7 3 3"/>
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
              <div class="tools-container"></div>
              <div class="preview">${t.preview.placeholder}</div>
  
              <div class="chat-section">
                <div class="chat-actions">
                  <button class="chat-upload-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    Upload image
                  </button>
                  <input type="file" id="image-upload" accept="image/*" class="hidden">
                </div>
                <ai-chat language="${this.language}"></ai-chat>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    return template;
  }

  renderImagePreview(image = null, isInitial = false) {
    const imageToRender = image || this.productImage || this.productImageUrl;
    if (!imageToRender) return "";

    const imageUrl =
      imageToRender instanceof File
        ? URL.createObjectURL(imageToRender)
        : imageToRender;

    const filename =
      imageToRender instanceof File
        ? imageToRender.name
        : new URL(imageToRender).pathname.split("/").pop() || "From URL";

    return `
      <div class="image-preview-card ${
        isInitial ? "initial-image" : ""
      }" data-image-id="${Date.now()}">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${imageUrl}" alt="Preview">
          </div>
          <div class="image-preview-info">
            <div class="image-preview-label">${
              isInitial ? "Initial image" : "Uploaded image"
            }</div>
            <div class="image-preview-filename">${filename}</div>
          </div>
          ${
            !isInitial && !this.isImageUsed(imageToRender)
              ? `
            <button class="image-preview-remove" title="Remove image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  isImageUsed(image) {
    const imageId = image instanceof File ? image.name : image;
    return this.responseHistory.some(
      (response) =>
        response.action !== "image-upload" && response.imageUsed === imageId
    );
  }

  async connectedCallback() {
    try {
      // Crear y agregar el template
      const template = this.createTemplate();
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Esperar a que el DOM esté listo
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Initialize components
      const toolsContainer = this.shadowRoot.querySelector(".tools-container");
      const chatComponent = this.shadowRoot.querySelector("ai-chat");

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
      if (!modal || !toolsContainer) {
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
    const file = event.target.files?.[0];
    if (file) {
      // La nueva imagen reemplaza cualquier imagen existente
      this.productImage = file;
      this.productImageUrl = null; // Limpiar la URL inicial

      // Agregar la imagen como un mensaje al historial
      this.addResponseToHistory("image-upload", this.renderImagePreview(file));

      // Limpiar el input file
      if (this.shadowRoot.querySelector("#image-upload")) {
        this.shadowRoot.querySelector("#image-upload").value = "";
      }
    }
  }

  removeImage(imageId) {
    // Solo permitir eliminar si la imagen no ha sido usada
    const imageResponse = this.responseHistory.find(
      (r) => r.action === "image-upload" && r.id === parseInt(imageId, 10)
    );

    if (imageResponse && !this.isImageUsed(this.productImage)) {
      this.productImage = null;
      this.productImageUrl = null;

      // Eliminar la imagen del historial
      this.responseHistory = this.responseHistory.filter(
        (r) => r.id !== parseInt(imageId, 10)
      );
      this.renderResponseHistory();
    }
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
    let tempResponse = null;

    try {
      await this.waitForInitialization();

      if (!this.apiKey || !this.apiClient) {
        this.updatePreview(this.translations.errors.apiKey);
        return;
      }

      const content = this.currentContent;
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

  editChatQuestion(responseId) {
    const response = this.responseHistory.find(
      (r) => r.id === parseInt(responseId, 10)
    );
    if (!response) return;

    // Extraer el texto de la pregunta (eliminando el prefijo "Question:")
    const questionText = response.content.replace(/^\*\*.*:\*\*\s*/, "");

    // Obtener el chat input y el form
    const chatInput = this.shadowRoot.querySelector(".chat-input");
    const chatForm = this.shadowRoot.querySelector(".chat-form");

    if (chatInput && chatForm) {
      // Guardar la referencia al mensaje que estamos editando
      chatForm.dataset.editingId = responseId;

      // Cambiar el texto del botón de envío
      const submitButton = chatForm.querySelector("button");
      if (submitButton) {
        submitButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
            <path d="m2 6 10 7 10-7"/>
          </svg>
          Update
        `;
      }

      // Rellenar y enfocar el input
      chatInput.value = questionText;
      chatInput.focus();
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
    const chatForm = this.shadowRoot.querySelector(".chat-form");
    const editingId = chatForm?.dataset.editingId;

    if (!this.apiKey) {
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      // Si estamos editando, eliminar la pregunta anterior y su respuesta
      if (editingId) {
        const editingIndex = this.responseHistory.findIndex(
          (r) => r.id === parseInt(editingId, 10)
        );

        if (editingIndex !== -1) {
          this.responseHistory.splice(editingIndex, 2);
        }

        delete chatForm.dataset.editingId;
        const submitButton = chatForm.querySelector("button");
        if (submitButton) {
          submitButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
            Send
          `;
        }
      }

      const chatContent = `${this.currentContent}-${message}`;

      this.addResponseToHistory(
        "chat-question",
        `**${this.translations.chat.question}:** ${message}`
      );

      const cachedResponse = this.cacheManager.get("chat", chatContent);
      if (cachedResponse) {
        this.addResponseToHistory("chat-response", cachedResponse);
        return;
      }

      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.push(tempResponse);
      this.renderResponseHistory();

      // Pasar la imagen actual (si existe) al chatResponse
      const imageSource = this.productImage || this.productImageUrl;
      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message,
        imageSource
      );

      if (imageSource) {
        const imageId = this.productImage?.name || this.productImageUrl;
        response.imageUsed = imageId;
      }

      this.responseHistory = this.responseHistory.filter(
        (r) => r.id !== tempResponse.id
      );

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
}

// Register the component
customElements.define("ai-text-enhancer", AITextEnhancer);
