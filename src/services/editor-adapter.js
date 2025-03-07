// editor-adapter.js (Versión mejorada)

// Importación para tipo específico de editor TinyMCE
import { createTinyMCEAdapter } from "../utils/tinymce-adapter.js";

/**
 * Clase adaptadora para diferentes tipos de editores
 * Proporciona una interfaz unificada para trabajar con distintos editores
 */
export class EditorAdapter {
  /**
   * Constructor del adaptador de editor
   * @param {string} editorId - ID del elemento editor
   * @param {string} editorType - Tipo de editor ('textarea', 'tinymce', etc.)
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, editorType = "textarea", options = {}) {
    this.editorId = editorId;
    this.editorType = editorType?.toLowerCase() || "textarea";
    this.options = {
      debug: options.debug || false,
      ...options,
    };

    // Referencia al elemento DOM del editor
    this.editor = document.getElementById(editorId);

    // Adaptadores específicos para tipos de editor
    this.specificAdapters = {};

    if (this.options.debug) {
      console.log("[EditorAdapter] Initializing with:", {
        editorId,
        editorType: this.editorType,
        editorFound: !!this.editor,
      });
    }

    if (!this.editor) {
      console.warn(`[EditorAdapter] Editor element not found: ${editorId}`);
    }

    // Inicializar adaptador específico si es necesario
    this.initSpecificAdapter();
  }

  /**
   * Inicializa adaptadores específicos según el tipo de editor
   * @private
   */
  initSpecificAdapter() {
    switch (this.editorType) {
      case "tinymce":
        try {
          this.specificAdapters.tinymce = createTinyMCEAdapter(this.editorId, {
            debug: this.options.debug,
          });

          if (this.options.debug) {
            console.log("[EditorAdapter] TinyMCE adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize TinyMCE adapter:",
            error
          );
        }
        break;

      // Aquí se pueden agregar más adaptadores específicos para otros editores

      default:
        // No se necesita adaptador específico para textarea
        break;
    }
  }

  /**
   * Obtiene el contenido del editor
   * @returns {string} Contenido del editor
   */
  getContent() {
    try {
      const editorType = this.editorType.toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE - usar adaptador específico si está disponible
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          if (typeof window.tinymce !== "undefined") {
            const tinyEditor = window.tinymce.get(this.editorId);
            if (tinyEditor) {
              return tinyEditor.getContent() || "";
            }
          }

          console.warn("[EditorAdapter] TinyMCE not initialized properly");
          return "";

        case "textarea":
        default:
          // Textarea o elemento HTML genérico
          const editorElement = document.getElementById(this.editorId);
          if (editorElement) {
            if (typeof editorElement.value !== "undefined") {
              return editorElement.value || "";
            } else if (typeof editorElement.innerHTML !== "undefined") {
              return editorElement.innerHTML || "";
            }
          }
          return "";
      }
    } catch (error) {
      console.error("[EditorAdapter] Error getting editor content:", error);
      return "";
    }
  }

  /**
   * Establece el contenido del editor
   * @param {string} content - Contenido a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  setContent(content) {
    if (!content && content !== "") {
      console.warn("[EditorAdapter] Attempt to set null/undefined content");
      return false;
    }

    try {
      const editorType = this.editorType.toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE - usar adaptador específico si está disponible
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          if (typeof window.tinymce !== "undefined") {
            const tinyEditor = window.tinymce.get(this.editorId);
            if (tinyEditor) {
              tinyEditor.setContent(content);
              tinyEditor.undoManager.add();

              if (this.options.debug) {
                console.log("[EditorAdapter] Content set in TinyMCE");
              }

              return true;
            }
          }

          console.warn("[EditorAdapter] TinyMCE not initialized properly");
          return false;

        case "textarea":
        default:
          // Textarea o elemento HTML genérico
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
      console.error("[EditorAdapter] Error setting editor content:", error);
      return false;
    }
  }

  /**
   * Actualiza el tipo de editor
   * @param {string} type - Nuevo tipo de editor
   */
  setEditorType(type) {
    if (!type) return;

    const oldType = this.editorType;
    this.editorType = type.toLowerCase();

    if (this.options.debug) {
      console.log("[EditorAdapter] Editor type updated:", {
        from: oldType,
        to: this.editorType,
      });
    }

    // Reinicializar adaptador específico si el tipo cambió
    if (oldType !== this.editorType) {
      this.initSpecificAdapter();
    }
  }

