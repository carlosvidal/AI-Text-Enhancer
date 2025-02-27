// src/utils/state-utils.js

/**
 * Utilidad para gestionar actualizaciones de estado y renderizado en componentes web
 *
 * @param {HTMLElement} component - El componente web que se va a ampliar con funcionalidades de estado
 * @returns {Object} - Métodos para manipular el estado del componente
 */
export const createStateManager = (component) => {
  // Estado interno privado
  const _state = {};

  return {
    /**
     * Actualiza una propiedad de estado y opcionalmente vuelve a renderizar partes del componente
     *
     * @param {string} propName - Nombre de la propiedad a actualizar
     * @param {any} value - Nuevo valor
     * @param {Object} options - Opciones de actualización
     * @param {Boolean} options.rerender - Si se debe volver a renderizar después de la actualización
     * @param {String} options.targetSelector - Selector CSS del elemento que debería actualizarse
     */
    updateState(propName, value, options = {}) {
      const oldValue = _state[propName];
      _state[propName] = value;

      // Disparar evento de cambio de propiedad
      component.dispatchEvent(
        new CustomEvent("stateChange", {
          detail: { property: propName, oldValue, newValue: value },
          bubbles: false,
        })
      );

      // Opcionalmente re-renderizar
      if (options.rerender && component.shadowRoot) {
        if (options.targetSelector) {
          // Renderizado selectivo
          const target = component.shadowRoot.querySelector(
            options.targetSelector
          );
          if (target && typeof component.renderPart === "function") {
            component.renderPart(target, propName);
          }
        } else if (typeof component.render === "function") {
          // Renderizado completo
          component.render();
        }
      }

      return value;
    },

    /**
     * Obtiene el valor actual de una propiedad de estado
     *
     * @param {string} propName - Nombre de la propiedad
     * @param {any} defaultValue - Valor por defecto si la propiedad no existe
     * @returns {any} - Valor actual de la propiedad
     */
    getState(propName, defaultValue = null) {
      return propName in _state ? _state[propName] : defaultValue;
    },

    /**
     * Devuelve una copia de todo el estado actual
     *
     * @returns {Object} - Copia del estado actual
     */
    getAllState() {
      return { ..._state };
    },

    /**
     * Actualiza múltiples propiedades de estado a la vez
     *
     * @param {Object} stateUpdates - Objeto con las actualizaciones {propiedad: nuevoValor}
     * @param {Object} options - Opciones de actualización (igual que updateState)
     */
    batchUpdate(stateUpdates, options = {}) {
      const changedProps = [];

      for (const [propName, value] of Object.entries(stateUpdates)) {
        const oldValue = _state[propName];
        if (oldValue !== value) {
          _state[propName] = value;
          changedProps.push({ property: propName, oldValue, newValue: value });
        }
      }

      // Solo disparar evento si hubo cambios
      if (changedProps.length > 0) {
        component.dispatchEvent(
          new CustomEvent("stateBatchChange", {
            detail: { changes: changedProps },
            bubbles: false,
          })
        );

        // Renderizado tras actualización por lotes
        if (options.rerender && component.shadowRoot) {
          if (
            options.targetSelector &&
            typeof component.renderPart === "function"
          ) {
            const target = component.shadowRoot.querySelector(
              options.targetSelector
            );
            if (target) {
              component.renderPart(
                target,
                changedProps.map((c) => c.property)
              );
            }
          } else if (typeof component.render === "function") {
            component.render();
          }
        }
      }

      return changedProps.length > 0;
    },
  };
};
