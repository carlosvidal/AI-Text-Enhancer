// src/utils/tinymce-adapter.js
/**
 * Adaptador especializado para la integración con TinyMCE
 * Proporciona métodos mejorados para la interacción entre AITextEnhancer y TinyMCE
 */
export class TinyMCEAdapter {
  /**
   * Crea un nuevo adaptador para TinyMCE
   * @param {string} editorId - ID del elemento contenedor de TinyMCE
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

    // Intentar obtener la instancia de TinyMCE (si ya está inicializada)
    this._findEditorInstance();
  }

  /**
   * Busca la instancia de TinyMCE ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      // Verificar si tinymce existe en el contexto global
      if (typeof window.tinymce !== "undefined") {
        // Intentar obtener el editor por ID
        const instance = window.tinymce.get(this.editorId);

        if (instance) {
          this.editorInstance = instance;
          this._initialized = true;

          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Found editor instance for "${this.editorId}"`,
              instance
            );
          }

          return true;
        }
      }

      if (this.options.debug) {
        console.warn(
          `[TinyMCEAdapter] TinyMCE instance not found for "${this.editorId}"`
        );
      }

      return false;
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error finding TinyMCE instance:`, error);
      return false;
    }
  }

  /**
   * Espera a que TinyMCE esté inicializado
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
            `[TinyMCEAdapter] Timeout waiting for TinyMCE to initialize`
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
        const content = this.editorInstance.getContent();

        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Retrieved content (${content.length} chars)`
          );
        }

        return content;
      }
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error getting content:`, error);
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
        this.editorInstance.setContent(content);

        // Agregar la acción al historial de deshacer
        this.editorInstance.undoManager.add();

        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Content set successfully (${content.length} chars)`
          );
        }

        return true;
      }
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error setting content:`, error);
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
        this.editorInstance.execCommand("mceInsertContent", false, content);
        this.editorInstance.undoManager.add();

        if (this.options.debug) {
          console.log(`[TinyMCEAdapter] Content inserted successfully`);
        }

        return true;
      }
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error inserting content:`, error);
    }

    return false;
  }

  /**
   * Registra un plugin personalizado en TinyMCE
   * @param {Object} plugin - El plugin a registrar
   * @param {Object} options - Opciones para el registro del plugin
   * @returns {boolean} true si se registró correctamente, false en caso contrario
   */
  registerPlugin(plugin, options = {}) {
    try {
      if (typeof window.tinymce === "undefined") {
        console.error(
          `[TinyMCEAdapter] TinyMCE not available for plugin registration`
        );
        return false;
      }

      if (this.options.debug) {
        console.log(`[TinyMCEAdapter] Registering plugin:`, plugin);
      }

      // Implementación simplificada - esto debería expandirse según las necesidades
      // El registro real del plugin depende de la estructura específica de TinyMCE

      return true;
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error registering plugin:`, error);
      return false;
    }
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
 * Función de ayuda para crear un adaptador TinyMCE
 * @param {string} editorId - ID del elemento contenedor de TinyMCE
 * @param {Object} options - Opciones adicionales
 * @returns {TinyMCEAdapter} Una nueva instancia del adaptador
 */
export function createTinyMCEAdapter(editorId, options = {}) {
  return new TinyMCEAdapter(editorId, options);
}
