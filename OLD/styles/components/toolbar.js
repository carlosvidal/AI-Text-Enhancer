// styles/components/toolbar.js
export const toolbarStyles = `
  .tools {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tool-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--ai-secondary);
    border: none;
    border-radius: var(--ai-radius);
    cursor: pointer;
    font-family: var(--ai-font-sans);
    transition: all 0.2s ease;
  }

  .tool-button:hover {
    background: var(--ai-secondary-hover);
  }

  .tool-button.active {
    background: var(--ai-primary);
    color: white;
  }

  .tool-button svg {
    width: 16px;
    height: 16px;
  }
`;
