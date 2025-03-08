# Guía de Integración con Editores

Este documento proporciona una guía detallada sobre cómo integrar AI Text Enhancer con diferentes editores WYSIWYG utilizando el sistema de adaptadores.

## Acerca del Sistema de Adaptadores

AI Text Enhancer utiliza un sistema de adaptadores para comunicarse con diferentes editores WYSIWYG. Este enfoque proporciona varias ventajas:

- **Abstracción uniforme**: Interactúa con cualquier editor a través de una API consistente
- **Manejo robusto de errores**: Incluye mecanismos de recuperación y fallbacks
- **Detección automática**: Encuentra instancias de editores incluso si no están disponibles inmediatamente
- **Soporte extensible**: Fácil de extender para nuevos editores

## Editores Soportados

Actualmente, AI Text Enhancer soporta los siguientes editores:

1. **Textarea** (predeterminado)
2. **TinyMCE**
3. **CKEditor 5**
4. **Quill**
5. **Froala**

## Configuración Básica

Para conectar AI Text Enhancer con un editor, necesitas configurar dos atributos clave:

```html
<ai-text-enhancer
  editor-id="id-del-elemento-editor"
  editor-type="tipo-de-editor">
</ai-text-enhancer>
```

- `editor-id`: El ID del elemento editor en el DOM
- `editor-type`: El tipo de editor (textarea, tinymce, ckeditor, quill, froala)

## Integración Paso a Paso por Editor

### Textarea (Editor básico)

La integración con textareas estándar es directa:

```html
<textarea id="simple-editor" placeholder="Escribe aquí...">Contenido inicial</textarea>
<ai-text-enhancer
  editor-id="simple-editor"
  editor-type="textarea">
</ai-text-enhancer>
```

### TinyMCE

Para TinyMCE, recomendamos añadir un botón personalizado a la barra de herramientas:

```javascript
tinymce.init({
  selector: '#tinymce-editor',
  // Configuración general de TinyMCE...
  toolbar: 'undo redo | formatselect | bold italic | ai_enhancer', // Añadir ai_enhancer al toolbar
  setup: function(editor) {
    // Registrar botón personalizado
    editor.ui.registry.addButton('ai_enhancer', {
      icon: 'magic', // O icono personalizado
      tooltip: 'Mejorar con IA',
      onAction: function() {
        // Obtener referencia al componente AI Text Enhancer
        const enhancer = document.getElementById('tinymce-enhancer');
        if (enhancer) {
          enhancer.openModal();
        }
      }
    });
    
    // Opcional: escuchar el evento ai-content-generated
    document.getElementById('tinymce-enhancer').addEventListener('ai-content-generated', function(event) {
      if (event.detail && event.detail.content) {
        editor.setContent(event.detail.content);
      }
    });
  }
});

// Configuración de AI Text Enhancer
<ai-text-enhancer
  id="tinymce-enhancer"
  editor-id="tinymce-editor"
  editor-type="tinymce"
  hide-trigger>
</ai-text-enhancer>
```

### CKEditor 5

Para CKEditor 5, añade un botón personalizado de manera similar:

```javascript
ClassicEditor.create(document.querySelector('#ckeditor-container'), {
  // Configuración de CKEditor...
  toolbar: ['heading', '|', 'bold', 'italic', '|', 'undo', 'redo']
}).then(editor => {
  // Guardar la instancia global para que el adaptador pueda encontrarla
  window.ckeditorInstance = editor;
  
  // Establecer contenido inicial si es necesario
  editor.setData('<p>Contenido inicial</p>');
  
  // Añadir botón de IA (personalizado, después de la inicialización)
  setTimeout(() => {
    const toolbar = document.querySelector('.ck-toolbar');
    if (toolbar) {
      const aiButton = document.createElement('span');
      aiButton.className = 'ck ck-button ai-enhancer-button';
      // Configurar HTML del botón...
      
      aiButton.addEventListener('click', () => {
        const enhancer = document.getElementById('ckeditor-enhancer');
        if (enhancer) {
          enhancer.openModal();
        }
      });
      
      toolbar.appendChild(aiButton);
    }
  }, 500);
}).catch(error => {
  console.error('Error inicializando CKEditor:', error);
});

// Configuración de AI Text Enhancer
<ai-text-enhancer
  id="ckeditor-enhancer"
  editor-id="ckeditor-container"
  editor-type="ckeditor"
  hide-trigger>
</ai-text-enhancer>
```

### Quill

Para Quill, la integración es similar:

```javascript
// Inicializar Quill
const quill = new Quill('#quill-editor', {
  theme: 'snow',
  // Opciones de Quill...
});

// Opcional: hacer la instancia disponible globalmente
window.quillInstance = quill;

// Añadir botón de IA a la barra de herramientas
setTimeout(() => {
  const toolbar = document.querySelector('.ql-toolbar');
  if (toolbar) {
    const aiButton = document.createElement('span');
    aiButton.className = 'ql-formats';
    // Configurar HTML del botón...
    
    aiButton.querySelector('button').addEventListener('click', () => {
      const enhancer = document.getElementById('quill-enhancer');
      if (enhancer) {
        enhancer.openModal();
      }
    });
    
    toolbar.appendChild(aiButton);
  }
}, 500);

// Configuración de AI Text Enhancer
<ai-text-enhancer
  id="quill-enhancer"
  editor-id="quill-editor"
  editor-type="quill"
  hide-trigger>
</ai-text-enhancer>
```

