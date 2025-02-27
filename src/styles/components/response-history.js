// styles/components/response-history.js
export const responseHistoryStyles = `
  /* ===== CONTENEDORES PRINCIPALES ===== */
  .response-container {
    overflow-y: auto;
    max-height: 100%;
  }

  .response-entry {
    background: var(--ai-surface);
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
    margin-bottom: 1rem;
    padding: 1rem;
    /* Optimizaciones de rendimiento */
    contain: content;
    position: relative;
    will-change: contents;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  .response-content-wrapper {
    flex: 1;
    min-width: 0;
    /* Optimizar para cambios frecuentes */
    will-change: contents;
  }

  .response-entry[data-action="error"],
  .response-entry[data-action="info"],
  .response-entry[data-action="chat-error"] {
    background: var(--ai-surface-light);
    border-left: 3px solid var(--ai-error);
    padding-left: calc(1rem - 3px);
  }

  .response-entry[data-action="info"] {
    border-left-color: var(--ai-info);
  }

  /* ===== ÁREA DE CONTENIDO ===== */
  .response-content {
    margin: 1rem 0;
    line-height: 1.5;
    /* Claves para el streaming sin parpadeo */
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    position: relative;
    /* Evitar que el contenido salte durante la actualización */
    min-height: 1.5em;
  }

  /* Control para streaming activo */
  .response-content[data-streaming-active="true"] {
    transition: none !important;
    user-select: none;
  }

  /* Desactivar transiciones durante streaming para contenido anidado */
  .response-content[data-streaming-active="true"] * {
    transition: none !important;
  }

  /* Restaurar selección cuando termina el streaming */
  .response-content:not([data-streaming-active="true"]) {
    user-select: text;
  }

  /* Contenido para markdown */
  .response-content p {
    margin: 0.5em 0;
    animation: textReveal 0.2s ease-out forwards;
  }

  .response-content ul, 
  .response-content ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  .response-content pre {
    background: var(--ai-surface-dark);
    padding: 1rem;
    border-radius: var(--ai-radius);
    overflow-x: auto;
    margin-bottom: 1em;
  }

  .response-content code {
    font-family: var(--ai-font-mono);
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    background: var(--ai-surface-dark);
    border-radius: var(--ai-radius-sm);
  }

  /* Mantener contenido estable */
  .response-content p, 
  .response-content ul, 
  .response-content ol,
  .response-content pre {
    contain: layout;
  }

  /* Eliminar margen en el último elemento para mantener espaciado consistente */
  .response-content > *:last-child {
    margin-bottom: 0;
  }

  /* ===== ANIMACIÓN DE ESCRITURA ===== */
  /* Deshabilitar el cursor por defecto */
  .response-content::after {
    content: none;
  }

  /* Cursor de escritura personalizado */
  .typing-animation::after {
    content: '|';
    display: inline-block;
    width: 0.5em;
    height: 1.2em;
    background: transparent;
    margin-left: 1px;
    border: none;
    animation: typingCursor 0.8s infinite step-end;
    vertical-align: middle;
    position: relative;
    opacity: 0.8;
  }

  /* Eliminar CUALQUIER cursor adicional */
  .typing-animation span.typing,
  .typing span.cursor,
  span.typing-cursor {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  /* Animación del cursor */
  @keyframes typingCursor {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0; }
  }

  /* Indicadores de carga */
  .typing-indicator {
    color: var(--ai-text-light);
    font-style: italic;
    padding: 0.25rem 0;
    animation: fadeInOut 1.5s ease-in-out infinite;
  }

  /* Animación para indicadores de carga */
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* Efecto de texto apareciendo gradualmente */
  @keyframes textReveal {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mensajes de estado iniciales para contenido vacío */
  .response-entry[data-action="chat-response"] .response-content:empty::after,
  .response-entry[data-action="summarize"] .response-content:empty::after,
  .response-entry[data-action="improve"] .response-content:empty::after,
  .response-entry[data-action="expand"] .response-content:empty::after,
  .response-entry[data-action="paraphrase"] .response-content:empty::after,
  .response-entry[data-action="more-formal"] .response-content:empty::after,
  .response-entry[data-action="more-casual"] .response-content:empty::after {
    content: 'Pensando...';
    color: var(--ai-text-light);
    font-style: italic;
  }

  .response-entry[data-action="chat-response"] .response-content:empty::after {
    content: 'Escribiendo respuesta...';
  }

  /* ===== CABECERA Y PIE DE RESPUESTA ===== */
  .response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    color: var(--ai-text-secondary);
  }

  .response-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0 0;
    gap: 1rem;
    border-top: 1px solid var(--ai-border);
  }

  /* ===== BOTONES Y ACCIONES ===== */
  .response-actions {
    display: flex;
    gap: 0.5rem;
  }

  .response-tools {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 0 0.25rem;
  }

  .response-tools::-webkit-scrollbar {
    height: 4px;
  }

  .response-tools::-webkit-scrollbar-track {
    background: var(--ai-surface-light);
    border-radius: 2px;
  }

  .response-tools::-webkit-scrollbar-thumb {
    background: var(--ai-surface-dark);
    border-radius: 2px;
  }

  .response-action,
  .tool-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--ai-radius);
    background: var(--ai-surface-dark);
    color: var(--ai-text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .response-action {
    padding: 0.5rem;
  }

  .response-action:hover,
  .tool-button:hover {
    background: var(--ai-primary);
    color: white;
  }

  .response-action svg,
  .tool-button svg {
    width: 16px;
    height: 16px;
  }

  /* ===== IMÁGENES Y ADJUNTOS ===== */
  .response-entry.with-image {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: start;
  }

  .response-image-container {
    width: 120px;
  }

  .image-preview {
    width: 120px;
    height: 120px;
    border-radius: var(--ai-radius);
    overflow: hidden;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .response-content-with-image {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin: 1rem 0;
  }

  .response-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .response-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  .image-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    margin-top: 0.25rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Estilos para imágenes en las respuestas */
  .response-entry img {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .response-content .image-preview-card {
    flex-shrink: 0;
    width: 100px;
    margin: 0;
  }

  .response-content .image-preview-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  .response-content .image-preview-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    text-align: center;
    margin-top: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ===== PREGUNTAS CON IMÁGENES ===== */
  .question-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .question-content {
    flex: 1;
    min-width: 0;
  }

  .question-image {
    flex-shrink: 0;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .question-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .question-image .image-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  .question-with-image {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin: 0.5rem 0;
  }

  /* ESTILO PARA MENSAJES DE INFORMACIÓN */
.response-entry[data-action="info"],
.response-entry[data-action="error"],
.response-entry[data-action="chat-error"] {
  background-color: var(--ai-surface-light, #f9fafb);
  padding: 0.5rem 0.75rem !important; 
  display: flex !important;
  align-items: center !important;
  max-height: none !important;
}

.response-entry[data-action="info"] .response-header,
.response-entry[data-action="error"] .response-header,
.response-entry[data-action="chat-error"] .response-header {
  display: none !important; /* Ocultar header para más compacidad */
}

/* ESTILO PARA PREGUNTAS */
.response-entry[data-action="chat-question"] {
  padding: 0.5rem 0.75rem !important;
  max-height: none !important;
}
`;
