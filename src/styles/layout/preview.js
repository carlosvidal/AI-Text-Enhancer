// styles/layout/preview.js
export const previewStyles = `
  .preview {
    flex: 1;
    overflow-y: auto;
    background: var(--ai-background);
    border-radius: var(--ai-radius);
  }

  .response-entry {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    background: var(--ai-background);
    animation: fadeIn 0.3s ease forwards;
  }

  .response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--ai-border);
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

  .response-content {
    color: var(--ai-text);
    line-height: 1.5;
  }

  .response-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .response-action {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--ai-radius);
    background: var(--ai-secondary);
    color: var(--ai-text);
    cursor: pointer;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .response-action:hover {
    background: var(--ai-secondary-hover);
  }

  .response-action.primary {
    background: var(--ai-primary);
    color: white;
  }

  .response-action.primary:hover {
    background: var(--ai-primary-hover);
  }
`;
