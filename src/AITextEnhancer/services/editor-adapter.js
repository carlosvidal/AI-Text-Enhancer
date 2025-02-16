// editor-adapter.js

export class EditorAdapter {
  constructor(editorId) {
    console.log("[EditorAdapter] Initializing with editor ID:", editorId);
    this.editorId = editorId;
    this.editor = document.getElementById(editorId);

    if (!this.editor) {
      console.error("[EditorAdapter] Editor element not found:", editorId);
    }
  }

  getContent() {
    console.log("[EditorAdapter] Getting content from editor");
    if (!this.editor) return "";
    return this.editor.value || this.editor.textContent || "";
  }

  setContent(content) {
    console.log("[EditorAdapter] Setting content to editor:", content);
    if (!this.editor) {
      console.error("[EditorAdapter] Editor not available");
      return;
    }

    if (this.editor.value !== undefined) {
      this.editor.value = content;
    } else {
      this.editor.textContent = content;
    }

    // Dispatch change event
    this.editor.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
