# AI Text Enhancer

A powerful web component for enhancing product descriptions using AI. This component integrates seamlessly with existing text editors and provides real-time AI-powered text enhancement capabilities.

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
- 🎯 TinyMCE integration support
- 🌐 Multiple AI provider support (OpenAI, Deepseek)
- 🔒 Shadow DOM encapsulation for style isolation

## Installation

```html
<!-- Include the web component -->
<script type="module" src="path/to/ai-text-enhancer.js"></script>
```

## Usage

### Basic Implementation

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

### TinyMCE Integration

```html
<ai-text-enhancer
  editor-id="tinymce-editor"
  api-key="your-api-key">
</ai-text-enhancer>

<textarea id="tinymce-editor"></textarea>

<script>
  tinymce.init({
    selector: '#tinymce-editor',
    // Your TinyMCE configuration...
  });
</script>
```

## Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| editor-id | ID of the target text editor | Required |
| api-key | Your AI provider API key | Required |
| api-provider | AI service provider (openai/deepseek) | "openai" |
| api-model | Model to use for text generation | Provider default |
| language | Interface language (en/es/fr/de/pt) | "en" |

### Language Support

The component supports multiple languages for its interface:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)

Example using different languages:

```html
<!-- English (default) -->
<ai-text-enhancer 
  editor-id="my-editor" 
  api-key="your-api-key">
</ai-text-enhancer>

<!-- Spanish -->
<ai-text-enhancer 
  editor-id="my-editor" 
  api-key="your-api-key" 
  language="es">
</ai-text-enhancer>

<!-- French -->
<ai-text-enhancer 
  editor-id="my-editor" 
  api-key="your-api-key" 
  language="fr">
</ai-text-enhancer>
```

## Cache Configuration

The component includes a smart caching system to improve performance and reduce API calls:

```javascript
const cacheOptions = {
  prefix: "ai-text-enhancer",
  maxItems: 20,
  ttl: 30 * 60 * 1000, // 30 minutes
  storage: window.sessionStorage
};
```

## Component Architecture

```
/ai-text-enhancer
  ├── src/
  │   ├── ai-text-enhancer.js       # Main component
  │   ├── styles.js                 # Encapsulated styles
  │   ├── markdown-handler.js       # Markdown processing
  │   ├── cache-manager.js          # Caching system
  │   └── api-client.js             # API client
  ├── demo/
  │   ├── index.html               # Demo page
  │   └── tinymce-integration.html # TinyMCE demo
  └── README.md                    # Documentation
```

## Development

### Prerequisites

- Modern web browser with Web Components support
- API key from supported providers (OpenAI/Deepseek)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-text-enhancer.git
cd ai-text-enhancer
```

2. Open demo/index.html in your browser to test the component.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Dependencies

- marked.js (loaded dynamically for Markdown support)
- No other external dependencies required

## Security Considerations

- API keys should be properly secured and not exposed in client-side code
- Component uses Shadow DOM for style encapsulation
- All content is processed locally before API transmission
- Cache data is stored in sessionStorage by default

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
- marked.js for Markdown processing
- TinyMCE team for editor compatibility