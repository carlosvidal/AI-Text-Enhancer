/**
 * Plugin para TinyMCE que añade un botón para mejorar el texto con IA
 * @param {Object} options - Opciones de configuración
 * @param {string} options.enhancerId - ID del componente ai-text-enhancer
 * @param {string} options.buttonTooltip - Texto del tooltip del botón
 * @param {string} options.buttonIcon - Icono SVG para el botón
 * @returns {Object} - Plugin de TinyMCE
 */
export function TinyMCEPlugin(options = {}) {
  const {
    enhancerId,
    buttonTooltip = "Mejorar con IA",
    buttonIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
  } = options;

  return function (editor) {
    // Registrar el botón en TinyMCE
    editor.ui.registry.addButton("aienhancer", {
      icon: "magic", // Icono predefinido o usar tu SVG personalizado
      tooltip: buttonTooltip,
      onAction: function () {
        // Guardar la selección actual
        const currentSelection = editor.selection.getContent();

        // Buscar el componente enhancer
        const enhancer = document.getElementById(enhancerId);
        if (enhancer && typeof enhancer.openModal === "function") {
          // Configurar un listener para el evento 'ai-content-generated'
          const handleContentGenerated = (event) => {
            const generatedContent = event.detail.content;

            // Insertar el contenido en TinyMCE
            if (generatedContent) {
              // Si hay una selección, reemplazarla; si no, insertar al final
              if (currentSelection) {
                editor.selection.setContent(generatedContent);
              } else {
                editor.setContent(generatedContent);
              }
              editor.undoManager.add(); // Permitir deshacer
            }

            // Eliminar este listener después de usarlo
            enhancer.removeEventListener(
              "ai-content-generated",
              handleContentGenerated
            );
          };

          // Añadir el listener para capturar el contenido generado
          enhancer.addEventListener(
            "ai-content-generated",
            handleContentGenerated
          );

          // Abrir el modal
          enhancer.openModal();
        } else {
          console.error(
            `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
          );
        }
      },
    });

    // También añadir un método para acceso directo desde el componente
    editor.addCommand("insertAIContent", function (content) {
      editor.selection.setContent(content);
      editor.undoManager.add();
    });

    // Registrar el plugin (opcional)
    return {
      getMetadata: function () {
        return {
          name: "AI Text Enhancer",
          url: "https://github.com/yourusername/ai-text-enhancer",
        };
      },
    };
  };
}
