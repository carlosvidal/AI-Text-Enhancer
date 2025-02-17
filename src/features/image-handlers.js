// En image-handlers.js

export const imageHandlerMixin = {
  isImageUsed(image) {
    if (!this.responseHistory) return false;

    const imageId = image instanceof File ? image.name : image;
    return this.responseHistory.responses.some(
      (response) =>
        response.action !== "image-upload" && response.imageUsed === imageId
    );
  },
  handleImageChange(file) {
    if (file) {
      this.productImage = file;
      this.productImageUrl = null;
      this.addResponseToHistory("image-upload", this.renderImagePreview(file));
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

    const imageUrl =
      imageToRender instanceof File
        ? URL.createObjectURL(imageToRender)
        : imageToRender;

    const filename =
      imageToRender instanceof File
        ? imageToRender.name
        : new URL(imageToRender).pathname.split("/").pop() || "From URL";

    return `
      <div class="image-preview-card" 
           data-image-id="${Date.now()}"
           role="figure"
           aria-label="${
             isInitial ? "Initial product image" : "Uploaded product image"
           }">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${imageUrl}" alt="Product preview - ${filename}">
          </div>
        </div>
      </div>
    `;
  },
};
