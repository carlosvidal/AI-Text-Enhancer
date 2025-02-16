export const responseHandlerMixin = {
  handleResponseCopy(event) {
    console.log('[ResponseHandlers] Copy event received:', event.detail);
    const { responseId } = event.detail;
    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn('[ResponseHandlers] No response found for ID:', responseId);
      return;
    }

    navigator.clipboard.writeText(response.content)
      .then(() => console.log('[ResponseHandlers] Content copied to clipboard'))
      .catch(err => console.error('[ResponseHandlers] Copy failed:', err));
  },

  handleResponseUse(event) {
    console.log('[ResponseHandlers] Use event received:', event.detail);
    const { responseId } = event.detail;
    
    if (!this.responseHistory) {
      console.error('[ResponseHandlers] No response history available');
      return;
    }
    
    if (!this.editorAdapter) {
      console.error('[ResponseHandlers] No editor adapter available');
      return;
    }

    const response = this.responseHistory.getResponse(responseId);
    console.log('[ResponseHandlers] Found response:', response);
    
    if (!response) {
      console.warn('[ResponseHandlers] No response found for ID:', responseId);
      return;
    }

    try {
      console.log('[ResponseHandlers] Setting content to editor:', response.content);
      this.editorAdapter.setContent(response.content);
    } catch (error) {
      console.error('[ResponseHandlers] Error setting content:', error);
    }
  },
  
  handleResponseRetry(event) {
    console.log('[ResponseHandlers] Retry event received:', event.detail);
    const { responseId } = event.detail;
    const response = this.responseHistory?.getResponse(responseId);
    if (!response) {
      console.warn('[ResponseHandlers] No response found for ID:', responseId);
      return;
    }

    console.log('[ResponseHandlers] Retrying action:', response.action);
    this.handleToolAction(response.action);
  }
};