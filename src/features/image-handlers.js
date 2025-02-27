// src/features/image-handlers.js

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

      // Encontrar el último mensaje de pregunta en el historial
      const lastQuestion = this.responseHistory.responses.findLast(
        (response) => response.action === "chat-question"
      );

      if (lastQuestion) {
        // Mover el contenido de la imagen al contenido de la pregunta
        const imagePreviewHTML = this.renderImagePreview(file);

        // Buscar el elemento response-content en el DOM
        const questionEntry = this.shadowRoot.querySelector(
          `.response-entry[data-response-id="${lastQuestion.id}"]`
        );

        if (questionEntry) {
          const responseContent =
            questionEntry.querySelector(".response-content");
          if (responseContent) {
            // Insertar la imagen directamente en el response-content
            responseContent.insertAdjacentHTML("beforeend", imagePreviewHTML);
          }
        }

        // Eliminar las entradas de image-upload existentes del DOM
        const imageUploadEntries = this.shadowRoot.querySelectorAll(
          '.response-entry[data-action="image-upload"]'
        );
        imageUploadEntries.forEach((entry) => entry.remove());

        // Eliminar las entradas de image-upload del historial
        this.responseHistory.responses = this.responseHistory.responses.filter(
          (response) => response.action !== "image-upload"
        );
      }
    }
  },

  removeImage() {
    if (this.productImage || this.productImageUrl) {
      this.productImage = null;
      this.productImageUrl = null;

      // Encontrar y actualizar el último mensaje de pregunta en el historial
      const lastQuestion = this.responseHistory.responses.findLast(
        (response) => response.action === "chat-question"
      );

      if (lastQuestion) {
        // Eliminar el HTML de la imagen del contenido
        lastQuestion.content = lastQuestion.content.replace(
          /<div class="image-preview-card"[\s\S]*?<\/div><\/div><\/div>/g,
          ""
        );

        // En lugar de usar this.requestUpdate (que no existe), forzamos una actualización
        // renderizando de nuevo el historial de respuestas
        if (this.responseHistory) {
          this.responseHistory.render();
        }
      }
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
