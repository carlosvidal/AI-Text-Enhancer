function TinyMCEPlugin(options = {}) {
  const {
    enhancerId,
    buttonTooltip = "Mejorar con IA",
    buttonText = "IA",
    buttonIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
    debug = false
  } = options;
  return function(editor) {
    editor.ui.registry.addButton("aienhancer", {
      icon: "magic",
      // Icono predefinido o usar tu SVG personalizado
      tooltip: buttonTooltip,
      text: buttonText,
      onAction: function() {
        if (debug) {
          console.log("[TinyMCEPlugin] AI enhancer button clicked");
        }
        editor.selection.getContent();
        editor.getContent();
        const enhancer = document.getElementById(enhancerId);
        if (!enhancer) {
          console.error(
            `[TinyMCEPlugin] AI Text Enhancer with ID "${enhancerId}" not found`
          );
          return;
        }
        if (!enhancer.isInitialized && typeof enhancer.initializeComponents === "function") {
          console.log(
            "[TinyMCEPlugin] Initializing AI Text Enhancer component"
          );
          enhancer.initializeComponents();
        }
        if (enhancer.editorAdapter) {
          enhancer.editorAdapter.getContent = function() {
            return editor.getContent();
          };
          enhancer.editorAdapter.setContent = function(content) {
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
        const handleResponseUse = (event) => {
          const { responseId } = event.detail || {};
          if (debug) {
            console.log(
              "[TinyMCEPlugin] Received responseUse event:",
              event.detail
            );
          }
          if (enhancer.responseHistory) {
            const response = enhancer.responseHistory.getResponse(responseId);
            if (response && response.content) {
              if (debug) {
                console.log("[TinyMCEPlugin] Setting content from response:", {
                  id: responseId,
                  contentLength: response.content.length
                });
              }
              editor.setContent(response.content);
              editor.undoManager.add();
              setTimeout(() => {
                const modal = enhancer.shadowRoot.querySelector(".modal");
                if (modal) {
                  modal.classList.remove("open");
                }
              }, 100);
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
        enhancer.addEventListener("responseUse", handleResponseUse);
        const handleContentGenerated = (event) => {
          var _a;
          const generatedContent = (_a = event.detail) == null ? void 0 : _a.content;
          if (debug) {
            console.log(
              "[TinyMCEPlugin] Received ai-content-generated event:",
              event.detail
            );
          }
          if (generatedContent) {
            editor.setContent(generatedContent);
            editor.undoManager.add();
            enhancer.removeEventListener(
              "ai-content-generated",
              handleContentGenerated
            );
          }
        };
        enhancer.addEventListener(
          "ai-content-generated",
          handleContentGenerated
        );
        if (typeof enhancer.openModal === "function") {
          enhancer.openModal();
        } else {
          console.error(
            "[TinyMCEPlugin] openModal method not available on enhancer"
          );
        }
      }
    });
    editor.addCommand("insertAIContent", function(content) {
      if (content) {
        editor.setContent(content);
        editor.undoManager.add();
        if (debug) {
          console.log("[TinyMCEPlugin] Content inserted via command");
        }
      }
    });
    return {
      getMetadata: function() {
        return {
          name: "AI Text Enhancer",
          url: "https://github.com/yourusername/ai-text-enhancer"
        };
      }
    };
  };
}
function CKEditorPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;
  return function initPlugin(editor) {
    editor.ui.componentFactory.add("aienhancer", () => {
      const button = document.createElement("button");
      button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
        <path d="m14 7 3 3"/>
      </svg>`;
      button.title = buttonTooltip;
      button.className = "ck ck-button";
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
      return button;
    });
    setTimeout(() => {
      try {
        const editor_element = document.querySelector(".ck-editor__main");
        if (editor_element) {
          const toolbar = document.querySelector(".ck-toolbar");
          if (toolbar) {
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
function QuillPlugin(options = {}) {
  const {
    enhancerId,
    buttonTooltip = "Mejorar con IA",
    iconHTML = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
      <path d="m14 7 3 3"/>
    </svg>`
  } = options;
  return function(quill) {
    setTimeout(() => {
      try {
        const container = quill.container;
        const toolbar = container.querySelector(".ql-toolbar");
        if (!toolbar) {
          console.warn("Quill toolbar not found, waiting...");
          setTimeout(() => {
            const retryToolbar = container.querySelector(".ql-toolbar");
            if (retryToolbar) {
              addButton(retryToolbar);
            } else {
              console.error("Quill toolbar not found after retry");
            }
          }, 500);
          return;
        }
        addButton(toolbar);
      } catch (error) {
        console.error("Error initializing Quill plugin:", error);
      }
    }, 100);
    function addButton(toolbar) {
      const button = document.createElement("button");
      button.className = "ql-ai-enhancer";
      button.innerHTML = iconHTML;
      button.title = buttonTooltip;
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
      console.log("Quill AI enhancer button added successfully");
    }
    return {
      destroy: function() {
        const button = quill.container.querySelector(".ql-ai-enhancer");
        if (button) {
          button.removeEventListener("click");
          button.parentNode.removeChild(button);
        }
      }
    };
  };
}
function FroalaPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;
  return function manualPlugin() {
    setTimeout(() => {
      try {
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
        if (toolbar.querySelector(".ai-enhancer-button")) {
          return;
        }
        const buttonGroup = document.createElement("div");
        buttonGroup.className = "fr-btn-grp";
        const button = document.createElement("button");
        button.className = "fr-command fr-btn ai-enhancer-button";
        button.title = buttonTooltip;
        button.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
            <path d="m14 7 3 3"/>
          </svg>
        `;
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
        buttonGroup.appendChild(button);
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
    }, 1e3);
  };
}
export {
  CKEditorPlugin,
  FroalaPlugin,
  QuillPlugin,
  TinyMCEPlugin
};
//# sourceMappingURL=ai-text-enhancer-plugins.es.js.map
