// Versión mejorada del archivo index.js con todas las correcciones integradas

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
import { createNotificationManager } from "./services/notification-manager.js";

// Feature imports
import {
  setupKeyboardNavigation,
  keyboardNavigationMixin,
} from "./features/keyboard-navigation.js";
import { responseHandlerMixin } from "./features/response-handlers.js";
import { imageHandlerMixin } from "./features/image-handlers.js";
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
      stateManagementMixin
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

    // Modal trigger handler
    this.modalTriggerHandler = this.modalTriggerHandler?.bind(this);
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
      "editor-type",
      "hide-trigger",
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

  get editorType() {
    return this.getAttribute("editor-type") || "textarea";
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

  get hideTrigger() {
    return this.hasAttribute("hide-trigger");
  }

  // Método mejorado para connectedCallback
  async connectedCallback() {
    try {
      console.log("[AITextEnhancer] Component connected, initializing...");

      // Crear el template y adjuntarlo al shadowRoot
      const template = createTemplate(this);
      attachShadowTemplate(this, template);
      console.log("[AITextEnhancer] Shadow DOM created");

      // Inicializar el NotificationManager
      const notificationsContainer = this.shadowRoot.querySelector(
        ".notifications-container"
      );
      if (notificationsContainer) {
        this.notificationManager = createNotificationManager(
          notificationsContainer
        );
        console.log("[AITextEnhancer] Notification manager initialized");
      }

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

  // Método mejorado para attributeChangedCallback
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

  // Método mejorado para setupEditorListener
  setupEditorListener() {
    if (!this.editorId) {
      console.warn("[AITextEnhancer] No editor ID provided");
      return;
    }

    const editorElement = document.getElementById(this.editorId);
    if (!editorElement) {
      console.warn(
        `[AITextEnhancer] Editor element with ID "${this.editorId}" not found`
      );

      if (this.notificationManager) {
        this.notificationManager.warning(
          `Editor element "${this.editorId}" not found. Text enhancement functionality may be limited.`
        );
      }
      return;
    }

    // Función para actualizar el estado del chat cuando cambia el contenido del editor
    const updateChatOnChange = () => {
      // Update only if modal is open to avoid unnecessary updates
      if (this.isModalOpen()) {
        this.updateChatState();

        // También actualizar las herramientas visibles basado en el contenido
        this.updateVisibleTools();
      }
    };

    // Eliminar listeners anteriores si existen
    if (this._editorChangeListener) {
      editorElement.removeEventListener("input", this._editorChangeListener);
      editorElement.removeEventListener("change", this._editorChangeListener);
    }

    // Guardar referencia al listener para poder eliminarlo después
    this._editorChangeListener = updateChatOnChange;

    // Añadir listeners para diferentes tipos de editores
    editorElement.addEventListener("input", this._editorChangeListener);
    editorElement.addEventListener("change", this._editorChangeListener);

    console.log(
      `[AITextEnhancer] Editor listener set up for "${this.editorId}"`
    );
  }

  // Método mejorado para updateLanguageForChildren
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

    // Asegurar que el manejador de eventos siga funcionando
    if (this.modalTriggerHandler) {
      const trigger = this.shadowRoot.querySelector(".modal-trigger");
      if (trigger) {
        trigger.removeEventListener("click", this.modalTriggerHandler);
        trigger.addEventListener("click", this.modalTriggerHandler);
      }
    }

    // Actualizar componentes con el atributo de language
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

    // Forzar la actualización en componentes específicos
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

  // Método mejorado para modalTriggerHandler
  modalTriggerHandler() {
    console.log("[AITextEnhancer] Modal trigger clicked, checking shadowRoot");

    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] Shadow root not available");
      return;
    }

    const modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.error("[AITextEnhancer] Modal element not found in shadowRoot");

      // Intentar recrear el modal
      if (this.notificationManager) {
        this.notificationManager.warning(
          "Modal not found, trying to recreate it..."
        );
      }

      if (this.ensureModalExists()) {
        const newModal = this.shadowRoot.querySelector(".modal");
        if (newModal) {
          modal = newModal;
        } else {
          if (this.notificationManager) {
            this.notificationManager.error("Failed to recreate modal");
          }
          return;
        }
      } else {
        return;
      }
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

  // Método público para abrir el modal programáticamente
  openModal() {
    const modal = this.shadowRoot.querySelector(".modal");
    if (modal) {
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
  }

  // Función para asegurar que el modal exista
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

  // Método mejorado para setupEventListeners
  setupEventListeners() {
    // Obtener el componente de chat
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      // Eliminar listener anterior si existe
      chatComponent.removeEventListener("chatMessage", this.handleChatMessage);
      // Agregar nuevo listener
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
      console.log("[AITextEnhancer] Chat message event listener set up");
    } else {
      console.warn("[AITextEnhancer] Chat component not found");
    }

    // Obtener el componente de historial de respuestas
    this.responseHistory = this.shadowRoot.querySelector("response-history");
    if (this.responseHistory) {
      // Configurar markdown handler
      if (this.markdownHandler) {
        this.responseHistory.markdownHandler = this.markdownHandler;
      }

      // Configurar eventos
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

      console.log("[AITextEnhancer] Response history events set up");
    } else {
      console.warn("[AITextEnhancer] Response history component not found");
    }

    // Configurar evento para actualización de configuración
    this.addEventListener("configurationUpdated", (event) => {
      console.log("[AITextEnhancer] Configuration updated:", event.detail);
      if (this.isInitialized) {
        this.initializeComponents().catch((error) => {
          console.error("Error reinitializing components:", error);
          if (this.notificationManager) {
            this.notificationManager.error(
              `Failed to update configuration: ${error.message}`
            );
          }
        });
      }
    });

    // Vincular eventos UI
    this.bindEvents();
  }

  // Método mejorado para bindEvents
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

  // Método actualizado para initializeComponents
  async initializeComponents() {
    if (this.isInitialized) {
      console.log("[AITextEnhancer] Components already initialized, skipping");
      return;
    }

    try {
      console.log("[AITextEnhancer] Initializing components...");

      // Inicializar markdown handler
      await this.markdownHandler.initialize();
      console.log("[AITextEnhancer] Markdown handler initialized");

      // Obtener el endpoint del proxy del atributo o usar el valor predeterminado
      const proxyEndpoint =
        this.proxyEndpoint || "http://llmproxy2.test:8080/api/llm-proxy";

      // Inicializar API client con proxy
      this.apiClient = createAPIClient({
        provider: this.apiProvider,
        model: this.apiModel,
        systemPrompt: this.prompt,
        temperature: 0.7,
        proxyEndpoint: proxyEndpoint,
        tenantId: this.getAttribute("tenant-id") || "default",
        userId: this.getAttribute("user-id") || "default",
        debugMode: true,
      });

      console.log(
        "[AITextEnhancer] API client initialized with provider",
        this.apiProvider
      );

      // Inicializar editor adapter si editor ID es proporcionado
      if (this.editorId) {
        // Pasar el tipo de editor al crear EditorAdapter
        this.editorAdapter = new EditorAdapter(this.editorId, this.editorType);
        console.log(
          "[AITextEnhancer] Editor adapter initialized for",
          this.editorId,
          "with type",
          this.editorType
        );
      } else {
        console.warn(
          "[AITextEnhancer] No editor ID provided, editor adapter not initialized"
        );
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

      // Notificar éxito
      if (this.notificationManager) {
        this.notificationManager.success(
          "AI Text Enhancer initialized successfully"
        );
      }

      // Actualizar herramientas visibles basadas en contenido
      this.updateVisibleTools();

      return true;
    } catch (error) {
      console.error("Error in initializeComponents:", error);

      // Notificar error
      if (this.notificationManager) {
        this.notificationManager.error(
          `Initialization error: ${error.message}`
        );
      }

      this.addResponseToHistory(
        "error",
        `Initialization error: ${error.message}`
      );

      throw error;
    }
  }

  isModalOpen() {
    const modal = this.shadowRoot?.querySelector(".modal");
    return modal ? modal.classList.contains("open") : false;
  }

  updateVisibleTools() {
    const hasContent = Boolean(this.currentContent?.trim());
    const toolbar = this.shadowRoot?.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.setAttribute("has-content", hasContent.toString());
      console.log("[AITextEnhancer] Updated toolbar has-content:", hasContent);
    }
  }

  // Manejador de mensajes de chat actualizado
  async handleChatMessage(event) {
    const { message, image } = event.detail;

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

      // Mostrar notificación de éxito sutil
      if (this.notificationManager) {
        this.notificationManager.success("Response received", 2000);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = this.formatErrorMessage(error);
      this.addResponseToHistory("chat-error", errorMessage);

      // Mostrar notificación de error
      if (this.notificationManager) {
        this.notificationManager.error(`Chat error: ${error.message}`);
      }
    }
  }

  // Agrega este método para solicitar actualizaciones explícitas
  requestUpdate(part = null) {
    // Este método delegará en el stateManager
    if (
      this.stateManager &&
      typeof this.stateManager.triggerUpdate === "function"
    ) {
      return this.stateManager.triggerUpdate(part);
    } else {
      console.warn(
        "[AITextEnhancer] StateManager or triggerUpdate method not available"
      );
      return false;
    }
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
  /**
   * Improved handleToolAction method for AITextEnhancer
   * This implementation resolves issues with the retry functionality
   * Replace this method in src/index.js
   */
  async handleToolAction(event) {
    // Safely extract action details with fallbacks
    const detail = event.detail || {};
    const action = detail.action;
    const responseId = detail.responseId;
    const content = detail.content;

    console.log("[AITextEnhancer] Tool action received:", {
      action,
      responseId,
      contentLength: content ? content.length : 0,
    });

    if (!action) {
      console.error("[AITextEnhancer] Tool action missing action parameter");
      if (this.notificationManager) {
        this.notificationManager.error("Invalid action request");
      }
      return;
    }

    let tempResponse = null;
    try {
      // Determine text to process - from response content, event content, or current editor content
      const textToProcess = content || this.currentContent;

      // Check for cached response
      const cachedResponse = this.cacheManager?.get(action, textToProcess);
      if (cachedResponse) {
        console.log("[AITextEnhancer] Using cached response for", action);
        this.addResponseToHistory(action, cachedResponse);
        return;
      }

      // Create temporary response for showing progress
      tempResponse = {
        id: Date.now(),
        action,
        content: "", // Empty content to start with
        timestamp: new Date(),
      };

      // Add response to history
      if (this.responseHistory) {
        this.responseHistory.addResponse(tempResponse);
      } else {
        console.error("[AITextEnhancer] Response history not available");
        return;
      }

      // Check if components are initialized
      if (!this.apiClient || !this.isInitialized) {
        console.log(
          "[AITextEnhancer] Components not initialized, initializing now..."
        );
        await this.initializeComponents();
      }

      // Handler for streaming updates
      const onProgress = (chunk) => {
        if (chunk && this.responseHistory) {
          this.responseHistory.updateResponse(
            tempResponse.id,
            (prevContent) => prevContent + chunk
          );
        }
      };

      try {
        // Make the actual API request
        console.log("[AITextEnhancer] Making API request for action:", action);

        // Log if we're using an empty text
        if (!textToProcess) {
          console.warn(
            "[AITextEnhancer] Processing empty text for action:",
            action
          );
        }

        const completeText = await this.apiClient.enhanceText(
          textToProcess,
          action,
          null, // No image for tool actions
          this.context,
          onProgress
        );

        // Cache for future requests if cache manager is available
        if (this.cacheManager) {
          this.cacheManager.set(action, textToProcess, completeText);
        }

        // Update chat state
        this.updateChatState();

        // Show success notification
        if (this.notificationManager) {
          const actionName = this.translations?.tools?.[action] || action;
          this.notificationManager.success(
            `Text ${actionName} successfully`,
            2000
          );
        }
      } catch (error) {
        console.error("[AITextEnhancer] API request error:", error);

        // Remove temporary response
        if (tempResponse && this.responseHistory) {
          this.responseHistory.removeResponse(tempResponse.id);
        }

        // Add error message
        this.addResponseToHistory("error", this.formatErrorMessage(error));

        // Show error notification
        if (this.notificationManager) {
          this.notificationManager.error(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("[AITextEnhancer] Error in handleToolAction:", error);

      // Remove temporary response if it exists
      if (tempResponse && this.responseHistory) {
        this.responseHistory.removeResponse(tempResponse.id);
      }

      // Add error message
      this.addResponseToHistory("error", `Error: ${error.message}`);

      // Show notification
      if (this.notificationManager) {
        this.notificationManager.error(`Error: ${error.message}`);
      }
    }
  }

  /**
   * Helper method to add responses to history
   * Add this if it doesn't exist
   */
  addResponseToHistory(action, content) {
    if (!this.responseHistory) {
      console.error("[AITextEnhancer] No response history available");
      return;
    }

    const response = {
      id: Date.now(),
      action,
      content: content || "",
      timestamp: new Date(),
    };

    this.responseHistory.addResponse(response);
    return response;
  }

  /**
   * Helper method to format error messages
   * Add this if it doesn't exist
   */
  formatErrorMessage(error) {
    if (!error) return "An unknown error occurred";

    // Extract message from different error formats
    let message = error.message || error.toString();

    if (error.originalError) {
      message += `\n${
        error.originalError.message || error.originalError.toString()
      }`;
    }

    return message;
  }
}

// Registrar el componente
customElements.define("ai-text-enhancer", AITextEnhancer);

export default AITextEnhancer;
