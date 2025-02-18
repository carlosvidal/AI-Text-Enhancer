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
    const contentClass = isTyping
      ? "response-content typing-animation"
      : "response-content";
    const isQuestion = response.action === "chat-question";
    const isSystemMessage = ["error", "info", "chat-error"].includes(
      response.action
    );

    // Herramientas disponibles para respuestas no-sistema
    const toolsHtml =
      !isQuestion && !isSystemMessage
        ? `
      <button class="tool-button" data-action="improve" data-response-id="${
        response.id
      }">
        ${getToolIcon("improve")}
        ${this.translations?.tools?.improve || "Improve"}
      </button>
      <button class="tool-button" data-action="summarize" data-response-id="${
        response.id
      }">
        ${getToolIcon("summarize")}
        ${this.translations?.tools?.summarize || "Summarize"}
      </button>
      <button class="tool-button" data-action="expand" data-response-id="${
        response.id
      }">
        ${getToolIcon("expand")}
        ${this.translations?.tools?.expand || "Expand"}
      </button>
      <button class="tool-button" data-action="paraphrase" data-response-id="${
        response.id
      }">
        ${getToolIcon("paraphrase")}
        ${this.translations?.tools?.paraphrase || "Paraphrase"}
      </button>
      <button class="tool-button" data-action="more-formal" data-response-id="${
        response.id
      }">
        ${getToolIcon("more-formal")}
        ${this.translations?.tools?.["more-formal"] || "More Formal"}
      </button>
      <button class="tool-button" data-action="more-casual" data-response-id="${
        response.id
      }">
        ${getToolIcon("more-casual")}
        ${this.translations?.tools?.["more-casual"] || "More Casual"}
      </button>
    `
        : "";

    // Botones de acción según el tipo de respuesta
    const actionsHtml = isSystemMessage
      ? ""
      : `
      <div class="response-footer">
        <div class="response-tools">
          ${toolsHtml}
        </div>
        <div class="response-actions">
          ${
            isQuestion
              ? `
            <button class="response-action edit-button" data-response-id="${
              response.id
            }">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              ${this.translations?.actions?.edit || "Edit"}
            </button>
          `
              : `
            <button class="response-action copy-button" data-response-id="${
              response.id
            }">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              ${this.translations?.actions?.copy || "Copy"}
            </button>
            <button class="response-action use-button" data-response-id="${
              response.id
            }">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ${this.translations?.actions?.use || "Use"}
            </button>
            <button class="response-action retry-button" data-response-id="${
              response.id
            }" data-action="${response.action}">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
              </svg>
              ${this.translations?.actions?.retry || "Retry"}
            </button>
          `
          }
        </div>
      </div>
    `;

    // Construir el contenido principal
    let mainContent;
    if (response.action === "image-upload") {
      // Renderizar directamente el contenido para image-upload
      mainContent = response.content;
    } else if (response.action === "chat-question" && response.image) {
      mainContent = `
        <div class="question-container">
          <div class="question-content">
            ${
              this.markdownHandler
                ? this.markdownHandler.convert(response.content)
                : response.content
            }
          </div>
          <div class="question-image">
            <img src="${URL.createObjectURL(
              response.image
            )}" alt="Attached image">
            <span class="image-filename">${response.image.name}</span>
          </div>
        </div>
      `;
    } else {
      mainContent = this.markdownHandler
        ? this.markdownHandler.convert(response.content)
        : response.content;
    }

    contentWrapper.innerHTML = `
      <div class="response-header">
        <div class="response-tool">
          ${getToolIcon(response.action)}
          <span>${
            this.translations?.tools[response.action] || response.action
          }</span>
        </div>
        <div class="response-timestamp">${this.formatTimestamp(
          response.timestamp
        )}</div>
      </div>
      <div class="${contentClass}">
        ${mainContent}
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

  updateResponse(id, contentOrCallback) {
    const response = this.responses.find((r) => r.id === id);
    if (response) {
      if (typeof contentOrCallback === 'function') {
        response.content = contentOrCallback(response.content);
      } else {
        response.content = contentOrCallback;
      }
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

    // Quitar el filter y dejar que todas las respuestas pasen
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
