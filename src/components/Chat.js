// src/components/Chat.js
import { TRANSLATIONS } from "../constants/translations.js";
import { variables } from "../styles/base/variables.js";
import { animations } from "../styles/base/animations.js";
import { chatStyles } from "../styles/components/chat.js";

export class Chat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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

  connectedCallback() {
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
        ${variables}
        ${animations}
        ${chatStyles}
    `;

    const content = document.createElement("div");
    content.className = "chat-container";
    content.innerHTML = `
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

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(content);
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
