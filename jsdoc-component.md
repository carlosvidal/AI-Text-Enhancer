# Referencia de API para AI Text Enhancer

Este documento proporciona información detallada sobre los métodos, propiedades y eventos disponibles en el componente AI Text Enhancer.

## Componente `<ai-text-enhancer>`

### Propiedades

> ⚠️ **Seguridad:** El componente solo debe configurarse con el atributo `proxy-endpoint`, que apunta a tu backend seguro. No se debe exponer ninguna clave API ni configurar providers/modelos desde el frontend.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `editorId` | String | El ID del elemento editor asociado |
| `editorType` | String | Tipo de editor (textarea, tinymce, ckeditor, quill, froala) |
| `language` | String | Código del idioma actual (en, es, fr, de, it, pt) |

| `currentContent` | String | Contenido actual del editor (solo lectura) |
| `isInitialized` | Boolean | Si el componente está completamente inicializado |
| `imageUrl` | String | URL de imagen para analizar (si existe) |
| `context` | String | Contexto adicional para el procesamiento |

### Métodos

#### `openModal()`
Abre el modal de AI Text Enhancer.

```javascript
const enhancer = document.getElementById('my-enhancer');
enhancer.openModal();
```

#### `handleToolAction(event)`
Procesa una acción de herramienta (como mejorar, resumir, etc).

```javascript
enhancer.handleToolAction({
  detail: {
    action: 'improve',
    content: 'Texto para mejorar'
  }
});
```

#### `handleChatMessage(event)`
Procesa un mensaje de chat, opcionalmente con una imagen.

```javascript
enhancer.handleChatMessage({
  detail: {
    message: 'Pregunta para la IA',
    image: fileObject // Opcional
  }
});
```

#### `addResponseToHistory(action, content)`
Añade una nueva respuesta al historial.

```javascript
enhancer.addResponseToHistory('improve', 'Texto mejorado para mostrar');
```

#### `initializeComponents()`
Inicializa los componentes internos (marcado, API client, etc).

```javascript
await enhancer.initializeComponents();
```

#### `updateVisibleTools()`
Actualiza qué herramientas se muestran basado en el contenido actual.

```javascript
enhancer.updateVisibleTools();
```

### Eventos

#### `toolaction`
Disparado cuando se selecciona una herramienta (mejorar, resumir, etc.).

```javascript
enhancer.addEventListener('toolaction', function(event) {
  console.log('Acción:', event.detail.action);
  console.log('Contenido:', event.detail.content);
});
```

#### `chatMessage`
Disparado cuando se envía un mensaje de chat.

```javascript
enhancer.addEventListener('chatMessage', function(event) {
  console.log('Mensaje:', event.detail.message);
  console.log('Imagen:', event.detail.image);
});
```

#### `responseUse`
Disparado cuando el usuario decide utilizar una respuesta generada.

```javascript
enhancer.addEventListener('responseUse', function(event) {
  console.log('ID de respuesta utilizada:', event.detail.responseId);
});
```

#### `responseCopy`
Disparado cuando se copia una respuesta.

```javascript
enhancer.addEventListener('responseCopy', function(event) {
  console.log('ID de respuesta copiada:', event.detail.responseId);
});
```

#### `responseRetry`
Disparado cuando se reintenta una acción.

```javascript
enhancer.addEventListener('responseRetry', function(event) {
  console.log('ID de respuesta:', event.detail.responseId);
  console.log('Acción:', event.detail.action);
});
```

#### `ai-content-generated`
Disparado cuando se genera nuevo contenido.

```javascript
enhancer.addEventListener('ai-content-generated', function(event) {
  console.log('Contenido generado:', event.detail.content);
});
```

#### `configurationUpdated`
Disparado cuando se actualiza la configuración.

```javascript
enhancer.addEventListener('configurationUpdated', function(event) {
  console.log('Nueva configuración:', event.detail);
});
```

#### `stateChange`
Disparado cuando cambia cualquier propiedad del estado interno.

```javascript
enhancer.addEventListener('stateChange', function(event) {
  console.log('Propiedad:', event.detail.property);
  console.log('Valor anterior:', event.detail.oldValue);
  console.log('Nuevo valor:', event.detail.newValue);
});
```

## Sistema de Adaptadores

### `EditorAdapter`

La clase central que maneja la comunicación con diferentes editores.

```javascript
const adapter = enhancer.editorAdapter;
```

#### Métodos

