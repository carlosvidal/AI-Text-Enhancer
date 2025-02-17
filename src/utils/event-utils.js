export const createEventEmitter = (element) => {
  return {
    emit: (eventName, detail) => {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(event);
    },
    on: (eventName, handler) => {
      element.addEventListener(eventName, handler);
      return () => element.removeEventListener(eventName, handler);
    },
    off: (eventName, handler) => {
      element.removeEventListener(eventName, handler);
    },
  };
};

export const createCustomEvent = (name, detail) => {
  return new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
  });
};

export const dispatchCustomEvent = (element, name, detail) => {
  element.dispatchEvent(createCustomEvent(name, detail));
};
