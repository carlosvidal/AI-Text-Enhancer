/**
 * Plugin para CKEditor 5 que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @returns {Object} - Plugin de CKEditor
 */
export function CKEditorPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;

  const plugin = {
    pluginName: "AIEnhancer",

    init: function (editor) {
      // Registrar el botón
      editor.ui.componentFactory.add("aienhancer", (locale) => {
        const button = new editor.ui.ButtonView(locale);

        button.set({
          label: buttonTooltip,
          icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
          tooltip: true,
        });

        // Al hacer clic, abrir el modal
        button.on("execute", () => {
          const enhancer = document.getElementById(enhancerId);
          if (enhancer && typeof enhancer.openModal === "function") {
            enhancer.openModal();
          } else {
            console.error(
              `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
            );
          }
        });

        return button;
      });
    },
  };

  return plugin;
}
