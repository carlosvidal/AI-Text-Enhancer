import { ResponseHistory } from "./components/ResponseHistory.js";
import { ChatWithImage } from "./components/ChatWithImage.js";
import { ToolBar } from "./components/ToolBar.js";
import { TokenManager } from "./services/token-manager.js";
import { MarkdownHandler } from "./services/markdown-handler.js";
import { createAPIClient } from "./services/api-client.js";
import { createCacheManager } from "./services/cache-manager.js";
import { ModelManager } from "./services/model-manager.js";
import { EditorAdapter } from "./services/editor-adapter.js";
// Update this import line
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
import { createTemplate } from "./template.js";

class AITextEnhancer extends HTMLElement {
  constructor() {
    super();

    // Apply mixins first
    Object.assign(
      this,
      keyboardNavigationMixin,
      responseHandlerMixin,
      imageHandlerMixin
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

    // Initialize cache
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1000,
    });

    // State initialization
    this.enhancedText = "";
    this.chatMessages = [];
    this.isInitialized = false;
    this.productImage = null;
    this.usageControl = null;

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
      "prompt", // Make sure this is included
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
      this.notificationManager.error(`Initialization error: ${error.message}`);
    }
  }

  updateLanguageForChildren(language) {
    console.log("[AITextEnhancer] Updating language for children:", language);

    if (!this.shadowRoot) {
      console.warn("[AITextEnhancer] No shadowRoot available yet");
      return;
    }

    // Update modal trigger text
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");
    if (modalTrigger) {
      modalTrigger.textContent = this.translations.modalTitle || "Enhance Text";
      console.log(
        "[AITextEnhancer] Updated modal trigger text:",
        modalTrigger.textContent
      );

      // Ensure event listener is still working
      if (this.modalTriggerHandler) {
        modalTrigger.removeEventListener("click", this.modalTriggerHandler);
        modalTrigger.addEventListener("click", this.modalTriggerHandler);
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

  // Core functionality
  setupEventListeners() {
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
    }

    this.responseHistory = this.shadowRoot.querySelector("response-history");
    if (this.responseHistory) {
      // Corregir los nombres de los eventos para que coincidan con los originales
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

  async handleChatMessage(event) {
    const { message, image } = event.detail;

    if (!this.apiKey) {
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      // Asegurar que tenemos un mensaje válido
      if (!message?.trim()) {
        throw new Error("Message cannot be empty");
      }

      // Preparar el contenido del chat
      const currentContent =
        this.currentContent?.trim() || "No content available";

      if (image) {
        if (!this.validateImage(image)) {
          throw new Error("Invalid image format or size");
        }
        this.addResponseToHistory(
          "image-upload",
          this.renderImagePreview(image)
        );
      }

      // Agregar la pregunta al historial
      this.addResponseToHistory(
        "chat-question",
        `**${this.translations.chat.question}:** ${message}`
      );

      // Mostrar indicador de carga
      const tempResponse = {
        id: Date.now(),
        action: "chat-response",
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.addResponse(tempResponse);

      // Hacer la solicitud a la API
      const response = await this.apiClient.chatResponse(
        currentContent,
        message.trim(),
        image
      );

      if (tempResponse) {
        this.responseHistory.removeResponse(tempResponse.id);
      }

      // Procesar y mostrar la respuesta
      if (!response) {
        throw new Error("Empty response from API");
      }

      const finalContent = image
        ? { content: response, imageUsed: image.name }
        : response;

      const chatContent = `${currentContent}-${message}`;
      this.cacheManager.set("chat", chatContent, finalContent);
      this.addResponseToHistory(
        "chat-response",
        finalContent.content || finalContent
      );
    } catch (error) {
      console.error("Chat Error:", error);
      if (tempResponse) {
        this.responseHistory.removeResponse(tempResponse.id);
      }
      const errorMessage = this.formatErrorMessage(error);
      this.addResponseToHistory("chat-error", errorMessage);
    }
  }

  validateImage(image) {
    const maxSize = 4 * 1024 * 1024; // 4MB
    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    return image.size <= maxSize && validTypes.includes(image.type);
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
    }

    this.bindEvents();
  }

  async initializeComponents() {
    if (this.isInitialized) return;

    try {
      const apiKey = this.apiKey;
      if (!apiKey) {
        throw new Error("API key is required");
      }

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

      // Initialize markdown handler and pass it to response history
      if (this.markdownHandler) {
        await this.markdownHandler.initialize();
        const responseHistory =
          this.shadowRoot.querySelector("response-history");
        if (responseHistory) {
          responseHistory.markdownHandler = this.markdownHandler;
        }
      }

      // Set initial state
      this.isInitialized = true;

      // Update visible tools based on content
      this.updateVisibleTools();
    } catch (error) {
      console.error("Error in initializeComponents:", error);
      throw error;
    }
  }

  updateVisibleTools() {
    const hasContent = Boolean(this.currentContent.trim());
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.setAttribute("has-content", hasContent.toString());
    }
  }

  // ... keep other core methods that aren't moved to mixins ...
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

  isModalOpen() {
    return this.shadowRoot.querySelector(".modal").classList.contains("open");
  }

  async handleToolAction(event) {
    const action = event.detail?.action || event;
    if (!this.apiKey) {
      console.warn("No API key provided");
      this.addResponseToHistory("error", this.translations.errors.apiKey);
      return;
    }

    let tempResponse = null;

    try {
      const content = this.currentContent;
      const cachedResponse = this.cacheManager.get(action, content);

      if (cachedResponse) {
        this.addResponseToHistory(action, cachedResponse);
        return;
      }

      tempResponse = {
        id: Date.now(),
        action,
        content: '<span class="typing">|</span>',
        timestamp: new Date(),
      };
      this.responseHistory.addResponse(tempResponse);

      // Reinicializar el cliente API si es necesario
      if (!this.apiClient || !this.isInitialized) {
        await this.initializeComponents();
      }

      const completeText = await this.apiClient.enhanceText(
        content,
        action,
        null,
        this.context
      );

      this.responseHistory.removeResponse(tempResponse.id);
      this.addResponseToHistory(action, completeText);
      this.cacheManager.set(action, content, completeText);
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      if (tempResponse) {
        this.responseHistory.removeResponse(tempResponse.id);
      }
      this.addResponseToHistory("error", error.message || "An error occurred");
    }
  }

  async handleChatMessage(event) {
    const { message, image } = event.detail;

    if (!this.apiKey) {
      this.addResponseToHistory("chat-error", this.translations.errors.apiKey);
      return;
    }

    try {
      const chatContent = `${this.currentContent}-${message}`;

      if (image) {
        this.addResponseToHistory(
          "image-upload",
          this.renderImagePreview(image)
        );
      }

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

      const response = await this.apiClient.chatResponse(
        this.currentContent,
        message,
        image
      );

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

// Remove the Object.assign here since we're doing it in the constructor
customElements.define("ai-text-enhancer", AITextEnhancer);

export default AITextEnhancer;
