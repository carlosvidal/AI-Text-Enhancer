// styles/components/model-selector.js
export const modelSelectorStyles = `
  .model-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--ai-background-light);
    border-radius: var(--ai-radius);
    margin-bottom: 1rem;
  }

  select {
    padding: 0.75rem;
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    background-color: var(--ai-background);
    font-size: 0.875rem;
    width: 100%;
    font-family: var(--ai-font-sans);
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  select:focus {
    outline: none;
    border-color: var(--ai-primary);
  }

  .model-info {
    font-size: 0.875rem;
    color: var(--ai-text-light);
  }

  .suggested {
    color: var(--ai-success);
    font-size: 0.75rem;
    margin-left: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: var(--ai-radius-sm);
  }

  .context-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--ai-text-light);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--ai-border);
  }

  .warning {
    color: var(--ai-error);
    padding: 0.5rem;
    border-radius: var(--ai-radius-sm);
    background: rgba(220, 38, 38, 0.1);
    font-size: 0.875rem;
  }

  .model-description {
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .model-costs {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--ai-text-light);
  }

  .model-cost-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .model-cost-item svg {
    width: 14px;
    height: 14px;
    color: var(--ai-text-light);
  }
`;
