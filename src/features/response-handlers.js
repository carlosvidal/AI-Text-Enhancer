export const responseHandlerMixin = {
  /**
   * Maneja el evento responseCopy para copiar el contenido al portapapeles
   * @param {CustomEvent} event - El evento con el ID de la respuesta
   */
  handleResponseCopy(event) {
    console.log("[ResponseHandlers] Copy event received:", event.detail);
    const { responseId } = event.detail;

    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in copy event");
      return;
    }

    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    navigator.clipboard
      .writeText(response.content)
      .then(() => {
        console.log("[ResponseHandlers] Content copied to clipboard");

        // Mostrar notificación al usuario si está disponible
        if (this.notificationManager) {
          this.notificationManager.success("Content copied to clipboard", 2000);
        }
      })
      .catch((err) => {
        console.error("[ResponseHandlers] Copy failed:", err);

        // Mostrar error si hay un problema
        if (this.notificationManager) {
          this.notificationManager.error("Failed to copy to clipboard");
        }
      });
  },

  /**
   * Maneja el evento responseUse para utilizar una respuesta generada
   * Versión mejorada con mejor manejo de errores y diagnóstico
   * @param {CustomEvent} event - El evento con la respuesta
   */
  handleResponseUse(event) {
    try {
      console.log("[ResponseHandlers] Use event received:", event.detail);

      // Verificar si el evento tiene los datos necesarios
      if (!event.detail || !event.detail.responseId) {
        console.warn("[ResponseHandlers] Invalid event data:", event.detail);
        throw new Error("Invalid response data");
      }

      const { responseId } = event.detail;

      // Obtener la respuesta del historial
      if (!this.responseHistory) {
        console.error("[ResponseHandlers] No response history available");
        throw new Error("Response history not available");
      }

      const response = this.responseHistory.getResponse(responseId);

      if (!response) {
        console.warn(
          "[ResponseHandlers] No response found for ID:",
          responseId
        );
        throw new Error("Response not found");
      }

      // Verificar que la respuesta tenga contenido
      if (
        !response.content ||
        typeof response.content !== "string" ||
        response.content.trim() === ""
      ) {
        console.warn(
          "[ResponseHandlers] Empty content in response:",
          responseId
        );
        throw new Error("Response content is empty");
      }

      console.log("[ResponseHandlers] Found response:", {
        id: responseId,
        action: response.action,
        contentLength: response.content.length,
      });

      // Intentar aplicar el contenido al editor
      if (this.editorAdapter) {
        console.log("[ResponseHandlers] Applying content to editor");

        // Usar el método setContent del adaptador del editor
        const success = this.editorAdapter.setContent(response.content);

        if (success) {
          console.log("[ResponseHandlers] Response content applied to editor");

          // Disparar evento ai-content-generated para plugins
          this.dispatchEvent(
            new CustomEvent("ai-content-generated", {
              detail: { content: response.content },
              bubbles: true,
              composed: true,
            })
          );

          // Cerrar el modal
          const modal = this.shadowRoot.querySelector(".modal");
          if (modal) {
            modal.classList.remove("open");
          }

          // Mostrar notificación
          if (this.notificationManager) {
            this.notificationManager.success("Content applied successfully");
          }

          return true;
        } else {
          console.error("[ResponseHandlers] Failed to apply content to editor");
          throw new Error("Failed to apply content to editor");
        }
      } else {
        console.error("[ResponseHandlers] No editor adapter available");
        throw new Error("No editor connected");
      }
    } catch (error) {
      console.error("[ResponseHandlers] Error in handleResponseUse:", error);

      if (this.notificationManager) {
        this.notificationManager.error(`Error: ${error.message}`);
      }

      return false;
    }
  },

  /**
   * Maneja el evento responseRetry para volver a ejecutar una acción
   * @param {CustomEvent} event - El evento con la información de la acción a reintentar
   */
  handleResponseRetry(event) {
    console.log("[ResponseHandlers] Retry event received:", event.detail);
    const { responseId, action } = event.detail;

    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in retry event");
      return;
    }

    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    console.log("[ResponseHandlers] Retrying action:", response.action);

    // Crear un evento sintético con la estructura necesaria
    const syntheticEvent = {
      detail: {
        action: action || response.action,
        responseId: responseId,
        content: response.content,
      },
    };

    // Llamar al método handleToolAction con el evento sintético
    this.handleToolAction(syntheticEvent);
  },

  /**
   * Maneja el evento responseEdit para editar una respuesta
   * @param {CustomEvent} event - El evento con el ID de la respuesta a editar
   */
  handleResponseEdit(event) {
    console.log("[ResponseHandlers] Edit event received:", event.detail);
    const { responseId } = event.detail;

    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in edit event");
      return;
    }

    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    // La implementación de la edición dependerá de tu diseño UI
    // Aquí podría mostrarse un modal, o enviar el contenido a un área de edición, etc.
    console.log("[ResponseHandlers] Edit functionality not fully implemented");

    // Mostrar notificación informativa
    if (this.notificationManager) {
      this.notificationManager.info("Edit functionality coming soon");
    }
  },
};