  /**
   * Verifica si el editor tiene contenido
   * @returns {boolean} true si el editor tiene contenido, false en caso contrario
   */
  hasContent() {
    const content = this.getContent();
    return content !== null && content !== undefined && content.trim() !== "";
  }

  /**
   * Inserta contenido en la posición actual del cursor (solo disponible en algunos editores)
   * @param {string} content - Contenido a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  insertContent(content) {
    if (!content) {
      console.warn("[EditorAdapter] Attempt to insert null/undefined content");
      return false;
    }

    try {
      const editorType = this.editorType.toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE - usar adaptador específico si está disponible
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.insertContent(content);
          }

          // Fallback: intentar insertar contenido directamente
          if (typeof window.tinymce !== "undefined") {
            const tinyEditor = window.tinymce.get(this.editorId);
            if (tinyEditor) {
              tinyEditor.execCommand("mceInsertContent", false, content);
              tinyEditor.undoManager.add();
              return true;
            }
          }

          return false;

        // Se pueden agregar otros editores que soporten inserción de contenido

        case "textarea":
        default:
          // Para textareas, simplemente agregamos al final (no hay cursor real)
          const editorElement = document.getElementById(this.editorId);
          if (editorElement) {
            if (typeof editorElement.value !== "undefined") {
              editorElement.value += content;
              return true;
            } else if (typeof editorElement.innerHTML !== "undefined") {
              editorElement.innerHTML += content;
              return true;
            }
          }
          return false;
      }
    } catch (error) {
      console.error("[EditorAdapter] Error inserting content:", error);
      return false;
    }
  }

  /**
   * Obtiene la selección actual en el editor
   * @returns {string} Texto seleccionado o cadena vacía si no hay selección
   */
  getSelection() {
    try {
      const editorType = this.editorType.toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE
          if (typeof window.tinymce !== "undefined") {
            const tinyEditor = window.tinymce.get(this.editorId);
            if (tinyEditor) {
              return tinyEditor.selection.getContent() || "";
            }
          }
          return "";

        case "textarea":
        default:
          // Textarea básico
          const editorElement = document.getElementById(this.editorId);
          if (
            editorElement &&
            typeof editorElement.selectionStart !== "undefined"
          ) {
            return (
              editorElement.value.substring(
                editorElement.selectionStart,
                editorElement.selectionEnd
              ) || ""
            );
          }
          return "";
      }
    } catch (error) {
      console.error("[EditorAdapter] Error getting selection:", error);
      return "";
    }
  }

  /**
   * Reemplaza la selección actual con el contenido proporcionado
   * @param {string} content - Contenido para reemplazar la selección
   * @returns {boolean} true si se reemplazó correctamente, false en caso contrario
   */
  replaceSelection(content) {
    if (!content && content !== "") {
      console.warn(
        "[EditorAdapter] Attempt to replace selection with null/undefined content"
      );
      return false;
    }

    try {
      const editorType = this.editorType.toLowerCase();

      switch (editorType) {
        case "tinymce":
          // TinyMCE
          if (typeof window.tinymce !== "undefined") {
            const tinyEditor = window.tinymce.get(this.editorId);
            if (tinyEditor) {
              tinyEditor.selection.setContent(content);
              tinyEditor.undoManager.add();
              return true;
            }
          }
          return false;

        case "textarea":
        default:
          // Textarea básico
          const editorElement = document.getElementById(this.editorId);
          if (
            editorElement &&
            typeof editorElement.selectionStart !== "undefined"
          ) {
            const start = editorElement.selectionStart;
            const end = editorElement.selectionEnd;

            editorElement.value =
              editorElement.value.substring(0, start) +
              content +
              editorElement.value.substring(end);

            // Mover el cursor al final del contenido insertado
            editorElement.selectionStart = editorElement.selectionEnd =
              start + content.length;

            return true;
          }
          return false;
      }
    } catch (error) {
      console.error("[EditorAdapter] Error replacing selection:", error);
      return false;
    }
  }
}
