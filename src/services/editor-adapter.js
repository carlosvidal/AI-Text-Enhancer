// editor-adapter.js - Actualizado con soporte para Froala

// Importar los adaptadores específicos
import { createTinyMCEAdapter } from "../utils/tinymce-adapter.js";
import { createCKEditorAdapter } from "../utils/ckeditor-adapter.js";
import { createQuillAdapter } from "../utils/quill-adapter.js";
import { createFroalaAdapter } from "../utils/froala-adapter.js";

/**
 * Clase adaptadora para diferentes tipos de editores
 * Proporciona una interfaz unificada para trabajar con distintos editores
 */
export class EditorAdapter {
  /**
   * Constructor del adaptador de editor
   * @param {string} editorId - ID del elemento editor
   * @param {string} editorType - Tipo de editor ('textarea', 'tinymce', 'ckeditor', 'froala', etc.)
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

      case "ckeditor":
        try {
          this.specificAdapters.ckeditor = createCKEditorAdapter(
            this.editorId,
            {
              debug: this.options.debug,
            }
          );

          if (this.options.debug) {
            console.log("[EditorAdapter] CKEditor adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize CKEditor adapter:",
            error
          );
        }
        break;

      case "quill":
        try {
          this.specificAdapters.quill = createQuillAdapter(this.editorId, {
            debug: this.options.debug,
          });

          if (this.options.debug) {
            console.log("[EditorAdapter] Quill adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize Quill adapter:",
            error
          );
        }
        break;

      case "froala":
        try {
          this.specificAdapters.froala = createFroalaAdapter(this.editorId, {
            debug: this.options.debug,
          });

          if (this.options.debug) {
            console.log("[EditorAdapter] Froala adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize Froala adapter:",
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

        case "ckeditor":
          // CKEditor - usar adaptador específico si está disponible
          if (this.specificAdapters.ckeditor) {
            return this.specificAdapters.ckeditor.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          if (typeof window.ckeditorInstance !== "undefined") {
            return window.ckeditorInstance.getData() || "";
          }

          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return "";

        case "quill":
          // Quill - usar adaptador específico si está disponible
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          if (typeof window.quillInstance !== "undefined") {
            return window.quillInstance.root.innerHTML || "";
          }

          // Otro intento: buscar el elemento editor
          const quillElement = document.getElementById(this.editorId);
          if (quillElement) {
            const editor = quillElement.querySelector(".ql-editor");
            if (editor) {
              return editor.innerHTML || "";
            }
          }

          console.warn("[EditorAdapter] Quill not initialized properly");
          return "";

        case "froala":
          // Froala - usar adaptador específico si está disponible
          if (this.specificAdapters.froala) {
            return this.specificAdapters.froala.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          if (typeof window.froalaInstance !== "undefined") {
            return window.froalaInstance.html.get() || "";
          }

          // Otro intento: buscar el elemento editable de Froala
          const froalaElement = document.querySelector(
            `#${this.editorId} div.fr-element`
          );
          if (froalaElement) {
            return froalaElement.innerHTML || "";
          }

          console.warn("[EditorAdapter] Froala not initialized properly");
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

        case "ckeditor":
          // CKEditor - usar adaptador específico si está disponible
          if (this.specificAdapters.ckeditor) {
            return this.specificAdapters.ckeditor.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          if (typeof window.ckeditorInstance !== "undefined") {
            window.ckeditorInstance.setData(content);

            if (this.options.debug) {
              console.log("[EditorAdapter] Content set in CKEditor");
            }

            return true;
          }

          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return false;

        case "quill":
          // Quill - usar adaptador específico si está disponible
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          if (typeof window.quillInstance !== "undefined") {
            window.quillInstance.clipboard.dangerouslyPasteHTML(content);
            return true;
          }

          // Otro intento: buscar el elemento editor
          const quillElem = document.getElementById(this.editorId);
          if (quillElem && quillElem.__quill) {
            quillElem.__quill.clipboard.dangerouslyPasteHTML(content);
            return true;
          }

          console.warn("[EditorAdapter] Quill not initialized properly");
          return false;

        case "froala":
          // Froala - usar adaptador específico si está disponible
          if (this.specificAdapters.froala) {
            return this.specificAdapters.froala.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          if (typeof window.froalaInstance !== "undefined") {
            window.froalaInstance.html.set(content);
            window.froalaInstance.events.trigger("contentChanged");
            return true;
          }

          // Otro intento: buscar el elemento editable de Froala
          const froalaElement = document.querySelector(
            `#${this.editorId} div.fr-element`
          );
          if (froalaElement) {
            froalaElement.innerHTML = content;
            return true;
          }

          console.warn("[EditorAdapter] Froala not initialized properly");
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

        case "ckeditor":
          // CKEditor - usar adaptador específico si está disponible
          if (this.specificAdapters.ckeditor) {
            return this.specificAdapters.ckeditor.insertContent(content);
          }

          // Fallback básico: reemplazar todo el contenido
          if (typeof window.ckeditorInstance !== "undefined") {
            window.ckeditorInstance.setData(content);
            return true;
          }

          return false;

        case "quill":
          // Quill - usar adaptador específico si está disponible
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.insertContent(content);
          }

          // Fallback: intentar insertar contenido directamente
          if (typeof window.quillInstance !== "undefined") {
            const range = window.quillInstance.getSelection();
            if (range) {
              window.quillInstance.clipboard.dangerouslyPasteHTML(
                range.index,
                content,
                "user"
              );
            } else {
              const length = window.quillInstance.getLength();
              window.quillInstance.clipboard.dangerouslyPasteHTML(
                length,
                content,
                "user"
              );
            }
            return true;
          }

          return false;

        case "froala":
          // Froala - usar adaptador específico si está disponible
          if (this.specificAdapters.froala) {
            return this.specificAdapters.froala.insertContent(content);
          }

          // Fallback: intentar insertar contenido directamente
          if (typeof window.froalaInstance !== "undefined") {
            window.froalaInstance.html.insert(content, true);
            window.froalaInstance.events.trigger("contentChanged");
            return true;
          }

          return false;

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

        case "ckeditor":
          // CKEditor - no hay un método simple para obtener la selección actual
          return "";

        case "froala":
          // Froala
          if (typeof window.froalaInstance !== "undefined") {
            return window.froalaInstance.selection.text() || "";
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

        case "ckeditor":
          // CKEditor - no hay un método simple para reemplazar la selección
          // Como fallback, insertamos el contenido completo
          return this.setContent(content);

        case "froala":
          // Froala
          if (typeof window.froalaInstance !== "undefined") {
            window.froalaInstance.selection.replace(content);
            window.froalaInstance.events.trigger("contentChanged");
            return true;
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
