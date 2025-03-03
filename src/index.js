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
      "proxy-endpoint",
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

  get proxyEndpoint() {
    return this.getAttribute("proxy-endpoint");
  }

  // Lifecycle methods
  /**
   * Add this to the connectedCallback to ensure all methods are set up properly
   */
  // Add this code inside the connectedCallback method
  async connectedCallback() {
    try {
      console.log("[AITextEnhancer] Component connected, initializing...");

      // Crear el template y adjuntarlo al shadowRoot
      const template = createTemplate(this);
      attachShadowTemplate(this, template);
      console.log("[AITextEnhancer] Shadow DOM created");

      // Asegurar que el modal exista y esté configurado correctamente
      this.ensureModalExists();

      // Configurar idioma para los hijos
      this.updateLanguageForChildren(this.language);

      // Configurar eventos
      this.setupEventListeners();
      setupKeyboardNavigation(this);

      // Inicializar componentes - esperar a que completen
      await this.initializeComponents();
      console.log("[AITextEnhancer] Components initialized");

      // Configurar listener del editor
      this.setupEditorListener();

      // Actualizar estado inicial del chat
      this.updateChatState();

      // Reforzar la vinculación de eventos después de la inicialización
      setTimeout(() => {
        console.log("[AITextEnhancer] Re-binding events after initialization");
        this.bindEvents();

        // Verificación final
        const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");
        if (modalTrigger) {
          console.log("[AITextEnhancer] Modal trigger element:", modalTrigger);
          console.log(
            "[AITextEnhancer] Modal trigger listeners:",
            modalTrigger.onclick
          );
        } else {
          console.warn(
            "[AITextEnhancer] Modal trigger still not found after initialization"
          );
        }
      }, 200);

      console.log("[AITextEnhancer] Component fully initialized");
    } catch (error) {
      console.error("[AITextEnhancer] Error initializing component:", error);

      // Intentar mostrar notificación de error
      try {
        if (this.notificationManager) {
          this.notificationManager.error(
            `Initialization error: ${error.message}`
          );
        } else {
          // Fallback: mostrar error en el shadowRoot si está disponible
          if (this.shadowRoot) {
            const errorElement = document.createElement("div");
            errorElement.style.color = "red";
            errorElement.style.padding = "10px";
            errorElement.style.margin = "10px 0";
            errorElement.style.border = "1px solid red";
            errorElement.textContent = `Error initializing component: ${error.message}`;
            this.shadowRoot.appendChild(errorElement);
          }
        }
      } catch (notifError) {
        console.error(
          "[AITextEnhancer] Error showing notification:",
          notifError
        );
      }
    }
  }
  /**
   * Override the attributeChangedCallback to handle context changes
   */
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
      case "context":
        // Update chat state when context changes
        setTimeout(() => this.updateChatState(), 100);
        break;
      case "api-provider":
      case "api-model":
      case "proxy-endpoint":
        if (this.isInitialized && this.apiClient) {
          this.apiClient.updateConfig({
            provider: this.apiProvider,
            model: this.apiModel,
            proxyEndpoint: this.proxyEndpoint,
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

  /**
   * Add editor content change listener to update chat state
   */
  setupEditorListener() {
    if (!this.editorId) return;

    const editorElement = document.getElementById(this.editorId);
    if (!editorElement) {
      console.warn(
        `[AITextEnhancer] Editor element with ID "${this.editorId}" not found`
      );
      return;
    }

    // Listen for input events on the editor
    const updateChatOnChange = () => {
      // Update only if modal is open to avoid unnecessary updates
      if (this.isModalOpen()) {
        this.updateChatState();
      }
    };

    // Add event listeners for different types of editors
    editorElement.addEventListener("input", updateChatOnChange);
    editorElement.addEventListener("change", updateChatOnChange);

    console.log(
      `[AITextEnhancer] Editor listener set up for "${this.editorId}"`
    );
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

  /**
   * Handler for modal trigger button click
   */
  modalTriggerHandler() {
    console.log("[AITextEnhancer] Modal trigger clicked, checking shadowRoot");

    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] Shadow root not available");
      return;
    }

    const modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.error("[AITextEnhancer] Modal element not found in shadowRoot");
      return;
    }

    console.log("[AITextEnhancer] Opening modal with current state:", {
      apiProvider: this.apiProvider,
      model: this.apiModel,
      language: this.language,
      context:
        this.context?.substring(0, 50) +
        (this.context?.length > 50 ? "..." : ""),
      imageUrl: this.imageUrl,
      hasContent: Boolean(this.currentContent?.trim()),
      hasContext: Boolean(this.context?.trim()),
    });

    modal.classList.add("open");

    // Asegurar que se actualice el estado de las herramientas
    setTimeout(() => {
      this.updateVisibleTools();
      this.updateChatState();

      // Enfocar el primer elemento interactivo para mejorar la accesibilidad
      const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);
  }

  // Mejora adicional: Reforzar la inicialización del componente en connectedCallback
  // Agrega esta función de ayuda a la clase AITextEnhancer

  ensureModalExists() {
    // Esta función garantiza que el modal esté presente en el DOM
    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] No shadowRoot available for modal check");
      return false;
    }

    let modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.warn("[AITextEnhancer] Modal not found, attempting to recreate");

      // Intentar recrear el modal desde la plantilla
      const template = createTemplate(this);
      const fragment = document
        .createRange()
        .createContextualFragment(template);
      const newModal = fragment.querySelector(".modal");

      if (newModal) {
        this.shadowRoot.appendChild(newModal);
        console.log("[AITextEnhancer] Modal recreated successfully");

        // Asegurar que los eventos estén vinculados
        const closeButton = newModal.querySelector(".close-button");
        if (closeButton) {
          closeButton.onclick = () => newModal.classList.remove("open");
        }

        newModal.onclick = (e) => {
          if (e.target === newModal) {
            newModal.classList.remove("open");
          }
        };

        modal = newModal;
      } else {
        console.error("[AITextEnhancer] Failed to recreate modal");
        return false;
      }
    }

    return true;
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
    // Verificar que el shadowRoot exista
    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] No shadowRoot available in bindEvents");
      return;
    }

    // Modal events
    const modal = this.shadowRoot.querySelector(".modal");
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");

    if (modalTrigger) {
      // Define the handler as a bound method if not already bound
      if (!this.modalTriggerHandler) {
        this.modalTriggerHandler = this.modalTriggerHandler.bind(this);
      }

      // Remove any existing event listener before adding new one
      modalTrigger.removeEventListener("click", this.modalTriggerHandler);
      modalTrigger.addEventListener("click", this.modalTriggerHandler);
      console.log("[AITextEnhancer] Modal trigger event bound");
    } else {
      console.warn("[AITextEnhancer] Modal trigger not found in bindEvents");
    }

    // Modal and close button
    if (modal) {
      // Set up click outside to close
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
        }
      };

      // Close button
      const closeButton = modal.querySelector(".close-button");
      if (closeButton) {
        closeButton.onclick = () => modal.classList.remove("open");
        console.log("[AITextEnhancer] Close button event bound");
      } else {
        console.warn("[AITextEnhancer] Close button not found in modal");
      }
    } else {
      console.warn("[AITextEnhancer] Modal element not found in bindEvents");
    }

    // Tool buttons
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      // Remove previous listener if it exists
      toolbar.removeEventListener("toolaction", this.handleToolAction);
      toolbar.addEventListener("toolaction", this.handleToolAction);
      console.log("[AITextEnhancer] Toolbar events bound");
    } else {
      console.warn("[AITextEnhancer] Toolbar not found in bindEvents");
    }

    // Chat component
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      // Remove previous listener if it exists
      chatComponent.removeEventListener("chatMessage", this.handleChatMessage);
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
      console.log("[AITextEnhancer] Chat component events bound");
    }

    // Response history
    if (this.responseHistory) {
      // Remove previous listeners
      this.responseHistory.removeEventListener(
        "responseCopy",
        this.handleResponseCopy
      );
      this.responseHistory.removeEventListener(
        "responseUse",
        this.handleResponseUse
      );
      this.responseHistory.removeEventListener(
        "responseRetry",
        this.handleResponseRetry
      );
      this.responseHistory.removeEventListener(
        "responseEdit",
        this.handleResponseEdit
      );
      this.responseHistory.removeEventListener(
        "toolaction",
        this.handleToolAction
      );

      // Add new listeners
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
      console.log("[AITextEnhancer] Response history events bound");
    }

    // Set up editor listener
    this.setupEditorListener();

    console.log("[AITextEnhancer] All events bound successfully");
  }

  async initializeComponents() {
    if (this.isInitialized) return;

    try {
      // Inicializar markdown handler
      await this.markdownHandler.initialize();
      console.log("[AITextEnhancer] Markdown handler initialized");

      // Obtener el endpoint del proxy del atributo o usar el valor predeterminado
      const proxyEndpoint =
        this.proxyEndpoint || "http://llmproxy.test:8080/api/llm-proxy";

      // Inicializar API client con proxy
      this.apiClient = createAPIClient({
        provider: this.apiProvider,
        model: this.apiModel,
        systemPrompt: this.prompt,
        temperature: 0.7,
        proxyEndpoint: proxyEndpoint,
        tenantId: this.getAttribute("tenant-id") || "default",
        userId: this.getAttribute("user-id") || "default",
      });

      // Inicializar editor adapter si editor ID es proporcionado
      if (this.editorId) {
        this.editorAdapter = new EditorAdapter(this.editorId);
      }

      // Pasar markdown handler a response history
      const responseHistory = this.shadowRoot.querySelector("response-history");
      if (responseHistory) {
        responseHistory.markdownHandler = this.markdownHandler;
        console.log(
          "[AITextEnhancer] Markdown handler passed to response history"
        );
      }

      // Establecer estado inicial
      this.isInitialized = true;

      // Actualizar herramientas visibles basadas en contenido
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

    // Ya no es necesario verificar la API key
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

      // Un último scroll para asegurar que todo el contenido sea visible
      setTimeout(() => {
        const responseContainer = this.shadowRoot.querySelector(
          ".response-container"
        );
        if (responseContainer) {
          responseContainer.scrollTop = responseContainer.scrollHeight;
        }
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
    // return this.requestUpdate(part); // ¡Esto es una llamada recursiva infinita!
    return this.stateManager.triggerUpdate(part);
  }

  /**
   * Updates the ChatWithImage component with current content and context state
   * This should be called whenever editor content or context changes
   */
  updateChatState() {
    if (!this.shadowRoot) return;

    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (!chatComponent) return;

    const hasContent = Boolean(this.currentContent?.trim());
    const hasContext = Boolean(this.context?.trim());

    // Update attributes
    chatComponent.setAttribute("has-content", hasContent.toString());
    chatComponent.setAttribute("has-context", hasContext.toString());

    // Log for debugging
    console.log("[AITextEnhancer] Updated chat state:", {
      hasContent,
      hasContext,
      contentLength: this.currentContent?.length || 0,
      contextLength: this.context?.length || 0,
    });
  }

  /**
   * Override the original handleToolAction method to update chat state after content changes
   */
  async handleToolAction(event) {
    const { action, responseId, content } = event.detail;

    let tempResponse = null;
    try {
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

      if (!this.apiClient || !this.stateManager.get("isInitialized")) {
        await this.initializeComponents();
      }

      // Manejador de streaming
      const onProgress = (chunk) => {
        this.responseHistory.updateResponse(
          tempResponse.id,
          (prevContent) =>
            prevContent.replace('<span class="typing">|</span>', "") + chunk
        );
      };

      // Hacer la petición real al proxy
      const completeText = await this.apiClient.enhanceText(
        content,
        action,
        null,
        this.context,
        onProgress
      );

      // Si no usamos streaming, necesitamos actualizar la respuesta completa
      if (!completeText.includes('<span class="typing">|</span>')) {
        this.responseHistory.removeResponse(tempResponse.id);
        this.addResponseToHistory(action, completeText);
      }

      // Guardar en caché
      this.cacheManager.set(action, content, completeText);

      // Update chat state since content might have changed
      this.updateChatState();
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      if (tempResponse) {
        this.responseHistory.removeResponse(tempResponse.id);
      }
      this.addResponseToHistory("error", error.message || "An error occurred");
    }
  }

  handleResponseUse(event) {
    console.log("[ResponseHandlers] Use event received:", event.detail);
    const { responseId } = event.detail;

    if (!this.responseHistory) {
      console.error("[ResponseHandlers] No response history available");
      return;
    }

    if (!this.editorAdapter) {
      console.error("[ResponseHandlers] No editor adapter available");
      return;
    }

    const response = this.responseHistory.getResponse(responseId);
    console.log("[ResponseHandlers] Found response:", response);

    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    try {
      console.log(
        "[ResponseHandlers] Setting content to editor:",
        response.content
      );
      this.editorAdapter.setContent(response.content);

      // Update chat state since the editor content has changed
      setTimeout(() => {
        this.updateChatState();
      }, 100); // Small delay to ensure editor content is updated
    } catch (error) {
      console.error("[ResponseHandlers] Error setting content:", error);
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
