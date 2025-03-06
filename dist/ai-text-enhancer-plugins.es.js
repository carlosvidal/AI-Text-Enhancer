function TinyMCEPlugin(options = {}) {
  const {
    enhancerId,
    buttonTooltip = "Mejorar con IA",
    buttonIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>'
  } = options;
  return function(editor) {
    editor.ui.registry.addButton("aienhancer", {
      icon: "magic",
      // Icono predefinido o usar tu SVG personalizado
      tooltip: buttonTooltip,
      onAction: function() {
        const enhancer = document.getElementById(enhancerId);
        if (enhancer && typeof enhancer.openModal === "function") {
          enhancer.openModal();
        } else {
          console.error(
            `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
          );
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
  const plugin = {
    pluginName: "AIEnhancer",
    init: function(editor) {
      editor.ui.componentFactory.add("aienhancer", (locale) => {
        const button = new editor.ui.ButtonView(locale);
        button.set({
          label: buttonTooltip,
          icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
          tooltip: true
        });
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
    }
  };
  return plugin;
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
    const toolbar = quill.container.querySelector(".ql-toolbar");
    if (toolbar) {
      toolbar.appendChild(button);
    } else {
      console.error("Quill toolbar not found");
    }
    return {
      destroy: function() {
        button.removeEventListener("click");
        if (button.parentNode) {
          button.parentNode.removeChild(button);
        }
      }
    };
  };
}
function FroalaPlugin(options = {}) {
  const { enhancerId, buttonTooltip = "Mejorar con IA" } = options;
  return {
    // Nombre del plugin
    name: "aiEnhancer",
    // Icono SVG para el botón
    icon: {
      SVG: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/></svg>',
      template: "text"
    },
    // Código para inicializar el plugin
    init: function(editor) {
      editor.toolbar.addButton("aiEnhancer", {
        title: buttonTooltip,
        icon: this.icon,
        callback: function() {
          const enhancer = document.getElementById(enhancerId);
          if (enhancer && typeof enhancer.openModal === "function") {
            enhancer.openModal();
          } else {
            console.error(
              `AI Text Enhancer with ID "${enhancerId}" not found or not initialized`
            );
          }
        }
      });
    }
  };
}
export {
  CKEditorPlugin,
  FroalaPlugin,
  QuillPlugin,
  TinyMCEPlugin
};
//# sourceMappingURL=ai-text-enhancer-plugins.es.js.map
