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
import { ChatWithImage } from "./ChatWithImage.js";
import { ToolBar } from "./ToolBar.js";
import { TokenManager } from "../services/token-manager.js";
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
    if (!customElements.get("chat-with-image")) {
      customElements.define("chat-with-image", ChatWithImage);
    }
    if (!customElements.get("response-history")) {
      customElements.define("response-history", ResponseHistory);
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

    // Inicializar TokenManager
    this.tokenManager = new TokenManager();

    // El control de uso es opcional
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
          const chatComponent =
            this.shadowRoot.querySelector("chat-with-image");

          if (chatComponent) {
            chatComponent.setAttribute("language", newValue);
          }
          this.updateTranslations();
        }
        break;
    }

    // No ejecutar improve automáticamente cuando cambia editor-id
    if (name === "editor-id" && oldValue !== null) {
      this.handleToolAction("improve");
    }
  }

  updateTranslations() {
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
    // const chatForm = this.shadowRoot.querySelector(".chat-form");
    // if (chatForm) {
    //   chatForm.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     const input = chatForm.querySelector(".chat-input");
    //     if (input && input.value.trim()) {
    //       this.handleChatMessage({ detail: { message: input.value.trim() } });
    //       input.value = "";
    //     }
    //   });
    // }

    // Manejar el botón de upload
    // const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    // const imageInput = this.shadowRoot.querySelector("#image-upload");

    // if (uploadButton && imageInput) {
    //   uploadButton.onclick = () => imageInput.click();
    //   imageInput.onchange = (e) => this.handleImageChange(e);
    // }

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
          height: calc(100vh - 200px); /* Ajuste de altura */
          min-height: 400px;
        }
  
        .chat-section {
          border-top: 1px solid var(--ai-border);
          padding-top: 1rem;
        }
  
        .tools-container {
          margin-bottom: 1rem;
        }

        /* Estilos actualizados para response-history */
        response-history {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--ai-background);
          border-radius: var(--ai-radius);
          margin-bottom: 1rem;
          overflow: auto;
          min-height: 200px;
          max-height: calc(100% - 150px); /* Ajuste para mantener proporción */
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          height: 90vh;
        }

        .modal-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      </style>
  
      <button class="modal-trigger" aria-label="${
        t.modalTrigger
      }" aria-haspopup="dialog">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
          <path d="m14 7 3 3"/>
        </svg>
        <span>${t.modalTrigger}</span>
      </button>
      
      <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal-content" role="document">
          <button class="close-button" aria-label="Close dialog">×</button>
          <div class="modal-header">
            <h2 id="modal-title">${t.modalTitle}</h2>
          </div>
          
          <div class="modal-body" role="main">
            <div class="editor-section">
              <div class="tools-container" role="toolbar" aria-label="Text enhancement tools">
                <ai-toolbar language="${this.language}"></ai-toolbar>
              </div>
              <response-history role="log" aria-label="Enhancement history"></response-history>
              <div class="chat-section" role="complementary" aria-label="Chat assistance">
                <chat-with-image
                  language="${this.language}"
                  image-url="${this.imageUrl || ""}"
                  api-provider="${this.apiProvider}">
                </chat-with-image>
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
      <div class="image-preview-card ${isInitial ? "initial-image" : ""}" 
           data-image-id="${Date.now()}"
           role="figure"
           aria-label="${
             isInitial ? "Initial product image" : "Uploaded product image"
           }">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${imageUrl}" alt="Product preview - ${filename}">
          </div>
          <div class="image-preview-info">
            <div class="image-preview-label" aria-hidden="true">${
              isInitial ? "Initial image" : "Uploaded image"
            }</div>
            <div class="image-preview-filename">${filename}</div>
          </div>
          ${
            !isInitial && !this.isImageUsed(imageToRender)
              ? `
            <button class="image-preview-remove" 
                    aria-label="Remove image ${filename}"
                    title="Remove image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
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

      const chatComponent = this.shadowRoot.querySelector("chat-with-image");
      if (chatComponent) {
        chatComponent.addEventListener(
          "chatMessage",
          this.handleChatMessage.bind(this)
        );
      }

      const imageUploader = this.shadowRoot.querySelector("ai-image-uploader");
      if (imageUploader) {
        imageUploader.addEventListener("imagechange", (e) => {
          const { file } = e.detail;
          this.handleImageChange(file);
        });
      }

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

  handleImageChange(file) {
    if (file) {
      // La nueva imagen reemplaza cualquier imagen existente
      this.productImage = file;
      this.productImageUrl = null; // Limpiar la URL inicial

      // Agregar la imagen como un mensaje al historial
      this.addResponseToHistory("image-upload", this.renderImagePreview(file));
    } else {
      // Si file es null, significa que se está eliminando la imagen
      this.productImage = null;
      this.productImageUrl = null;

      // Eliminar la última imagen del historial si existe
      const lastImageUpload = [...this.responseHistory.responses]
        .reverse()
        .find((r) => r.action === "image-upload");

      if (lastImageUpload) {
        this.responseHistory.removeResponse(lastImageUpload.id);
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

      // Verificar cuota solo si existe el control y los atributos necesarios
      if (this.usageControl) {
        const tenantId = this.getAttribute("tenant-id");
        const userId = this.getAttribute("user-id");

        if (tenantId && userId) {
          try {
            const quota = await this.usageControl.checkQuota(tenantId, userId);
            if (!quota.hasAvailableQuota) {
              throw new Error(
                "Quota exceeded. Please contact your administrator."
              );
            }
          } catch (error) {
            console.warn("Error checking quota:", error);
            // Continuar con la ejecución si hay error al verificar cuota
          }
        }
      }

      const content = this.currentContent;
      let tempResponse = {
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
        this.productImage,
        "",
        (newContent) => {
          accumulatedText += newContent;
          this.responseHistory.updateResponse(tempResponse.id, accumulatedText);
        }
      );

      // Registrar uso solo si existe el control y los atributos necesarios
      if (this.usageControl) {
        const tenantId = this.getAttribute("tenant-id");
        const userId = this.getAttribute("user-id");

        if (tenantId && userId) {
          try {
            const estimatedTokens = this.tokenManager.estimateTokens(content);
            await this.usageControl.trackUsage(
              tenantId,
              userId,
              action,
              estimatedTokens
            );
          } catch (error) {
            console.warn("Error tracking usage:", error);
          }
        }
      }

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
    const { message, image } = event.detail;

    if (!this.apiKey) {
      console.log("No API key provided");
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      const chatContent = `${this.currentContent}-${message}`;

      // Si hay imagen, primero agregar la vista previa
      if (image) {
        this.addResponseToHistory(
          "image-upload",
          `
          <div class="image-preview-card">
            <div class="image-preview-content">
              <div class="image-preview-thumbnail">
                <img src="${URL.createObjectURL(image)}" alt="Preview">
              </div>
              <div class="image-preview-info">
                <div class="image-preview-label">Attached image</div>
                <div class="image-preview-filename">${image.name}</div>
              </div>
            </div>
          </div>
        `
        );
      }

      // Agregar la pregunta al historial
      this.addResponseToHistory(
        "chat-question",
        `**${this.translations.chat.question}:** ${message}`
      );

      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.addResponse(tempResponse);

      // Obtener la respuesta
      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message,
        image
      );

      // Preparar el contenido final
      let finalContent = response;
      if (image) {
        finalContent = {
          content: response,
          imageUsed: image.name,
        };
      }

      this.responseHistory.removeResponse(tempResponse.id);
      this.cacheManager.set("chat", chatContent, finalContent);
      this.addResponseToHistory(
        "chat-response",
        finalContent.content || finalContent
      );
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
    const container = this.shadowRoot
      .querySelector("ai-chat")
      ?.shadowRoot?.querySelector(".chat-messages");
    if (!container) return;

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

  // Add keyboard navigation methods:
  // ...
  // Add after bindEvents method
  setupKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener("keydown", this.handleKeyboard);

    // Modal specific keyboard navigation
    const modal = this.shadowRoot.querySelector(".modal");
    if (modal) {
      modal.addEventListener("keydown", this.handleModalKeyboard);
    }
  }

  handleKeyboard(event) {
    // Global shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case "e":
          // Ctrl/Cmd + E to open enhancer
          event.preventDefault();
          this.shadowRoot.querySelector(".modal-trigger").click();
          break;
        case "i":
          // Ctrl/Cmd + I to trigger improve
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction("improve");
          }
          break;
        case "s":
          // Ctrl/Cmd + S to trigger summarize
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction("summarize");
          }
          break;
      }
    }
  }

  handleModalKeyboard(event) {
    if (!this.isModalOpen()) return;

    switch (event.key) {
      case "Escape":
        // Close modal with Escape
        this.shadowRoot.querySelector(".close-button").click();
        break;
      case "Tab":
        // Trap focus within modal
        this.handleTabNavigation(event);
        break;
      case "ArrowRight":
      case "ArrowLeft":
        // Tool navigation with arrow keys
        if (event.target.closest(".tools-container")) {
          this.handleToolNavigation(event);
        }
        break;
    }
  }

  handleTabNavigation(event) {
    const modal = this.shadowRoot.querySelector(".modal");
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  handleToolNavigation(event) {
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    const tools = toolbar.shadowRoot.querySelectorAll(".tool-button");
    const currentTool = toolbar.shadowRoot.querySelector(".tool-button:focus");

    if (!currentTool) return;

    const currentIndex = Array.from(tools).indexOf(currentTool);
    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tools.length;
    } else {
      nextIndex = (currentIndex - 1 + tools.length) % tools.length;
    }

    tools[nextIndex].focus();
    event.preventDefault();
  }

  isModalOpen() {
    return this.shadowRoot.querySelector(".modal").classList.contains("open");
  }

  // Update connectedCallback to include keyboard navigation setup
  async connectedCallback() {
    try {
      const template = this.createTemplate();
      attachShadowTemplate(this, template);

      // Inicializar componentes
      await this.initializeComponents();

      const chatComponent = this.shadowRoot.querySelector("chat-with-image");
      if (chatComponent) {
        chatComponent.addEventListener(
          "chatMessage",
          this.handleChatMessage.bind(this)
        );
      }

      const imageUploader = this.shadowRoot.querySelector("ai-image-uploader");
      if (imageUploader) {
        imageUploader.addEventListener("imagechange", (e) => {
          const { file } = e.detail;
          this.handleImageChange(file);
        });
      }

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

  handleImageChange(file) {
    if (file) {
      // La nueva imagen reemplaza cualquier imagen existente
      this.productImage = file;
      this.productImageUrl = null; // Limpiar la URL inicial

      // Agregar la imagen como un mensaje al historial
      this.addResponseToHistory("image-upload", this.renderImagePreview(file));
    } else {
      // Si file es null, significa que se está eliminando la imagen
      this.productImage = null;
      this.productImageUrl = null;

      // Eliminar la última imagen del historial si existe
      const lastImageUpload = [...this.responseHistory.responses]
        .reverse()
        .find((r) => r.action === "image-upload");

      if (lastImageUpload) {
        this.responseHistory.removeResponse(lastImageUpload.id);
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

      // Verificar cuota solo si existe el control y los atributos necesarios
      if (this.usageControl) {
        const tenantId = this.getAttribute("tenant-id");
        const userId = this.getAttribute("user-id");

        if (tenantId && userId) {
          try {
            const quota = await this.usageControl.checkQuota(tenantId, userId);
            if (!quota.hasAvailableQuota) {
              throw new Error(
                "Quota exceeded. Please contact your administrator."
              );
            }
          } catch (error) {
            console.warn("Error checking quota:", error);
            // Continuar con la ejecución si hay error al verificar cuota
          }
        }
      }

      const content = this.currentContent;
      let tempResponse = {
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
        this.productImage,
        "",
        (newContent) => {
          accumulatedText += newContent;
          this.responseHistory.updateResponse(tempResponse.id, accumulatedText);
        }
      );

      // Registrar uso solo si existe el control y los atributos necesarios
      if (this.usageControl) {
        const tenantId = this.getAttribute("tenant-id");
        const userId = this.getAttribute("user-id");

        if (tenantId && userId) {
          try {
            const estimatedTokens = this.tokenManager.estimateTokens(content);
            await this.usageControl.trackUsage(
              tenantId,
              userId,
              action,
              estimatedTokens
            );
          } catch (error) {
            console.warn("Error tracking usage:", error);
          }
        }
      }

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
    const { message, image } = event.detail;

    if (!this.apiKey) {
      console.log("No API key provided");
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      const chatContent = `${this.currentContent}-${message}`;

      // Si hay imagen, primero agregar la vista previa
      if (image) {
        this.addResponseToHistory(
          "image-upload",
          `
          <div class="image-preview-card">
            <div class="image-preview-content">
              <div class="image-preview-thumbnail">
                <img src="${URL.createObjectURL(image)}" alt="Preview">
              </div>
              <div class="image-preview-info">
                <div class="image-preview-label">Attached image</div>
                <div class="image-preview-filename">${image.name}</div>
              </div>
            </div>
          </div>
        `
        );
      }

      // Agregar la pregunta al historial
      this.addResponseToHistory(
        "chat-question",
        `**${this.translations.chat.question}:** ${message}`
      );

      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.addResponse(tempResponse);

      // Obtener la respuesta
      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message,
        image
      );

      // Preparar el contenido final
      let finalContent = response;
      if (image) {
        finalContent = {
          content: response,
          imageUsed: image.name,
        };
      }

      this.responseHistory.removeResponse(tempResponse.id);
      this.cacheManager.set("chat", chatContent, finalContent);
      this.addResponseToHistory(
        "chat-response",
        finalContent.content || finalContent
      );
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
    const container = this.shadowRoot
      .querySelector("ai-chat")
      ?.shadowRoot?.querySelector(".chat-messages");
    if (!container) return;

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
