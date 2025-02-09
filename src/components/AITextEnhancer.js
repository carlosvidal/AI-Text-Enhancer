// ai-text-enhancer.js
// Imports
import { ResponseHistory } from "./ResponseHistory.js";
import {
  createTemplate,
  attachShadowTemplate,
  createStyleSheet,
} from "../utils/dom-utils.js";
import { createEventEmitter } from "../utils/event-utils.js";
import { TRANSLATIONS } from "../constants/translations.js";
import { ImageUploader } from "./ImageUploader.js";
import { ToolBar } from "./ToolBar.js";
import { Chat } from "./Chat.js";
import { MarkdownHandler } from "../services/markdown-handler.js";
import { createAPIClient } from "../services/api-client.js";
import { createCacheManager } from "../services/cache-manager.js";
import { ModelManager } from "../services/model-manager.js";
import { EditorAdapter } from "../services/editor-adapter.js";
import { getToolIcon } from "../services/icon-service.js";

// Imports de estilos
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
if (!customElements.get("response-history")) {
  customElements.define("response-history", ResponseHistory);
}

class AITextEnhancer extends HTMLElement {
  constructor() {
    super();
    // Registrar todos los componentes necesarios si no existen
    if (!customElements.get("ai-toolbar")) {
      customElements.define("ai-toolbar", ToolBar);
    }
    if (!customElements.get("ai-chat")) {
      customElements.define("ai-chat", Chat);
    }

    // Inicializar el event emitter
    this.eventEmitter = createEventEmitter(this);

    // Referencias a componentes
    this.responseHistory = null;
    this.editorAdapter = null;
    this.currentAction = "improve";

    // Inicializar cache manager
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1000, // 30 minutos
    });

    // Inicializar componentes core
    this.modelManager = new ModelManager();
    this.markdownHandler = new MarkdownHandler();
    this.enhancedText = "";
    this.chatMessages = [];
    this.isInitialized = false;
    this.productImage = null;

    // Control de uso opcional
    this.usageControl = null;

    // Bind de métodos
    this.handleResponseCopy = this.handleResponseCopy.bind(this);
    this.handleResponseUse = this.handleResponseUse.bind(this);
    this.handleResponseRetry = this.handleResponseRetry.bind(this);
    this.handleResponseEdit = this.handleResponseEdit.bind(this);
    this.handleToolAction = this.handleToolAction.bind(this);
    this.handleChatMessage = this.handleChatMessage.bind(this);
  }

  addResponseToHistory(action, content) {
    const response = {
      id: Date.now(),
      action,
      content,
      timestamp: new Date(),
    };

    this.responseHistory.addResponse(response);
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
            chatComponent.addEventListener(
              "chatMessage",
              this.handleChatMessage.bind(this)
            );
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

    // Tool buttons
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.addEventListener("toolaction", this.handleToolAction.bind(this));
    }

    // Chat form
    const chatForm = this.shadowRoot.querySelector(".chat-form");
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = chatForm.querySelector(".chat-input");
        if (input && input.value.trim()) {
          this.handleChatMessage({ detail: { message: input.value.trim() } });
          input.value = "";
        }
      });
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
      ${chatStyles}
      ${toolbarStyles}
      ${modelSelectorStyles}
        :host {
  display: inline-block;
  font-family: var(--ai-font-sans);
  position: relative;
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.tools-container {
  flex-shrink: 0;
  margin-bottom: 1rem;
}

response-history {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.chat-section {
  flex-shrink: 0;
  border-top: 1px solid var(--ai-border);
  margin-top: auto;
  padding-top: 1rem;
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
    <div class="tools-container">
      <ai-toolbar language="${this.language}"></ai-toolbar>
    </div>
    <response-history language="${this.language}"></response-history>
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
    return this.responseHistory.responses.some(
      (response) =>
        response.action !== "image-upload" && response.imageUsed === imageId
    );
  }

  async connectedCallback() {
    try {
      const template = this.createTemplate();
      attachShadowTemplate(this, template);

      // Inicializar componentes
      await this.initializeComponents();

      // Esperar a que el DOM esté realmente listo
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Configurar el ResponseHistory
      this.responseHistory = this.shadowRoot.querySelector("response-history");
      if (!this.responseHistory) {
        throw new Error("ResponseHistory component not found in the DOM");
      }

      // Esperar a que el markdownHandler esté inicializado
      if (!this.markdownHandler) {
        await this.markdownHandler.initialize();
      }

      this.responseHistory.markdownHandler = this.markdownHandler;

      // Configurar event listeners para el ResponseHistory
      this.responseHistory.addEventListener(
        "responseCopy",
        this.handleResponseCopy.bind(this)
      );
      this.responseHistory.addEventListener(
        "responseUse",
        this.handleResponseUse.bind(this)
      );
      this.responseHistory.addEventListener(
        "responseRetry",
        this.handleResponseRetry.bind(this)
      );
      this.responseHistory.addEventListener(
        "responseEdit",
        this.handleResponseEdit.bind(this)
      );

      // Enlazar otros eventos
      this.bindEvents();

      if (this.apiKey) {
        this.apiClient?.setApiKey(this.apiKey);
      }

      this.editorAdapter = new EditorAdapter(this.editorId);
    } catch (error) {
      console.error("Error initializing component:", error);
      // Log más detalles del error para debugging
      console.error("Full error:", error.stack);
      console.error("Component state:", {
        responseHistory: this.responseHistory,
        markdownHandler: this.markdownHandler,
        apiClient: this.apiClient,
        isInitialized: this.isInitialized,
      });
    }
  }

  handleResponseCopy(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      navigator.clipboard
        .writeText(response.content)
        .then(() => {
          const button = this.shadowRoot.querySelector(
            `.copy-button[data-response-id="${responseId}"]`
          );
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = "✓ Copied!";
            setTimeout(() => (button.innerHTML = originalText), 2000);
          }
        })
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  }

  handleResponseUse(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      this.setEditorContent(response.content, "replace");
      this.shadowRoot.querySelector(".modal").classList.remove("open");
    }
  }

  handleResponseRetry(event) {
    const { responseId, action } = event.detail;
    this.handleToolAction(action);
  }

  handleResponseEdit(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      const chatInput = this.shadowRoot.querySelector(".chat-input");
      const chatForm = this.shadowRoot.querySelector(".chat-form");

      if (chatInput && chatForm) {
        chatForm.dataset.editingId = responseId;
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

        const questionText = response.content.replace(/^\*\*.*:\*\*\s*/, "");
        chatInput.value = questionText;
        chatInput.focus();
      }
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
    const responses = this.responseHistory.responses;
    const imageResponse = responses.find(
      (r) => r.action === "image-upload" && r.id === parseInt(imageId, 10)
    );

    if (imageResponse && !this.isImageUsed(this.productImage)) {
      this.productImage = null;
      this.productImageUrl = null;
      this.responseHistory.removeResponse(parseInt(imageId, 10));
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
        this.addResponseToHistory(
          "chat-error",
          this.translations.errors.apiKey
        );
        return;
      }

      const content = this.currentContent;
      tempResponse = {
        id: Date.now(),
        action,
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };

      this.responseHistory.addResponse(tempResponse);

      let accumulatedText = "";

      const completeText = await this.apiClient.enhanceText(
        content,
        action,
        this.productImage || this.productImageUrl,
        "",
        (newContent) => {
          accumulatedText += newContent;
          // Actualizamos la respuesta con el texto acumulado
          this.responseHistory.updateResponse(tempResponse.id, accumulatedText);
        }
      );

      // Actualizamos con el texto completo final
      this.responseHistory.updateResponse(tempResponse.id, completeText);
      this.cacheManager.set(action, content, completeText);
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      if (tempResponse) {
        this.responseHistory.removeResponse(tempResponse.id);
      }
      this.addResponseToHistory("chat-error", `Error: ${error.message}`);
    }
  }

  editChatQuestion(responseId) {
    const response = this.responseHistory.find(
      (r) => r.id === parseInt(responseId, 10)
    );
    if (!response) return;

    const questionText = response.content.replace(/^\*\*.*:\*\*\s*/, "");
    const chatInput = this.shadowRoot.querySelector(".chat-input");
    const chatForm = this.shadowRoot.querySelector(".chat-form");

    if (chatInput && chatForm) {
      chatForm.dataset.editingId = responseId;
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
    console.log("Chat message received:", event.detail);
    const message = event.detail.message;
    const chatForm = this.shadowRoot.querySelector(".chat-form");
    const editingId = chatForm?.dataset.editingId;

    if (!this.apiKey) {
      console.log("No API key provided");
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      // Si estamos editando, eliminar la pregunta anterior y su respuesta
      if (editingId) {
        const editingIndex = this.responseHistory.responses.findIndex(
          (r) => r.id === parseInt(editingId, 10)
        );

        if (editingIndex !== -1) {
          // Eliminar la pregunta y su respuesta
          this.responseHistory.removeResponse(parseInt(editingId, 10));
          // También eliminar la siguiente respuesta si existe
          if (this.responseHistory.responses[editingIndex]) {
            this.responseHistory.removeResponse(
              this.responseHistory.responses[editingIndex].id
            );
          }
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

      // Crear y agregar respuesta temporal
      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.addResponse(tempResponse);

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

      // Eliminar la respuesta temporal
      this.responseHistory.removeResponse(tempResponse.id);

      // Agregar la respuesta final
      this.cacheManager.set("chat", chatContent, response);
      this.addResponseToHistory("chat-response", response);
    } catch (error) {
      console.error("Error:", error);
      this.addResponseToHistory("chat-error", `Error: ${error.message}`);
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
