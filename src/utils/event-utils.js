// src/utils/event-utils.js
export const createCustomEvent = (name, detail, options = {}) => {
  return new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: true,
    ...options,
  });
};

export const dispatchCustomEvent = (element, name, detail, options = {}) => {
  const event = createCustomEvent(name, detail, options);
  return element.dispatchEvent(event);
};

export const createEventEmitter = (element) => {
  const listeners = new Map();

  return {
    on(event, callback) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(callback);
      element.addEventListener(event, callback);
    },

    off(event, callback) {
      const callbacks = listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        element.removeEventListener(event, callback);
      }
    },

    emit(event, detail) {
      return dispatchCustomEvent(element, event, detail);
    },

    once(event, callback) {
      const onceCallback = (...args) => {
        this.off(event, onceCallback);
        callback(...args);
      };
      this.on(event, onceCallback);
    },

    clear(event) {
      if (event) {
        const callbacks = listeners.get(event);
        if (callbacks) {
          callbacks.forEach((callback) => {
            element.removeEventListener(event, callback);
          });
          listeners.delete(event);
        }
      } else {
        listeners.forEach((callbacks, evt) => {
          callbacks.forEach((callback) => {
            element.removeEventListener(evt, callback);
          });
        });
        listeners.clear();
      }
    },
  };
};
