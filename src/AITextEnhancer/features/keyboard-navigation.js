export function setupKeyboardNavigation(component) {
  document.addEventListener('keydown', component.handleKeyboard.bind(component));
  
  const modal = component.shadowRoot.querySelector('.modal');
  if (modal) {
    modal.addEventListener('keydown', component.handleModalKeyboard.bind(component));
  }
}

export const keyboardNavigationMixin = {
  handleKeyboard(event) {
    if (event.ctrlKey || event.metaKey) {
      switch(event.key.toLowerCase()) {
        case 'e':
          event.preventDefault();
          this.shadowRoot.querySelector('.modal-trigger').click();
          break;
        case 'i':
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction('improve');
          }
          break;
        case 's':
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction('summarize');
          }
          break;
      }
    }
  },

  handleModalKeyboard(event) {
    if (!this.isModalOpen()) return;

    switch (event.key) {
      case 'Escape':
        this.shadowRoot.querySelector('.close-button').click();
        break;
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'ArrowRight':
      case 'ArrowLeft':
        if (event.target.closest('.tools-container')) {
          this.handleToolNavigation(event);
        }
        break;
    }
  },

  handleTabNavigation(event) {
    const modal = this.shadowRoot.querySelector('.modal');
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  },

  handleToolNavigation(event) {
    const toolbar = this.shadowRoot.querySelector('ai-toolbar');
    const tools = toolbar.shadowRoot.querySelectorAll('.tool-button');
    const currentTool = toolbar.shadowRoot.querySelector('.tool-button:focus');

    if (!currentTool) return;

    const currentIndex = Array.from(tools).indexOf(currentTool);
    let nextIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tools.length;
    } else {
      nextIndex = (currentIndex - 1 + tools.length) % tools.length;
    }

    tools[nextIndex].focus();
    event.preventDefault();
  }
};