// styles/base/animations.js
export const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes glow {
    0% { background-position: 0 0; }
    50% { background-position: 200% 0; }
    100% { background-position: 0 0; }
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    50% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes typingCursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* Typing animation styles */
  .typing-animation::after {
    content: '|';
    color: var(--ai-primary, #2563eb);
    animation: typingCursor 1s infinite;
    margin-left: 2px;
  }

  .typing-animation {
    position: relative;
  }
`;
