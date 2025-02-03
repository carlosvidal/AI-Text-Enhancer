// styles.js
export const styles = `
  :host {
    display: block;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .modal-trigger {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .modal-trigger:hover {
    background: #2563eb;
  }

  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .modal.open {
    display: block;
  }

  .modal-content {
    position: relative;
    background: white;
    width: 95%;
    max-width: 1200px;
    height: 90vh;
    margin: 5vh auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  .modal-body {
    display: flex;
    flex: 1;
    min-height: 0;
    gap: 20px;
  }

  .editor-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  
  .chat-section {
    width: 300px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #e5e7eb;
    padding-left: 20px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #e5e7eb;
  }

  .tab-button.active {
    background: #3b82f6;
    color: white;
  }

  .tools {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tool-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #e5e7eb;
    cursor: pointer;
  }

  .tool-button:hover {
    background: #d1d5db;
  }

.preview {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  /* Markdown preview styles */
  .preview h1 { font-size: 1.8em; margin-bottom: 0.5em; }
  .preview h2 { font-size: 1.5em; margin-bottom: 0.5em; }
  .preview h3 { font-size: 1.3em; margin-bottom: 0.5em; }
  .preview p { margin-bottom: 1em; }
  .preview ul, .preview ol { margin-bottom: 1em; padding-left: 2em; }
  .preview li { margin-bottom: 0.5em; }
  .preview code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 3px; }
  .preview pre { background: #f1f5f9; padding: 1em; border-radius: 6px; overflow-x: auto; }
  .preview blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; margin-left: 0; color: #4b5563; }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .action-button.primary {
    background: #3b82f6;
    color: white;
  }

  .action-button.success {
    background: #10b981;
    color: white;
  }

  .chat-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .chat-message {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 6px;
  }

  .chat-message.user {
    background: #dbeafe;
    margin-left: 32px;
  }

  .chat-message.assistant {
    background: #e5e7eb;
    margin-right: 32px;
  }

  .chat-form {
    display: flex;
    gap: 8px;
  }

  .chat-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .generate-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .generate-button {
    min-width: 120px;
  }

  .tool-button.active {
    background: #3b82f6;
    color: white;
  }
`;
