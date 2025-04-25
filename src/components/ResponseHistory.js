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

  // Versión optimizada de createResponseEntry para reducir espacios en blanco innecesarios
  // Sobrescribir el método createResponseEntry para manejar específicamente mensajes info y preguntas
  createResponseEntry(response) {
    const entry = document.createElement("div");
    entry.className = "response-entry";
    entry.dataset.id = response.id;
    entry.dataset.action = response.action;

    // Determinar el tipo de respuesta
    const isInfo = ["info", "error", "chat-error"].includes(response.action);
    const isQuestion = response.action === "chat-question";

    // ===== CASO 1: MENSAJES DE INFORMACIÓN/ERROR - FORMATO SUPER COMPACTO =====
    if (isInfo) {
      entry.innerHTML = `
      <div class="response-content-wrapper">
        <div class="response-content">
          ${
            this.markdownHandler
              ? this.markdownHandler.convert(response.content)
              : response.content
          }
        </div>
      </div>
    `;
      return entry;
    }

    // ===== CASO 2: PREGUNTAS - FORMATO COMPACTO =====
    if (isQuestion) {
      const hasImage = response.image !== undefined && response.image !== null;

      // Si tiene imagen, usar un layout especial
      if (hasImage) {
        entry.innerHTML = `
        <div class="response-content-wrapper">
          <div class="response-header mini">
            <div class="response-tool">
              ${getToolIcon(response.action)}
              <span>Pregunta:</span>
            </div>
            <div class="response-timestamp">${this.formatTimestamp(
              response.timestamp
            )}</div>
          </div>
          <div class="question-container">
            <div class="question-content">
              ${response.content.replace(/^\*\*Pregunta:\*\*\s*/i, "")}
            </div>
            <div class="question-image mini">
              <img src="${URL.createObjectURL(
                response.image
              )}" alt="Imagen adjunta">
            </div>
          </div>
        </div>
      `;
      } else {
        // Sin imagen, aún más compacto
        entry.innerHTML = `
        <div class="response-content-wrapper">
          <div class="response-header mini">
            <div class="response-tool">
              ${getToolIcon(response.action)}
              <span>Pregunta:</span>
            </div>
            <div class="response-timestamp">${this.formatTimestamp(
              response.timestamp
            )}</div>
          </div>
          <div class="response-content">
            ${response.content.replace(/^\*\*Pregunta:\*\*\s*/i, "")}
          </div>
        </div>
        `;
      }

      return entry;
    }

    // Para todos los demás tipos de respuestas, mantener el comportamiento normal
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "response-content-wrapper";

    // Verificar si está en proceso de escritura
    const isLoading = response.content === "" || response.content.length < 5;
    const contentClass = isLoading
      ? "response-content typing-animation"
      : "response-content";

    // Crear el contenido principal como lo hacías antes
    let mainContent;
    if (response.action === "image-upload") {
      mainContent = response.content;
    } else if (isLoading) {
      if (response.action === "chat-response") {
        mainContent = `<div class="typing-indicator">Escribiendo respuesta...</div>`;
      } else if (
        [
          "improve",
          "summarize",
          "expand",
          "paraphrase",
          "more-formal",
          "more-casual",
        ].includes(response.action)
      ) {
        mainContent = `<div class="typing-indicator">Pensando...</div>`;
      } else {
        mainContent = "";
      }
    } else if (response.action === "chat-response") {
      // Mostrar texto plano durante el streaming, y HTML cuando termina
      if (response.streamingActive === false || response.streamingActive === undefined) {
        // Streaming terminado: mostrar HTML
        mainContent = this.markdownHandler
          ? this.markdownHandler.convert(response.content)
          : response.content;
      } else {
        // Streaming activo: mostrar solo texto plano
        mainContent = response.content;
      }
    } else {
      // Otros tipos: markdown o texto plano
      mainContent = this.markdownHandler
        ? this.markdownHandler.convert(response.content)
        : response.content;
    }

    // Crear herramientas si no es pregunta ni mensaje del sistema
    const isSystemMessage = ["error", "info", "chat-error"].includes(
      response.action
    );

    // Generar los botones de herramientas
    let toolsHtml = "";
    if (!isQuestion && !isSystemMessage) {
      toolsHtml = `
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
      `;
    }

    // Botones de acción
    const actionsHtml =
      !isSystemMessage && !isQuestion
        ? `
<div class="response-footer">
  <div class="response-tools">
    ${toolsHtml}
  </div>
  <div class="response-actions">
    <button class="response-action copy-button" data-response-id="${
      response.id
    }" title="${this.translations?.actions?.copy || "Copy"}">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span class="action-text">${
        this.translations?.actions?.copy || "Copy"
      }</span>
    </button>
    <button class="response-action use-button" data-response-id="${
      response.id
    }" title="${this.translations?.actions?.use || "Use"}">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span class="action-text">${
        this.translations?.actions?.use || "Use"
      }</span>
    </button>
    <button class="response-action retry-button" data-response-id="${
      response.id
    }" data-action="${response.action}" title="${
            this.translations?.actions?.retry || "Retry"
          }">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
      </svg>
      <span class="action-text">${
        this.translations?.actions?.retry || "Retry"
      }</span>
    </button>
  </div>
</div>
`
        : "";

    // Construir el HTML para respuestas normales
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

    // Añadir estilos específicos para elementos miniatura si no existen
    if (!this.shadowRoot.querySelector("#mini-elements-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "mini-elements-style";
      styleEl.textContent = `
      /* Estilos para elementos miniatura */
      .mini {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .response-header.mini {
        margin-bottom: 0.25rem !important;
      }
      
      .response-footer.mini {
        padding-top: 0.25rem !important;
        display: flex;
        justify-content: flex-end;
      }
      
      .question-image.mini {
        width: 60px !important;
        height: 60px !important;
      }
      
      .question-image.mini img {
        width: 60px !important;
        height: 60px !important;
      }
      
      .response-action.mini {
        padding: 0.25rem !important;
      }
      
      /* Estilos específicos para mensajes de información */
      .response-entry[data-action="info"],
      .response-entry[data-action="error"],
      .response-entry[data-action="chat-error"] {
        padding: 0.5rem 0.75rem !important;
      }
      
      /* Estilos específicos para preguntas */
      .response-entry[data-action="chat-question"] {
        padding: 0.5rem 0.75rem !important;
      }
      
      .question-container {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin: 0;
        padding: 0;
      }
    `;
      this.shadowRoot.appendChild(styleEl);
    }

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

  // Método mejorado para updateResponse en ResponseHistory.js
  updateResponse(id, contentOrCallback) {
    const index = this.responses.findIndex((r) => r.id === id);
    if (index === -1) return;

    const response = this.responses[index];
    const oldContent = response.content;

    // Actualizar el contenido en el objeto de datos
    if (typeof contentOrCallback === "function") {
      response.content = contentOrCallback(response.content);
    } else {
      response.content = contentOrCallback;
    }

    // Determinar el tipo de actualización
    const isFirstUpdate = oldContent === "";
    const isIncrementalUpdate =
      typeof contentOrCallback === "function" &&
      response.content.length > oldContent.length &&
      response.content.startsWith(oldContent);

    // Obtener el elemento DOM
    const responseEntry = this.shadowRoot.querySelector(`[data-id="${id}"]`);
    if (!responseEntry) {
      // Si no hay elemento DOM, renderizar todo
      this.render();
      return;
    }

    // Obtener el elemento de contenido
    const contentElement = responseEntry.querySelector(".response-content");
    if (!contentElement) return;

    // =========== ESTRATEGIA DE STREAMING SIN PARPADEO ===========

    // CASO 1: Primera actualización - Configuración inicial
    if (isFirstUpdate) {
      console.log(
        "[ResponseHistory] Primera actualización, configurando streaming"
      );

      // Verificar si hay texto de contenido
      let firstChunk = response.content || "";

      // Verificar si necesitamos reparar un inicio truncado
      if (firstChunk.startsWith("aro,") || firstChunk.startsWith("laro,")) {
        console.warn(
          "[ResponseHistory] Detectado inicio truncado, reparando..."
        );
        firstChunk = "C" + firstChunk;
        // Actualizar también el objeto de respuesta
        response.content = firstChunk;
      }

      // Crear un nodo de texto para actualizaciones incrementales
      const textNode = document.createTextNode(firstChunk);

      // Asegurarnos de que el contenedor esté limpio
      contentElement.innerHTML = "";
      contentElement.appendChild(textNode);

      // Marcar como streaming activo y añadir clase para cursor
      contentElement.dataset.streamingActive = "true";
      contentElement.classList.add("typing-animation");
    }

    // CASO 2: Actualización incremental durante streaming
    else if (
      isIncrementalUpdate &&
      contentElement.dataset.streamingActive === "true"
    ) {
      // Calcular solo el nuevo texto añadido
      const newTextPart = response.content.substring(oldContent.length);

      // Si tiene un nodo de texto como último hijo, actualizarlo directamente
      if (
        contentElement.lastChild &&
        contentElement.lastChild.nodeType === Node.TEXT_NODE
      ) {
        // Actualizar el nodeValue para evitar parpadeo
        contentElement.lastChild.nodeValue = response.content;
      } else {
        const textNode = document.createTextNode(response.content);
        contentElement.innerHTML = "";
        contentElement.appendChild(textNode);
      }

      // Mantener el scroll al final si está cerca del final
      const container = responseEntry.parentNode;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        if (isNearBottom) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }

    // CASO 3: Streaming ha terminado o es una actualización completa
    else {
      console.log(
        "[ResponseHistory] Streaming completo o actualización no incremental"
      );

      // Comprobar si se debe finalizar el streaming
      const isStreamingComplete = response.content.length > 50;

      // Si el streaming ha terminado, quitar clase de animación
      if (
        isStreamingComplete &&
        contentElement.dataset.streamingActive === "true"
      ) {
        contentElement.classList.remove("typing-animation");
        contentElement.dataset.streamingActive = "false";

        // Preservar el contenido texto antes de aplicar markdown
        const textContent = response.content;

        // Hacer una copia del contenido para restaurar punto de scroll
        const scrollTop = responseEntry.parentNode?.scrollTop || 0;

        // Aplicar formato markdown si está disponible
        if (this.markdownHandler) {
          try {
            contentElement.innerHTML =
              this.markdownHandler.convert(textContent);
          } catch (error) {
            console.error("[ResponseHistory] Error applying markdown:", error);
            contentElement.textContent = textContent;
          }
        } else {
          contentElement.textContent = textContent;
        }

        // Restaurar desplazamiento para evitar saltos
        if (responseEntry.parentNode) {
          responseEntry.parentNode.scrollTop = scrollTop;
        }
      }
      // Si no es incremental pero no es final de streaming, actualizar normalmente
      else if (!isIncrementalUpdate) {
        if (this.markdownHandler) {
          contentElement.innerHTML = this.markdownHandler.convert(
            response.content
          );
        } else {
          contentElement.textContent = response.content;
        }
      }
    }
  }

  getTypingPlaceholder() {
    return '<span class="typing">|</span>';
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

    // Añadir estilos base junto con mejoras para el layout compacto
    style.textContent = `
      ${variables}
      ${animations}
      ${previewStyles}
      ${responseHistoryStyles}
      
      /* Optimizaciones de layout */
      .response-container {
        overflow-y: auto;
        max-height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }
      
      /* Reducir tamaño de los contenedores de respuesta */
      .response-entry {
        margin-bottom: 0.75rem !important;
        padding: 0.75rem !important;
        border-radius: var(--ai-radius);
        max-height: fit-content;
        overflow: visible;
      }
      
      /* Reducir margen entre elementos */
      .response-content {
        margin: 0.25rem 0 !important;
        line-height: 1.4 !important;
        padding: 0 !important;
      }
      
      /* Ajustar espaciado de cabecera */
      .response-header {
        margin-bottom: 0.25rem !important;
      }
      
      /* Ajustar espaciado de pie */
      .response-footer {
        padding-top: 0.5rem !important;
        margin-top: 0.25rem !important;
      }
      
      /* Optimizar espaciado de párrafos */
      .response-content p,
      .response-content ul,
      .response-content ol {
        margin: 0.25em 0 !important;
      }
      
      /* Reducir margen en listas */
      .response-content ul, 
      .response-content ol {
        padding-left: 1.25em !important;
      }
      
      /* Optimizar tamaño de imágenes */
      .question-image img {
        width: 80px !important;
        height: 80px !important;
      }
      
      /* Ajustar espaciado de preguntas con imágenes */
      .question-container {
        gap: 0.5rem !important;
      }
      
      /* Optimizar tamaño de botones */
      .response-action {
        padding: 0.35rem !important;
      }
      
      .tool-button {
        padding: 0.35rem 0.75rem !important;
      }
      
      /* Optimizar indicadores de escritura */
      .typing-indicator {
        padding: 0.125rem 0 !important;
      }
    `;

    const container = document.createElement("div");
    container.className = "response-container";

    // Crear entradas de respuesta con el nuevo método optimizado
    this.responses.forEach((response) => {
      container.appendChild(this.createResponseEntry(response));
    });

    // Limpiar y actualizar el shadow DOM
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    // Auto-scroll al último mensaje si hay respuestas
    if (this.responses.length > 0) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
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
