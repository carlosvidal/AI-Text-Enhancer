// editor-adapter.js

export class EditorAdapter {
  constructor(editorId, editorType = "textarea") {
    console.log(
      "[EditorAdapter] Initializing with editor ID:",
      editorId,
      "and type:",
      editorType
    );
    this.editorId = editorId;
    this.editorType = editorType; // Añadido: guardar el tipo de editor
    this.editor = document.getElementById(editorId);

    if (!this.editor) {
      console.error("[EditorAdapter] Editor element not found:", editorId);
    }
  }

  getContent() {
    try {
      // Usar un valor por defecto si editorType es undefined
      const editorType = (this.editorType || "textarea").toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE - este método será sobreescrito desde la página de demostración
          return "";

        case "textarea":
        default:
          // Textarea
          const editorElement = document.getElementById(this.editorId);
          if (editorElement) {
            return editorElement.value || editorElement.innerHTML || "";
          }
          return "";
      }
    } catch (error) {
      console.error("❌ Error getting editor content:", error);
      return "";
    }
  }

  setContent(content) {
    try {
      // Usar un valor por defecto si editorType es undefined
      const editorType = (this.editorType || "textarea").toLowerCase();

      switch (
        editorType // Cambiado: usar la variable local en lugar de this.editorType
      ) {
        case "tinymce":
          // TinyMCE - este método será sobreescrito desde la página de demostración
          return false;

        case "textarea":
        default:
          // Textarea
          const editorElement = document.getElementById(this.editorId);
          if (editorElement) {
            if (typeof editorElement.value !== "undefined") {
              editorElement.value = content;
              return true;
            } else if (typeof editorElement.innerHTML !== "undefined") {
              editorElement.innerHTML = content;
              return true;
            }
          }
          return false;
      }
    } catch (error) {
      console.error("❌ Error setting editor content:", error);
      return false;
    }
  }

  // Método para actualizar el tipo de editor
  setEditorType(type) {
    this.editorType = type;
    console.log("[EditorAdapter] Editor type updated to:", type);
  }
}
