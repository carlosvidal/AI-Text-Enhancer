export const modalStyles = `
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    padding: 1rem;
  }

  .modal.open {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 2rem;
  }

  .modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 42rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.5rem;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
  }

  .close-button:hover {
    color: #111827;
  }

  .modal-body {
    margin-top: 0.5rem;
  }
`;