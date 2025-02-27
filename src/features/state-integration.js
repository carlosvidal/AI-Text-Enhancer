// src/features/state-integration.js
import { createStateManager } from "../utils/state-utils.js";

export const stateManagementMixin = {
  initializeStateManager() {
    this.stateManager = createStateManager(this);

    // Configuración de escuchadores para eventos de estado
    this.addEventListener("stateChange", this.handleStateChange.bind(this));
    this.addEventListener(
      "stateBatchChange",
      this.handleStateBatchChange.bind(this)
    );
  },

  handleStateChange(event) {
    const { property, oldValue, newValue } = event.detail;
    console.log(
      `[StateManager] Property '${property}' changed:`,
      oldValue,
      "->",
      newValue
    );

    // Manejar cambios específicos de propiedades
    switch (property) {
      case "productImage":
        this.handleProductImageChange(oldValue, newValue);
        break;
      case "enhancedText":
        this.handleEnhancedTextChange(oldValue, newValue);
        break;
      // Agregar más manejadores según sea necesario
    }
  },

  handleStateBatchChange(event) {
    console.log("[StateManager] Batch state change:", event.detail.changes);

    // Detectar tipos de cambios en el lote
    const changedProps = event.detail.changes.map((c) => c.property);

    if (changedProps.includes("productImage")) {
      const change = event.detail.changes.find(
        (c) => c.property === "productImage"
      );
      this.handleProductImageChange(change.oldValue, change.newValue);
    }

    // Manejar más cambios según sea necesario
  },

  handleProductImageChange(oldImage, newImage) {
    // Actualizar la interfaz de usuario basada en la imagen
    if (newImage) {
      console.log("[StateManager] New product image set:", newImage.name);

      // Si responseHistory existe, actualiza la vista
      if (this.responseHistory) {
        const lastQuestion = this.responseHistory.responses.findLast(
          (response) => response.action === "chat-question"
        );

        if (lastQuestion) {
          // Agregar la imagen a la última pregunta si existe
          this.responseHistory.render();
        }
      }
    } else if (oldImage) {
      console.log("[StateManager] Product image removed");
    }
  },

  handleEnhancedTextChange(oldText, newText) {
    // Manejar cambios en el texto mejorado
    console.log("[StateManager] Enhanced text updated");
  },

  // Método para solicitar una actualización de la interfaz de usuario
  requestUpdate(target = null) {
    console.log(
      "[StateManager] Update requested for:",
      target || "entire component"
    );

    if (!target) {
      // Actualización general del componente
      if (this.responseHistory) {
        this.responseHistory.render();
      }
      this.updateVisibleTools();
      return;
    }

    // Actualizaciones específicas de componentes
    switch (target) {
      case "responseHistory":
        if (this.responseHistory) {
          this.responseHistory.render();
        }
        break;
      case "toolbar":
        this.updateVisibleTools();
        break;
      // Otros casos según sea necesario
    }
  },
};
