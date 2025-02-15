export const createTemplate = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
};

export const attachShadowTemplate = (element, template) => {
  const shadow = element.attachShadow({ mode: 'open' });
  shadow.appendChild(template.content.cloneNode(true));
  return shadow;
};