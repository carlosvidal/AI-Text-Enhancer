// src/plugins/ckeditor-plugin.js (versión corregida)

/**
 * Plugin para CKEditor 5 que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @returns {Function} - Inicializador del plugin
 */
export function CKEditorPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;

  // Esta función se debería pasar como callback a extraPlugins
  return function initPlugin(editor) {
    // Añadir un botón a la barra de herramientas de forma directa
    // En lugar de usar la API ButtonView

    editor.ui.componentFactory.add("aienhancer", () => {
      // Crear un botón manualmente
      const button = document.createElement("button");
      button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
        <path d="m14 7 3 3"/>
      </svg>`;
      button.title = buttonTooltip;
      button.className = "ck ck-button";

      // Añadir estilos CSS
      button.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 4px;
        cursor: pointer;
        margin: 2px;
      `;

      // Añadir eventos
      button.addEventListener("click", () => {
        const enhancer = document.getElementById(enhancerId);
        if (enhancer && typeof enhancer.openModal === "function") {
          enhancer.openModal();
        } else {
          console.error(
            `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
          );
        }
      });

      // Devolver el elemento DOM (CKEditor lo añadirá a la UI)
      return button;
    });

    // De manera alternativa, podemos observar cuando la barra de herramientas está lista
    // y añadir nuestro botón directamente
    setTimeout(() => {
      try {
        // Buscar la barra de herramientas de CKEditor
        const editor_element = document.querySelector(".ck-editor__main");
        if (editor_element) {
          const toolbar = document.querySelector(".ck-toolbar");
          if (toolbar) {
            // Crear botón si no existe ya
            if (!toolbar.querySelector(".ai-enhancer-button")) {
              const button = document.createElement("button");
              button.className = "ck ck-button ai-enhancer-button";
              button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16">
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
                <path d="m14 7 3 3"/>
              </svg>`;
              button.title = buttonTooltip;

              button.addEventListener("click", () => {
                const enhancer = document.getElementById(enhancerId);
                if (enhancer && typeof enhancer.openModal === "function") {
                  enhancer.openModal();
                } else {
                  console.error(
                    `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
                  );
                }
              });

              toolbar.appendChild(button);
              console.log("CKEditor AI enhancer button added");
            }
          }
        }
      } catch (error) {
        console.error("Error adding button to CKEditor:", error);
      }
    }, 500);
  };
}
