// src/utils/ckeditor-adapter.js
/**
 * Adaptador especializado para la integración con CKEditor
 * Proporciona métodos para la interacción entre AITextEnhancer y CKEditor
 */
export class CKEditorAdapter {
  /**
   * Crea un nuevo adaptador para CKEditor
   * @param {string} editorId - ID del elemento contenedor de CKEditor
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

    // Intentar obtener la instancia de CKEditor (si ya está inicializada)
    this._findEditorInstance();
  }

  /**
   * Busca la instancia de CKEditor ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      // Verificar si hay una instancia global (enfoque común para demos)
      if (typeof window.ckeditorInstance !== "undefined") {
        this.editorInstance = window.ckeditorInstance;
        this._initialized = true;

        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Found editor instance from global variable`
          );
        }

        return true;
      }

      // Alternativa: Buscar el elemento y verificar si tiene la propiedad ckeditorInstance
      const editorElement = document.getElementById(this.editorId);
      if (editorElement && editorElement.ckeditorInstance) {
        this.editorInstance = editorElement.ckeditorInstance;
        this._initialized = true;

        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Found editor instance from element property`
          );
        }

        return true;
      }

      if (this.options.debug) {
        console.warn(
          `[CKEditorAdapter] CKEditor instance not found for "${this.editorId}"`
        );
      }

      return false;
    } catch (error) {
      console.error(
        `[CKEditorAdapter] Error finding CKEditor instance:`,
        error
      );
      return false;
    }
  }

  /**
   * Espera a que CKEditor esté inicializado
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
            `[CKEditorAdapter] Timeout waiting for CKEditor to initialize`
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
        const content = this.editorInstance.getData();

        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Retrieved content (${content.length} chars)`
          );
        }

        return content;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error getting content:`, error);
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
        this.editorInstance.setData(content);

        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Content set successfully (${content.length} chars)`
          );
        }

        return true;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error setting content:`, error);
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
        const viewFragment = this.editorInstance.data.processor.toView(content);
        const modelFragment = this.editorInstance.data.toModel(viewFragment);
        this.editorInstance.model.insertContent(modelFragment);

        if (this.options.debug) {
          console.log(`[CKEditorAdapter] Content inserted successfully`);
        }

        return true;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error inserting content:`, error);
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
 * Función de ayuda para crear un adaptador CKEditor
 * @param {string} editorId - ID del elemento contenedor de CKEditor
 * @param {Object} options - Opciones adicionales
 * @returns {CKEditorAdapter} Una nueva instancia del adaptador
 */
export function createCKEditorAdapter(editorId, options = {}) {
  return new CKEditorAdapter(editorId, options);
}
