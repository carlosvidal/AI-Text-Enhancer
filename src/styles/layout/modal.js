// styles/layout/modal.js
export const modalStyles = `
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--ai-z-modal);
  }

  .modal.open {
    display: block;
  }

  .modal-content {
    position: relative;
    background: var(--ai-background);
    width: 95%;
    max-width: 1200px;
    height: 85vh;
    margin: 5vh auto;
    padding: 1.5rem;
    border-radius: var(--ai-radius-lg);
    box-shadow: var(--ai-shadow-md);
    display: flex;
    flex-direction: column;
    z-index: var(--ai-z-content);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ai-text);
  }

  .version-info {
    background: var(--ai-secondary);
    color: var(--ai-text-light);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: var(--ai-radius-sm);
    cursor: help;
    user-select: none;
    transition: all 0.2s ease;
  }

  .version-info:hover {
    background: var(--ai-secondary-hover);
    color: var(--ai-text);
  }

  .modal-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }

  .editor-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .image-upload-section {
    margin-bottom: 1rem;
  }

  .tools-container {
    margin-bottom: 1rem;
  }

  .chat-section {
    flex-shrink: 0;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--ai-text-light);
    transition: color 0.2s ease;
    z-index: 1;
  }

  .close-button:hover {
    color: var(--ai-text);
  }
`;
