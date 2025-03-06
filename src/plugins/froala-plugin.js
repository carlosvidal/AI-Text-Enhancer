/**
 * Plugin para Froala Editor que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @returns {Object} - Plugin de Froala
 */
export function FroalaPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;

  // Devolveremos un objeto con la definición del plugin para Froala
  return {
    // Nombre del plugin
    name: "aiEnhancer",

    // Icono SVG para el botón
    icon: {
      SVG: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
      template: "text",
    },

    // Código para inicializar el plugin
    init: function (editor) {
      // Añadir el botón a la barra de herramientas
      editor.toolbar.addButton("aiEnhancer", {
        title: buttonTooltip,
        icon: this.icon,
        callback: function () {
          const enhancer = document.getElementById(enhancerId);
          if (enhancer && typeof enhancer.openModal === "function") {
            enhancer.openModal();
          } else {
            console.error(
              `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
            );
          }
        },
      });
    },
  };
}
