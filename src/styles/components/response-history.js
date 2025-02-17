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
`;
