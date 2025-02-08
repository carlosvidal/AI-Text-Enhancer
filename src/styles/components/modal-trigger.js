// styles/components/modal-trigger.js
export const modalTriggerStyles = `
  .modal-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(to right, var(--ai-gradient-start) 0%, var(--ai-gradient-middle) 51%, var(--ai-gradient-end) 100%);
    background-size: 200% auto;
    border: 0;
    border-radius: 2em;
    color: white;
    font-family: var(--ai-font-sans);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    box-shadow: var(--ai-shadow);
  }

  .modal-trigger::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
    background-size: 400%;
    border-radius: 2em;
    z-index: -1;
    transition: opacity 0.3s ease;
    animation: glow 5s linear infinite;
  }

  .modal-trigger:hover {
    background-position: right center;
    box-shadow: var(--ai-shadow-md);
    transform: translateY(-1px);
  }

  .modal-trigger:hover::before {
    opacity: 0.7;
    filter: blur(8px);
  }

  .modal-trigger svg {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.5em;
    transition: transform 0.3s ease;
  }

  .modal-trigger:hover svg {
    animation: shake 0.5s ease-in-out;
  }

  .modal-trigger span {
    font-size: 0.9375rem;
    letter-spacing: 0.025em;
  }
`;
