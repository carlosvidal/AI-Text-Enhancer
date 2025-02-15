export const responseHandlerMixin = {
  handleResponseCopy(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      navigator.clipboard
        .writeText(response.content)
        .then(() => {
          const button = this.shadowRoot.querySelector(
            `.copy-button[data-response-id="${responseId}"]`
          );
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = "✓ Copied!";
            setTimeout(() => (button.innerHTML = originalText), 2000);
          }
        })
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  },

  handleResponseUse(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      this.setEditorContent(response.content, "replace");
      this.shadowRoot.querySelector(".modal").classList.remove("open");
    }
  },

  handleResponseRetry(event) {
    const { responseId, action } = event.detail;
    this.handleToolAction(action);
  },

  handleResponseEdit(event) {
    const { responseId } = event.detail;
    const response = this.responseHistory.responses.find(
      (r) => r.id === responseId
    );
    if (response) {
      const chatInput = this.shadowRoot.querySelector(".chat-input");
      const chatForm = this.shadowRoot.querySelector(".chat-form");

      if (chatInput && chatForm) {
        chatForm.dataset.editingId = responseId;
        const submitButton = chatForm.querySelector("button");
        if (submitButton) {
          submitButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
              <path d="m2 6 10 7 10-7"/>
            </svg>
            Update
          `;
        }

        const questionText = response.content.replace(/^\*\*.*:\*\*\s*/, "");
        chatInput.value = questionText;
        chatInput.focus();
      }
    }
  }
};