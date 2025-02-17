export const notificationStyles = `
  .ai-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem;
    border-radius: var(--ai-radius);
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
    max-width: 300px;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ai-notification.info {
    background: var(--ai-info-bg, #e3f2fd);
    color: var(--ai-info-text, #0d47a1);
    border: 1px solid var(--ai-info-border, #90caf9);
  }

  .ai-notification.warning {
    background: var(--ai-warning-bg);
    color: var(--ai-warning-text);
    border: 1px solid var(--ai-warning-border);
  }

  .ai-notification.error {
    background: var(--ai-error-bg);
    color: var(--ai-error-text);
    border: 1px solid var(--ai-error-border);
  }

  .ai-notification.success {
    background: var(--ai-success-bg, #e8f5e9);
    color: var(--ai-success-text, #1b5e20);
    border: 1px solid var(--ai-success-border, #a5d6a7);
  }

  .notification-close {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: currentColor;
    opacity: 0.7;
  }

  .notification-close:hover {
    opacity: 1;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;