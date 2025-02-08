// src/components/Chat.js
import { TRANSLATIONS } from "../constants/translations.js";
import { createAPIClient } from "../services/api-client.js";
import { createCacheManager } from "../services/cache-manager.js";
import { MarkdownHandler } from "../services/markdown-handler.js";

export class Chat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = [];
    this.markdownHandler = new MarkdownHandler();
  }

  static get observedAttributes() {
    return ["language"];
  }

  get language() {
    return this.getAttribute("language") || "en";
  }

  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }

  async connectedCallback() {
    await this.markdownHandler.initialize();
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && oldValue !== newValue) {
      this.updateTranslations();
    }
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
      }
  
      .chat-form {
        display: flex;
        gap: 8px;
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
      }
  
      .chat-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-family: inherit;
      }
  
      .chat-submit {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
  
      .chat-submit:hover {
        background: #2563eb;
      }
  
      .chat-submit svg {
        width: 16px;
        height: 16px;
      }
    `;

    this.shadowRoot.innerHTML = `
      <form class="chat-form">
        <input type="text" class="chat-input" placeholder="${this.translations.chat.placeholder}">
        <button type="submit" class="chat-submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </form>
    `;

    this.shadowRoot.appendChild(style);
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector(".chat-form");
    form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.value.trim();

    if (message) {
      this.dispatchEvent(
        new CustomEvent("chatMessage", {
          detail: { message },
          bubbles: true,
          composed: true,
        })
      );
      input.value = "";
    }
  }

  updateTranslations() {
    requestAnimationFrame(() => {
      const input = this.shadowRoot.querySelector(".chat-input");
      if (input) {
        input.placeholder = this.translations.chat.placeholder;
      }
    });
  }
}

customElements.define("ai-chat", Chat);
