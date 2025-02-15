import { variables } from "../../styles/base/variables.js";
import { animations } from "../../styles/base/animations.js";
import { modalTriggerStyles } from "../../styles/components/modal-trigger.js";
import { modalStyles } from "../../styles/layout/modal.js";
import { previewStyles } from "../../styles/layout/preview.js";
import { imagePreviewStyles } from "../../styles/components/image-preview.js";

export function createTemplate(component) {
  const t = component.translations;
  const template = document.createElement("template");
  template.innerHTML = `
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
        height: calc(100vh - 200px);
        min-height: 400px;
      }

      .chat-section {
        border-top: 1px solid var(--ai-border);
        padding-top: 1rem;
      }

      .tools-container {
        margin-bottom: 1rem;
      }

      response-history {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--ai-background);
        border-radius: var(--ai-radius);
        margin-bottom: 1rem;
        overflow: auto;
        min-height: 200px;
        max-height: calc(100% - 150px);
      }

      .modal-content {
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        height: 90vh;
      }

      .modal-body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
    </style>

    <button class="modal-trigger" aria-label="${t.modalTrigger}" aria-haspopup="dialog">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
        <path d="m14 7 3 3"/>
      </svg>
      <span>${t.modalTrigger}</span>
    </button>
    
    <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <div class="modal-content" role="document">
        <button class="close-button" aria-label="Close dialog">×</button>
        <div class="modal-header">
          <h2 id="modal-title">${t.modalTitle}</h2>
        </div>
        
        <div class="modal-body" role="main">
          <div class="editor-section">
            <div class="tools-container" role="toolbar" aria-label="Text enhancement tools">
              <ai-toolbar language="${component.language}"></ai-toolbar>
            </div>
            <response-history role="log" aria-label="Enhancement history"></response-history>
            <div class="chat-section" role="complementary" aria-label="Chat assistance">
              <chat-with-image
                language="${component.language}"
                image-url="${component.imageUrl || ""}"
                api-provider="${component.apiProvider}">
              </chat-with-image>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return template;
}