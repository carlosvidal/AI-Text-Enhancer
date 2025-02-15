import { variables } from "./styles/base/variables.js";
import { animations } from "./styles/base/animations.js";
import { modalTriggerStyles } from "./styles/components/modal-trigger.js";
import { modalStyles } from "./styles/layout/modal.js";
import { previewStyles } from "./styles/layout/preview.js";
import { imagePreviewStyles } from "./styles/components/image-preview.js";

export function createTemplate(component) {
  return `
    <style>
      ${variables}
      ${animations}
      ${modalTriggerStyles}
      ${modalStyles}
      ${previewStyles}
      ${imagePreviewStyles}
    </style>
    <div class="ai-text-enhancer">
      <button class="modal-trigger">
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
        </svg>
        <span>AI Text Enhancer</span>
      </button>
      
      <div class="modal">
        <div class="modal-content">
          <button class="close-button">×</button>
          <div class="modal-body">
            <ai-toolbar></ai-toolbar>
            <chat-with-image></chat-with-image>
            <response-history></response-history>
          </div>
        </div>
      </div>
    </div>
  `;
}