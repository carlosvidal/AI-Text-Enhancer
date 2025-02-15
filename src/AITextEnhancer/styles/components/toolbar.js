export const toolbarStyles = `
  .toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .tool-button {
    padding: 0.5rem 1rem;
    border: none;
    background: var(--background-color);
    color: var(--text-color);
    border-radius: 0.375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .tool-button:hover {
    background: var(--border-color);
  }
`;