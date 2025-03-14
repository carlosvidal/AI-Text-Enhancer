// editor-adapter.js - Actualizado con soporte para Froala

// Importar los adaptadores específicos
import { createTinyMCEAdapter } from "../utils/tinymce-adapter.js";
import { createCKEditorAdapter } from "../utils/ckeditor-adapter.js";
import { createQuillAdapter } from "../utils/quill-adapter.js";
import { createFroalaAdapter } from "../utils/froala-adapter.js";

/**
 * Clase adaptadora para diferentes tipos de editores
 * @class EditorAdapter
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
    this.editorType = editorType.toLowerCase();
    this.options = {
      debug: options.debug || false,
      ...options,
    };

    // Inicializar contenedor para adaptadores específicos
    this.specificAdapters = {};

    // Inicializar el adaptador específico según el tipo
    this._initializeSpecificAdapter();
  }

  /**
   * Inicializa el adaptador específico según el tipo de editor
   * @private
   */
  _initializeSpecificAdapter() {
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
          this.specificAdapters.ckeditor = createCKEditorAdapter(this.editorId, {
            debug: this.options.debug,
          });

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
        if (this.options.debug) {
          console.log(
            `[EditorAdapter] Using default textarea adapter for type: ${this.editorType}`
          );
        }
        break;
    }
  }

  /**
   * Obtiene el contenido del editor
   * @returns {string} Contenido del editor
   */
  getContent() {
    try {
      switch (this.editorType) {
        case "tinymce":
          // TinyMCE - usar adaptador específico si está disponible
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          if (typeof tinymce !== "undefined") {
            const editor = tinymce.get(this.editorId);
            if (editor) {
              return editor.getContent() || "";
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
          if (typeof CKEDITOR !== "undefined") {
            const editor = CKEDITOR.instances[this.editorId];
            if (editor) {
              return editor.getData() || "";
            }
          }

          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return "";

        case "quill":
          // Quill - usar adaptador específico si está disponible
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.getContent() || "";
          }

          // Fallback: intentar obtener contenido directamente
          const quillElement = document.querySelector(`#${this.editorId}`);
          if (quillElement && quillElement.__quill) {
            return quillElement.__quill.root.innerHTML || "";
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
          const element = document.getElementById(this.editorId);
          if (element) {
            if (element.tagName.toLowerCase() === "textarea") {
              return element.value || "";
            } else {
              return element.innerHTML || "";
            }
          }

          console.warn("[EditorAdapter] Element not found:", this.editorId);
          return "";
      }
    } catch (error) {
      console.error("[EditorAdapter] Error getting content:", error);
      return "";
    }
  }

  /**
   * Establece el contenido del editor
   * @param {string} content - Contenido a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  setContent(content) {
    try {
      switch (this.editorType) {
        case "tinymce":
          // TinyMCE - usar adaptador específico si está disponible
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          if (typeof tinymce !== "undefined") {
            const editor = tinymce.get(this.editorId);
            if (editor) {
              editor.setContent(content);
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
          if (typeof CKEDITOR !== "undefined") {
            const editor = CKEDITOR.instances[this.editorId];
            if (editor) {
              editor.setData(content);
              return true;
            }
          }

          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return false;

        case "quill":
          // Quill - usar adaptador específico si está disponible
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.setContent(content);
          }

          // Fallback: intentar establecer contenido directamente
          const quillElement = document.querySelector(`#${this.editorId}`);
          if (quillElement && quillElement.__quill) {
            quillElement.__quill.root.innerHTML = content;
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
          const element = document.getElementById(this.editorId);
          if (element) {
            if (element.tagName.toLowerCase() === "textarea") {
              element.value = content;
            } else {
              element.innerHTML = content;
            }
            return true;
          }

          console.warn("[EditorAdapter] Element not found:", this.editorId);
          return false;
      }
    } catch (error) {
      console.error("[EditorAdapter] Error setting content:", error);
      return false;
    }
  }
}