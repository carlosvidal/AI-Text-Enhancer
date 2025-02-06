# AI Text Enhancer

A powerful web component for enhancing product descriptions using AI. This component integrates seamlessly with multiple rich text editors and provides real-time AI-powered text enhancement capabilities.

## Features

- 🎨 Multiple enhancement modes:
  - Improve: Makes descriptions more professional and engaging
  - Summarize: Creates concise versions while maintaining key points
  - Expand: Adds more details and benefits
  - Paraphrase: Rewrites content while preserving the message
  - Style: Adjusts tone for better persuasion

- 💬 Interactive chat interface for specific content queries
- 🔄 Smart caching system for improved performance
- 📝 Markdown support with live preview
- 🔌 Multiple editor integrations:
  - Plain textarea
  - TinyMCE
  - CKEditor 5
  - Quill
  - Froala Editor
- 🌐 Multiple AI provider support (OpenAI, Deepseek)
- 🔒 Shadow DOM encapsulation for style isolation
- 🤖 Customizable AI system prompt
- 📊 Optional usage control and quota management
- 🏢 Multi-tenant support

## Installation

```html
<!-- Include the web component -->
<script type="module" src="path/to/ai-text-enhancer.js"></script>
```

## Usage

### Basic Implementation (Textarea)

```html
<!-- Add the component to your HTML -->
<ai-text-enhancer
  editor-id="my-editor"
  api-key="your-api-key"
  api-provider="openai"
  api-model="gpt-4">
</ai-text-enhancer>

<!-- Reference text editor -->
<textarea id="my-editor">Your product description here</textarea>
```

### With Usage Control

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-key="your-api-key"
  quota-endpoint="/api/quota"
  tenant-id="123"
  user-id="456">
</ai-text-enhancer>
```

### TinyMCE Integration

```html
<ai-text-enhancer
  editor-id="tinymce-editor"
  api-key="your-api-key">
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

### CKEditor 5 Integration

```html
<ai-text-enhancer
  editor-id="ckeditor-container"
  api-key="your-api-key">
</ai-text-enhancer>

<div id="ckeditor-container"></div>

<script>
  ClassicEditor.create(document.querySelector('#ckeditor-container'))
    .then(editor => {
      editor.editing.view.change(writer => {
        writer.setStyle('min-height', '300px', editor.editing.view.document.getRoot());
      });
    });
</script>
```

### Quill Integration

```html
<ai-text-enhancer
  editor-id="quill-editor"
  api-key="your-api-key">
</ai-text-enhancer>

<div id="quill-editor"></div>

<script>
  const quill = new Quill('#quill-editor', {
    theme: 'snow',
    modules: {
      toolbar: [/* your toolbar config */]
    }
  });
</script>
```

### Froala Integration

```html
<ai-text-enhancer
  editor-id="froala-editor"
  api-key="your-api-key">
</ai-text-enhancer>

<div id="froala-editor"></div>

<script>
  new FroalaEditor('#froala-editor', {
    height: 300
    // Your Froala configuration...
  });
</script>
```

## Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| editor-id | ID of the target editor element | Required |
| api-key | Your AI provider API key | Required |
| api-provider | AI service provider (openai/deepseek) | "openai" |
| api-model | Model to use for text generation | Provider default |
| language | Interface language (en/es/fr/de/pt) | "en" |
| prompt | Custom system prompt for the AI | Default marketing expert prompt |
| quota-endpoint | Endpoint for quota checking | Optional |
| tenant-id | Tenant identifier for multi-tenant setups | Optional |
| user-id | User identifier for usage tracking | Optional |

### Usage Control Options

The component supports three usage modes:

1. **Basic Mode** (No usage control):
```html
<ai-text-enhancer editor-id="editor" api-key="key">
```

2. **Simple Quota Mode** (Only quota verification):
```html
<ai-text-enhancer 
  editor-id="editor" 
  api-key="key" 
  quota-endpoint="/quota.json">
```

3. **Full Control Mode** (Complete usage tracking):
```html
<ai-text-enhancer 
  editor-id="editor" 
  api-key="key"
  quota-endpoint="/api/quota"
  tenant-id="123"
  user-id="456">
```

### Editor Support

The component automatically detects and adapts to different editor types:

| Editor | Support Level | Notes |
|--------|--------------|-------|
| Textarea | Full | Default fallback |
| TinyMCE | Full | Versions 5.x and 6.x |
| CKEditor 5 | Full | Classic build |
| Quill | Full | Version 1.3.6+ |
| Froala | Full | Requires license |

### Language Support

The component supports multiple languages for its interface:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)

## Component Architecture

```
/ai-text-enhancer
  ├── src/
  │   ├── ai-text-enhancer.js       # Main component
  │   ├── editor-adapter.js         # Editor integration layer
  │   ├── styles.js                 # Encapsulated styles
  │   ├── markdown-handler.js       # Markdown processing
  │   ├── cache-manager.js          # Caching system
  │   └── api-client.js             # API client
  ├── demo/
  │   ├── index.html               # Demo page
  │   └── editor-demo.html         # Rich text editors demo
  └── README.md                    # Documentation
```

## Development

### Prerequisites

- Modern web browser with Web Components support
- API key from supported providers (OpenAI/Deepseek)
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

- OpenAI for GPT API
- Deepseek for their API service
- TinyMCE, CKEditor, Quill, and Froala teams for their editors
- marked.js for Markdown processing
- Lucide for icons