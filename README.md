# AI Text Enhancer

A powerful web component for enhancing product descriptions using AI. This component integrates seamlessly with multiple rich text editors and provides real-time AI-powered text enhancement capabilities through a secure proxy middleware architecture.

## Features

- 🤖 **Multiple AI Provider Support**:
  - OpenAI (GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
  - Anthropic (Claude 3 Opus, Claude 3 Sonnet)
  - Google (Gemini Pro)
  - Mistral AI
  - DeepSeek
  - Cohere
  
- 🎨 **Multiple Enhancement Modes**:
  - **Improve**: Makes descriptions more professional and engaging
  - **Summarize**: Creates concise versions while maintaining key points
  - **Expand**: Adds more details and benefits
  - **Paraphrase**: Rewrites content while preserving the message
  - **More Formal**: Elevates the tone for a professional audience
  - **More Casual**: Makes text more approachable and conversational

- 🖼️ **Image Analysis Support**:
  - AI providers like OpenAI and Anthropic can analyze product images
  - Enriches product descriptions with visual details
  - Supports file uploads and image URLs

- 💬 **Interactive Chat Interface**:
  - Ask specific questions about product descriptions
  - Upload images for AI to reference in responses
  - Smart context management

- 🔄 **Real-time Streaming Responses**:
  - See AI responses appear as they're generated
  - Smooth typing animation without flickering
  - Responsive interface during processing

- 🔌 **Secure Proxy Architecture**:
  - API calls routed through secure middleware
  - No API keys exposed in client-side code
  - Optional direct API key mode for testing

- 🌐 **Multi-language Support**:
  - Interface in English, Spanish, French, German, Italian, Portuguese
  - Content generation in multiple languages
  - Language-specific prompts

- 🏢 **Multi-tenant & User Management**:
  - Tenant and user tracking capabilities
  - Usage statistics and quotas (optional)
  - Enterprise-ready implementation

- ⚡ **Performance Optimizations**:
  - Smart caching system for improved response times
  - Efficient rendering with minimal DOM updates
  - Resource-conscious implementation

## Installation

### Option 1: Via NPM

```bash
npm install ai-text-enhancer
```

```javascript
// Import in your JavaScript
import 'ai-text-enhancer';
```

### Option 2: Via CDN

```html
<!-- Include the web component -->
<script type="module" src="https://cdn.example.com/ai-text-enhancer.js"></script>
```

## Implementation

### Basic Integration (With Proxy Middleware)

This is the recommended approach for production environments:

```html
<!-- Add the component to your HTML -->
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  api-model="gpt-4-turbo"
  language="en"
  proxy-endpoint="https://your-server.com/api/llm-proxy">
</ai-text-enhancer>

<!-- Reference text editor -->
<textarea id="my-editor">Your product description here</textarea>
```

### With Direct API Key (Testing Only)

**⚠️ Not recommended for production use! ⚠️**

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-key="your-api-key"
  api-provider="openai"
  api-model="gpt-4-turbo">
</ai-text-enhancer>
```

### Multi-tenant Implementation

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  tenant-id="123"
  user-id="456"
  quota-endpoint="/api/quota">
</ai-text-enhancer>
```

### With Language Selection

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="anthropic"
  api-model="claude-3-opus-20240229"
  language="es">
</ai-text-enhancer>
```

## Server-side Proxy Setup

The component works optimally with a server-side proxy to handle API calls. This proxy should:

1. Authenticate the client request
2. Add the API key to the outgoing request
3. Forward to the appropriate AI provider
4. Return the streamed response

You can dynamically configure which proxy endpoint to use with the `proxy-endpoint` attribute. This is especially useful for:
- Different environments (development, staging, production)
- Multi-region deployments
- Custom backend implementations
- Testing with different proxy configurations

### Configuring the Proxy Endpoint

You can specify your custom proxy endpoint using the `proxy-endpoint` attribute:

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  proxy-endpoint="https://your-custom-server.com/api/llm-proxy">
</ai-text-enhancer>
```

If not specified, the component will use the default endpoint: `http://llmproxy.test:8080/api/llm-proxy`

## Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `editor-id` | ID of the target editor element | Required |
| `api-provider` | AI service provider (openai/anthropic/deepseek/cohere/google/mistral) | "openai" |
| `api-model` | Model to use for text generation | Provider default |
| `language` | Interface language (en/es/fr/de/it/pt) | "en" |
| `proxy-endpoint` | Custom URL for your proxy service | "http://llmproxy.test:8080/api/llm-proxy" |
| `prompt` | Custom system prompt for the AI | Default marketing expert prompt |
| `tenant-id` | Tenant identifier for multi-tenant setups | "default" |
| `user-id` | User identifier for usage tracking | "default" |
| `quota-endpoint` | Endpoint for quota checking | Optional |
| `image-url` | URL of an image to analyze | Optional |
| `context` | Additional context for the AI | Optional |

### Provider-specific Models

#### OpenAI
- `gpt-4-turbo` (default)
- `gpt-4`
- `gpt-3.5-turbo`

#### Anthropic
- `claude-3-opus-20240229` (default)
- `claude-3-sonnet-20240229`

#### DeepSeek
- `deepseek-chat` (default)
- `deepseek-coder`

#### Google
- `gemini-pro` (default)
- `gemini-pro-vision` (for images)

#### Mistral AI
- `mistral-large-latest` (default)
- `mistral-medium-latest`
- `mistral-small-latest`

## Events

| Event Name | Description | Detail |
|------------|-------------|--------|
| `toolaction` | Fired when a tool button is clicked | `{ action, responseId, content }` |
| `chatMessage` | Fired when a chat message is sent | `{ message, image }` |
| `responseCopy` | Fired when a response is copied | `{ responseId }` |
| `responseUse` | Fired when a response is used | `{ responseId }` |
| `responseRetry` | Fired when a response action is retried | `{ responseId, action }` |
| `stateChange` | Fired when component state changes | `{ property, oldValue, newValue }` |
| `configurationUpdated` | Fired when configuration is updated | Configuration object |

## Setup for Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-text-enhancer.git
cd ai-text-enhancer
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Security Considerations

- **DO NOT** use the `api-key` attribute in production environments
- Always implement a secure proxy middleware for production
- Consider implementing rate limiting and usage quotas
- Validate user permissions before processing requests

## Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Uses standard Web Components technology

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI, Anthropic, Google, Mistral, DeepSeek, and Cohere for their APIs
- marked.js for Markdown processing
- The Web Components standards community