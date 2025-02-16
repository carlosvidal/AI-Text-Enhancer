// styles/components/image-uploader.js
export const imageUploaderStyles = `
  :host {
    display: block;
  }

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
    background: #f9fafb;
  }

  .image-preview.has-image {
    border-style: solid;
    border-color: #3b82f6;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .image-preview svg {
    width: 24px;
    height: 24px;
    color: #6b7280;
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
    font-family: inherit;
    color: #374151;
  }

  .upload-button:hover {
    background: #d1d5db;
  }

  .upload-button svg {
    width: 16px;
    height: 16px;
  }

  input[type="file"] {
    display: none;
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
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .image-preview:hover .remove-image {
    opacity: 1;
  }

  .remove-image:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .hidden {
    display: none !important;
  }

  /* Estilo para el input de archivo nativo */
  input[type="file"]::file-selector-button {
    display: none;
  }

  /* Estilo para el área de drag & drop */
  .image-preview.dragover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  /* Mejora del contenedor del botón */
  .button-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;
