export const imageHandlerMixin = {
  handleImageChange(file) {
    if (file) {
      this.productImage = file;
      this.productImageUrl = null;
      this.addResponseToHistory(
        "image-upload",
        this.renderImagePreview(file)
      );
    }
  },

  removeImage() {
    this.productImage = null;
    this.productImageUrl = null;
    const imagePreview = this.shadowRoot.querySelector(".image-preview-card");
    if (imagePreview) {
      imagePreview.remove();
    }
  },

  renderImagePreview(image = null, isInitial = false) {
    const imageToRender = image || this.productImage || this.productImageUrl;
    if (!imageToRender) return "";

    const imageUrl = imageToRender instanceof File
      ? URL.createObjectURL(imageToRender)
      : imageToRender;

    const filename = imageToRender instanceof File
      ? imageToRender.name
      : new URL(imageToRender).pathname.split("/").pop() || "From URL";

    return `
      <div class="image-preview-card ${isInitial ? "initial-image" : ""}" 
           data-image-id="${Date.now()}"
           role="figure"
           aria-label="${isInitial ? "Initial product image" : "Uploaded product image"}">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${imageUrl}" alt="Product preview - ${filename}">
          </div>
          <div class="image-preview-info">
            <div class="image-preview-label" aria-hidden="true">${
              isInitial ? "Initial image" : "Uploaded image"
            }</div>
            <div class="image-preview-filename">${filename}</div>
          </div>
          ${
            !isInitial && !this.isImageUsed(imageToRender)
              ? `
            <button class="image-preview-remove" 
                    aria-label="Remove image ${filename}"
                    title="Remove image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          `
              : ""
          }
        </div>
      </div>
    `;
  },

  isImageUsed(image) {
    const imageId = image instanceof File ? image.name : image;
    return this.responseHistory.responses.some(
      (response) =>
        response.action !== "image-upload" && response.imageUsed === imageId
    );
  }
};