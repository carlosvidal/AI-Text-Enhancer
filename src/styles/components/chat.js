// styles/components/chat.js
export const chatStyles = `
  .chat-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .chat-form {
    display: flex;
    gap: 0.5rem;
  }

  .chat-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    font-family: var(--ai-font-sans);
    transition: border-color 0.2s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--ai-primary);
  }

  .chat-submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--ai-primary);
    color: white;
    border: none;
    border-radius: var(--ai-radius);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .chat-submit:hover {
    background: var(--ai-primary-hover);
  }

  .chat-message {
    padding: 1rem;
    border-radius: var(--ai-radius);
    animation: fadeIn 0.3s ease forwards;
  }

  .chat-message.user {
    background: #dbeafe;
    margin-left: 2rem;
  }

  .chat-message.assistant {
    background: var(--ai-secondary);
    margin-right: 2rem;
  }
`;
