// styles/components/image-preview.js
export const imagePreviewStyles = `
  .image-preview-card {
    background: var(--ai-background);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    padding: 1rem;
    margin-bottom: 1rem;
    animation: fadeIn 0.3s ease forwards;
  }

  .image-preview-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .image-preview-thumbnail {
    width: 96px;
    height: 96px;
    position: relative;
    border-radius: var(--ai-radius);
    overflow: hidden;
    background: var(--ai-background-light);
  }

  .image-preview-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-preview-info {
    flex: 1;
  }

  .image-preview-label {
    font-size: 0.875rem;
    color: var(--ai-text-light);
    margin-bottom: 0.25rem;
  }

  .image-preview-filename {
    font-size: 0.875rem;
    color: var(--ai-text);
  }

  .image-preview-remove {
    padding: 0.25rem;
    border: none;
    background: none;
    color: var(--ai-text-light);
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
  }

  .image-preview-remove:hover {
    opacity: 1;
    color: var(--ai-text);
  }

  /* Estilos para el botón de upload en el chat */
  .chat-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .chat-upload-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--ai-background-light);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    color: var(--ai-text);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .chat-upload-button:hover {
    background: var(--ai-secondary);
    border-color: var(--ai-border);
  }

  .chat-upload-button svg {
    width: 16px;
    height: 16px;
  }

  /* Ocultar input de archivo */
  .hidden {
    display: none !important;
  }
`;
