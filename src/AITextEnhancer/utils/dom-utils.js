export const createTemplate = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
};

export function attachShadowTemplate(component, templateContent) {
  console.log('Attaching shadow template to component:', {
    componentTagName: component.tagName,
    hasTemplate: !!templateContent
  });

  const shadow = component.attachShadow({ mode: "open" });
  console.log('Shadow root created:', !!shadow);

  const template = document.createElement("template");
  template.innerHTML = templateContent;
  console.log('Template element created with content length:', template.innerHTML.length);

  const content = template.content.cloneNode(true);
  console.log('Content cloned:', {
    hasContent: !!content,
    childNodes: content.childNodes.length
  });

  shadow.appendChild(content);
  console.log('Content appended to shadow root');

  // Log rendered elements
  console.log('Rendered elements:', {
    modalTrigger: shadow.querySelector('.modal-trigger'),
    modal: shadow.querySelector('.modal'),
    aiToolbar: shadow.querySelector('ai-toolbar'),
    chatWithImage: shadow.querySelector('chat-with-image'),
    responseHistory: shadow.querySelector('response-history')
  });
}