// src/components/ToolBar.js
import { TRANSLATIONS } from "../constants/translations.js";
import { getToolIcon } from "../services/icon-service.js";
import { variables } from "../styles/base/variables.js";
import { toolbarStyles } from "../styles/components/toolbar.js";

export class ToolBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.translations = TRANSLATIONS.en; // valor por defecto
  }

  static get observedAttributes() {
    return ["language"];
  }

  get language() {
    return this.getAttribute("language") || "en";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && oldValue !== newValue) {
      this.translations = TRANSLATIONS[newValue] || TRANSLATIONS.en;
      this.render();
    }
  }

  createButton(action) {
    const button = document.createElement("button");
    button.className = "tool-button";
    button.dataset.action = action;
    button.innerHTML = `${getToolIcon(action)}<span>${this.translations.tools[action]}</span>`;
    return button;
  }

  render() {
    const tools = ["improve", "summarize", "expand", "paraphrase", "more-formal", "more-casual"];
    const container = document.createElement("div");
    container.className = "toolbar";
    
    tools.forEach(action => {
      container.appendChild(this.createButton(action));
    });

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(container);
  }

  connectedCallback() {
    this.translations = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    this.render();
  }
}

customElements.define("ai-toolbar", ToolBar);
