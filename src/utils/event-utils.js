export const createCustomEvent = (name, detail) => {
  return new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true
  });
};

export const dispatchCustomEvent = (element, name, detail) => {
  element.dispatchEvent(createCustomEvent(name, detail));
};