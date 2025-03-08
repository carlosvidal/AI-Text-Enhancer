# AI Text Enhancer

Un potente componente web para mejorar descripciones de productos usando IA. Este componente se integra perfectamente con múltiples editores de texto enriquecido y proporciona capacidades de mejora de texto en tiempo real mediante una arquitectura middleware segura.

## Características

- 🤖 **Soporte para múltiples proveedores de IA**:
  - OpenAI (GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
  - Anthropic (Claude 3 Opus, Claude 3 Sonnet)
  - Google (Gemini Pro)
  - Mistral AI
  - DeepSeek
  - Cohere
  
- 🎨 **Múltiples modos de mejora**:
  - **Mejorar**: Hace que las descripciones sean más profesionales y atractivas
  - **Resumir**: Crea versiones concisas manteniendo los puntos clave
  - **Expandir**: Añade más detalles y beneficios
  - **Parafrasear**: Reescribe el contenido manteniendo el mensaje
  - **Más formal**: Eleva el tono para un público profesional
  - **Más casual**: Hace que el texto sea más accesible y conversacional

- 🖼️ **Soporte para análisis de imágenes**:
  - Proveedores de IA como OpenAI y Anthropic pueden analizar imágenes de productos
  - Enriquece descripciones de productos con detalles visuales
  - Soporta carga de archivos y URLs de imágenes

- 💬 **Interfaz de chat interactiva**:
  - Realiza preguntas específicas sobre descripciones de productos
  - Sube imágenes para que la IA las referencie en las respuestas
  - Gestión inteligente del contexto

- 🔄 **Respuestas en streaming**:
  - Ve las respuestas de la IA aparecer mientras se generan
  - Animación de escritura suave sin parpadeos
  - Interfaz receptiva durante el procesamiento

- 🔌 **Arquitectura de proxy segura**:
  - Llamadas a la API enrutadas a través de middleware seguro
  - Sin exposición de claves API en código del lado del cliente
  - Modo de clave API directa opcional para pruebas

- 🌐 **Soporte multilenguaje**:
  - Interfaz en inglés, español, francés, alemán, italiano, portugués
  - Generación de contenido en múltiples idiomas
  - Prompts específicos por idioma

- 🏢 **Gestión multi-tenant y de usuarios**:
  - Capacidades de seguimiento de tenant y usuario
  - Estadísticas de uso y cuotas (opcional)
  - Implementación lista para empresas

- ⚡ **Optimizaciones de rendimiento**:
  - Sistema de caché inteligente para mejorar tiempos de respuesta
  - Renderizado eficiente con actualizaciones mínimas del DOM
  - Implementación consciente de los recursos

## Instalación

### Opción 1: Vía NPM

```bash
npm install ai-text-enhancer
```

```javascript
// Importar en tu JavaScript
import 'ai-text-enhancer';
```

### Opción 2: Vía CDN

```html
<!-- Incluir el componente web -->
<script type="module" src="https://cdn.example.com/ai-text-enhancer.js"></script>
```

## Implementación

### Integración básica (con middleware proxy)

Este es el enfoque recomendado para entornos de producción:

```html
<!-- Añadir el componente a tu HTML -->
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  api-model="gpt-4-turbo"
  language="en"
  proxy-endpoint="https://your-server.com/api/llm-proxy">
</ai-text-enhancer>

<!-- Editor de texto referenciado -->
<textarea id="my-editor">Tu descripción de producto aquí</textarea>
```

### Con clave API directa (solo para pruebas)

**⚠️ No recomendado para uso en producción! ⚠️**

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-key="your-api-key"
  api-provider="openai"
  api-model="gpt-4-turbo">
</ai-text-enhancer>
```

### Implementación multi-tenant

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  tenant-id="123"
  user-id="456"
  quota-endpoint="/api/quota">
</ai-text-enhancer>
```

### Con selección de idioma

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="anthropic"
  api-model="claude-3-opus-20240229"
  language="es">
</ai-text-enhancer>
```

## Integración con editores WYSIWYG

El componente integra perfectamente con varios editores WYSIWYG populares a través de su sistema de adaptadores.

### Adaptadores soportados

El componente incluye adaptadores optimizados para los siguientes editores:

- **TinyMCE**
- **CKEditor 5**
- **Quill**
- **Froala**
- **Textarea** (por defecto)

### Configuración del adaptador

Especifica el tipo de editor utilizando el atributo `editor-type`:

```html
<ai-text-enhancer
  editor-id="my-editor"
  editor-type="tinymce"
  api-provider="openai">
</ai-text-enhancer>
```

### Integración de botón en la barra de herramientas

Para añadir un botón de IA a la barra de herramientas del editor, sigue el patrón mostrado en nuestros ejemplos:

#### Ejemplo con TinyMCE:

```javascript
tinymce.init({
  selector: '#tinymce-editor',
  // Otras opciones de configuración...
  setup: function(editor) {
    // Añadir botón personalizado
    editor.ui.registry.addButton('ai_enhancer', {
      icon: 'magic',
      tooltip: 'Mejorar con IA',
      onAction: function() {
        // Referencia al componente AI Text Enhancer
        const enhancer = document.getElementById('my-enhancer');
        if (enhancer) {
          enhancer.openModal();
        }
      }
    });
  }
});
```

Ver los archivos de demostración en la carpeta `demo/` para ejemplos completos de integración con cada editor.

## Configuración del proxy del lado del servidor

El componente funciona de manera óptima con un proxy del lado del servidor para manejar llamadas a la API. Este proxy debe:

1. Autenticar la solicitud del cliente
2. Añadir la clave API a la solicitud saliente
3. Reenviar al proveedor de IA apropiado
4. Devolver la respuesta en streaming

Puedes configurar dinámicamente qué endpoint de proxy utilizar con el atributo `proxy-endpoint`. Esto es especialmente útil para:
- Diferentes entornos (desarrollo, staging, producción)
- Despliegues multi-región
- Implementaciones backend personalizadas
- Pruebas con diferentes configuraciones de proxy

### Configuración del endpoint de proxy

Puedes especificar tu endpoint de proxy personalizado utilizando el atributo `proxy-endpoint`:

```html
<ai-text-enhancer
  editor-id="my-editor"
  api-provider="openai"
  proxy-endpoint="https://your-custom-server.com/api/llm-proxy">
</ai-text-enhancer>
```

Si no se especifica, el componente utilizará el endpoint predeterminado: `http://llmproxy.test:8080/api/llm-proxy`

## Opciones de configuración

| Atributo | Descripción | Valor predeterminado |
|-----------|-------------|---------|
| `editor-id` | ID del elemento editor objetivo | Requerido |
| `editor-type` | Tipo de editor (textarea/tinymce/ckeditor/quill/froala) | "textarea" |
| `api-provider` | Proveedor de servicio de IA (openai/anthropic/deepseek/cohere/google/mistral) | "openai" |
| `api-model` | Modelo a usar para generación de texto | Predeterminado del proveedor |
| `language` | Idioma de la interfaz (en/es/fr/de/it/pt) | "en" |
| `proxy-endpoint` | URL personalizada para tu servicio de proxy | "http://llmproxy.test:8080/api/llm-proxy" |
| `prompt` | Prompt de sistema personalizado para la IA | Prompt predeterminado de experto en marketing |
| `tenant-id` | Identificador de tenant para configuraciones multi-tenant | "default" |
| `user-id` | Identificador de usuario para seguimiento de uso | "default" |
| `quota-endpoint` | Endpoint para verificación de cuota | Opcional |
| `image-url` | URL de una imagen para analizar | Opcional |
| `context` | Contexto adicional para la IA | Opcional |
| `hide-trigger` | Oculta el botón desencadenador (para integraciones personalizadas) | false |

### Modelos específicos por proveedor

#### OpenAI
- `gpt-4-turbo` (predeterminado)
- `gpt-4`
- `gpt-3.5-turbo`

#### Anthropic
- `claude-3-opus-20240229` (predeterminado)
- `claude-3-sonnet-20240229`

#### DeepSeek
- `deepseek-chat` (predeterminado)
- `deepseek-coder`

#### Google
- `gemini-pro` (predeterminado)
- `gemini-pro-vision` (para imágenes)

#### Mistral AI
- `mistral-large-latest` (predeterminado)
- `mistral-medium-latest`
- `mistral-small-latest`

## Eventos

| Nombre del evento | Descripción | Detalle |
|------------|-------------|--------|
| `toolaction` | Se dispara cuando se hace clic en un botón de herramienta | `{ action, responseId, content }` |
| `chatMessage` | Se dispara cuando se envía un mensaje de chat | `{ message, image }` |
| `responseCopy` | Se dispara cuando se copia una respuesta | `{ responseId }` |
| `responseUse` | Se dispara cuando se utiliza una respuesta | `{ responseId }` |
| `responseRetry` | Se dispara cuando se reintenta una acción de respuesta | `{ responseId, action }` |
| `stateChange` | Se dispara cuando cambia el estado del componente | `{ property, oldValue, newValue }` |
| `configurationUpdated` | Se dispara cuando se actualiza la configuración | Objeto de configuración |
| `ai-content-generated` | Se dispara cuando se ha generado nuevo contenido | `{ content }` |

## Configuración para desarrollo local

1. Clonar el repositorio
```bash
git clone https://github.com/yourusername/ai-text-enhancer.git
cd ai-text-enhancer
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar servidor de desarrollo
```bash
npm run dev
```

4. Construir para producción
```bash
npm run build
```

## Consideraciones de seguridad

- **NO** utilices el atributo `api-key` en entornos de producción
- Siempre implementa un middleware de proxy seguro para producción
- Considera implementar limitación de tasa y cuotas de uso
- Valida los permisos del usuario antes de procesar solicitudes

## Compatibilidad con navegadores

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Utiliza tecnología estándar de Web Components

## Contribuir

1. Haz un fork del repositorio
2. Crea tu rama de función (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Agradecimientos

- OpenAI, Anthropic, Google, Mistral, DeepSeek y Cohere por sus APIs
- marked.js para procesamiento de Markdown
- La comunidad de estándares de Web Components