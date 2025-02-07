// src/styles/components/image-uploader.js
export const styles = `
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
    transition: all 0.3s ease;
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
    transition: background-color 0.2s ease;
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
    transition: background-color 0.2s ease;
  }

  .remove-image:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .hidden {
    display: none;
  }

  .image-preview.dragover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: scale(1.02);
  }
`;
