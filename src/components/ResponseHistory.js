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
  }

  static get observedAttributes() {
    return ["language"];
  }

  get language() {
    const lang = this.getAttribute("language");
    console.log("[ResponseHistory] Getting language:", lang);
    return lang || "en";
  }

  connectedCallback() {
    console.log("[ResponseHistory] Connected, language:", this.language);
    console.log(
      "[ResponseHistory] Has language attribute:",
      this.hasAttribute("language")
    );
    console.log("[ResponseHistory] All attributes:", this.getAttributeNames());

    this.translations = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    console.log("[ResponseHistory] Initial translations:", this.translations);

    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "[ResponseHistory] Attribute changed:",
      name,
      "from",
      oldValue,
      "to",
      newValue
    );
    if (name === "language" && oldValue !== newValue) {
      console.log(
        "[ResponseHistory] Updating translations for new language:",
        newValue
      );
      this.translations = TRANSLATIONS[newValue] || TRANSLATIONS.en;
      console.log("[ResponseHistory] New translations:", this.translations);
      this.render();
    }
  }

  createResponseEntry(response) {
    const entry = document.createElement("div");
    entry.className = "response-entry";
    entry.dataset.id = response.id;
    entry.dataset.action = response.action;

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "response-content-wrapper";

    const isTyping = response.content.includes('<span class="typing">');
    const contentClass = isTyping ? "response-content typing-animation" : "response-content";

    const isQuestion = response.action === "chat-question";
    const isSystemMessage =
      response.action === "error" ||
      response.action === "info" ||
      response.action === "chat-error";

    // Restaurar el HTML original de las acciones
    const actionsHtml = !isQuestion && !isSystemMessage ? `
      <div class="response-footer">
        <div class="response-tools">
          <button class="tool-button" data-action="improve" data-response-id="${response.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span>Improve</span>
          </button>
          <button class="tool-button" data-action="summarize" data-response-id="${response.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h12"/>
            </svg>
            <span>Summarize</span>
          </button>
          <button class="tool-button" data-action="expand" data-response-id="${response.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21H3M21 10H3M21 3h-7M21 17h-7M14 7h7M3 3l4 4M3 3l4-4"/>
            </svg>
            <span>Expand</span>
          </button>
        </div>
        <div class="response-actions">
          <button class="response-action copy-button" data-action="copy" data-response-id="${response.id}" title="Copy">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <button class="response-action use-button" data-action="use" data-response-id="${response.id}" title="Use">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m5 12 5 5L20 7"/>
            </svg>
          </button>
          <button class="response-action retry-button" data-action="retry" data-response-id="${response.id}" title="Retry">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M21 21v-5h-5"/>
            </svg>
          </button>
        </div>
      </div>
    ` : '';

    // Manejar el contenido y la imagen
    contentWrapper.innerHTML = `
      <div class="response-header">
        <div class="response-tool">
          ${getToolIcon(response.action)}
          <span>${this.translations?.tools[response.action] || response.action}</span>
        </div>
        <div class="response-timestamp">${this.formatTimestamp(response.timestamp)}</div>
      </div>
      ${response.image ? `
        <div class="response-image">
          <img src="${URL.createObjectURL(response.image)}" alt="Uploaded image" />
        </div>
      ` : ''}
      <div class="${contentClass}">
        ${this.markdownHandler ? this.markdownHandler.convert(response.content) : response.content}
      </div>
      ${actionsHtml}
    `;

    entry.appendChild(contentWrapper);
    return entry;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const responseId = button.dataset.responseId;
      if (!responseId) return;

      const response = this.getResponse(responseId);
      if (!response) return;

      // Manejar los eventos de las herramientas
      if (button.classList.contains("tool-button")) {
        const action = button.dataset.action;
        console.log("[ResponseHistory] Tool button clicked:", {
          action,
          responseId,
        });
        this.dispatchEvent(
          new CustomEvent("toolaction", {
            detail: {
              action,
              responseId,
              content: response.content,
            },
            bubbles: true,
            composed: true,
          })
        );
      } else if (button.classList.contains("retry-button")) {
        const action = button.dataset.action;
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
      } else if (button.classList.contains("copy-button")) {
        this.dispatchEvent(
          new CustomEvent("responseCopy", {
            detail: { responseId },
            bubbles: true,
            composed: true,
          })
        );
      } else if (button.classList.contains("use-button")) {
        console.log("[ResponseHistory] Use button clicked");

        // Primero disparamos el evento de uso
        this.dispatchEvent(
          new CustomEvent("responseUse", {
            detail: { responseId },
            bubbles: true,
            composed: true,
          })
        );

        // Esperar un momento antes de cerrar el modal
        setTimeout(() => {
          console.log("[ResponseHistory] Attempting to close modal");

          try {
            // Buscar el modal más cercano usando la clase correcta
            let element = this;
            while (element) {
              console.log(
                "[ResponseHistory] Checking element for modal class:",
                element
              );
              if (element.classList?.contains("modal")) {
                console.log("[ResponseHistory] Found modal element:", element);
                element.classList.remove("open");
                break;
              }
              // Navegar hacia arriba en el árbol del DOM
              element = element.parentNode || element.getRootNode().host;
            }
          } catch (error) {
            console.error("[ResponseHistory] Error closing modal:", error);
          }
        }, 100); // Esperar 100ms
      } else if (button.classList.contains("retry-button")) {
        const action = button.dataset.action;
        this.dispatchEvent(
          new CustomEvent("responseRetry", {
            detail: { responseId, action },
            bubbles: true,
            composed: true,
          })
        );
      }
    });
  }

  getResponse(id) {
    console.log("[ResponseHistory] Getting response for ID:", id);
    console.log("[ResponseHistory] Available responses:", this.responses);
    const response = this.responses.find(
      (response) => response.id === parseInt(id)
    );
    console.log("[ResponseHistory] Found response:", response);
    return response;
  }

  addResponse(response) {
    console.log("[ResponseHistory] Adding response:", response);
    this.responses.push(response);
    this.render();
  }

  updateResponse(id, content) {
    const response = this.responses.find((r) => r.id === id);
    if (response) {
      response.content = content;
      this.render();
    }
  }

  getResponse(id) {
    return this.responses.find((response) => response.id === parseInt(id));
  }

  removeResponse(id) {
    this.responses = this.responses.filter((r) => r.id !== id);
    this.render();
  }

  clear() {
    this.responses = [];
    this.render();
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

    this.responses.forEach((response) => {
      container.appendChild(this.createResponseEntry(response));
    });

    // Limpiar y actualizar el shadowRoot
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  formatTimestamp(timestamp) {
    if (!timestamp) return "";

    try {
      console.log("[ResponseHistory] Formatting timestamp:", timestamp);
      return new Date(timestamp).toLocaleTimeString(this.language || "en", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("[ResponseHistory] Error formatting timestamp:", error);
      return "";
    }
  }
}

customElements.define("response-history", ResponseHistory);
