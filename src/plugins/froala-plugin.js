// src/plugins/froala-plugin.js (versión corregida)

/**
 * Plugin para Froala Editor que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @returns {Object} - Plugin de Froala
 */
export function FroalaPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;

  // Esta función se llama para registrar el plugin
  return function manualPlugin() {
    // No usamos la estructura estándar de plugin de Froala
    // En su lugar, añadimos manualmente un botón cuando Froala esté listo

    setTimeout(() => {
      try {
        // Buscar la barra de herramientas de Froala
        const froalaContainer = document.querySelector(".fr-box");
        if (!froalaContainer) {
          console.warn("Froala container not found");
          return;
        }

        const toolbar = froalaContainer.querySelector(".fr-toolbar");
        if (!toolbar) {
          console.warn("Froala toolbar not found");
          return;
        }

        // Verificar si ya existe nuestro botón
        if (toolbar.querySelector(".ai-enhancer-button")) {
          return;
        }

        // Crear un nuevo grupo de botones
        const buttonGroup = document.createElement("div");
        buttonGroup.className = "fr-btn-grp";

        // Crear el botón
        const button = document.createElement("button");
        button.className = "fr-command fr-btn ai-enhancer-button";
        button.title = buttonTooltip;
        button.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
            <path d="m14 7 3 3"/>
          </svg>
        `;

        // Añadir evento
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

        // Añadir botón al grupo
        buttonGroup.appendChild(button);

        // Añadir grupo a la barra de herramientas
        const lastGroup = toolbar.querySelector(".fr-btn-grp:last-child");
        if (lastGroup) {
          toolbar.insertBefore(buttonGroup, lastGroup.nextSibling);
        } else {
          toolbar.appendChild(buttonGroup);
        }

        console.log("Froala AI enhancer button added successfully");
      } catch (error) {
        console.error("Error adding button to Froala:", error);
      }
    }, 1000); // Dar tiempo a Froala para inicializarse completamente
  };
}
