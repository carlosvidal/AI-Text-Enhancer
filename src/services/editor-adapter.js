// editor-adapter.js

class EditorAdapter {
  constructor(editorId) {
    this.editorId = editorId;
    this.editor = document.getElementById(editorId);
    this.type = this.detectEditorType();

    if (this.type === "quill") {
      this.setupQuillEditor();
    }
  }

  detectEditorType() {
    // TinyMCE
    if (window.tinymce && tinymce.get(this.editorId)) {
      return "tinymce";
    }

    // CKEditor (both v4 and v5)
    if (window.CKEDITOR) {
      // CKEditor 4
      if (CKEDITOR.instances[this.editorId]) {
        return "ckeditor4";
      }
    } else if (window.ClassicEditor) {
      // CKEditor 5
      return "ckeditor5";
    }

    // Quill
    const quillEditor = document.querySelector(`#${this.editorId} .ql-editor`);
    if (quillEditor) {
      return "quill";
    }

    // Froala
    if (window.FroalaEditor && FroalaEditor.instances[this.editorId]) {
      return "froala";
    }

    // Default to textarea if no other editor is detected
    return "textarea";
  }

  setupQuillEditor() {
    try {
      const quill = Quill.find(this.editor);
      if (quill && quill.root) {
        // Usar MutationObserver para detectar cambios en el contenido
        const observer = new MutationObserver(() => {
          // Manejar cambios si es necesario
        });

        observer.observe(quill.root, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    } catch (error) {
      console.error("Error setting up Quill editor:", error);
    }
  }

  getContent() {
    try {
      switch (this.type) {
        case "tinymce":
          return tinymce.get(this.editorId).getContent();

        case "ckeditor4":
          return CKEDITOR.instances[this.editorId].getData();

        case "ckeditor5":
          return this.editor.ckeditor.getData();

        case "quill":
          const quill = Quill.find(this.editor);
          return quill.root.innerHTML;

        case "froala":
          return FroalaEditor.instances[this.editorId].html.get();

        case "textarea":
        default:
          return this.editor.value || "";
      }
    } catch (error) {
      console.error(`Error getting content from ${this.type}:`, error);
      return "";
    }
  }

  setContent(content, mode = "replace") {
    try {
      switch (this.type) {
        case "tinymce": {
          const editor = tinymce.get(this.editorId);
          if (mode === "insert") {
            editor.insertContent(content);
          } else {
            editor.setContent(content);
          }
          break;
        }

        case "ckeditor4": {
          const editor = CKEDITOR.instances[this.editorId];
          if (mode === "insert") {
            editor.insertHtml(content);
          } else {
            editor.setData(content);
          }
          break;
        }

        case "ckeditor5": {
          const editor = this.editor.ckeditor;
          if (mode === "insert") {
            editor.model.change((writer) => {
              editor.model.insertContent(writer.createText(content));
            });
          } else {
            editor.setData(content);
          }
          break;
        }

        case "quill": {
          const quill = Quill.find(this.editor);
          if (mode === "insert") {
            const range = quill.getSelection();
            quill.insertText(range ? range.index : 0, content);
          } else {
            // Usar setContents en lugar de setText
            quill.setContents([{ insert: content }]);
          }
          break;
        }

        case "froala": {
          const editor = FroalaEditor.instances[this.editorId];
          if (mode === "insert") {
            editor.html.insert(content);
          } else {
            editor.html.set(content);
          }
          break;
        }

        case "textarea":
        default: {
          if (mode === "insert") {
            const start = this.editor.selectionStart;
            this.editor.value =
              this.editor.value.substring(0, start) +
              content +
              this.editor.value.substring(this.editor.selectionEnd);
            this.editor.selectionStart = this.editor.selectionEnd =
              start + content.length;
          } else {
            this.editor.value = content;
          }
        }
      }
    } catch (error) {
      console.error(`Error setting content in ${this.type}:`, error);
      // Fallback: append to textarea
      if (this.editor) {
        if (mode === "insert") {
          this.editor.value += content;
        } else {
          this.editor.value = content;
        }
      }
    }
  }

  getSelection() {
    try {
      switch (this.type) {
        case "tinymce":
          return tinymce.get(this.editorId).selection.getContent();

        case "ckeditor4":
          return CKEDITOR.instances[this.editorId]
            .getSelection()
            .getSelectedText();

        case "ckeditor5":
          return this.editor.ckeditor.model.document.selection.getSelectedContent();

        case "quill": {
          const quill = Quill.find(this.editor);
          const range = quill.getSelection();
          return range ? quill.getText(range.index, range.length) : "";
        }

        case "froala":
          return FroalaEditor.instances[this.editorId].selection.text();

        case "textarea":
        default:
          return this.editor.value.substring(
            this.editor.selectionStart,
            this.editor.selectionEnd
          );
      }
    } catch (error) {
      console.error(`Error getting selection from ${this.type}:`, error);
      return "";
    }
  }
}

export { EditorAdapter };
