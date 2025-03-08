// src/utils/froala-adapter.js
/**
 * Adaptador especializado para la integración con Froala Editor
 * Proporciona métodos para la interacción entre AITextEnhancer y Froala
 */
export class FroalaAdapter {
  /**
   * Crea un nuevo adaptador para Froala
   * @param {string} editorId - ID del elemento contenedor de Froala
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

    // Intentar obtener la instancia de Froala (si ya está inicializada)
    this._findEditorInstance();
  }

  /**
   * Busca la instancia de Froala ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      // Verificar si hay una instancia global (enfoque común para demos)
      if (typeof window.froalaInstance !== "undefined") {
        this.editorInstance = window.froalaInstance;
        this._initialized = true;

        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Found editor instance from global variable`
          );
        }

        return true;
      }

      // Verificar si el elemento tiene la instancia de Froala
      const editorElement = document.getElementById(this.editorId);
      if (editorElement && editorElement.froalaEditor) {
        this.editorInstance = editorElement.froalaEditor;
        this._initialized = true;

        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Found editor instance from element property`
          );
        }

        return true;
      }

      // Buscar el contenedor de Froala con la clase fr-box
      const froalaContainer = document.querySelector(
        `.fr-box[id^="${this.editorId}"]`
      );
      if (froalaContainer) {
        // Encontrar la instancia de editor dentro del contenedor
        const editorElement = froalaContainer.querySelector(
          "[contenteditable=true]"
        );
        if (
          editorElement &&
          editorElement.parentNode.querySelector(".fr-element")
        ) {
          const instanceKey = Object.keys(window).find(
            (key) =>
              key.startsWith("FE_") &&
              window[key] &&
              typeof window[key] === "object" &&
              window[key].$
          );

          if (instanceKey) {
            this.editorInstance = window[instanceKey];
            this._initialized = true;

            if (this.options.debug) {
              console.log(
                `[FroalaAdapter] Found editor instance from global FE key`
              );
            }

            return true;
          }
        }
      }

      if (this.options.debug) {
        console.warn(
          `[FroalaAdapter] Froala instance not found for "${this.editorId}"`
        );
      }

      return false;
    } catch (error) {
      console.error(`[FroalaAdapter] Error finding Froala instance:`, error);
      return false;
    }
  }

  /**
   * Espera a que Froala esté inicializado
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
            `[FroalaAdapter] Timeout waiting for Froala to initialize`
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
        // En Froala, el método .html() se usa para obtener el contenido
        const content = this.editorInstance.html.get();

        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Retrieved content (${content?.length || 0} chars)`
          );
        }

        return content || "";
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error getting content:`, error);
    }

    // Fallback: intentar obtener el HTML directamente del elemento editable
    try {
      const element = document.querySelector(
        `#${this.editorId} div.fr-element`
      );
      if (element) {
        return element.innerHTML || "";
      }
    } catch (e) {
      console.error(`[FroalaAdapter] Error in fallback content retrieval:`, e);
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
        // En Froala, el método .html.set() se usa para establecer el contenido
        this.editorInstance.html.set(content);

        // Asegurarse de que el editor esté enfocado y triggerea un evento change
        this.editorInstance.events.trigger("contentChanged");

        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Content set successfully (${content.length} chars)`
          );
        }

        return true;
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error setting content:`, error);
    }

    // Fallback: intentar establecer el HTML directamente en el elemento editable
    try {
      const element = document.querySelector(
        `#${this.editorId} div.fr-element`
      );
      if (element) {
        element.innerHTML = content;
        return true;
      }
    } catch (e) {
      console.error(`[FroalaAdapter] Error in fallback content setting:`, e);
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
        // En Froala, insertHTML inserta contenido en la posición del cursor
        this.editorInstance.html.insert(content, true);

        // Trigger para actualizar UI y historial
        this.editorInstance.events.trigger("contentChanged");

        if (this.options.debug) {
          console.log(`[FroalaAdapter] Content inserted successfully`);
        }

        return true;
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error inserting content:`, error);
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
 * Función de ayuda para crear un adaptador Froala
 * @param {string} editorId - ID del elemento contenedor de Froala
 * @param {Object} options - Opciones adicionales
 * @returns {FroalaAdapter} Una nueva instancia del adaptador
 */
export function createFroalaAdapter(editorId, options = {}) {
  return new FroalaAdapter(editorId, options);
}
