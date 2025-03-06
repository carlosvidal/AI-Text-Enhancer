/**
 * Plugin para Quill que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @param {string} options.iconHTML - HTML del icono del botón
 * @returns {Function} - Función para registrar el plugin
 */
export function QuillPlugin(options = {}) {
  const {
    enhancerId,
    buttonTooltip = "Mejorar con IA",
    iconHTML = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
        <path d="m14 7 3 3"/>
      </svg>`,
  } = options;

  return function (quill) {
    // Crear el botón
    const button = document.createElement("button");
    button.className = "ql-ai-enhancer";
    button.innerHTML = iconHTML;
    button.title = buttonTooltip;

    // Estilizar el botón
    button.style.cssText = `
        display: inline-block;
        height: 24px;
        width: 28px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 3px;
        position: relative;
      `;

    // Escuchar clics
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

    // Obtener la barra de herramientas y añadir el botón
    const toolbar = quill.container.querySelector(".ql-toolbar");
    if (toolbar) {
      toolbar.appendChild(button);
    } else {
      console.error("Quill toolbar not found");
    }

    // Devolver funciones del plugin (opcional)
    return {
      destroy: function () {
        button.removeEventListener("click");
        if (button.parentNode) {
          button.parentNode.removeChild(button);
        }
      },
    };
  };
}
