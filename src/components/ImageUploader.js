// src/components/ImageUploader.js

export class ImageUploader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["image-url"];
  }

  connectedCallback() {
    this.render();
    this.setupElements();
    this.bindEvents();

    if (this.imageUrl) {
      this.handleImageUrlChange(this.imageUrl);
    }
  }

  get imageUrl() {
    return this.getAttribute("image-url");
  }

  set imageUrl(value) {
    if (value) {
      this.setAttribute("image-url", value);
    } else {
      this.removeAttribute("image-url");
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .image-upload {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-preview {
          width: 200px;
          height: 200px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .image-preview.has-image {
          border-style: solid;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #e5e7eb;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .upload-button:hover {
          background: #d1d5db;
        }

        .remove-image {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hidden {
          display: none;
        }
      </style>
      <div class="image-upload">
        <div class="image-preview" id="imagePreview">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
        <button class="upload-button" id="uploadButton" type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
            <line x1="16" y1="5" x2="22" y2="5"/>
            <line x1="19" y1="2" x2="19" y2="8"/>
          </svg>
          Upload Product Image
        </button>
        <input type="file" id="imageInput" accept="image/*" class="hidden">
      </div>
    `;
  }

  setupElements() {
    this.imagePreview = this.shadowRoot.getElementById("imagePreview");
    this.uploadButton = this.shadowRoot.getElementById("uploadButton");
    this.imageInput = this.shadowRoot.getElementById("imageInput");
  }

  bindEvents() {
    this.uploadButton.onclick = () => this.imageInput.click();
    this.imageInput.onchange = (e) => this.handleFileSelect(e);
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file) {
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type. Please select an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.updatePreview(e.target.result);
      this.dispatchEvent(new CustomEvent("imagechange", { detail: { file } }));
    };
    reader.readAsDataURL(file);
  }

  async handleImageUrlChange(url) {
    if (!url) {
      this.removeImage();
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load image");

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("Invalid image URL");
      }

      this.updatePreview(url);
    } catch (error) {
      console.error("Error loading image:", error);
      this.removeImage();
    }
  }

  updatePreview(src) {
    this.imagePreview.innerHTML = `
      <img src="${src}" alt="Product preview">
      <button class="remove-image" title="Remove image">×</button>
    `;
    this.imagePreview.classList.add("has-image");

    const removeButton = this.imagePreview.querySelector(".remove-image");
    removeButton.onclick = () => this.removeImage();
  }

  removeImage() {
    this.imagePreview.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
    `;
    this.imagePreview.classList.remove("has-image");
    this.imageInput.value = "";
    this.imageUrl = "";
    this.dispatchEvent(
      new CustomEvent("imagechange", { detail: { file: null } })
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "image-url" && oldValue !== newValue) {
      this.handleImageUrlChange(newValue);
    }
  }
}

customElements.define("ai-image-uploader", ImageUploader);
