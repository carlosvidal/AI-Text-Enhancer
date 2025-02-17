// styles/layout/preview.js
export const previewStyles = `
  .preview {
    flex: 1;
    overflow-y: auto;
    background: var(--ai-background);
    border-radius: var(--ai-radius);
  }

  .response-tool {
    font-weight: 500;
    color: var(--ai-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .response-timestamp {
    color: var(--ai-text-light);
    font-size: 0.875rem;
  }

  .response-action.primary {
    background: var(--ai-primary);
    color: white;
  }

  .response-action.primary:hover {
    background: var(--ai-primary-hover);
  }
`;
