// ai-text-enhancer.js

import { styles } from "./styles.js";
import { MarkdownHandler } from "./markdown-handler.js";
import { createAPIClient } from "./api-client.js";
import { createCacheManager } from "./cache-manager.js";
import { ModelManager } from "./model-manager.js";
import { TRANSLATIONS } from "./translations.js";

class AITextEnhancer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

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
  }

  static get observedAttributes() {
    return ["editor-id", "api-key", "api-provider", "api-model", "language"];
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
    try {
      const editor = document.getElementById(this.editorId);
      if (!editor) return "";

      // Check if TinyMCE is being used
      if (window.tinymce) {
        const tinymceEditor = tinymce.get(this.editorId);
        // Check if TinyMCE editor exists and is initialized
        if (tinymceEditor && tinymceEditor.initialized) {
          return tinymceEditor.getContent();
        }
      }

      // Fallback to regular textarea
      return editor.value || "";
    } catch (error) {
      console.error("Error getting editor content:", error);
      return "";
    }
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
      this.updatePreview(this.translations.preview.placeholder);
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

    // Generate button
    this.shadowRoot.querySelector(".generate-button").onclick = () => {
      const activeToolButton = this.shadowRoot.querySelector(
        ".tool-button.active"
      );
      const action = activeToolButton
        ? activeToolButton.dataset.action
        : "improve";
      this.handleToolAction(action);
    };
  }

  createTemplate() {
    const t = this.translations;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>${styles}</style>
      <button class="modal-trigger">${t.modalTrigger}</button>
      
      <div class="modal">
        <div class="modal-content">
          <button class="close-button">×</button>
          <div class="modal-header">
            <h2>${t.modalTitle}</h2>
          </div>
          
          <div class="modal-body">
            <div class="editor-section">
              <div class="tools">
                <button class="tool-button" data-action="summarize">${t.tools.summarize}</button>
                <button class="tool-button" data-action="expand">${t.tools.expand}</button>
                <button class="tool-button" data-action="paraphrase">${t.tools.paraphrase}</button>
                <button class="tool-button" data-action="style">${t.tools.style}</button>
              </div>

              <div class="preview">${t.preview.placeholder}</div>
        
              <div class="actions">
                <button class="action-button primary generate-button">${t.actions.generate}</button>
                <button class="action-button" data-action="retry">${t.actions.retry}</button>
                <button class="action-button success" data-action="insert">${t.actions.insert}</button>
                <button class="action-button primary" data-action="replace">${t.actions.replace}</button>
              </div>
            </div>
            
            <div class="chat-section">
              <div class="chat-container"></div>
              <form class="chat-form">
                <input type="text" class="chat-input" placeholder="${t.chat.placeholder}">
                <button type="submit" class="action-button primary">${t.chat.send}</button>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    return template;
  }

  connectedCallback() {
    try {
      // Crear y adjuntar el template con las traducciones correctas
      const template = this.createTemplate();
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Resto de la inicialización...
      this.bindEvents();
      this.initializeComponents();

      if (this.apiKey) {
        this.apiClient?.setApiKey(this.apiKey);
      }
    } catch (error) {
      console.error(this.translations.errors.initialization, error);
    }
  }

  async initializeComponents() {
    try {
      await this.markdownHandler.initialize();

      // Initialize ModelManager with current provider
      this.modelManager.setProvider(this.apiProvider);

      // Initialize API client
      this.apiClient = createAPIClient({
        provider: this.apiProvider,
        model: this.apiModel,
      });

      // Set API key if available
      if (this.apiKey) {
        this.apiClient.setApiKey(this.apiKey);
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

  async handleToolAction(action) {
    try {
      console.log("🔄 HandleToolAction - Starting", action);
      await this.waitForInitialization();

      console.log("🔑 Current API Key:", this.apiKey ? "Present" : "Missing");
      console.log("🔧 API Client exists:", !!this.apiClient);

      if (!this.apiKey || !this.apiClient) {
        console.log("❌ Missing API Key or API Client");
        this.updatePreview(
          `Error: API key not configured. Please provide a valid API key.`
        );
        return;
      }

      const content = this.currentContent;
      console.log("📝 Content length:", content.length);

      const preview = this.shadowRoot.querySelector(".preview");
      preview.textContent = "Generando respuesta...";

      // Check cache first
      const cachedResult = this.cacheManager.get(action, content);
      if (cachedResult) {
        this.updatePreview(cachedResult);
        return;
      }

      // If not in cache, call API
      const enhancedText = await this.apiClient.enhanceText(
        content,
        action,
        (partialResponse) => this.updatePreview(partialResponse)
      );

      // Cache the result
      this.cacheManager.set(action, content, enhancedText);

      this.updatePreview(enhancedText);
    } catch (error) {
      console.error("Error in handleToolAction:", error);
      this.updatePreview(`Error: ${error.message}`);
    }
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
      const html = this.markdownHandler.convertToHTML(text);
      preview.innerHTML = html;
      this.enhancedText = text;
    } catch (error) {
      console.error("Error updating preview:", error);
      preview.textContent = text;
    }
  }

  setEditorContent(content, mode = "replace") {
    const editor = document.getElementById(this.editorId);
    if (!editor) return;

    try {
      const html =
        window.tinymce && tinymce.get(this.editorId)
          ? this.markdownHandler.convertForTinyMCE(content)
          : this.markdownHandler.getPlainText(content);

      if (window.tinymce && tinymce.get(this.editorId)) {
        if (mode === "insert") {
          tinymce.get(this.editorId).insertContent(html);
        } else {
          tinymce.get(this.editorId).setContent(html);
        }
      } else {
        if (mode === "insert") {
          const start = editor.selectionStart;
          editor.value =
            editor.value.substring(0, start) +
            html +
            editor.value.substring(editor.selectionEnd);
          editor.selectionStart = editor.selectionEnd = start + html.length;
        } else {
          editor.value = html;
        }
      }
    } catch (error) {
      console.error("Error setting editor content:", error);
      if (mode === "insert") {
        editor.value += content;
      } else {
        editor.value = content;
      }
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
