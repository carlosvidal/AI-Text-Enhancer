// src/components/ChatWithImage.js
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
  }

  static get observedAttributes() {
    return ["language", "image-url", "api-provider"];
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

  get apiProvider() {
    return this.getAttribute("api-provider") || "openai";
  }

  get supportsImages() {
    return ["openai", "anthropic"].includes(this.apiProvider);
  }

  async connectedCallback() {
    this.render();
    this.setupEventListeners();

    if (this.imageUrl) {
      await this.handleImageUrl(this.imageUrl);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "language":
        this.updateTranslations();
        break;
      case "image-url":
        if (newValue) {
          this.handleImageUrl(newValue);
        }
        break;
      case "api-provider":
        this.updateUploadVisibility();
        break;
    }
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations}
      ${chatStyles}
      ${imagePreviewStyles}
      
      .chat-input-container {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
      }
      
      .chat-upload-button {
        position: absolute;
        right: 12px;
        display: inline-flex;
        align-items: center;
        padding: 6px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--ai-text-light);
      }
      
      .chat-upload-button:hover {
        color: var(--ai-text);
      }
      
      .hidden {
        display: none !important;
      }
    `;

    const content = document.createElement("div");
    content.className = "chat-container";
    content.innerHTML = `
      <div id="imagePreviewContainer"></div>
      <form class="chat-form">
        <div class="chat-input-container">
          <input type="text" class="chat-input" placeholder="${
            this.translations.chat.placeholder
          }">
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
        </div>
        <button type="submit" class="chat-submit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </form>
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(content);
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector(".chat-form");
    const imageInput = this.shadowRoot.querySelector("#imageInput");

    form.addEventListener("submit", this.handleSubmit.bind(this));

    if (imageInput) {
      imageInput.addEventListener("change", this.handleFileSelect.bind(this));
    }

    // Delegación de eventos para el botón de eliminar imagen
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.closest(".image-preview-remove")) {
        this.removeImage();
      }
    });
  }

  async handleImageUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load image");

      const blob = await response.blob();
      const file = new File([blob], "product-image.jpg", {
        type: "image/jpeg",
      });
      this.setTempImage(file, url);
    } catch (error) {
      console.error("Error loading image URL:", error);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      this.setTempImage(file, URL.createObjectURL(file));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.value.trim();

    if (!message && !this.tempImage) return;

    this.dispatchEvent(
      new CustomEvent("chatMessage", {
        detail: {
          message,
          image: this.tempImage,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Limpiar
    input.value = "";
    this.tempImage = null;
    this.updateImagePreview();
  }

  setTempImage(file, previewUrl) {
    this.tempImage = file;
    this.updateImagePreview(previewUrl);
  }

  updateImagePreview(previewUrl = null) {
    const container = this.shadowRoot.querySelector("#imagePreviewContainer");

    if (!this.tempImage) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="image-preview-card">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${previewUrl}" alt="Preview">
          </div>
          <div class="image-preview-info">
            <div class="image-preview-label">Selected image</div>
            <div class="image-preview-filename">${this.tempImage.name}</div>
          </div>
          <button class="image-preview-remove" title="Remove image">×</button>
        </div>
      </div>
    `;
  }

  removeImage() {
    this.tempImage = null;
    this.updateImagePreview();
  }

  updateUploadVisibility() {
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    if (uploadButton) {
      uploadButton.style.display = this.supportsImages ? "inline-flex" : "none";
    }
  }

  updateTranslations() {
    const input = this.shadowRoot.querySelector(".chat-input");
    if (input) {
      input.placeholder = this.translations.chat.placeholder;
    }
  }
}

customElements.define("chat-with-image", ChatWithImage);
