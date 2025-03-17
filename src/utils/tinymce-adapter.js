// src/utils/tinymce-adapter.js
/**
 * Adaptador especializado para la integración con TinyMCE
 * Mejorado para soportar múltiples versiones (v3, v4, v5, v6)
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
      useGlobalReference: options.useGlobalReference !== false, // Por defecto usa referencias globales
      ...options,
    };

    this.editorInstance = null;
    this._initialized = false;
    this.tmceVersion = null; // Versión de TinyMCE detectada

    // Intentar obtener la instancia de TinyMCE (si ya está inicializada)
    this._findEditorInstance();
  }

  /**
   * Detecta la versión de TinyMCE
   * @private
   * @returns {number|null} Versión principal de TinyMCE (3, 4, 5 o 6) o null si no se puede detectar
   */
  _detectTinyMCEVersion() {
    try {
      if (typeof window.tinymce === "undefined") {
        return null;
      }

      // Intentar detectar por la versión
      if (window.tinymce.majorVersion) {
        return parseInt(window.tinymce.majorVersion, 10);
      }

      // Alternativa: detectar por características específicas de cada versión
      if (typeof window.tinymce.createEditor === "function") {
        return 6; // Característica de v6
      } else if (typeof window.tinymce.dom?.TreeWalker === "function") {
        return 5; // Característica de v5
      } else if (typeof window.tinymce.dom?.EventUtils === "function") {
        return 4; // Característica de v4
      } else if (typeof window.tinymce.dom?.Event === "function") {
        return 3; // Característica de v3
      }

      // Si no podemos detectar específicamente, asumimos v4 como fallback común
      return 4;
    } catch (error) {
      console.error("[TinyMCEAdapter] Error detecting TinyMCE version:", error);
      return null;
    }
  }

  /**
   * Busca la instancia de TinyMCE ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      // Detectar versión de TinyMCE
      this.tmceVersion = this._detectTinyMCEVersion();

      if (this.options.debug) {
        console.log(
          `[TinyMCEAdapter] Detected TinyMCE version: ${
            this.tmceVersion || "unknown"
          }`
        );
      }

      // Verificar si tinymce existe en el contexto global
      if (typeof window.tinymce !== "undefined") {
        // Obtener la instancia del editor
        let instance = null;

        // Diferentes métodos según la versión
        if (this.tmceVersion >= 3) {
          instance = window.tinymce.get(this.editorId);
        }

        // Verificar opciones adicionales de búsqueda
        if (!instance && this.options.useGlobalReference) {
          // Verificar si hay una instancia global para este ID específico
          const globalInstanceKey = `tinyMCE_${this.editorId}`;
          if (window[globalInstanceKey]) {
            instance = window[globalInstanceKey];
          }

          // Verificar si hay una instancia marcada específicamente
          if (window.tinyMCEInstance) {
            instance = window.tinyMCEInstance;
          }
        }

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
   * Verifica si el método existe en la instancia del editor y es una función
   * @param {string} methodName - Nombre del método a verificar
   * @returns {boolean} true si el método existe y es una función
   */
  _hasMethod(methodName) {
    return (
      this.editorInstance &&
      typeof this.editorInstance[methodName] === "function"
    );
  }

  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    await this.waitForEditor();

    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }

      // Estrategia 1: Usar el método getContent directamente (v4+ principalmente)
      if (this._hasMethod("getContent")) {
        try {
          // Algunos editores necesitan especificar el formato
          const content = this.editorInstance.getContent({ format: "html" });

          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Retrieved content using getContent() (${
                content?.length || 0
              } chars)`
            );
          }

          return content || "";
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using getContent():", err);
          // Continuar con otras estrategias
        }
      }

      // Estrategia 2: Acceder al contenido mediante el DOM (v3-v4 fallback)
      if (this.editorInstance.getBody) {
        try {
          const body = this.editorInstance.getBody();
          if (body) {
            const content = body.innerHTML;

            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Retrieved content from body (${
                  content?.length || 0
                } chars)`
              );
            }

            return content || "";
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error accessing body content:", err);
        }
      }

      // Estrategia 3: Usar el área de contenido (v3 principalmente)
      if (this.editorInstance.contentDocument) {
        try {
          const doc = this.editorInstance.contentDocument;
          if (doc && doc.body) {
            const content = doc.body.innerHTML;

            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Retrieved content from contentDocument (${
                  content?.length || 0
                } chars)`
              );
            }

            return content || "";
          }
        } catch (err) {
          console.warn(
            "[TinyMCEAdapter] Error accessing contentDocument:",
            err
          );
        }
      }

      // Estrategia 4: Intentar con el original textarea
      const textareaElement = document.getElementById(this.editorId);
      if (textareaElement && textareaElement.value) {
        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Retrieved content from textarea (${
              textareaElement.value?.length || 0
            } chars)`
          );
        }
        return textareaElement.value;
      }

      // Si llegamos aquí, no pudimos obtener el contenido
      console.error("[TinyMCEAdapter] All content retrieval methods failed");
      return "";
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error getting content:`, error);
      return "";
    }
  }

  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();

    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }

      // Estrategia 1: Usar el método setContent directamente (v4+ principalmente)
      if (this._hasMethod("setContent")) {
        try {
          this.editorInstance.setContent(content);

          // Agregar la acción al historial de deshacer si está disponible
          if (
            this._hasMethod("undoManager") &&
            this.editorInstance.undoManager &&
            this._hasMethod("undoManager.add")
          ) {
            this.editorInstance.undoManager.add();
          }

          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Content set successfully using setContent (${
                content?.length || 0
              } chars)`
            );
          }

          return true;
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using setContent():", err);
          // Continuar con otras estrategias
        }
      }

      // Estrategia 2: Establecer el contenido mediante el DOM (v3-v4 fallback)
      if (this.editorInstance.getBody) {
        try {
          const body = this.editorInstance.getBody();
          if (body) {
            body.innerHTML = content;

            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content set successfully using body (${
                  content?.length || 0
                } chars)`
              );
            }

            return true;
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error setting body content:", err);
        }
      }

      // Estrategia 3: Usar el área de contenido (v3 principalmente)
      if (this.editorInstance.contentDocument) {
        try {
          const doc = this.editorInstance.contentDocument;
          if (doc && doc.body) {
            doc.body.innerHTML = content;

            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content set successfully using contentDocument (${
                  content?.length || 0
                } chars)`
              );
            }

            return true;
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error setting contentDocument:", err);
        }
      }

      // Estrategia 4: Intentar con el original textarea
      const textareaElement = document.getElementById(this.editorId);
      if (textareaElement) {
        textareaElement.value = content;

        // Tratar de actualizar el editor desde el textarea
        if (this._hasMethod("load")) {
          this.editorInstance.load();
        }

        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Content set using textarea (${
              content?.length || 0
            } chars)`
          );
        }

        return true;
      }

      // Si llegamos aquí, no pudimos establecer el contenido
      console.error("[TinyMCEAdapter] All content setting methods failed");
      return false;
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error setting content:`, error);
      return false;
    }
  }

  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();

    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }

      // Estrategia 1: Usar commandExec con mceInsertContent (v4-v6)
      if (this._hasMethod("execCommand")) {
        try {
          this.editorInstance.execCommand("mceInsertContent", false, content);

          // Tratar de registrar para deshacer si disponible
          if (
            this._hasMethod("undoManager") &&
            this.editorInstance.undoManager &&
            this._hasMethod("undoManager.add")
          ) {
            this.editorInstance.undoManager.add();
          }

          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Content inserted successfully using execCommand`
            );
          }

          return true;
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using execCommand():", err);
          // Continuar con otras estrategias
        }
      }

      // Estrategia 2: Insertar directamente en la selección (v3-v4 fallback)
      if (this._hasMethod("selection") && this.editorInstance.selection) {
        try {
          const selection = this.editorInstance.selection;

          if (this._hasMethod("selection.setContent")) {
            selection.setContent(content);

            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content inserted successfully using selection.setContent`
              );
            }

            return true;
          }
        } catch (err) {
          console.warn(
            "[TinyMCEAdapter] Error using selection.setContent():",
            err
          );
        }
      }

      // Estrategia 3: Fallback a reemplazar todo el contenido
      return await this.setContent(content);
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error inserting content:`, error);
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

  /**
   * Obtiene la versión detectada de TinyMCE
   * @returns {number|null} Versión principal de TinyMCE (3, 4, 5, 6) o null si no se detectó
   */
  getVersion() {
    return this.tmceVersion;
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
