// model-selector.js
import { ModelManager } from "./model-config.js";

export class ModelSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.modelManager = new ModelManager();
  }

  static get observedAttributes() {
    return ["provider", "model"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "provider") {
      this.modelManager.setProvider(newValue);
      this.render();
    } else if (name === "model") {
      this.updateSelectedModel(newValue);
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("change", (e) => {
      if (e.target.matches("select")) {
        this.dispatchEvent(
          new CustomEvent("modelChange", {
            detail: { model: e.target.value },
            bubbles: true,
            composed: true,
          })
        );
      }
    });
  }

  updateSelectedModel(modelId) {
    const select = this.shadowRoot.querySelector("select");
    if (select && modelId) {
      select.value = modelId;
    }
  }

  render() {
    const models = this.modelManager.getAvailableModels();
    const defaultModel = this.modelManager.getDefaultModel();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .model-selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background-color: white;
          font-size: 0.875rem;
          width: 100%;
        }

        .model-info {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .suggested {
          color: #059669;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .context-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .warning {
          color: #dc2626;
        }
      </style>

      <div class="model-selector">
        <select>
          ${models
            .map(
              (model) => `
            <option value="${model.id}" 
              ${model.id === defaultModel ? "selected" : ""}>
              ${model.name}
              ${model.suggested ? " (Recomendado)" : ""}
            </option>
          `
            )
            .join("")}
        </select>

        <div class="model-info">
          ${this.renderModelInfo(this.getAttribute("model") || defaultModel)}
        </div>
      </div>
    `;
  }

  renderModelInfo(modelId) {
    try {
      const model = this.modelManager.getModelConfig(modelId);
      return `
        <div>
          ${model.description}
          ${model.suggested ? '<span class="suggested">Recomendado</span>' : ""}
        </div>
        <div class="context-info">
          Contexto máximo: ${this.formatTokenCount(model.contextWindow)} tokens
          ${model.costPer1k ? `· Costo: $${model.costPer1k} por 1K tokens` : ""}
        </div>
      `;
    } catch (error) {
      return '<div class="warning">Error al cargar información del modelo</div>';
    }
  }

  formatTokenCount(count) {
    return new Intl.NumberFormat().format(count);
  }
}

customElements.define("model-selector", ModelSelector);
