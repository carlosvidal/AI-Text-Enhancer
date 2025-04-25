// Enhanced ChatWithImage.js
import { TRANSLATIONS } from "../constants/translations.js";
import { variables } from "../styles/base/variables.js";
import { animations } from "../styles/base/animations.js";
import { chatStyles } from "../styles/components/chat.js";
import { imagePreviewStyles } from "../styles/components/image-preview.js";

export class ChatWithImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.tempImage = null;
    // Don't initialize initialPrompt here since it's a getter
  }

  static get observedAttributes() {
    return [
      "language",
      "image-url",
      "initial-prompt",
      "has-content",
      "has-context",
      "supports-images",
      "apiProvider",
      "apiModel",
      "temperature",
    ];
  }

  get apiProvider() {
    return this.getAttribute("apiProvider") || "";
  }

  get apiModel() {
    return this.getAttribute("apiModel") || "";
  }

  get temperature() {
    return this.getAttribute("temperature") || "";
  }

  get supportsImages() {
    return this.getAttribute("supports-images") === "true";
  }

  get language() {
    return this.getAttribute("language") || "en";
  }

  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }

  get imageUrl() {
    return this.getAttribute("image-url");
  }

  get initialPrompt() {
    return this.getAttribute("initial-prompt") || "";
  }

  async connectedCallback() {
    console.log(
      "[ChatWithImage] connectedCallback: imageUrl=",
      this.imageUrl,
      "content=",
      this.getAttribute("content"),
      "context=",
      this.getAttribute("context")
    );
    this.render();
    this.setupEventListeners();

    if (this.imageUrl) {
      await this.handleImageUrl(this.imageUrl);
    }

    // Set initial prompt if available
    this.setInitialPrompt();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    console.log(
      `[ChatWithImage] attributeChangedCallback: ${name} from`,
      oldValue,
      "to",
      newValue,
      {
        content: this.getAttribute("content"),
        context: this.getAttribute("context"),
        initialPrompt: this.getAttribute("initial-prompt"),
      }
    );
    switch (name) {
      case "language":
        this.updateTranslations();
        break;
      case "image-url":
        if (newValue) {
          this.handleImageUrl(newValue);
        }
        break;
      case "apiProvider":
        this.updateUploadVisibility();
        break;
      case "initial-prompt":
      case "has-content":
      case "has-context":
      case "content":
      case "context":
        this.updateInitialPrompt();
        break;
    }
  }

  async setInitialPrompt() {
    if (!this.shadowRoot) return;

    const chatInput = this.shadowRoot.querySelector(".chat-input");
    if (!chatInput) return;

    // Determine which initial prompt to use
    let prompt = "";

    const content = this.getAttribute("content") || this.currentContent || "";
    const context = this.getAttribute("context") || "";

    const hasContent = !!content.trim();
    const hasContext = !!context.trim();

    console.log(
      "[setInitialPrompt] content:",
      content,
      "context:",
      context,
      "hasContent:",
      hasContent,
      "hasContext:",
      hasContext
    );

    if (hasContent && hasContext) {
      // Ambos presentes: mostrar contenido y contexto, pedir mejorar el contenido considerando el contexto
      prompt = `Descripción actual:\n${content}\n\nContexto del producto:\n${context}\n\nPor favor, mejora la descripción teniendo en cuenta el contexto.`;
    } else if (hasContent) {
      // Solo contenido: mostrar contenido, pedir mejorarlo
      prompt = `Descripción actual:\n${content}\n\nPor favor, mejora la descripción.`;
    } else if (hasContext) {
      // Solo contexto: pedir crear una descripción basada en el contexto
      prompt = `Contexto del producto:\n${context}\n\nPor favor, genera una descripción atractiva y persuasiva basada en este contexto.`;
    } else if (this.initialPrompt) {
      prompt = this.initialPrompt;
    }

    console.log("[setInitialPrompt] prompt seleccionado:", prompt);

    // Set the prompt in the input
    if (prompt && chatInput.innerText.trim() === "") {
      chatInput.innerText = prompt;

      // Place cursor at end of text
      if (document.activeElement === chatInput) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(chatInput);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  async updateInitialPrompt() {
    // Check if the input is empty before updating to avoid overwriting user input
    const chatInput = this.shadowRoot?.querySelector(".chat-input");
    if (chatInput && chatInput.innerText.trim() === "") {
      this.setInitialPrompt();
    }
  }

  updateImagePreview() {
    // Remove this method's content - we don't want to show preview in chat
    // Just keep track of the selected image
    const existingPreview = this.shadowRoot.querySelector(
      ".image-preview-container"
    );
    if (existingPreview) {
      existingPreview.remove();
    }
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations}
      ${chatStyles}
      
      .chat-form {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        padding: 8px;
      }
      
      .chat-input-container {
        position: relative;
        flex: 1;
        display: flex;
        align-items: flex-end;
      }
      
      .chat-submit {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .chat-input {
        flex: 1;
        min-height: 24px;
        max-height: 150px;
        padding: 12px;
        padding-right: 40px;
        background: var(--ai-background);
        color: var(--ai-text);
        font-size: 14px;
        line-height: 1.5;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      .chat-input:empty::before {
        content: attr(data-placeholder);
        color: var(--ai-text-light);
      }
      
      .chat-input:focus {
        outline: none;
      }
      
      .chat-upload-button {
        display: inline-flex;
        cursor: pointer;
        color: var(--ai-text-light);
        width: 32px;
        height: 32px;
        background: lightgray;
        padding: 0;
        align-items: center;
        justify-content: center;
        border-radius: var(--ai-radius);
        border: 0;
        flex-shrink: 0;
      }
      
      .chat-upload-button:hover {
        color: var(--ai-text);
      }
      
      .hidden {
        display: none !important;
      }
    `;

    const template = `
      <div class="chat-container">
        <form class="chat-form">
          <div class="chat-input-container">
            <div class="chat-input" 
                 contenteditable="true" 
                 data-placeholder="${
                   this.translations?.chat?.placeholder || "Ask a question..."
                 }"
                 role="textbox"
                 aria-multiline="true"></div>
          </div>
          ${
            this.supportsImages
              ? `
            <label class="chat-upload-button" title="Upload image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <input type="file" accept="image/*" class="hidden" id="imageInput">
            </label>
          `
              : ""
          }
          <button type="submit" class="chat-submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(
      document.createRange().createContextualFragment(template)
    );

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector(".chat-form");
    const input = this.shadowRoot.querySelector(".chat-input");
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    const imageInput = this.shadowRoot.querySelector("#imageInput");

    form.addEventListener("submit", this.handleSubmit.bind(this));

    // Prevent default enter behavior and handle form submission
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });

    // Focus event to set initial prompt if input is empty
    input.addEventListener("focus", () => {
      if (input.innerText.trim() === "") {
        this.setInitialPrompt();
      }
    });

    if (uploadButton && imageInput) {
      uploadButton.addEventListener("click", (e) => {
        // Prevent the click event from triggering multiple times
        e.stopPropagation();
      });

      imageInput.addEventListener("change", (e) => {
        this.handleFileSelect(e);
        // Reset the input value to allow selecting the same file again
        e.target.value = "";
      });
    }
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.tempImage = file;
    }
  }

  updateUploadVisibility() {
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    if (uploadButton) {
      uploadButton.style.display = this.supportsImages ? "inline-flex" : "none";
    }
  }

  /**
   * Maneja una URL de imagen, con soporte para URLs con restricciones CORS
   * @param {string} url - URL de la imagen
   * @returns {Promise<void>}
   */
  /**
   * Método actualizado para manejar imageUrl
   * Con soporte para URLs con restricciones CORS
   */
  async handleImageUrl(url) {
    if (!url) return;

    console.log("[ChatWithImage] Processing image URL:", url);

    try {
      // Primero intentamos el método tradicional: fetch + blob
      try {
        const response = await fetch(url, {
          mode: "cors",
          credentials: "omit", // Evitar cookies para reducir problemas CORS
          cache: "no-store", // Evitar problemas de caché
        });

        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        this.tempImage = file;

        console.log("[ChatWithImage] Successfully loaded image via fetch");
        this.updateImagePreview();
        return;
      } catch (fetchError) {
        console.warn("[ChatWithImage] Error fetching image:", fetchError);

        // Si falla, usamos la URL directamente
        this.tempImage = url; // Guardar URL como string
        console.log(
          "[ChatWithImage] Using URL directly due to CORS restrictions"
        );

        // Crear vista previa aunque no podamos cargar la imagen directamente
        this.updateImagePreviewForURL(url);
      }
    } catch (error) {
      console.error("[ChatWithImage] Error loading image:", error);
    }
  }

  /**
   * Nuevo método para actualizar la vista previa usando una URL
   */
  updateImagePreviewForURL(url) {
    if (!url) return;

    // Obtener nombre de archivo de la URL
    let filename = "image";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart) {
          filename = lastPart;
        }
      }
    } catch (e) {
      console.warn("[ChatWithImage] Error parsing image URL for filename");
    }

    const container = document.createElement("div");
    container.className = "image-preview-container";
    container.innerHTML = `
    <div class="image-preview-card">
      <div class="image-preview-content">
        <div class="image-preview-thumbnail">
          <img src="${url}" alt="Preview" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMWYxZjEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNDQ0IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='"/>
        </div>
        <div class="image-preview-info">
          <div class="image-preview-filename">
            ${filename} (External URL)
          </div>
          <button class="image-preview-remove" title="Remove image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

    // Buscar contenedor existente y reemplazarlo
    const existingContainer = this.shadowRoot.querySelector(
      ".image-preview-container"
    );
    if (existingContainer) {
      existingContainer.remove();
    }

    // Añadir nuevo contenedor
    this.shadowRoot
      .querySelector(".chat-form")
      .parentNode.insertBefore(
        container,
        this.shadowRoot.querySelector(".chat-form")
      );

    // Agregar evento de clic para eliminar
    const removeButton = container.querySelector(".image-preview-remove");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        this.tempImage = null;
        container.remove();
      });
    }
  }
}

customElements.define("chat-with-image", ChatWithImage);
