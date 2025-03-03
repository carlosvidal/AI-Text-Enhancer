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
      "api-provider",
      "initial-prompt",
      "has-content",
      "has-context",
    ];
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

  get initialPrompt() {
    return this.getAttribute("initial-prompt") || "";
  }

  get hasContent() {
    return this.getAttribute("has-content") === "true";
  }

  get hasContext() {
    return this.getAttribute("has-context") === "true";
  }

  async connectedCallback() {
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
      case "initial-prompt":
      case "has-content":
      case "has-context":
        this.updateInitialPrompt();
        break;
    }
  }

  setInitialPrompt() {
    if (!this.shadowRoot) return;

    const chatInput = this.shadowRoot.querySelector(".chat-input");
    if (!chatInput) return;

    // Determine which initial prompt to use
    let prompt = "";

    if (this.hasContent) {
      prompt =
        this.translations?.chat?.contentPrompt ||
        "Could you improve the text in the editor?";
    } else if (this.hasContext) {
      prompt =
        this.translations?.chat?.contextPrompt ||
        "Can you create a professional description based on this context?";
    } else if (this.initialPrompt) {
      prompt = this.initialPrompt;
    }

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

  updateInitialPrompt() {
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

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.innerText.trim();

    if (message || this.tempImage) {
      this.dispatchEvent(
        new CustomEvent("chatMessage", {
          detail: { message, image: this.tempImage },
          bubbles: true,
          composed: true,
        })
      );
      input.innerText = "";
      this.tempImage = null;
    }
  }

  updateTranslations() {
    const input = this.shadowRoot.querySelector(".chat-input");
    const submitButton = this.shadowRoot.querySelector(".chat-submit");

    if (input && submitButton) {
      input.setAttribute(
        "data-placeholder",
        this.translations?.chat?.placeholder || "Ask a question..."
      );
      submitButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      `;
    }

    // Update initial prompt based on new language
    this.updateInitialPrompt();
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
