// src/utils/dom-utils.js
export const createTemplate = (strings, ...values) => {
  const template = document.createElement("template");
  template.innerHTML = strings.reduce(
    (acc, str, i) => acc + str + (values[i] || ""),
    ""
  );
  return template;
};

export const attachShadowTemplate = (element, template, styles = []) => {
  const shadow = element.attachShadow({ mode: "open" });

  // Add styles first
  styles.forEach((styleContent) => {
    const style = document.createElement("style");
    style.textContent = styleContent;
    shadow.appendChild(style);
  });

  // Then add content
  shadow.appendChild(template.content.cloneNode(true));
  return shadow;
};

export const createStyleSheet = (...styles) => {
  return styles.join("\n");
};

export const findElement = (root, selector, required = false) => {
  const element = root.querySelector(selector);
  if (required && !element) {
    throw new Error(`Required element "${selector}" not found`);
  }
  return element;
};

export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
};
