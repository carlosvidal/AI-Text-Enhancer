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
    `;

    const template = `
      <div class="chat-container">
        <form class="chat-form">
          <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="${this.translations.chat.placeholder}" />
            ${this.supportsImages ? `
              <button type="button" class="chat-upload-button" aria-label="${this.translations.chat.uploadImage}">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                  <path d="M12 12v9"/>
                  <path d="m8 17 4-4 4 4"/>
                </svg>
              </button>
              <input type="file" class="file-input" accept="image/*" hidden />
            ` : ''}
          </div>
          <button type="submit" class="chat-submit">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
            ${this.translations.chat.send}
          </button>
        </form>
      </div>
    `;

    this.shadowRoot.innerHTML = `${style.outerHTML}${template}`;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector(".chat-form");
    const input = this.shadowRoot.querySelector(".chat-input");
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    const fileInput = this.shadowRoot.querySelector(".file-input");

    form.addEventListener("submit", this.handleSubmit.bind(this));
    
    if (this.supportsImages && uploadButton && fileInput) {
      uploadButton.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", this.handleFileSelect.bind(this));
    }
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
