export const modalTriggerStyles = `
  :host {
    --z-index-trigger: 999;
  }

  .ai-text-enhancer {
    position: relative;
  }

  .modal-trigger {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 12px 24px !important;
    background: var(--primary-color) !important;
    color: white !important;
    border: none !important;
    border-radius: 50px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
    z-index: var(--z-index-trigger) !important;
    opacity: 1 !important;
    visibility: visible !important;
    font-family: var(--font-family) !important;
    line-height: normal !important;
    margin: 0 !important;
    min-width: auto !important;
    max-width: none !important;
    outline: none !important;
    pointer-events: auto !important;
    text-decoration: none !important;
    transform: none !important;
    white-space: nowrap !important;
  }

  .modal-trigger:hover {
    background: var(--secondary-color) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15) !important;
  }

  .modal-trigger svg {
    width: 20px !important;
    height: 20px !important;
    fill: currentColor !important;
    stroke: currentColor !important;
  }

  .modal-trigger span {
    display: inline-block !important;
    vertical-align: middle !important;
  }
`;