### Froala

Para Froala Editor:

```javascript
// Inicializar Froala
const editor = new FroalaEditor('#froala-editor', {
  // Opciones de Froala...
  events: {
    initialized: function() {
      // Guardar referencia global
      window.froalaInstance = this;
      
      // Añadir botón personalizado después de inicialización
      setTimeout(addAIButton, 500);
    }
  }
});

// Función para añadir botón de IA
function addAIButton() {
  const toolbar = document.querySelector('.fr-toolbar');
  if (!toolbar) return;
  
  // Crear botón
  const button = document.createElement('button');
  button.className = 'fr-command fr-btn ai-enhancer-button';
  // Configurar HTML del botón...
  
  button.addEventListener('click', function() {
    const enhancer = document.getElementById('froala-enhancer');
    if (enhancer) {
      enhancer.openModal();
    }
  });
  
  // Añadir a la barra de herramientas
  toolbar.querySelector('.fr-btn-grp').appendChild(button);
}

// Configuración de AI Text Enhancer
<ai-text-enhancer
  id="froala-enhancer"
  editor-id="froala-editor"
  editor-type="froala"
  hide-trigger>
</ai-text-enhancer>
```

## Manejo de Eventos

Para una integración completa, recomendamos manejar los siguientes eventos:

### Evento `responseUse`

Este evento se dispara cuando el usuario decide aplicar una respuesta generada por la IA:

```javascript
document.getElementById('my-enhancer').addEventListener('responseUse', function(event) {
  const { responseId } = event.detail;
  if (!responseId) return;
  
  // Obtener la respuesta del historial (método alternativo si el adaptador falla)
  const responseHistory = this.shadowRoot?.querySelector('response-history');
  if (!responseHistory) return;
  
  const response = responseHistory.getResponse(responseId);
  if (!response || !response.content) return;
  
  // Aplicar manualmente al editor si es necesario
  // Por ejemplo, para TinyMCE:
  if (window.tinymce && tinymce.get('tinymce-editor')) {
    tinymce.get('tinymce-editor').setContent(response.content);
  }
  
  // Cerrar el modal
  setTimeout(() => {
    const modal = this.shadowRoot?.querySelector('.modal');
    if (modal) modal.classList.remove('open');
  }, 100);
});
```

### Evento `ai-content-generated`

Este evento proporciona acceso al contenido generado:

```javascript
document.getElementById('my-enhancer').addEventListener('ai-content-generated', function(event) {
  if (event.detail && event.detail.content) {
    // Usar el contenido generado como sea necesario
    console.log('Contenido generado:', event.detail.content);
  }
});
```

## Recomendaciones para una Integración Óptima

1. **Usa el atributo `hide-trigger`** cuando añadas botones personalizados a la barra de herramientas del editor para evitar duplicar controles.

2. **Configura manejadores de eventos de respaldo** para `responseUse` para asegurar que el contenido se aplique correctamente incluso si hay algún problema con el adaptador.

3. **Configura el tipo de editor correcto** con el atributo `editor-type` para asegurar que el adaptador adecuado sea utilizado.

4. **Haz las instancias del editor accesibles globalmente** si es posible (como `window.tinymceInstance`) para facilitar que el adaptador las encuentre.

5. **Añade botones después de la inicialización completa** del editor usando `setTimeout` para evitar problemas de tiempo.

## Solución de Problemas

Si encuentras problemas con la integración del editor:

1. **Verificar la inicialización**: Asegúrate de que el editor esté completamente inicializado antes de intentar interactuar con él.

2. **Comprobar IDs**: Verifica que `editor-id` coincida exactamente con el ID del elemento editor.

3. **Inspeccionar adaptadores**: Puedes verificar si el adaptador está funcionando correctamente con:
   ```javascript
   const enhancer = document.getElementById('my-enhancer');
   console.log('Estado del adaptador:', enhancer.editorAdapter);
   ```

4. **Eventos manuales**: Si el adaptador no funciona como se espera, implementa manejadores manuales para los eventos clave.

5. **Depuración del editor**: Añade `debug: true` a las opciones de inicialización del editor para obtener más información.

## Extendiendo para Nuevos Editores

Si necesitas soportar un editor adicional, puedes crear un adaptador personalizado siguiendo el patrón de los adaptadores existentes. Un adaptador debe implementar al menos estos métodos:

- `getContent()`: Obtiene el contenido actual del editor
- `setContent(content)`: Establece nuevo contenido en el editor
- `waitForEditor()`: Espera a que el editor esté inicializado

Consulta los archivos en `src/utils/*-adapter.js` para ejemplos detallados.