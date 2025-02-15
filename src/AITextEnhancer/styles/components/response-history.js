// styles/components/response-history.js
export const responseHistoryStyles = `
  .response-container {
    padding: 1rem;
    overflow-y: auto;
    max-height: 100%;
  }

  .response-entry {
    background: var(--ai-surface);
    border-radius: var(--ai-radius);
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .response-entry.with-image {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
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

  .response-tool {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .response-tool svg {
    width: 16px;
    height: 16px;
  }

  .response-content {
    margin: 1rem 0;
    line-height: 1.5;
  }

  .response-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .response-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--ai-radius);
    background: var(--ai-background);
    color: var(--ai-text);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
  }

  .response-action:hover {
    background: var(--ai-background-hover);
  }

  .response-action svg {
    width: 16px;
    height: 16px;
  }
`;