| Método | Descripción |
|--------|-------------|
| `getContent()` | Obtiene el contenido del editor |
| `setContent(content)` | Establece el contenido del editor |
| `insertContent(content)` | Inserta contenido en la posición actual |
| `getSelection()` | Obtiene el texto seleccionado actualmente en el editor |
| `replaceSelection(content)` | Reemplaza la selección actual con contenido nuevo |
| `hasContent()` | Verifica si el editor tiene contenido |
| `setEditorType(type)` | Actualiza el tipo de editor dinámicamente |

### Adaptadores específicos por editor

AI Text Enhancer utiliza adaptadores especializados para cada tipo de editor. Estos se crean automáticamente según el valor del atributo `editor-type`.

#### `TinyMCEAdapter`

Adaptador especializado para TinyMCE.

```javascript
import { createTinyMCEAdapter } from 'ai-text-enhancer/utils/tinymce-adapter.js';
const tinyMCEAdapter = createTinyMCEAdapter('editor-id');
```

#### `CKEditorAdapter`

Adaptador especializado para CKEditor 5.

```javascript
import { createCKEditorAdapter } from 'ai-text-enhancer/utils/ckeditor-adapter.js';
const ckEditorAdapter = createCKEditorAdapter('editor-id');
```

#### `QuillAdapter`

Adaptador especializado para Quill.

```javascript
import { createQuillAdapter } from 'ai-text-enhancer/utils/quill-adapter.js';
const quillAdapter = createQuillAdapter('editor-id');
```

#### `FroalaAdapter`

Adaptador especializado para Froala Editor.

```javascript
import { createFroalaAdapter } from 'ai-text-enhancer/utils/froala-adapter.js';
const froalaAdapter = createFroalaAdapter('editor-id');
```

## Otros servicios disponibles

El componente expone algunos servicios internos que pueden ser útiles para integraciones avanzadas.

### `NotificationManager`

Gestiona las notificaciones del sistema.

```javascript
const notificationManager = enhancer.notificationManager;

// Mostrar diferentes tipos de notificaciones
notificationManager.success('Operación completada');
notificationManager.error('Ha ocurrido un error');
notificationManager.warning('Advertencia importante');
notificationManager.info('Información relevante');
```

### `APIClient`

Maneja las comunicaciones con los proveedores de IA.

```javascript
const apiClient = enhancer.apiClient;

// Actualizar configuración
apiClient.updateConfig({
  provider: 'anthropic',
  model: 'claude-3-opus-20240229'
});

// Comprobar si el proveedor soporta imágenes
const supportsImages = apiClient.supportsImages;
```

### `CacheManager`

Gestiona el almacenamiento en caché de las respuestas para mejorar el rendimiento.

```javascript
const cacheManager = enhancer.cacheManager;

// Obtener estadísticas de caché
const stats = cacheManager.getStats();
console.log(`Elementos en caché: ${stats.totalItems}`);

// Limpiar caché
cacheManager.clear();
```

### `MarkdownHandler`

Gestiona la conversión de markdown a HTML para mostrar las respuestas.

```javascript
const markdownHandler = enhancer.markdownHandler;

// Convertir markdown a HTML
const html = markdownHandler.convert('**Texto en negrita** y _cursiva_');
```

## Ejemplos completos de integración

### Integración básica con textarea

```html
<textarea id="editor" placeholder="Escribe aquí..."></textarea>
<ai-text-enhancer editor-id="editor"></ai-text-enhancer>

<script>
  // Escuchar eventos
  document.querySelector('ai-text-enhancer').addEventListener('responseUse', function(event) {
    console.log('Contenido aplicado al editor');
  });
</script>
```

### Integración avanzada con TinyMCE

```html
<div id="tinymce-editor"></div>
<ai-text-enhancer 
  id="my-enhancer"
  editor-id="tinymce-editor" 
  editor-type="tinymce"
  api-provider="openai"
  api-model="gpt-4-turbo"
  hide-trigger>
</ai-text-enhancer>

<script>
  // Inicializar TinyMCE
  tinymce.init({
    selector: '#tinymce-editor',
    toolbar: 'bold italic | ai_enhancer',
    setup: function(editor) {
      // Añadir botón personalizado
      editor.ui.registry.addButton('ai_enhancer', {
        icon: 'magic',
        tooltip: 'AI Text Enhancer',
        onAction: function() {
          document.getElementById('my-enhancer').openModal();
        }
      });
      
      // Manejar contenido generado
      document.getElementById('my-enhancer').addEventListener('ai-content-generated', function(e) {
        if (e.detail && e.detail.content) {
          editor.setContent(e.detail.content);
          editor.undoManager.add();
        }
      });
    }
  });
</script>
```