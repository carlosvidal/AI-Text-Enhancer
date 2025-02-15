// markdown-handler.js
export class MarkdownHandler {
  constructor() {
    this.marked = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Load marked.js from CDN
    try {
      await this.loadMarked();
      this.configureMarked();
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing marked:", error);
      throw error;
    }
  }

  async loadMarked() {
    if (window.marked) {
      this.marked = window.marked;
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js";
      script.onload = () => {
        this.marked = window.marked;
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load marked.js"));
      document.head.appendChild(script);
    });
  }

  configureMarked() {
    // Configuración moderna de marked sin usar opciones deprecated
    this.marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      headerIds: false, // Disable header IDs to avoid conflicts
      mangle: false, // Disable mangling to preserve text
      smartLists: true, // Use smarter list behavior
      smartypants: true, // Use smart typography
      xhtml: true, // Use XHTML compliant tags
    });

    // Usar marked.parse en lugar de marked directamente
    this.marked.use({
      renderer: new this.marked.Renderer(),
      pedantic: false,
      silent: false,
    });
  }

  convertToHTML(markdown) {
    if (!this.initialized) {
      throw new Error("MarkdownHandler not initialized");
    }
    return this.marked.parse(markdown);
  }

  // Convert markdown content for TinyMCE
  convertForTinyMCE(markdown) {
    const html = this.convertToHTML(markdown);
    // Additional processing for TinyMCE compatibility if needed
    return html;
  }

  // Convert markdown content for chat messages
  convertForChat(markdown) {
    const html = this.convertToHTML(markdown);
    // Simplified conversion for chat messages
    return html.replace(/<p>/g, "").replace(/<\/p>/g, "<br>");
  }

  // Clean and normalize markdown content
  normalizeMarkdown(content) {
    return content
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
      .trim();
  }

  // Extract plain text from markdown
  getPlainText(markdown) {
    const html = this.convertToHTML(markdown);
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText;
  }

  // Convert HTML to Markdown (for editing)
  convertFromHTML(html) {
    // Basic HTML to Markdown conversion
    return html
      .replace(/<h([1-6])>([^<]+)<\/h[1-6]>/g, (_, level, content) => {
        return "#".repeat(level) + " " + content + "\n\n";
      })
      .replace(/<p>([^<]+)<\/p>/g, "$1\n\n")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove remaining HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}
