// src/utils/quill-adapter.js
/**
 * Adaptador especializado para la integración con Quill Editor
 * Proporciona métodos para la interacción entre AITextEnhancer y Quill
 */
export class QuillAdapter {
  /**
   * Crea un nuevo adaptador para Quill
   * @param {string} editorId - ID del elemento contenedor de Quill
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, options = {}) {
    this.editorId = editorId;
    this.options = {
      debug: options.debug || false,
      waitTimeout: options.waitTimeout || 2000,
      ...options,
    };

    this.editorInstance = null;
    this._initialized = false;

    // Intentar obtener la instancia de Quill (si ya está inicializada)
    this._findEditorInstance();
  }

  /**
   * Busca la instancia de Quill ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      // Verificar si hay una instancia global (enfoque común para demos)
      if (typeof window.quillInstance !== "undefined") {
        this.editorInstance = window.quillInstance;
        this._initialized = true;

        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Found editor instance from global variable`
          );
        }

        return true;
      }

      // Alternativa: Buscar por el selector de Quill y su propiedad __quill
      const editorElement = document.getElementById(this.editorId);
      if (editorElement) {
        // Intentar encontrar el editor por su ID y la propiedad __quill
        const quillContainer = editorElement;
        if (quillContainer && quillContainer.__quill) {
          this.editorInstance = quillContainer.__quill;
          this._initialized = true;

          if (this.options.debug) {
            console.log(
              `[QuillAdapter] Found editor instance from element __quill property`
            );
          }

          return true;
        }

        // Segundo intento: buscar el primer elemento con la clase ql-editor
        const editor = quillContainer.querySelector(".ql-editor");
        if (editor && editor.__quill) {
          this.editorInstance = editor.__quill;
          this._initialized = true;

          if (this.options.debug) {
            console.log(
              `[QuillAdapter] Found editor instance from ql-editor element`
            );
          }

          return true;
        }
      }

      if (this.options.debug) {
        console.warn(
          `[QuillAdapter] Quill instance not found for "${this.editorId}"`
        );
      }

      return false;
    } catch (error) {
      console.error(`[QuillAdapter] Error finding Quill instance:`, error);
      return false;
    }
  }

  /**
   * Espera a que Quill esté inicializado
   * @returns {Promise<boolean>} Promesa que se resuelve cuando el editor está listo
   */
  async waitForEditor() {
    if (this._initialized && this.editorInstance) {
      return true;
    }

    return new Promise((resolve) => {
      // Intentar encontrar la instancia inmediatamente
      if (this._findEditorInstance()) {
        resolve(true);
        return;
      }

      // Configurar un intervalo para verificar periódicamente
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this._findEditorInstance()) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }

        // Verificar si hemos excedido el tiempo de espera
        if (Date.now() - startTime > this.options.waitTimeout) {
          clearInterval(checkInterval);
          console.warn(
            `[QuillAdapter] Timeout waiting for Quill to initialize`
          );
          resolve(false);
        }
      }, 100);
    });
  }

  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    await this.waitForEditor();

    try {
      if (this.editorInstance) {
        // Quill tiene dos formas de obtener contenido:
        // 1. getContents() - Devuelve un objeto Delta con formato interno de Quill
        // 2. root.innerHTML - Devuelve el HTML del contenido

        // Para compatibilidad con otros editores, devolvemos el HTML
        const content = this.editorInstance.root.innerHTML;

        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Retrieved content (${content.length} chars)`
          );
        }

        return content;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error getting content:`, error);
    }

    return "";
  }

  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();

    try {
      if (this.editorInstance) {
        // Quill puede configurar contenido como HTML
        this.editorInstance.clipboard.dangerouslyPasteHTML(content);

        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Content set successfully (${content.length} chars)`
          );
        }

        return true;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error setting content:`, error);
    }

    return false;
  }

  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();

    try {
      if (this.editorInstance) {
        const range = this.editorInstance.getSelection();
        if (range) {
          // Si hay una selección, inserta en esa posición
          this.editorInstance.clipboard.dangerouslyPasteHTML(
            range.index,
            content,
            "user"
          );
        } else {
          // Si no hay selección, inserta al final
          const length = this.editorInstance.getLength();
          this.editorInstance.clipboard.dangerouslyPasteHTML(
            length,
            content,
            "user"
          );
        }

        if (this.options.debug) {
          console.log(`[QuillAdapter] Content inserted successfully`);
        }

        return true;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error inserting content:`, error);
    }

    return false;
  }

  /**
   * Verifica si el editor está inicializado
   * @returns {boolean} true si el editor está inicializado, false en caso contrario
   */
  isInitialized() {
    return this._initialized && this.editorInstance !== null;
  }
}

/**
 * Función de ayuda para crear un adaptador Quill
 * @param {string} editorId - ID del elemento contenedor de Quill
 * @param {Object} options - Opciones adicionales
 * @returns {QuillAdapter} Una nueva instancia del adaptador
 */
export function createQuillAdapter(editorId, options = {}) {
  return new QuillAdapter(editorId, options);
}
