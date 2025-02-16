// src/utils/component-utils.js
export const defineComponent = (name, Component) => {
  if (!customElements.get(name)) {
    customElements.define(name, Component);
  }
};

export const createComponentBase = (componentClass) => {
  return class extends componentClass {
    constructor() {
      super();
      this.eventEmitter = createEventEmitter(this);
    }

    on(event, callback) {
      this.eventEmitter.on(event, callback);
    }

    off(event, callback) {
      this.eventEmitter.off(event, callback);
    }

    emit(event, detail) {
      return this.eventEmitter.emit(event, detail);
    }

    disconnectedCallback() {
      this.eventEmitter.clear();
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
};
