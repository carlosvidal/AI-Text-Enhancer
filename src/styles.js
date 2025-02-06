// styles.js
export const styles = `
:host {
  display: inline-block;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 9999;
}

:host {
  --ai-enhancer-base-z: 99999;
  --ai-enhancer-modal-z: var(--ai-enhancer-base-z);
  --ai-enhancer-content-z: calc(var(--ai-enhancer-base-z) + 1);
}

.modal-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0.5em;
  padding: 0.9em;
  background: #fff;
  border: 0;
  border-radius: 2em;
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: box-shadow 250ms ease-in-out;
  font-family: sans-serif;
  font-weight: bold;
  background-image: linear-gradient(to right, #da22ff 0%, #9733ee 51%, #da22ff 100%);
  background-size: 200%;
  color: white;
  text-shadow: 1px 1px 2px #9733ee;
  white-space: nowrap;
}

.modal-trigger::before {
  content: "";
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
  background-size: 400%;
  width: 100%;
  height: 100%;
  border-radius: 2em;
  z-index: -1;
  animation: ai-button-glow 5s linear infinite;
  transition: filter 250ms ease-in-out, opacity 250ms ease-in-out;
}

.modal-trigger:hover {
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.1);
  background-position: right center;
}

.modal-trigger:hover::before {
  filter: blur(0.5em);
  opacity: 1;
  z-index: -1;
}

.modal-trigger svg {
  margin-right: 0.5em;
  height: 1em;
}

.modal-trigger:hover svg {
  animation: shake 0.5s ease-in-out;
}

  @keyframes ai-button-glow {
      0% {
          background-position: 0 0;
      }

      50% {
          background-position: 200% 0;
      }

      100% {
          background-position: 0 0;
      }
  }

  @keyframes pulse {
      0% {
          filter: blur(0);
      }

      50% {
          filter: blur(0.5em);
      }

      100% {
          filter: blur(0);
      }
  }

  @keyframes shake {

      0%,
      100% {
          transform: rotate(0deg);
      }

      25% {
          transform: rotate(5deg);
      }

      50% {
          transform: rotate(-5deg);
      }

      75% {
          transform: rotate(5deg);
      }
  }

  

  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--ai-enhancer-modal-z) !important;
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
    z-index: var(--ai-enhancer-content-z) !important;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #e5e7eb;
  cursor: pointer;
}

.tool-button svg,
.action-button svg {
  width: 16px;
  height: 16px;
}

  .tool-button:hover {
    background: #d1d5db;
  }

.preview {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    position: relative;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .typing {
    display: inline-block;
    animation: blink 1s infinite;
    margin-left: 2px;
    color: #3b82f6;
    font-weight: bold;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

  .image-upload {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .image-preview {
    width: 200px;
    height: 200px;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .image-preview.has-image {
    border-style: solid;
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #e5e7eb;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .upload-button:hover {
    background: #d1d5db;
  }

  .remove-image {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-image:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;
