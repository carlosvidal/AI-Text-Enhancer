// model-selector.js
import { ModelManager } from "../constants/model-config.js";
import { variables } from "../styles/base/variables.js";
import { modelSelectorStyles } from "../styles/components/model-selector.js";

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
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations} // Solo si el componente usa animaciones
      ${componentSpecificStyles}
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML = `
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
