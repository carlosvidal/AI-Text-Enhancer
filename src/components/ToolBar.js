// src/components/ToolBar.js
import { TRANSLATIONS } from "../constants/translations.js";
import { getToolIcon } from "../services/icon-service.js";
import { variables } from "../styles/base/variables.js";
import { toolbarStyles } from "../styles/components/toolbar.js";

export class ToolBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentAction = "improve";
  }

  static get observedAttributes() {
    return ["has-content", "language"];
  }

  get hasContent() {
    return this.getAttribute("has-content") === "true";
  }

  get language() {
    return this.getAttribute("language") || "en";
  }

  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
  
    if (name === 'language') {
      // Re-render the entire toolbar when language changes
      this.render();
    } else if (name === 'has-content') {
      this.updateVisibleTools();
    }
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
      }

      .tools {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .tool-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #e5e7eb;
        cursor: pointer;
        font-family: inherit;
      }

      .tool-button:hover {
        background: #d1d5db;
      }

      .tool-button.active {
        background: #3b82f6;
        color: white;
      }

      .tool-button svg {
        width: 16px;
        height: 16px;
      }
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.createToolbar());
    
    requestAnimationFrame(() => {
      this.updateVisibleTools();
    });
  }

  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "tools";

    const tools = [
      { action: "improve", label: this.translations.tools.improve },
      { action: "summarize", label: this.translations.tools.summarize },
      { action: "expand", label: this.translations.tools.expand },
      { action: "paraphrase", label: this.translations.tools.paraphrase },
      { action: "more-formal", label: this.translations.tools["more-formal"] || this.translations.tools.formal },
      { action: "more-casual", label: this.translations.tools["more-casual"] || this.translations.tools.casual }
    ];

    tools.forEach((tool) => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.dataset.action = tool.action;
      // Asegurarse de que siempre hay una etiqueta
      const label = tool.label || tool.action;
      button.innerHTML = `${getToolIcon(tool.action)}${label}`;
      toolbar.appendChild(button);
    });

    return toolbar;
  }

  bindEvents() {
    this.shadowRoot.querySelectorAll(".tool-button").forEach((button) => {
      button.onclick = () => {
        this.setActiveAction(button.dataset.action);
        this.dispatchEvent(
          new CustomEvent("toolaction", {
            detail: { action: button.dataset.action },
            bubbles: true,
            composed: true,
          })
        );
      };
    });
  }

  setActiveAction(action) {
    this.currentAction = action;
    this.shadowRoot.querySelectorAll(".tool-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.action === action);
    });
  }

  updateVisibleTools() {
    const hasContent = this.hasContent;
    const improveButton = this.shadowRoot.querySelector('[data-action="improve"]');
    const tools = this.shadowRoot.querySelectorAll(".tool-button");

    if (!hasContent) {
      improveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
        ${this.translations.tools.generate || 'Generate'}
      `;
    } else {
      improveButton.innerHTML = `${getToolIcon("improve")}${this.translations.tools.improve}`;
    }

    tools.forEach((tool) => {
      const action = tool.dataset.action;
      if (hasContent) {
        tool.style.display = "inline-flex";
      } else {
        tool.style.display = action === "improve" ? "inline-flex" : "none";
      }
    });
  }

  getCurrentAction() {
    return this.currentAction;
  }
}

customElements.define("ai-toolbar", ToolBar);
