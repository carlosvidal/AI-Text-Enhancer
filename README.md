# AI Text Enhancer

A powerful web component for enhancing product descriptions using AI. This component integrates seamlessly with multiple rich text editors and provides real-time AI-powered text enhancement capabilities, including image analysis for more accurate product descriptions.

## Features

- 🎨 Multiple enhancement modes:
  - Improve: Makes descriptions more professional and engaging
  - Summarize: Creates concise versions while maintaining key points
  - Expand: Adds more details and benefits
  - Paraphrase: Rewrites content while preserving the message
  - Style: Adjusts tone for better persuasion

- 🖼️ Image Support:
  - Upload local images
  - Use image URLs
  - Visual analysis for better product descriptions
  - Image preview with remove option

- 💬 Interactive chat interface for specific content queries
- 🔄 Smart caching system for improved performance
- 📝 Markdown support with live preview
- 🔌 Multiple editor integrations:
  - Plain textarea
  - TinyMCE
  - CKEditor 5
  - Quill
  - Froala Editor
- 🌐 Multiple AI provider support:
  - OpenAI (GPT-4 Vision)
  - Anthropic (Claude 3)
- 🔒 Shadow DOM encapsulation for style isolation
- 🤖 Customizable AI system prompt

## Installation

```html
<!-- Include the web component -->
<script type="module" src="path/to/ai-text-enhancer.js"></script>
```

## Usage

### Basic Implementation (With Image Support)

```html
<!-- Add the component to your HTML -->
<ai-text-enhancer
  editor-id="my-editor"
  api-key="your-api-key"
  api-provider="openai"
  api-model="gpt-4-vision-preview"
  image-url="https://example.com/product-image.jpg">
</ai-text-enhancer>

<!-- Reference text editor -->
<textarea id="my-editor">Your product description here</textarea>
```

### Image Support Options

The component supports two ways of providing images:

1. Via URL attribute:
```html
<ai-text-enhancer
  image-url="https://example.com/product-image.jpg"
  ...other-attributes>
</ai-text-enhancer>
```

2. Via file upload button in the UI:
- Click the upload button in the component interface
- Select a local image file
- Image will be previewed and used for analysis

### Dynamic Image Updates

You can update the image programmatically:

```javascript
const enhancer = document.querySelector('ai-text-enhancer');

// Set image via URL
enhancer.setAttribute('image-url', 'https://example.com/new-image.jpg');

// Clear image
enhancer.setAttribute('image-url', '');
```

### Provider Support for Images

Current providers that support image analysis:

| Provider  | Model              | Max Image Size | Supported Formats |
|-----------|-------------------|----------------|------------------|
| OpenAI    | gpt-4-vision-preview | 20MB          | PNG, JPEG, GIF, WebP |
| Anthropic | claude-3-opus     | 100MB         | PNG, JPEG, WebP |

### TinyMCE Integration

```html
<ai-text-enhancer
  editor-id="tinymce-editor"
  api-key="your-api-key"
  api-model="gpt-4-vision-preview">
</ai-text-enhancer>

<div id="tinymce-editor"></div>

<script>
  tinymce.init({
    selector: '#tinymce-editor',
    height: 300
    // Your TinyMCE configuration...
  });
</script>
```

### Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| editor-id | ID of the target editor element | Required |
| api-key | Your AI provider API key | Required |
| api-provider | AI service provider (openai/anthropic) | "openai" |
| api-model | Model to use for text generation | Provider default |
| language | Interface language (en/es/fr/de/pt) | "en" |
| prompt | Custom system prompt for the AI | Default marketing expert prompt |
| image-url | URL of the product image to analyze | Optional |

### Using with Image Analysis

For best results with image analysis:

1. Use high-quality product images
2. Ensure images are well-lit and focused
3. Include multiple angles if relevant
4. Keep image sizes reasonable (< 20MB for OpenAI, < 100MB for Anthropic)
5. Use supported image formats (PNG, JPEG, WebP)

### Best Practices

1. Image Selection:
   - Use clear, high-quality product images
   - Avoid images with text overlays
   - Ensure good lighting and focus
   - Show important product features

2. Performance:
   - Use appropriate image sizes
   - Enable caching for repeated analyses
   - Consider using image URLs for faster loading

3. Error Handling:
   - Validate image URLs
   - Handle failed image loads
   - Provide fallback descriptions

## Development

### Prerequisites

- Modern web browser with Web Components support
- API key from supported providers (OpenAI/Anthropic)
- Editor dependencies as needed (TinyMCE, CKEditor, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- OpenAI for GPT-4 Vision API
- Anthropic for Claude 3 API
- TinyMCE, CKEditor, Quill, and Froala teams
- marked.js for Markdown processing
- Lucide for icons