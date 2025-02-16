// markdown-handler.js
export class MarkdownHandler {
  constructor() {
    this.marked = null;
  }

  async initialize() {
    try {
      const { marked } = await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
      this.marked = marked;
      
      this.marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: false
      });
    } catch (error) {
      console.error('Error initializing markdown handler:', error);
      throw error;
    }
  }

  convert(text) {
    if (!text || !this.marked) return text;
    return this.marked(text);
  }
}
