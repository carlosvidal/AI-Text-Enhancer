// src/components/ResponseHistory.js
import { TRANSLATIONS } from "../constants/translations.js";
import { getToolIcon } from "../services/icon-service.js";
import { variables } from "../styles/base/variables.js";
import { animations } from "../styles/base/animations.js";
import { previewStyles } from "../styles/layout/preview.js";

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

      .response-entry.with-image {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: 1rem;
        align-items: start;
      }

      .image-preview {
        width: 100%;
        aspect-ratio: 1;
        border-radius: var(--ai-radius);
        overflow: hidden;
        background: var(--ai-background-light);
      }

      .image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .response-content-wrapper {
        flex: 1;
      }

      @media (max-width: 640px) {
        .response-entry.with-image {
          grid-template-columns: 1fr;
        }

        .image-preview {
          max-width: 200px;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <div class="preview">
        ${
          this.responses.length === 0
            ? this.translations.preview.placeholder
            : this.renderResponses()
        }
      </div>
    `;

    this.shadowRoot.prepend(style);
  }

  renderResponses() {
    let currentQuestionId = null;
    let currentImageData = null;

    return this.responses
      .map((response, index) => {
        // Si es una imagen, guardarla para la siguiente pregunta
        if (response.action === "image-upload") {
          currentImageData = response.content;
          return ""; // No renderizar la entrada de imagen
        }

        // Si es una pregunta, actualizar el ID actual
        if (response.action === "chat-question") {
          currentQuestionId = response.id;
        }

        // Si es una respuesta y hay una imagen pendiente, limpiar la imagen
        if (response.action === "chat-response") {
          currentImageData = null;
        }

        let html = `
        <div class="response-entry ${
          currentImageData ? "with-image" : ""
        }" data-id="${response.id}">
      `;

        // Si hay una imagen y es una pregunta, mostrarla
        if (currentImageData && response.action === "chat-question") {
          html += `
          <div class="image-preview">
            ${currentImageData}
          </div>
        `;
        }

        html += `
          <div class="response-content-wrapper">
            <div class="response-header">
              <div class="response-tool">
                ${getToolIcon(response.action)}
                ${this.translations.tools[response.action] || response.action}
              </div>
              <div class="response-timestamp">
                ${this.formatTimestamp(response.timestamp)}
              </div>
            </div>
            <div class="response-content">
              ${this.formatContent(response)}
            </div>
            ${this.renderResponseActions(response)}
          </div>
        </div>
      `;

        return html;
      })
      .join("");
  }

  formatContent(response) {
    if (response.action === "image-upload") {
      return response.content;
    }
    return (
      this.markdownHandler?.convertToHTML(response.content) || response.content
    );
  }

  renderResponseActions(response) {
    if (response.action === "chat-question") {
      return this.renderChatActions(response);
    }

    if (
      response.action === "chat-error" ||
      response.action === "image-upload"
    ) {
      return "";
    }

    return this.renderStandardActions(response);
  }

  renderChatActions(response) {
    return `
      <div class="response-actions">
        <button class="response-action edit-button" data-response-id="${
          response.id
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          ${this.translations.actions.edit || "Edit"}
        </button>
      </div>
    `;
  }

  renderStandardActions(response) {
    return `
      <div class="response-actions">
        <button class="response-action retry-button" data-response-id="${
          response.id
        }" data-action="${response.action}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
            <path d="M11 10v4h4"/>
          </svg>
          ${this.translations.actions.retry || "Retry"}
        </button>
        <button class="response-action copy-button" data-response-id="${
          response.id
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          ${this.translations.actions.copy || "Copy"}
        </button>
        <button class="response-action primary use-button" data-response-id="${
          response.id
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 12 5 5L20 7"></path>
          </svg>
          ${this.translations.actions.use || "Use This"}
        </button>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const responseId = parseInt(button.dataset.responseId, 10);
      const action = button.dataset.action;

      if (button.classList.contains("copy-button")) {
        this.dispatchEvent(
          new CustomEvent("responseCopy", {
            detail: { responseId },
            bubbles: true,
            composed: true,
          })
        );
      } else if (button.classList.contains("use-button")) {
        this.dispatchEvent(
          new CustomEvent("responseUse", {
            detail: { responseId },
            bubbles: true,
            composed: true,
          })
        );
      } else if (button.classList.contains("retry-button")) {
        this.dispatchEvent(
          new CustomEvent("responseRetry", {
            detail: { responseId, action },
            bubbles: true,
            composed: true,
          })
        );
      } else if (button.classList.contains("edit-button")) {
        this.dispatchEvent(
          new CustomEvent("responseEdit", {
            detail: { responseId },
            bubbles: true,
            composed: true,
          })
        );
      }
    });
  }

  addResponse(response) {
    this.responses.push(response);
    this.render();
    this.scrollToBottom();
  }

  updateResponse(id, content, streaming = true) {
    const response = this.responses.find((r) => r.id === id);
    if (response) {
      response.content = streaming ? response.content + content : content;
      const responseElement = this.shadowRoot.querySelector(
        `[data-id="${id}"] .response-content`
      );
      if (responseElement) {
        if (streaming) {
          // Añadir solo el nuevo contenido con el cursor
          const newContent =
            this.markdownHandler?.convertToHTML(content) || content;
          responseElement.innerHTML =
            this.markdownHandler?.convertToHTML(response.content) ||
            response.content;
          responseElement.innerHTML += '<span class="typing">|</span>';
        } else {
          responseElement.innerHTML = this.formatContent(response);
        }
      }
    }
  }

  removeResponse(id) {
    this.responses = this.responses.filter((r) => r.id !== id);
    this.render();
  }

  clearResponses() {
    this.responses = [];
    this.render();
  }

  scrollToBottom() {
    const preview = this.shadowRoot.querySelector(".preview");
    if (preview) {
      preview.scrollTop = preview.scrollHeight;
    }
  }

  formatTimestamp(date) {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }
}

customElements.define("response-history", ResponseHistory);
