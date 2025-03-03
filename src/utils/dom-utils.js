export function attachShadowTemplate(component, templateContent) {
  if (!component) {
    console.error(
      "Error: No se proporcionó un componente para attachShadowTemplate"
    );
    return null;
  }

  if (!templateContent) {
    console.error(
      "Error: No se proporcionó contenido de plantilla para attachShadowTemplate"
    );
    return null;
  }

  console.log("Attaching shadow template to component:", {
    componentTagName: component.tagName,
    templateContentLength: templateContent.length,
  });

  // Verificar si el componente ya tiene un shadowRoot
  if (component.shadowRoot) {
    console.log("El componente ya tiene un shadowRoot, no se creará uno nuevo");

    // Limpiar el shadowRoot existente
    while (component.shadowRoot.firstChild) {
      component.shadowRoot.removeChild(component.shadowRoot.firstChild);
    }
  } else {
    // Crear un nuevo shadowRoot
    try {
      component.attachShadow({ mode: "open" });
      console.log("Shadow root creado:", !!component.shadowRoot);
    } catch (error) {
      console.error("Error creando shadow root:", error);
      return null;
    }
  }

  try {
    // Crear un template y agregar el contenido
    const template = document.createElement("template");
    template.innerHTML = templateContent;
    console.log(
      "Template element creado con contenido de longitud:",
      template.innerHTML.length
    );

    // Clonar el contenido del template
    const content = template.content.cloneNode(true);
    console.log("Contenido clonado:", {
      hasContent: !!content,
      childNodes: content.childNodes.length,
    });

    // Agregar el contenido al shadowRoot
    component.shadowRoot.appendChild(content);
    console.log("Contenido agregado al shadow root");

    // Registrar elementos clave
    const elements = {
      modalTrigger: component.shadowRoot.querySelector(".modal-trigger"),
      modal: component.shadowRoot.querySelector(".modal"),
      aiToolbar: component.shadowRoot.querySelector("ai-toolbar"),
      chatWithImage: component.shadowRoot.querySelector("chat-with-image"),
      responseHistory: component.shadowRoot.querySelector("response-history"),
    };

    console.log("Elementos renderizados:", {
      hasModalTrigger: !!elements.modalTrigger,
      hasModal: !!elements.modal,
      hasAiToolbar: !!elements.aiToolbar,
      hasChatWithImage: !!elements.chatWithImage,
      hasResponseHistory: !!elements.responseHistory,
    });

    return component.shadowRoot;
  } catch (error) {
    console.error("Error procesando template:", error);
    return null;
  }
}

export const createTemplate = (html) => {
  if (typeof html !== "string") {
    // Si se pasa un componente en lugar de una cadena HTML,
    // asumimos que es un componente y utilizamos su método createTemplate
    if (html && typeof html.translations === "object") {
      if (typeof createTemplate === "function") {
        return createTemplate(html);
      } else {
        console.warn(
          "No se encontró la función createTemplate para el componente"
        );
        return "";
      }
    }

    console.warn("Se esperaba una cadena HTML para createTemplate");
    return "";
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  return template;
};
