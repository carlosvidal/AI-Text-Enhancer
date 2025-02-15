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

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Solo actualizar si el componente ya está renderizado
    if (this.shadowRoot.querySelector(".tools")) {
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

    const toolbar = document.createElement("div");
    toolbar.className = "tools";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Enhancement tools");

    const tools = [
      { action: "improve", icon: "wand" },
      { action: "summarize", icon: "list" },
      { action: "expand", icon: "maximize" },
      { action: "paraphrase", icon: "repeat" },
      { action: "formal", icon: "briefcase" },
      { action: "casual", icon: "coffee" },
    ];

    tools.forEach(tool => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.dataset.action = tool.action;
      button.setAttribute("role", "button");
      button.setAttribute("aria-pressed", tool.action === this.currentAction ? "true" : "false");
      button.setAttribute("aria-label", this.translations?.tools[tool.action] || tool.action);
      
      // Add icon and text
      button.innerHTML = `
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${getToolIcon(tool.icon)}
        </svg>
        <span>${this.translations?.tools[tool.action] || tool.action}</span>
      `;
      
      toolbar.appendChild(button);
    });

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(toolbar);
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

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Solo actualizar si el componente ya está renderizado
    if (this.shadowRoot.querySelector(".tools")) {
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
      { action: "improve", label: "Improve" },
      { action: "summarize", label: "Summarize" },
      { action: "expand", label: "Expand" },
      { action: "paraphrase", label: "Paraphrase" },
      { action: "formal", label: "More Formal" },
      { action: "casual", label: "More Casual" },
    ];

    tools.forEach((tool) => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.dataset.action = tool.action;
      button.innerHTML = `${getToolIcon(tool.action)}${tool.label}`;
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
    const improveButton = this.shadowRoot.querySelector(
      '[data-action="improve"]'
    );
    const tools = this.shadowRoot.querySelectorAll(".tool-button");

    if (!hasContent) {
      improveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
        Generate
      `;
    } else {
      improveButton.innerHTML = `
        ${getToolIcon("improve")}Improve
      `;
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

  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }
}

customElements.define("ai-toolbar", ToolBar);
