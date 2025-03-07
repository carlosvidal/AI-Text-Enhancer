export const responseHandlerMixin = {
  handleResponseCopy(event) {
    console.log("[ResponseHandlers] Copy event received:", event.detail);
    const { responseId } = event.detail;
    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    navigator.clipboard
      .writeText(response.content)
      .then(() => console.log("[ResponseHandlers] Content copied to clipboard"))
      .catch((err) => console.error("[ResponseHandlers] Copy failed:", err));
  },

  /**
   * Maneja el evento responseUse para utilizar una respuesta generada
   * @param {CustomEvent} event - El evento con la respuesta
   */
  handleResponseUse(event) {
    try {
      const content = event.detail?.content;

      if (!content) {
        console.warn(
          "[AITextEnhancer] No content provided in response use event"
        );
        return;
      }

      if (this.editorAdapter) {
        const success = this.editorAdapter.setContent(content);

        if (success) {
          console.log("[AITextEnhancer] Response content applied to editor");

          // Disparar evento ai-content-generated para TinyMCE y otros plugins
          this.dispatchEvent(
            new CustomEvent("ai-content-generated", {
              detail: { content },
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
        } else {
          console.error("[AITextEnhancer] Failed to apply content to editor");

          if (this.notificationManager) {
            this.notificationManager.error("Failed to apply content to editor");
          }
        }
      } else {
        console.error("[AITextEnhancer] No editor adapter available");

        if (this.notificationManager) {
          this.notificationManager.warning("No editor connected");
        }
      }
    } catch (error) {
      console.error("[AITextEnhancer] Error in handleResponseUse:", error);

      if (this.notificationManager) {
        this.notificationManager.error(`Error: ${error.message}`);
      }
    }
  },

  handleResponseRetry(event) {
    console.log("[ResponseHandlers] Retry event received:", event.detail);
    const { responseId } = event.detail;
    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }

    console.log("[ResponseHandlers] Retrying action:", response.action);
    // Create a synthetic event with the necessary detail structure
    const syntheticEvent = {
      detail: {
        action: response.action,
        responseId: responseId,
        content: response.content,
      },
    };
    this.handleToolAction(syntheticEvent);
  },
};
