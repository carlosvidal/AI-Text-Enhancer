// Mejora de la función createTemplate en src/template.js
// Esta función crea el HTML del componente AITextEnhancer

import { variables } from "./styles/base/variables.js";
import { animations } from "./styles/base/animations.js";
import { modalTriggerStyles } from "./styles/components/modal-trigger.js";
import { modalStyles } from "./styles/layout/modal.js";
import { previewStyles } from "./styles/layout/preview.js";
import { imagePreviewStyles } from "./styles/components/image-preview.js";
import { notificationStyles } from "./styles/components/notifications.js";

export function createTemplate(component) {
  if (!component) {
    console.error("[createTemplate] Error: No se proporcionó un componente");
    return "";
  }

  try {
    console.log(
      "[createTemplate] Creando template para el componente",
      component.tagName
    );

    // Acceder a las traducciones con validación para evitar errores
    const t = component.translations || {};

    // Determinar si hay contenido y contexto con validación
    const currentContent =
      typeof component.currentContent === "function"
        ? component.currentContent()
        : component.currentContent || "";

    const context = component.context || "";

    const hasContent = Boolean(currentContent?.trim && currentContent.trim());
    const hasContext = Boolean(context?.trim && context.trim());

    // Verificar si el botón modal-trigger debe ser ocultado
    // Añadir esta línea para comprobar el atributo hide-trigger
    const showTrigger = !component.hideTrigger;

    console.log("[createTemplate] Estado del componente:", {
      hasContent,
      hasContext,
      language: component.language || "en",
      showTrigger, // Añadir esta línea para mostrar el estado en logs
    });

    // HTML del componente con comentarios para facilitar la depuración
    return `
    <!-- Estilos del componente -->
    <style>
      ${variables}
      ${animations}
      ${modalTriggerStyles}
      ${modalStyles}
      ${previewStyles}
      ${imagePreviewStyles}
      ${notificationStyles}
      
      /* Estilos específicos del componente */
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
        position: relative;
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
        max-height: calc(85vh - 120px);
        background: var(--ai-background);
        border-radius: var(--ai-radius);
        margin-bottom: 1rem;
        overflow: auto;
        display: block;
      }
      
      /* Contenedor de notificaciones */
      .notifications-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: var(--ai-z-notification, 100001);
        pointer-events: none;
      }
      
      .notifications-container > * {
        pointer-events: auto;
      }
      
      /* Estilos de ayuda y depuración */
      .debug-info {
        display: none;
        padding: 10px;
        margin: 10px 0;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 12px;
      }
      
      /* Mostrar en modo depuración */
      :host([debug]) .debug-info {
        display: block;
      }
    </style>

    <!-- Botón para abrir el modal (CONDICIONAL) -->
    ${
      showTrigger
        ? `
    <button class="modal-trigger" id="modal-trigger-button">
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" fill-opacity="0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
                        <path d="m14 7 3 3"/>
                        <path d="M5 6v4"/>
                        <path d="M19 14v4"/>
                        <path d="M10 2v2"/>
                        <path d="M7 8H3"/>
                        <path d="M21 16h-4"/>
                        <path d="M11 3H9"/>
                      </svg>
      <span>${t?.modalTrigger || "Enhance with AI"}</span>
    </button>
    `
        : ""
    }
    
    <!-- Modal principal -->
    <div class="modal" id="ai-enhancer-modal">
      <div class="modal-content">
        <button class="close-button" aria-label="Close modal">×</button>
        <div class="modal-header">
          <h2>${t?.modalTitle || "Enhance Text"}</h2>
        </div>
        
        <div class="modal-body">
          <!-- Historial de respuestas -->
          <div class="editor-section">
            <response-history language="${
              component.language || "en"
            }"></response-history>
          </div>
          
          <!-- Sección de chat -->
          <div class="chat-section">
            <!-- LOG: supports-images = "${component.getAttribute && component.getAttribute('supports-images')}" -->
            <chat-with-image
              language="${component.language || "en"}"
              image-url="${component.imageUrl || ""}"
              apiProvider="${component.apiProvider || "openai"}"
              ${component.hasAttribute && component.hasAttribute('supports-images') ? `supports-images="${component.getAttribute('supports-images')}"` : ''}
            >
            </chat-with-image>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contenedor de notificaciones -->
    <div class="notifications-container"></div>`;
  } catch (error) {
    console.error("[createTemplate] Error creando template:", error);

    // Retornar un template básico en caso de error
    return `
    <div style="color: red; padding: 10px; border: 1px solid red;">
      Error creating component template: ${error.message}
    </div>
    <button class="modal-trigger">Enhance Text</button>
    <div class="modal">
      <div class="modal-content">
        <button class="close-button">×</button>
        <div class="modal-header">
          <h2>Enhance Text</h2>
        </div>
        <div class="modal-body">
          <p>Error loading component. Please try refreshing the page.</p>
        </div>
      </div>
    </div>`;
  }
}
