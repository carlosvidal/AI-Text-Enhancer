// src/components/ResponseHistory.js
import { TRANSLATIONS } from "../constants/translations.js";
import { getToolIcon } from "../services/icon-service.js";
import { variables } from "../styles/base/variables.js";
import { animations } from "../styles/base/animations.js";
import { previewStyles } from "../styles/layout/preview.js";
import { responseHistoryStyles } from "../styles/components/response-history.js";

export class ResponseHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.responses = [];
    this.markdownHandler = null;
    this.translations = TRANSLATIONS.en;
  }

  static get observedAttributes() {
    return ["language"];
  }

  get language() {
    return this.getAttribute("language") || "en";
  }

  set markdownHandler(handler) {
    this._markdownHandler = handler;
  }

  get markdownHandler() {
    return this._markdownHandler;
  }

  connectedCallback() {
    this.translations = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && oldValue !== newValue) {
      this.translations = TRANSLATIONS[newValue] || TRANSLATIONS.en;
      this.render();
    }
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations}
      ${previewStyles}
      ${responseHistoryStyles}
    `;

    const container = document.createElement("div");
    container.className = "response-container";
    
    this.responses.forEach(response => {
      container.appendChild(this.createResponseEntry(response));
    });

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  createResponseEntry(response) {
    const entry = document.createElement("div");
    entry.className = `response-entry ${response.imageUrl ? 'with-image' : ''}`;
    entry.dataset.id = response.id;

    if (response.imageUrl) {
      entry.innerHTML = `
        <div class="image-preview">
          <img src="${response.imageUrl}" alt="Response image" />
        </div>
      `;
    }

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "response-content-wrapper";

    contentWrapper.innerHTML = `
      <div class="response-header">
        <div class="response-tool">
          ${getToolIcon(response.action)}
          <span>${this.translations.tools[response.action] || response.action}</span>
        </div>
        <div class="response-timestamp">${this.formatTimestamp(response.timestamp)}</div>
      </div>
      <div class="response-content">
        ${this.markdownHandler ? this.markdownHandler.convert(response.content) : response.content}
      </div>
      <div class="response-actions">
        <button class="response-action copy" data-action="copy">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          ${this.translations.actions.copy}
        </button>
        <button class="response-action use" data-action="use">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          ${this.translations.actions.use}
        </button>
        <button class="response-action edit" data-action="edit">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          </svg>
          ${this.translations.actions.edit}
        </button>
      </div>
    `;

    if (response.imageUrl) {
      entry.appendChild(contentWrapper);
    } else {
      entry.innerHTML = contentWrapper.innerHTML;
    }

    return entry;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (event) => {
      const button = event.target.closest(".response-action");
      if (!button) return;

      const entry = button.closest(".response-entry");
      const responseId = entry?.dataset.id;
      if (!responseId) return;

      const action = button.dataset.action;
      this.dispatchEvent(
        new CustomEvent(`response${action}`, {
          detail: { responseId },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString(this.language, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  addResponse(response) {
    this.responses.push(response);
    this.render();
  }

  updateResponse(id, content) {
    const response = this.responses.find(r => r.id === id);
    if (response) {
      response.content = content;
      this.render();
    }
  }

  removeResponse(id) {
    this.responses = this.responses.filter(r => r.id !== id);
    this.render();
  }

  clear() {
    this.responses = [];
    this.render();
  }
}

customElements.define("response-history", ResponseHistory);
