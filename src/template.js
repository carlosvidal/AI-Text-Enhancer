import { variables } from "./styles/base/variables.js";
import { animations } from "./styles/base/animations.js";
import { modalTriggerStyles } from "./styles/components/modal-trigger.js";
import { modalStyles } from "./styles/layout/modal.js";
import { previewStyles } from "./styles/layout/preview.js";
import { imagePreviewStyles } from "./styles/components/image-preview.js";

export function createTemplate(component) {
  const t = component.translations;

  return `
    <style>
      ${variables}
      ${animations}
      ${modalTriggerStyles}
      ${modalStyles}
      ${previewStyles}
      ${imagePreviewStyles}
      
      :host {
        display: inline-block;
        font-family: var(--ai-font-sans);
        position: relative;
      }

      .editor-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .chat-section {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }

      .tools-container {
        margin-bottom: 1rem;
      }

      response-history {
        flex: 1;
        min-height: 0;
        background: var(--ai-background);
        border-radius: var(--ai-radius);
        margin-bottom: 1rem;
        overflow: auto;
        display: block;
      }
    </style>

    <button class="modal-trigger">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
        <path d="m14 7 3 3"/>
      </svg>
      <span>${t?.modalTrigger || "Enhance Text"}</span>
    </button>
    
    <div class="modal">
      <div class="modal-content">
        <button class="close-button">×</button>
        <div class="modal-header">
          <h2>${t?.modalTrigger || "Enhance Text"}</h2>
        </div>
        
        <div class="modal-body">
          <div class="editor-section">
            <response-history language="${
              component.language
            }"></response-history>
          </div>
          <div class="chat-section">
            <chat-with-image
              language="${component.language}"
              image-url="${component.imageUrl || ""}"
              api-provider="${component.apiProvider}">
            </chat-with-image>
          </div>
        </div>
      </div>
    </div>`;
}
