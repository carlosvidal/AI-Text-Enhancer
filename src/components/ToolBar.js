// src/components/ToolBar.js
import { TRANSLATIONS } from "../constants/translations.js";

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

  getToolIcon(action) {
    const icons = {
      improve: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
        </svg>
      `,
      summarize: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/>
        </svg>
      `,
      expand: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/><path d="M12 7v6"/>
        </svg>
      `,
      paraphrase: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/>
          <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
          <path d="M11 10v4h4"/>
        </svg>
      `,
      formal: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      `,
      casual: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" x2="9.01" y1="9" y2="9"/>
          <line x1="15" x2="15.01" y1="9" y2="9"/>
        </svg>
      `,
    };

    return icons[action] || icons.improve;
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
      button.innerHTML = `${this.getToolIcon(tool.action)}${tool.label}`;
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
        ${this.getToolIcon("improve")}Improve
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
