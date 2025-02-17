// styles/components/response-history.js
export const responseHistoryStyles = `
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
  }

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

  .typing-animation {
    overflow: hidden;
    border-right: 2px solid var(--ai-text);
    white-space: pre-wrap;
    animation: typing 1s steps(40, end) infinite;
  }

  @keyframes typing {
    from { border-color: var(--ai-text); }
    to { border-color: transparent; }
  }

  .response-content {
    margin: 1rem 0;
    line-height: 1.5;
  }

  .response-content pre {
    background: var(--ai-surface-dark);
    padding: 1rem;
    border-radius: var(--ai-radius);
    overflow-x: auto;
  }

  .response-content code {
    font-family: var(--ai-font-mono);
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    background: var(--ai-surface-dark);
    border-radius: var(--ai-radius-sm);
  }

  .response-content p {
    margin: 0.5em 0;
  }

  .response-content ul, .response-content ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
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

.response-content-wrapper {
  flex: 1;
  min-width: 0;
}

.question-with-image {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin: 0.5rem 0;
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

.image-filename {
  font-size: 0.75rem;
  color: var(--ai-text-light);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

// En response-history.js, modifica o agrega estos estilos

.response-entry img {
  max-width: 100px;  // Limitar el ancho máximo
  max-height: 100px; // Limitar la altura máxima
  object-fit: contain; // Mantener la proporción de la imagen
  border-radius: var(--ai-radius);
  border: 1px solid var(--ai-border);
}

.response-entry .response-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.response-content .image-preview-card {
  flex-shrink: 0;
  width: 100px;
  margin: 0;  // Eliminar márgenes que pudieran venir por defecto
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

// En response-history.js, agregar estos estilos

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
`;
