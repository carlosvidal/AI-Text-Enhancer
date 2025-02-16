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

    const template = `
      <div class="chat-container">
        <div id="imagePreviewContainer"></div>
        <form class="chat-form">
          <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="${this.translations.chat.placeholder}">
            ${this.supportsImages ? `
              <label class="chat-upload-button" title="Upload image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <input type="file" accept="image/*" class="hidden" id="imageInput">
              </label>
            ` : ''}
          </div>
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
    this.shadowRoot.appendChild(document.createRange().createContextualFragment(template));
}

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('.chat-form');
    const input = this.shadowRoot.querySelector('.chat-input');
    const uploadButton = this.shadowRoot.querySelector('.chat-upload-button');
    const imageInput = this.shadowRoot.querySelector('#image-upload');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        this.dispatchEvent(new CustomEvent('chatMessage', {
          detail: { 
            message: input.value.trim(),
            image: imageInput.files[0]
          },
          bubbles: true,
          composed: true
        }));
        input.value = '';
        imageInput.value = '';
      }
    });

    uploadButton.addEventListener('click', () => {
      imageInput.click();
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.value.trim();

    if (message) {
      this.dispatchEvent(
        new CustomEvent("chatMessage", {
          detail: { message, image: this.tempImage },
          bubbles: true,
          composed: true,
        })
      );
      input.value = "";
      this.tempImage = null;
      this.updateImagePreview();
    }
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      this.tempImage = file;
      this.updateImagePreview();
    }
  }

  updateImagePreview() {
    const container = this.shadowRoot.querySelector(".chat-input-container");
    const existingPreview = this.shadowRoot.querySelector(".image-preview-container");
    
    if (existingPreview) {
      existingPreview.remove();
    }

    if (this.tempImage) {
      const preview = document.createElement("div");
      preview.className = "image-preview-container";
      preview.innerHTML = `
        <img src="${URL.createObjectURL(this.tempImage)}" alt="Preview" class="image-preview" />
        <button class="remove-image" aria-label="${this.translations.chat.removeImage}">×</button>
      `;

      container.appendChild(preview);
      preview.querySelector(".remove-image").addEventListener("click", () => {
        this.tempImage = null;
        this.updateImagePreview();
      });
    }
  }

  updateTranslations() {
    const input = this.shadowRoot.querySelector(".chat-input");
    const submitButton = this.shadowRoot.querySelector(".chat-submit");
    
    if (input && submitButton) {
      input.placeholder = this.translations.chat.placeholder;
      submitButton.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
          <path d="m22 2-7 20-4-9-9-4Z"/>
          <path d="M22 2 11 13"/>
        </svg>
        ${this.translations.chat.send}
      `;
    }
  }

  updateUploadVisibility() {
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    if (uploadButton) {
      uploadButton.style.display = this.supportsImages ? "inline-flex" : "none";
    }
  }

  async handleImageUrl(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      this.tempImage = file;
      this.updateImagePreview();
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }
}

customElements.define("chat-with-image", ChatWithImage);
