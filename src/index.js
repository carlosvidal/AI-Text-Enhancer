import { ResponseHistory } from "./components/ResponseHistory.js";
import { ChatWithImage } from "./components/ChatWithImage.js";
import { ToolBar } from "./components/ToolBar.js";
import { TokenManager } from "./services/token-manager.js";
import { MarkdownHandler } from "./services/markdown-handler.js";
import { createAPIClient } from "./services/api-client.js";
import { createCacheManager } from "./services/cache-manager.js";
import { ModelManager } from "./services/model-manager.js";
import { EditorAdapter } from "./services/editor-adapter.js";
import { createEventEmitter } from "./utils/event-utils.js";
import { attachShadowTemplate } from "./utils/dom-utils.js";
import { TRANSLATIONS } from "./constants/translations.js";

// Feature imports
import {
  setupKeyboardNavigation,
  keyboardNavigationMixin,
} from "./features/keyboard-navigation.js";
import { responseHandlerMixin } from "./features/response-handlers.js";
import { imageHandlerMixin } from "./features/image-handlers.js";
// Nuevo import
import { stateManagementMixin } from "./features/state-integration.js";
import { createTemplate } from "./template.js";

class AITextEnhancer extends HTMLElement {
  constructor() {
    super();

    // Apply mixins first
    Object.assign(
      this,
      keyboardNavigationMixin,
      responseHandlerMixin,
      imageHandlerMixin,
      stateManagementMixin // Agregar el nuevo mixin
    );

    // Register required components
    if (!customElements.get("ai-toolbar")) {
      customElements.define("ai-toolbar", ToolBar);
    }
    if (!customElements.get("chat-with-image")) {
      customElements.define("chat-with-image", ChatWithImage);
    }
    if (!customElements.get("response-history")) {
      customElements.define("response-history", ResponseHistory);
    }

    // Initialize core components
    this.eventEmitter = createEventEmitter(this);
    this.responseHistory = null;
    this.editorAdapter = null;
    this.currentAction = "improve";
    this.modelManager = new ModelManager();
    this.markdownHandler = new MarkdownHandler();
    this.tokenManager = new TokenManager();

    // Inicializar el gestor de estado
    this.initializeStateManager();

    // Initialize cache
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1000,
    });

    // State initialization
    this.stateManager.batchUpdate({
      enhancedText: "",
      chatMessages: [],
      isInitialized: false,
      productImage: null,
      usageControl: null,
    });

    // Bind methods after mixins are applied
    this.bindMethods();
  }

  bindMethods() {
    // Core methods
    this.handleToolAction = this.handleToolAction?.bind(this);
    this.handleChatMessage = this.handleChatMessage?.bind(this);

    // Response handler methods
    this.handleResponseCopy = this.handleResponseCopy?.bind(this);
    this.handleResponseUse = this.handleResponseUse?.bind(this);
    this.handleResponseRetry = this.handleResponseRetry?.bind(this);
    this.handleResponseEdit = this.handleResponseEdit?.bind(this);

    // Keyboard navigation methods
    this.handleKeyboard = this.handleKeyboard?.bind(this);
    this.handleModalKeyboard = this.handleModalKeyboard?.bind(this);
  }

  // Getters
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

  get prompt() {
    return (
      this.getAttribute("prompt") ||
      "You are a professional content enhancer. Improve the text while maintaining its core message and intent."
    );
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
      return this.modelManager.getModelConfig(model)?.id;
    } catch {
      return this.modelManager.getDefaultModel();
    }
  }

  get imageUrl() {
    return this.getAttribute("image-url");
  }

  get context() {
    return this.getAttribute("context") || "";
  }

  // Lifecycle methods
  async connectedCallback() {
    try {
      const template = createTemplate(this);
      attachShadowTemplate(this, template);

      // Setup basic functionality first
      this.updateLanguageForChildren(this.language);
      this.setupEventListeners();
      setupKeyboardNavigation(this);

      // Skip initialization if no API key
      if (!this.apiKey) {
        this.addResponseToHistory(
          "info",
          "Please enter your API key to start using the enhancer."
        );
        return;
      }

      await this.initializeComponents();
    } catch (error) {
      console.error("Error initializing component:", error);
      if (this.notificationManager) {
        this.notificationManager.error(
          `Initialization error: ${error.message}`
        );
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "[AITextEnhancer] Attribute changed:",
      name,
      "from",
      oldValue,
      "to",
      newValue
    );
    if (oldValue === newValue) return;

    switch (name) {
      case "api-key":
        if (this.apiClient) {
          this.apiClient.setApiKey(newValue);
        } else if (!this.isInitialized) {
          this.initializeComponents();
        }
        break;
      case "language":
        this.updateLanguageForChildren(newValue);
        break;
      case "api-provider":
      case "api-model":
        if (this.isInitialized && this.apiClient) {
          this.apiClient.updateConfig({
            provider: this.apiProvider,
            model: this.apiModel,
          });
        }
        break;
      case "image-url":
        if (this.isInitialized) {
          const chatComponent =
            this.shadowRoot.querySelector("chat-with-image");
          if (chatComponent) {
            chatComponent.setAttribute("image-url", newValue || "");
          }
        }
        break;
    }
  }

  updateLanguageForChildren(language) {
    console.log("[AITextEnhancer] Updating language for children:", language);

    if (!this.shadowRoot) {
      console.warn("[AITextEnhancer] No shadowRoot available yet");
      return;
    }

    // Update modal texts
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger span");
    const modalTitle = this.shadowRoot.querySelector(".modal-header h2");

    if (modalTrigger) {
      modalTrigger.textContent =
        this.translations.modalTrigger || "Enhance Text";
      console.log(
        "[AITextEnhancer] Updated modal trigger text:",
        modalTrigger.textContent
      );
    }

    if (modalTitle) {
      modalTitle.textContent = this.translations.modalTitle || "Enhance Text";
      console.log(
        "[AITextEnhancer] Updated modal title text:",
        modalTitle.textContent
      );
    }

    // Ensure event listener is still working
    if (this.modalTriggerHandler) {
      const trigger = this.shadowRoot.querySelector(".modal-trigger");
      if (trigger) {
        trigger.removeEventListener("click", this.modalTriggerHandler);
        trigger.addEventListener("click", this.modalTriggerHandler);
      }
    }

    // Update components with language attribute
    const components = this.shadowRoot.querySelectorAll("[language]");
    console.log(
      "[AITextEnhancer] Found components to update:",
      components.length
    );

    components.forEach((component) => {
      const oldLang = component.getAttribute("language");
      component.setAttribute("language", language);
      console.log("[AITextEnhancer] Updated component language:", {
        component: component.tagName,
        from: oldLang,
        to: language,
      });
    });

    // Force update on specific components
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    const responseHistory = this.shadowRoot.querySelector("response-history");

    [toolbar, chatComponent, responseHistory].forEach((component) => {
      if (component) {
        component.setAttribute("language", language);
        console.log(
          "[AITextEnhancer] Forced language update on:",
          component.tagName
        );
      }
    });
  }

  // Core functionality
  setupEventListeners() {
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
    }

    this.responseHistory = this.shadowRoot.querySelector("response-history");
    if (this.responseHistory) {
      this.responseHistory.addEventListener(
        "responseCopy",
        this.handleResponseCopy
      );
      this.responseHistory.addEventListener(
        "responseUse",
        this.handleResponseUse
      );
      this.responseHistory.addEventListener(
        "responseRetry",
        this.handleResponseRetry
      );
      this.responseHistory.addEventListener(
        "responseEdit",
        this.handleResponseEdit
      );
      this.responseHistory.addEventListener(
        "toolaction",
        this.handleToolAction
      );
    }

    this.addEventListener("configurationUpdated", (event) => {
      console.log("[AITextEnhancer] Configuration updated:", event.detail);
      if (this.isInitialized) {
        this.initializeComponents().catch((error) => {
          console.error("Error reinitializing components:", error);
        });
      }
    });

    this.bindEvents();
  }

  bindEvents() {
    // Modal events
    const modal = this.shadowRoot.querySelector(".modal");
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");

    if (!modal || !modalTrigger) {
      console.warn("[AITextEnhancer] Modal elements not found in bindEvents");
      return;
    }

    // Store the event handler as a property so we can reuse it
    this.modalTriggerHandler = () => {
      console.log("[AITextEnhancer] Current attributes when modal opens:", {
        apiKey: this.apiKey,
        provider: this.apiProvider,
        model: this.apiModel,
        language: this.language,
        prompt: this.prompt,
        context: this.context,
        imageUrl: this.imageUrl,
      });
      modal.classList.add("open");
      this.updateVisibleTools();
    };

    // Remove any existing event listener before adding new one
    modalTrigger.removeEventListener("click", this.modalTriggerHandler);
    modalTrigger.addEventListener("click", this.modalTriggerHandler);

    // Close button
    const closeButton = this.shadowRoot.querySelector(".close-button");
    if (closeButton) {
      closeButton.onclick = () => modal.classList.remove("open");
    }

    // Click outside modal
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    };

    // Tool buttons
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.addEventListener("toolaction", this.handleToolAction);
    }
  }

  async initializeComponents() {
    if (this.isInitialized) return;

    try {
      const apiKey = this.apiKey;
      if (!apiKey) {
        throw new Error("API key is required");
      }

      // Initialize markdown handler first
      await this.markdownHandler.initialize();
      console.log("[AITextEnhancer] Markdown handler initialized");

      // Initialize API client
      this.apiClient = createAPIClient({
        apiKey: this.apiKey,
        provider: this.apiProvider,
        model: this.apiModel,
        systemPrompt: this.prompt,
        temperature: 0.7,
      });

      // Initialize editor adapter if editor ID is provided
      if (this.editorId) {
        this.editorAdapter = new EditorAdapter(this.editorId);
      }

      // Pass markdown handler to response history
      const responseHistory = this.shadowRoot.querySelector("response-history");
      if (responseHistory) {
        responseHistory.markdownHandler = this.markdownHandler;
        console.log(
          "[AITextEnhancer] Markdown handler passed to response history"
        );
      }

      // Set initial state
      this.isInitialized = true;

      // Update visible tools based on content
      this.updateVisibleTools();
    } catch (error) {
      console.error("Error in initializeComponents:", error);
      this.addResponseToHistory(
        "error",
        `Initialization error: ${error.message}`
      );
      throw error;
    }
  }

  isModalOpen() {
    return this.shadowRoot.querySelector(".modal").classList.contains("open");
  }

  updateVisibleTools() {
    const hasContent = Boolean(this.currentContent.trim());
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.setAttribute("has-content", hasContent.toString());
    }
  }

  async handleChatMessage(event) {
    const { message, image } = event.detail;

    if (!this.apiKey) {
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      // Validar mensaje
      if (!message?.trim() && !image) {
        throw new Error("Message cannot be empty");
      }

      // Agregar la pregunta con imagen al historial
      const questionResponse = {
        id: Date.now(),
        action: "chat-question",
        content: `**${this.translations.chat.question}:** ${message}`,
        timestamp: new Date(),
        image: image,
      };
      this.responseHistory.addResponse(questionResponse);

      // Crear un ID para el streaming de respuestas
      const responseId = Date.now() + 1;

      // Agregar respuesta inicial vacía
      this.responseHistory.addResponse({
        id: responseId,
        action: "chat-response",
        content: "", // Empezar con contenido vacío para streaming adecuado
        timestamp: new Date(),
      });

      // Iniciar auto-scroll para mantener visible el contenido
      const scrollToBottom = () => {
        const responseContainer = this.shadowRoot.querySelector(
          ".response-container"
        );
        if (responseContainer) {
          responseContainer.scrollTop = responseContainer.scrollHeight;
        }
      };

      // Iniciar auto-scroll y mantenerlo durante el streaming
      scrollToBottom();
      const scrollInterval = setInterval(scrollToBottom, 300);

      // Manejador de streaming optimizado para evitar parpadeo
      const onProgress = (chunk) => {
        this.responseHistory.updateResponse(
          responseId,
          (prevContent) => prevContent + chunk
        );
      };

      // Hacer solicitud API con streaming
      await this.apiClient.chatResponse(
        this.currentContent,
        message.trim(),
        image,
        onProgress
      );

      // Esperar un momento para permitir que la última actualización se complete
      setTimeout(() => {
        // Detener el auto-scroll
        clearInterval(scrollInterval);

        // Aplicar formateo final con Markdown
        const response = this.responseHistory.getResponse(responseId);
        if (response) {
          this.responseHistory.updateResponse(responseId, response.content);
        }

        // Un último scroll para asegurar que todo el contenido sea visible
        scrollToBottom();
      }, 200);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = this.formatErrorMessage(error);
      this.addResponseToHistory("chat-error", errorMessage);
    }
  }

  // Agrega este método para solicitar actualizaciones explícitas
  requestUpdate(part = null) {
    // Este método delegará en el stateManager
    return this.requestUpdate(part);
  }

  async handleToolAction(event) {
    // Primero obtenemos los datos del evento
    const { action, responseId: eventResponseId, content } = event.detail;

    if (!this.apiKey) {
      console.warn("No API key provided");
      this.addResponseToHistory("error", this.translations.errors.apiKey);
      return;
    }

    // Usar el ID del evento si está disponible, o crear uno nuevo
    // IMPORTANTE: No redeclarar responseId, usamos una variable con nombre diferente
    const currentResponseId = eventResponseId || Date.now();

    try {
      // Verificar caché primero
      const cachedResponse = this.cacheManager.get(action, content);
      if (cachedResponse) {
        this.addResponseToHistory(action, cachedResponse);
        return;
      }

      // Inicializar el cliente API si es necesario
      if (!this.apiClient || !this.isInitialized) {
        await this.initializeComponents();
      }

      // Agregar respuesta inicial vacía solo si no estamos usando un ID existente
      if (!eventResponseId) {
        this.responseHistory.addResponse({
          id: currentResponseId,
          action,
          content: "", // Contenido vacío es crucial para streaming
          timestamp: new Date(),
        });
      }

      // Iniciar auto-desplazamiento para mantener visible el último contenido
      let autoScrollId;
      const startAutoScroll = () => {
        const container = this.shadowRoot.querySelector(".response-container");
        if (container) {
          autoScrollId = setInterval(() => {
            container.scrollTop = container.scrollHeight;
          }, 200);
        }
      };
      startAutoScroll();

      // Crear un manejador de progreso optimizado
      const onProgress = (chunk) => {
        if (!chunk) return; // Ignorar chunks vacías

        // Enviar la actualización incremental
        this.responseHistory.updateResponse(
          currentResponseId,
          (prevContent) => prevContent + chunk
        );
      };

      // Ejecutar la solicitud con streaming
      console.log(
        `[AITextEnhancer] Ejecutando acción "${action}" con streaming`
      );
      const completeText = await this.apiClient.enhanceText(
        content || this.currentContent,
        action,
        this.productImage,
        this.context,
        onProgress
      );

      // Detener auto-desplazamiento
      if (autoScrollId) {
        clearInterval(autoScrollId);
      }

      // Finalizar el streaming y aplicar formato
      setTimeout(() => {
        // Este timeout asegura que todas las actualizaciones incrementales
        // se hayan procesado antes de la actualización final
        const response = this.responseHistory.getResponse(currentResponseId);
        if (response) {
          // Aplicar una actualización final con formateo completo
          this.responseHistory.updateResponse(
            currentResponseId,
            response.content
          );

          // Desplazar al último contenido
          const container = this.shadowRoot.querySelector(
            ".response-container"
          );
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }

        // Guardar en caché para futuras solicitudes similares
        this.cacheManager.set(
          action,
          content || this.currentContent,
          completeText
        );
      }, 300);
    } catch (error) {
      console.error("Error in handleToolAction:", error);

      // Actualizar con el error
      this.responseHistory.updateResponse(
        currentResponseId,
        `Error: ${error.message || "Se produjo un error inesperado"}`
      );
    }
  }

  formatErrorMessage(error) {
    if (error.message.includes("CORS")) {
      return "Error: Unable to connect to AI service. Please check your API key and try again.";
    }
    if (error.message.includes("Failed to fetch")) {
      return "Error: Network connection failed. Please check your internet connection.";
    }
    return `Error: ${error.message}`;
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
}

customElements.define("ai-text-enhancer", AITextEnhancer);

export default AITextEnhancer;
