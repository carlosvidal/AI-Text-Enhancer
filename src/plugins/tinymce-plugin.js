/**
 * Plugin mejorado para TinyMCE que añade un botón para mejorar el texto con IA
 * Esta versión corrige problemas de integración con AITextEnhancer
 *
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
    buttonText = "IA",
    buttonIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
    debug = false,
  } = options;

  // Función para registrar el plugin
  return function (editor) {
    // Registrar el botón en TinyMCE
    editor.ui.registry.addButton("aienhancer", {
      icon: "magic", // Icono predefinido o usar tu SVG personalizado
      tooltip: buttonTooltip,
      text: buttonText,
      onAction: function () {
        if (debug) {
          console.log("[TinyMCEPlugin] AI enhancer button clicked");
        }

        // Guardar la selección actual
        const currentSelection = editor.selection.getContent();
        const currentContent = editor.getContent();

        // Buscar el componente enhancer
        const enhancer = document.getElementById(enhancerId);
        if (!enhancer) {
          console.error(
            `[TinyMCEPlugin] AI Text Enhancer with ID "${enhancerId}" not found`
          );
          return;
        }

        // Verificar si el componente está inicializado adecuadamente
        if (
          !enhancer.isInitialized &&
          typeof enhancer.initializeComponents === "function"
        ) {
          console.log(
            "[TinyMCEPlugin] Initializing AI Text Enhancer component"
          );
          enhancer.initializeComponents();
        }

        // Asegurar que el adaptador del editor esté configurado correctamente
        if (enhancer.editorAdapter) {
          // Sobreescribir métodos del adaptador para garantizar la correcta integración
          enhancer.editorAdapter.getContent = function () {
            return editor.getContent();
          };

          enhancer.editorAdapter.setContent = function (content) {
            if (content) {
              editor.setContent(content);
              editor.undoManager.add();
              return true;
            }
            return false;
          };

          if (debug) {
            console.log("[TinyMCEPlugin] Editor adapter methods overridden");
          }
        } else {
          console.warn(
            "[TinyMCEPlugin] Editor adapter not available in enhancer"
          );
        }

        // Configurar un listener para el evento 'responseUse'
        const handleResponseUse = (event) => {
          const { responseId } = event.detail || {};

          if (debug) {
            console.log(
              "[TinyMCEPlugin] Received responseUse event:",
              event.detail
            );
          }

          // Obtener la respuesta del historial
          if (enhancer.responseHistory) {
            const response = enhancer.responseHistory.getResponse(responseId);

            if (response && response.content) {
              if (debug) {
                console.log("[TinyMCEPlugin] Setting content from response:", {
                  id: responseId,
                  contentLength: response.content.length,
                });
              }

              // Insertar el contenido en TinyMCE
              editor.setContent(response.content);
              editor.undoManager.add();

              // Cerrar el modal después de una breve pausa
              setTimeout(() => {
                const modal = enhancer.shadowRoot.querySelector(".modal");
                if (modal) {
                  modal.classList.remove("open");
                }
              }, 100);

              // Eliminar este listener después de usarlo
              enhancer.removeEventListener("responseUse", handleResponseUse);
            } else {
              console.warn(
                "[TinyMCEPlugin] Response not found or content empty:",
                responseId
              );
            }
          } else {
            console.warn(
              "[TinyMCEPlugin] Response history not available in enhancer"
            );
          }
        };

        // Añadir listener para capturar el evento responseUse
        enhancer.addEventListener("responseUse", handleResponseUse);

        // También configurar un listener para el evento 'ai-content-generated'
        const handleContentGenerated = (event) => {
          const generatedContent = event.detail?.content;

          if (debug) {
            console.log(
              "[TinyMCEPlugin] Received ai-content-generated event:",
              event.detail
            );
          }

          // Insertar el contenido en TinyMCE
          if (generatedContent) {
            editor.setContent(generatedContent);
            editor.undoManager.add();

            // Eliminar este listener después de usarlo
            enhancer.removeEventListener(
              "ai-content-generated",
              handleContentGenerated
            );
          }
        };

        // Añadir listener para el evento ai-content-generated
        enhancer.addEventListener(
          "ai-content-generated",
          handleContentGenerated
        );

        // Abrir el modal
        if (typeof enhancer.openModal === "function") {
          enhancer.openModal();
        } else {
          console.error(
            "[TinyMCEPlugin] openModal method not available on enhancer"
          );
        }
      },
    });

    // Añadir un comando para insertar contenido
    editor.addCommand("insertAIContent", function (content) {
      if (content) {
        editor.setContent(content);
        editor.undoManager.add();

        if (debug) {
          console.log("[TinyMCEPlugin] Content inserted via command");
        }
      }
    });

    // Registrar el plugin (información de metadatos)
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
