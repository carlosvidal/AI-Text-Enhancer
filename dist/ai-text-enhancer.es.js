const VERSION = "1.1.0";
const BUILD_DATE = "2025-06-19T17:25:09.705Z";
const TRANSLATIONS = {
  en: {
    modalTrigger: "Enhance with AI (Beta)",
    modalTitle: "Enhance your text with AI",
    tools: {
      improve: "Improve",
      summarize: "Summarize",
      expand: "Expand",
      paraphrase: "Paraphrase",
      "more-formal": "More Formal",
      "more-casual": "More Casual",
      "chat-question": "Question",
      "chat-response": "Response",
      "chat-error": "Error"
    },
    actions: {
      copy: "Copy",
      use: "Use",
      edit: "Edit",
      retry: "Retry",
      insert: "Insert",
      replace: "Replace",
      generate: "Generate"
    },
    preview: {
      placeholder: "Enhanced text will appear here"
    },
    chat: {
      placeholder: "Ask a question about the product description...",
      question: "Question",
      contentPrompt: "Could you improve the text I have in the editor?",
      contextPrompt: "Please create a professional description based on the following context.",
      emptyPrompt: "What type of content would you like me to help you create?"
    },
    errors: {
      initialization: "Error initializing component:",
      request: "Error processing request:"
    }
  },
  es: {
    modalTrigger: "Mejorar con IA (Beta)",
    modalTitle: "Mejora tu texto con IA",
    tools: {
      improve: "Mejorar",
      summarize: "Resumir",
      expand: "Ampliar",
      paraphrase: "Parafrasear",
      "more-formal": "Más formal",
      "more-casual": "Más casual",
      "chat-question": "Pregunta",
      "chat-response": "Respuesta",
      "chat-error": "Error"
    },
    actions: {
      copy: "Copiar",
      use: "Usar",
      edit: "Editar",
      retry: "Reintentar",
      insert: "Insertar",
      replace: "Reemplazar",
      generate: "Generar"
    },
    preview: {
      placeholder: "El texto mejorado aparecerá aquí"
    },
    chat: {
      placeholder: "Haz una pregunta sobre la descripción del producto...",
      question: "Pregunta",
      contentPrompt: "¿Podrías mejorar el texto que tengo en el editor?",
      contextPrompt: "Por favor, crea una descripción profesional basada en el siguiente contexto.",
      emptyPrompt: "¿Qué tipo de contenido te gustaría que te ayude a crear?"
    },
    errors: {
      initialization: "Error inicializando componente:",
      request: "Error procesando solicitud:"
    }
  },
  fr: {
    modalTrigger: "Améliorer avec IA (Beta)",
    modalTitle: "Améliorez votre texte avec IA",
    tools: {
      improve: "Améliorer",
      summarize: "Résumer",
      expand: "Développer",
      paraphrase: "Paraphraser",
      "more-formal": "Plus Formel",
      "more-casual": "Plus Décontracté",
      "chat-question": "Question",
      "chat-response": "Réponse",
      "chat-error": "Erreur"
    },
    actions: {
      retry: "Réessayer",
      insert: "Insérer",
      replace: "Remplacer",
      generate: "Générer",
      copy: "Copier",
      use: "Utiliser",
      edit: "Éditer"
    },
    preview: {
      placeholder: "Le texte amélioré apparaîtra ici"
    },
    chat: {
      placeholder: "Posez une question sur la description du produit...",
      question: "Question",
      contentPrompt: "Pourriez-vous améliorer le texte que j'ai dans l'éditeur ?",
      contextPrompt: "Veuillez créer une description professionnelle basée sur le contexte suivant.",
      emptyPrompt: "Quel type de contenu souhaitez-vous que je vous aide à créer ?"
    },
    errors: {
      initialization: "Erreur d'initialisation du composant :",
      request: "Erreur lors du traitement de la demande :"
    }
  },
  de: {
    modalTrigger: "Beschreibung Verbessern mit KI (Beta)",
    modalTitle: "Verbessern Sie Ihre Beschreibun mit KI",
    tools: {
      improve: "Verbessern",
      summarize: "Zusammenfassen",
      expand: "Erweitern",
      paraphrase: "Umformulieren",
      "more-formal": "Formaler",
      "more-casual": "Lockerer",
      "chat-question": "Frage",
      "chat-response": "Antwort",
      "chat-error": "Fehler"
    },
    actions: {
      retry: "Wiederholen",
      insert: "Einfügen",
      replace: "Ersetzen",
      generate: "Generieren",
      copy: "Kopieren",
      use: "Verwenden",
      edit: "Bearbeiten"
    },
    preview: {
      placeholder: "Verbesserter Text erscheint hier"
    },
    chat: {
      placeholder: "Stellen Sie eine Frage zur Produktbeschreibung...",
      question: "Frage",
      contentPrompt: "Könnten Sie den Text in meinem Editor verbessern?",
      contextPrompt: "Bitte erstellen Sie eine professionelle Beschreibung basierend auf dem folgenden Kontext.",
      emptyPrompt: "Welche Art von Inhalt möchten Sie, dass ich Ihnen erstellen helfe?"
    },
    errors: {
      initialization: "Fehler bei der Initialisierung der Komponente:",
      request: "Fehler bei der Verarbeitung der Anfrage:"
    }
  },
  pt: {
    modalTrigger: "Melhorar com IA (Beta)",
    modalTitle: "Melhore sua texto com IA",
    tools: {
      improve: "Melhorar",
      summarize: "Resumir",
      expand: "Expandir",
      paraphrase: "Parafrasear",
      "more-formal": "Mais Formal",
      "more-casual": "Mais Casual",
      "chat-question": "Pergunta",
      "chat-response": "Resposta",
      "chat-error": "Erro"
    },
    actions: {
      retry: "Tentar Novamente",
      insert: "Inserir",
      replace: "Substituir",
      generate: "Gerar",
      copy: "Copiar",
      use: "Usar",
      edit: "Editar"
    },
    preview: {
      placeholder: "O texto melhorado aparecerá aqui"
    },
    chat: {
      placeholder: "Faça uma pergunta sobre a descrição do produto...",
      question: "Pergunta",
      contentPrompt: "Você poderia melhorar o texto que tenho no editor?",
      contextPrompt: "Por favor, crie uma descrição profissional com base no seguinte contexto.",
      emptyPrompt: "Que tipo de conteúdo você gostaria que eu ajudasse a criar?"
    },
    errors: {
      apiKey: "Erro: Chave API não configurada. Por favor, forneça uma chave API válida.",
      initialization: "Erro ao inicializar componente:",
      request: "Erro ao processar solicitação:"
    }
  },
  it: {
    modalTrigger: "Migliorare con IA (Beta)",
    modalTitle: "Migliorare il tuo testo con IA",
    tools: {
      improve: "Migliorare",
      summarize: "Sommario",
      expand: "Espandere",
      paraphrase: "Parafrasare",
      "more-formal": "Più Formale",
      "more-casual": "Più Casual",
      "chat-question": "Domanda",
      "chat-response": "Risposta",
      "chat-error": "Errore"
    },
    actions: {
      retry: "Riprova",
      insert: "Inserire",
      replace: "Sostituire",
      generate: "Generare",
      copy: "Copiare",
      use: "Usare",
      edit: "Modificare"
    },
    preview: {
      placeholder: "Il testo migliorato apparirà qui"
    },
    chat: {
      placeholder: "Fai una domanda sulla descrizione del prodotto...",
      question: "Domanda",
      contentPrompt: "Potresti migliorare il testo che ho nell'editor?",
      contextPrompt: "Per favore, crea una descrizione professionale basata sul seguente contesto.",
      emptyPrompt: "Che tipo di contenuto vorresti che ti aiutassi a creare?"
    },
    errors: {
      apiKey: "Errore: Chiave API non configurata. Fornisci una chiave API valida.",
      initialization: "Errore inizializzazione componente:",
      request: "Errore elaborazione richiesta:"
    }
  }
};
const getToolIcon = (action) => {
  const icons = {
    improve: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
          <path d="m14 7 3 3"/>
        </svg>
      `,
    summarize: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/>
        </svg>
      `,
    expand: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M9 10h6"/><path d="M12 7v6"/>
        </svg>
      `,
    paraphrase: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/>
          <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
          <path d="M11 10v4h4"/>
        </svg>
      `,
    "more-formal": `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      `,
    "more-casual": `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" x2="9.01" y1="9" y2="9"/>
          <line x1="15" x2="15.01" y1="9" y2="9"/>
        </svg>
      `,
    "chat-question": `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `,
    "chat-response": `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 15a2 2 0 0 0 2 2h14l4 4V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
      </svg>
    `,
    "chat-error": `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    `
  };
  return icons[action] || icons.improve;
};
const variables = `
  :host {
    --ai-primary: #3b82f6;
    --ai-primary-hover: #2563eb;
    --ai-secondary: #e5e7eb;
    --ai-secondary-hover: #d1d5db;
    --ai-text: #1f2937;
    --ai-text-light: #6b7280;
    --ai-border: #e5e7eb;
    --ai-success: #10b981;
    --ai-warning: #f59e0b;
    --ai-error: #dc2626;
    --ai-background: #ffffff;
    --ai-background-light: #f9fafb;
    
    --ai-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --ai-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --ai-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    
    --ai-radius-sm: 0.375rem;
    --ai-radius: 0.5rem;
    --ai-radius-md: 0.75rem;
    --ai-radius-lg: 1rem;
    
    --ai-font-sans: system-ui, -apple-system, sans-serif;
    --ai-z-modal: 99999;
    --ai-z-content: 100000;

    /* Gradient colors */
    --ai-gradient-start: #da22ff;
    --ai-gradient-middle: #9733ee;
    --ai-gradient-end: #da22ff;
  }
`;
const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes glow {
    0% { background-position: 0 0; }
    50% { background-position: 200% 0; }
    100% { background-position: 0 0; }
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    50% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes typingCursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* Typing animation styles */
  .typing-animation::after {
    content: '|';
    color: var(--ai-primary, #2563eb);
    animation: typingCursor 1s infinite;
    margin-left: 2px;
  }

  .typing-animation {
    position: relative;
  }
`;
const previewStyles = `
  .preview {
    flex: 1;
    overflow-y: auto;
    background: var(--ai-background);
    border-radius: var(--ai-radius);
  }

  .response-tool {
    font-weight: 500;
    color: var(--ai-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .response-timestamp {
    color: var(--ai-text-light);
    font-size: 0.875rem;
  }

  .response-action.primary {
    background: var(--ai-primary);
    color: white;
  }

  .response-action.primary:hover {
    background: var(--ai-primary-hover);
  }
`;
const responseHistoryStyles = `
  /* ===== CONTENEDORES PRINCIPALES ===== */
  .response-container {
    overflow-y: auto;
    max-height: 100%;
  }

  .response-entry {
    background: var(--ai-surface);
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
    margin-bottom: 1rem;
    padding: 1rem;
    /* Optimizaciones de rendimiento */
    contain: content;
    position: relative;
    will-change: contents;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  .response-content-wrapper {
    flex: 1;
    min-width: 0;
    /* Optimizar para cambios frecuentes */
    will-change: contents;
  }

  .response-entry[data-action="error"],
  .response-entry[data-action="info"],
  .response-entry[data-action="chat-error"] {
    background: var(--ai-surface-light);
    border-left: 3px solid var(--ai-error);
    padding-left: calc(1rem - 3px);
  }

  .response-entry[data-action="info"] {
    border-left-color: var(--ai-info);
  }

  /* ===== ÁREA DE CONTENIDO ===== */
  .response-content {
    margin: 1rem 0;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
    position: relative;
    min-height: 1.5em;
  }

  /* Control para streaming activo */
  .response-content[data-streaming-active="true"] {
    transition: none !important;
    user-select: none;
  }

  /* Desactivar transiciones durante streaming para contenido anidado */
  .response-content[data-streaming-active="true"] * {
    transition: none !important;
  }

  /* Restaurar selección cuando termina el streaming */
  .response-content:not([data-streaming-active="true"]) {
    user-select: text;
  }

  /* Contenido para markdown */
  .response-content p {
    margin: 0.5em 0;
    animation: textReveal 0.2s ease-out forwards;
  }

  .response-content ul, 
  .response-content ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  .response-content pre {
    background: var(--ai-surface-dark);
    padding: 1rem;
    border-radius: var(--ai-radius);
    overflow-x: auto;
    margin-bottom: 1em;
  }

  .response-content code {
    font-family: var(--ai-font-mono);
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    background: var(--ai-surface-dark);
    border-radius: var(--ai-radius-sm);
  }

  /* Mantener contenido estable */
  .response-content p, 
  .response-content ul, 
  .response-content ol,
  .response-content pre {
    contain: layout;
  }

  /* Eliminar margen en el último elemento para mantener espaciado consistente */
  .response-content > *:last-child {
    margin-bottom: 0;
  }

  /* ===== ANIMACIÓN DE ESCRITURA ===== */
  /* Deshabilitar el cursor por defecto */
  .response-content::after {
    content: none;
  }

  /* Cursor de escritura personalizado */
  .typing-animation::after {
    content: '|';
    display: inline-block;
    width: 0.5em;
    height: 1.2em;
    background: transparent;
    margin-left: 1px;
    border: none;
    animation: typingCursor 0.8s infinite step-end;
    vertical-align: middle;
    position: relative;
    opacity: 0.8;
  }

  /* Eliminar CUALQUIER cursor adicional */
  .typing-animation span.typing,
  .typing span.cursor,
  span.typing-cursor {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  /* Animación del cursor */
  @keyframes typingCursor {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0; }
  }

  /* Indicadores de carga */
  .typing-indicator {
    color: var(--ai-text-light);
    font-style: italic;
    padding: 0.25rem 0;
    animation: fadeInOut 1.5s ease-in-out infinite;
  }

  /* Animación para indicadores de carga */
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* Efecto de texto apareciendo gradualmente */
  @keyframes textReveal {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mensajes de estado iniciales para contenido vacío */
  .response-entry[data-action="chat-response"] .response-content:empty::after,
  .response-entry[data-action="summarize"] .response-content:empty::after,
  .response-entry[data-action="improve"] .response-content:empty::after,
  .response-entry[data-action="expand"] .response-content:empty::after,
  .response-entry[data-action="paraphrase"] .response-content:empty::after,
  .response-entry[data-action="more-formal"] .response-content:empty::after,
  .response-entry[data-action="more-casual"] .response-content:empty::after {
    content: 'Pensando...';
    color: var(--ai-text-light);
    font-style: italic;
  }

  .response-entry[data-action="chat-response"] .response-content:empty::after {
    content: 'Escribiendo respuesta...';
  }

  /* ===== CABECERA Y PIE DE RESPUESTA ===== */
  .response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    color: var(--ai-text-secondary);
  }

.response-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem !important;
  margin-top: 0.5rem !important;
  border-top: 1px solid var(--ai-border);
  flex-wrap: wrap;
  gap: 0.75rem;
}

  /* ===== BOTONES Y ACCIONES ===== */
  .response-actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

.response-tools {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 0.25rem;
  -webkit-overflow-scrolling: touch;
  scroll-padding: 0.5rem;
  scroll-snap-type: x proximity;
}

  .response-tools::-webkit-scrollbar {
    height: 4px;
  }

  .response-tools::-webkit-scrollbar-track {
    background: var(--ai-surface-light);
    border-radius: 2px;
  }

  .response-tools::-webkit-scrollbar-thumb {
    background: var(--ai-surface-dark);
    border-radius: 2px;
  }

  .response-action,
.tool-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--ai-background);
  border: none;
  border-radius: var(--ai-radius);
  color: var(--ai-text);
  font-size: 0.8125rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  scroll-snap-align: start;
}

.response-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: var(--ai-radius);
  background: var(--ai-surface-dark, #f1f5f9);
  color: var(--ai-text);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

  .response-action:hover,
  .tool-button:hover {
    background: var(--ai-secondary);
  color: var(--ai-text);
  transform: translateY(-1px);
  }

  .response-action svg,
  .tool-button svg {
    width: 16px;
    height: 16px;
  }

  /* ===== IMÁGENES Y ADJUNTOS ===== */
  .response-entry.with-image {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: start;
  }

  .response-image-container {
    width: 120px;
  }

  .image-preview {
    width: 120px;
    height: 120px;
    border-radius: var(--ai-radius);
    overflow: hidden;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .response-content-with-image {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin: 1rem 0;
  }

  .response-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .response-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  .image-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    margin-top: 0.25rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Estilos para imágenes en las respuestas */
  .response-entry img {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .response-content .image-preview-card {
    flex-shrink: 0;
    width: 100px;
    margin: 0;
  }

  .response-content .image-preview-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  .response-content .image-preview-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    text-align: center;
    margin-top: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ===== PREGUNTAS CON IMÁGENES ===== */
  .question-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .question-content {
    flex: 1;
    min-width: 0;
  }

  .question-image {
    flex-shrink: 0;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .question-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--ai-radius);
    border: 1px solid var(--ai-border);
  }

  .question-image .image-filename {
    font-size: 0.75rem;
    color: var(--ai-text-light);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  .question-with-image {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin: 0.5rem 0;
  }

  /* ESTILO PARA MENSAJES DE INFORMACIÓN */
.response-entry[data-action="info"],
.response-entry[data-action="error"],
.response-entry[data-action="chat-error"] {
  background-color: var(--ai-surface-light, #f9fafb);
  padding: 0.5rem 0.75rem !important; 
  display: flex !important;
  align-items: center !important;
  max-height: none !important;
}

.response-entry[data-action="info"] .response-header,
.response-entry[data-action="error"] .response-header,
.response-entry[data-action="chat-error"] .response-header {
  display: none !important; /* Ocultar header para más compacidad */
}

/* ESTILO PARA PREGUNTAS */
.response-entry[data-action="chat-question"] {
  padding: 0.5rem 0.75rem !important;
  max-height: none !important;
  margin-right: 5rem;
    background: aliceblue;
}

.response-entry[data-action="chat-response"] {
    margin-left: 5rem;
}

.action-text {
  display: none;
  margin-left: 0.25rem;
  font-size: 0.8125rem;
  opacity: 0;
  transform: translateX(-0.5rem);
  transition: all 0.2s ease;
}

.response-action:hover .action-text {
  display: inline;
  opacity: 1;
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .response-action {
    padding: 0.5rem 0.75rem;
  }
  
  .action-text {
    display: inline;
    opacity: 1;
    transform: translateX(0);
  }
}
  /* Fix for question entries - no footer */
.response-entry[data-action="chat-question"] .response-footer {
  display: none !important;
}

/* Additional optimizations for mobile layout */
@media (max-width: 640px) {
  .response-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .response-tools {
    width: 100%;
    padding-bottom: 0.5rem;
  }
  
  .response-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
`;
class ResponseHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.responses = [];
    this.markdownHandler = null;
  }
  static get observedAttributes() {
    return ["language"];
  }
  get language() {
    const lang = this.getAttribute("language");
    console.log("[ResponseHistory] Getting language:", lang);
    return lang || "en";
  }
  connectedCallback() {
    console.log("[ResponseHistory] Connected, language:", this.language);
    console.log(
      "[ResponseHistory] Has language attribute:",
      this.hasAttribute("language")
    );
    console.log("[ResponseHistory] All attributes:", this.getAttributeNames());
    this.translations = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    console.log("[ResponseHistory] Initial translations:", this.translations);
    this.render();
    this.setupEventListeners();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "[ResponseHistory] Attribute changed:",
      name,
      "from",
      oldValue,
      "to",
      newValue
    );
    if (name === "language" && oldValue !== newValue) {
      console.log(
        "[ResponseHistory] Updating translations for new language:",
        newValue
      );
      this.translations = TRANSLATIONS[newValue] || TRANSLATIONS.en;
      console.log("[ResponseHistory] New translations:", this.translations);
      this.render();
    }
  }
  // Versión optimizada de createResponseEntry para reducir espacios en blanco innecesarios
  // Sobrescribir el método createResponseEntry para manejar específicamente mensajes info y preguntas
  createResponseEntry(response) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const entry = document.createElement("div");
    entry.className = "response-entry";
    entry.dataset.id = response.id;
    entry.dataset.action = response.action;
    const isInfo = ["info", "error", "chat-error"].includes(response.action);
    const isQuestion = response.action === "chat-question";
    if (isInfo) {
      entry.innerHTML = `
      <div class="response-content-wrapper">
        <div class="response-content">
          ${this.markdownHandler ? this.markdownHandler.convert(response.content) : response.content}
        </div>
      </div>
    `;
      return entry;
    }
    if (isQuestion) {
      const hasImage = response.image !== void 0 && response.image !== null;
      if (hasImage) {
        entry.innerHTML = `
        <div class="response-content-wrapper">
          <div class="response-header mini">
            <div class="response-tool">
              ${getToolIcon(response.action)}
              <span>Pregunta:</span>
            </div>
            <div class="response-timestamp">${this.formatTimestamp(
          response.timestamp
        )}</div>
          </div>
          <div class="question-container">
            <div class="question-content">
              ${response.content.replace(/^\*\*Pregunta:\*\*\s*/i, "")}
            </div>
            <div class="question-image mini">
              <img src="${URL.createObjectURL(
          response.image
        )}" alt="Imagen adjunta">
            </div>
          </div>
        </div>
      `;
      } else {
        entry.innerHTML = `
        <div class="response-content-wrapper">
          <div class="response-header mini">
            <div class="response-tool">
              ${getToolIcon(response.action)}
              <span>Pregunta:</span>
            </div>
            <div class="response-timestamp">${this.formatTimestamp(
          response.timestamp
        )}</div>
          </div>
          <div class="response-content">
            ${response.content.replace(/^\*\*Pregunta:\*\*\s*/i, "")}
          </div>
        </div>
        `;
      }
      return entry;
    }
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "response-content-wrapper";
    const isLoading = response.content === "" || response.content.length < 5;
    const contentClass = isLoading ? "response-content typing-animation" : "response-content";
    let mainContent;
    if (response.action === "image-upload") {
      mainContent = response.content;
    } else if (isLoading) {
      if (response.action === "chat-response") {
        mainContent = `<div class="typing-indicator">Escribiendo respuesta...</div>`;
      } else if ([
        "improve",
        "summarize",
        "expand",
        "paraphrase",
        "more-formal",
        "more-casual"
      ].includes(response.action)) {
        mainContent = `<div class="typing-indicator">Pensando...</div>`;
      } else {
        mainContent = "";
      }
    } else if (response.action === "chat-response") {
      if (response.streamingActive === false || response.streamingActive === void 0) {
        mainContent = this.markdownHandler ? this.markdownHandler.convert(response.content) : response.content;
      } else {
        mainContent = response.content;
      }
    } else {
      mainContent = this.markdownHandler ? this.markdownHandler.convert(response.content) : response.content;
    }
    const isSystemMessage = ["error", "info", "chat-error"].includes(
      response.action
    );
    let toolsHtml = "";
    if (!isQuestion && !isSystemMessage) {
      toolsHtml = `
        <button class="tool-button" data-action="improve" data-response-id="${response.id}">
          ${getToolIcon("improve")}
          ${((_b = (_a = this.translations) == null ? void 0 : _a.tools) == null ? void 0 : _b.improve) || "Improve"}
        </button>
        <button class="tool-button" data-action="summarize" data-response-id="${response.id}">
          ${getToolIcon("summarize")}
          ${((_d = (_c = this.translations) == null ? void 0 : _c.tools) == null ? void 0 : _d.summarize) || "Summarize"}
        </button>
        <button class="tool-button" data-action="expand" data-response-id="${response.id}">
          ${getToolIcon("expand")}
          ${((_f = (_e = this.translations) == null ? void 0 : _e.tools) == null ? void 0 : _f.expand) || "Expand"}
        </button>
        <button class="tool-button" data-action="paraphrase" data-response-id="${response.id}">
          ${getToolIcon("paraphrase")}
          ${((_h = (_g = this.translations) == null ? void 0 : _g.tools) == null ? void 0 : _h.paraphrase) || "Paraphrase"}
        </button>
        <button class="tool-button" data-action="more-formal" data-response-id="${response.id}">
          ${getToolIcon("more-formal")}
          ${((_j = (_i = this.translations) == null ? void 0 : _i.tools) == null ? void 0 : _j["more-formal"]) || "More Formal"}
        </button>
        <button class="tool-button" data-action="more-casual" data-response-id="${response.id}">
          ${getToolIcon("more-casual")}
          ${((_l = (_k = this.translations) == null ? void 0 : _k.tools) == null ? void 0 : _l["more-casual"]) || "More Casual"}
        </button>
      `;
    }
    const actionsHtml = !isSystemMessage && !isQuestion ? `
<div class="response-footer">
  <div class="response-tools">
    ${toolsHtml}
  </div>
  <div class="response-actions">
    <button class="response-action copy-button" data-response-id="${response.id}" title="${((_n = (_m = this.translations) == null ? void 0 : _m.actions) == null ? void 0 : _n.copy) || "Copy"}">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span class="action-text">${((_p = (_o = this.translations) == null ? void 0 : _o.actions) == null ? void 0 : _p.copy) || "Copy"}</span>
    </button>
    <button class="response-action use-button" data-response-id="${response.id}" title="${((_r = (_q = this.translations) == null ? void 0 : _q.actions) == null ? void 0 : _r.use) || "Use"}">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span class="action-text">${((_t = (_s = this.translations) == null ? void 0 : _s.actions) == null ? void 0 : _t.use) || "Use"}</span>
    </button>
    <button class="response-action retry-button" data-response-id="${response.id}" data-action="${response.action}" title="${((_v = (_u = this.translations) == null ? void 0 : _u.actions) == null ? void 0 : _v.retry) || "Retry"}">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
      </svg>
      <span class="action-text">${((_x = (_w = this.translations) == null ? void 0 : _w.actions) == null ? void 0 : _x.retry) || "Retry"}</span>
    </button>
  </div>
</div>
` : "";
    contentWrapper.innerHTML = `
    <div class="response-header">
      <div class="response-tool">
        ${getToolIcon(response.action)}
        <span>${((_y = this.translations) == null ? void 0 : _y.tools[response.action]) || response.action}</span>
      </div>
      <div class="response-timestamp">${this.formatTimestamp(
      response.timestamp
    )}</div>
    </div>
    <div class="${contentClass}">
      ${mainContent}
    </div>
    ${actionsHtml}
  `;
    if (!this.shadowRoot.querySelector("#mini-elements-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "mini-elements-style";
      styleEl.textContent = `
      /* Estilos para elementos miniatura */
      .mini {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .response-header.mini {
        margin-bottom: 0.25rem !important;
      }
      
      .response-footer.mini {
        padding-top: 0.25rem !important;
        display: flex;
        justify-content: flex-end;
      }
      
      .question-image.mini {
        width: 60px !important;
        height: 60px !important;
      }
      
      .question-image.mini img {
        width: 60px !important;
        height: 60px !important;
      }
      
      .response-action.mini {
        padding: 0.25rem !important;
      }
      
      /* Estilos específicos para mensajes de información */
      .response-entry[data-action="info"],
      .response-entry[data-action="error"],
      .response-entry[data-action="chat-error"] {
        padding: 0.5rem 0.75rem !important;
      }
      
      /* Estilos específicos para preguntas */
      .response-entry[data-action="chat-question"] {
        padding: 0.5rem 0.75rem !important;
      }
      
      .question-container {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin: 0;
        padding: 0;
      }
    `;
      this.shadowRoot.appendChild(styleEl);
    }
    entry.appendChild(contentWrapper);
    return entry;
  }
  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      var _a;
      const button = e.target.closest("button");
      if (!button) return;
      const responseId = button.dataset.responseId;
      if (!responseId) return;
      const response = this.getResponse(responseId);
      if (!response) return;
      if (button.classList.contains("tool-button")) {
        const action = button.dataset.action;
        console.log("[ResponseHistory] Tool button clicked:", {
          action,
          responseId,
          responseContent: response.content,
          responseContentLength: ((_a = response.content) == null ? void 0 : _a.length) || 0
        });
        this.dispatchEvent(
          new CustomEvent("toolaction", {
            detail: {
              action,
              responseId,
              content: response.content
            },
            bubbles: true,
            composed: true
          })
        );
      } else if (button.classList.contains("retry-button")) {
        const action = button.dataset.action;
        this.dispatchEvent(
          new CustomEvent("responseRetry", {
            detail: { responseId, action },
            bubbles: true,
            composed: true
          })
        );
      } else if (button.classList.contains("edit-button")) {
        this.dispatchEvent(
          new CustomEvent("responseEdit", {
            detail: { responseId },
            bubbles: true,
            composed: true
          })
        );
      } else if (button.classList.contains("copy-button")) {
        this.dispatchEvent(
          new CustomEvent("responseCopy", {
            detail: { responseId },
            bubbles: true,
            composed: true
          })
        );
      } else if (button.classList.contains("use-button")) {
        console.log("[ResponseHistory] Use button clicked");
        this.dispatchEvent(
          new CustomEvent("responseUse", {
            detail: { responseId },
            bubbles: true,
            composed: true
          })
        );
        setTimeout(() => {
          var _a2;
          console.log("[ResponseHistory] Attempting to close modal");
          try {
            let element = this;
            while (element) {
              console.log(
                "[ResponseHistory] Checking element for modal class:",
                element
              );
              if ((_a2 = element.classList) == null ? void 0 : _a2.contains("modal")) {
                console.log("[ResponseHistory] Found modal element:", element);
                element.classList.remove("open");
                break;
              }
              element = element.parentNode || element.getRootNode().host;
            }
          } catch (error) {
            console.error("[ResponseHistory] Error closing modal:", error);
          }
        }, 100);
      } else if (button.classList.contains("retry-button")) {
        const action = button.dataset.action;
        this.dispatchEvent(
          new CustomEvent("responseRetry", {
            detail: { responseId, action },
            bubbles: true,
            composed: true
          })
        );
      }
    });
  }
  getResponse(id) {
    console.log("[ResponseHistory] Getting response for ID:", id);
    console.log("[ResponseHistory] Available responses:", this.responses);
    const response = this.responses.find(
      (response2) => response2.id === parseInt(id)
    );
    console.log("[ResponseHistory] Found response:", response);
    return response;
  }
  addResponse(response) {
    console.log("[ResponseHistory] Adding response:", response);
    this.responses.push(response);
    this.render();
  }
  // Método mejorado para updateResponse en ResponseHistory.js con animación letra por letra
  updateResponse(id, contentOrCallback) {
    const index = this.responses.findIndex((r) => r.id === id);
    if (index === -1) return;
    const response = this.responses[index];
    const oldContent = response.content;
    if (typeof contentOrCallback === "function") {
      response.content = contentOrCallback(response.content);
    } else {
      response.content = contentOrCallback;
    }
    const isFirstUpdate = oldContent === "";
    const isIncrementalUpdate = typeof contentOrCallback === "function" && response.content.length > oldContent.length && response.content.startsWith(oldContent);
    const responseEntry = this.shadowRoot.querySelector(`[data-id="${id}"]`);
    if (!responseEntry) {
      this.render();
      return;
    }
    const contentElement = responseEntry.querySelector(".response-content");
    if (!contentElement) return;
    if (isFirstUpdate) {
      console.log(
        "[ResponseHistory] Primera actualización, configurando streaming"
      );
      let firstChunk = response.content || "";
      if (firstChunk.startsWith("aro,") || firstChunk.startsWith("laro,")) {
        console.warn(
          "[ResponseHistory] Detectado inicio truncado, reparando..."
        );
        firstChunk = "C" + firstChunk;
        response.content = firstChunk;
      }
      contentElement.innerHTML = "";
      const textContainer = document.createElement("span");
      contentElement.appendChild(textContainer);
      contentElement.dataset.streamingActive = "true";
      contentElement.classList.add("typing-animation");
      if (!contentElement._typingQueue) {
        contentElement._typingQueue = [];
        contentElement._currentText = "";
        contentElement._isTyping = false;
      }
      if (firstChunk) {
        this._addToTypingQueue(contentElement, firstChunk);
      }
    } else if (isIncrementalUpdate && contentElement.dataset.streamingActive === "true") {
      const newTextPart = response.content.substring(oldContent.length);
      if (newTextPart) {
        this._addToTypingQueue(contentElement, newTextPart);
      }
      const container = responseEntry.parentNode;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        if (isNearBottom) {
          container.scrollTop = container.scrollHeight;
        }
      }
    } else {
      console.log(
        "[ResponseHistory] Streaming completo o actualización no incremental"
      );
      const isStreamingComplete = response.content.length > 50;
      if (isStreamingComplete && contentElement.dataset.streamingActive === "true") {
        this._finishTypingAnimation(contentElement, response.content, () => {
          var _a;
          contentElement.classList.remove("typing-animation");
          contentElement.dataset.streamingActive = "false";
          const textContent = response.content;
          const scrollTop = ((_a = responseEntry.parentNode) == null ? void 0 : _a.scrollTop) || 0;
          if (this.markdownHandler) {
            try {
              contentElement.innerHTML = this.markdownHandler.convert(textContent);
            } catch (error) {
              console.error("[ResponseHistory] Error applying markdown:", error);
              contentElement.textContent = textContent;
            }
          } else {
            contentElement.textContent = textContent;
          }
          if (responseEntry.parentNode) {
            responseEntry.parentNode.scrollTop = scrollTop;
          }
        });
      } else if (!isIncrementalUpdate) {
        if (this.markdownHandler) {
          contentElement.innerHTML = this.markdownHandler.convert(
            response.content
          );
        } else {
          contentElement.textContent = response.content;
        }
      }
    }
  }
  // Método para añadir texto directamente (sin animación letra por letra)
  _addToTypingQueue(contentElement, text) {
    if (!contentElement._currentText) {
      contentElement._currentText = "";
    }
    contentElement._currentText += text;
    const textContainer = contentElement.querySelector("span");
    if (textContainer) {
      textContainer.textContent = contentElement._currentText;
    }
  }
  // Método simplificado - ya no usa cola ni delay
  _processTypingQueue(contentElement) {
    return;
  }
  // Método para finalizar la animación de escritura inmediatamente
  _finishTypingAnimation(contentElement, finalText, callback) {
    if (contentElement._typingQueue) {
      contentElement._typingQueue = [];
      contentElement._isTyping = false;
      contentElement._currentText = finalText;
      const textContainer = contentElement.querySelector("span");
      if (textContainer) {
        textContainer.textContent = finalText;
      }
    }
    setTimeout(callback, 100);
  }
  getTypingPlaceholder() {
    return '<span class="typing">|</span>';
  }
  getResponse(id) {
    return this.responses.find((response) => response.id === parseInt(id));
  }
  removeResponse(id) {
    this.responses = this.responses.filter((r) => r.id !== id);
    this.render();
  }
  clear() {
    this.responses = [];
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations}
      ${previewStyles}
      ${responseHistoryStyles}
      
      /* Optimizaciones de layout */
      .response-container {
        overflow-y: auto;
        max-height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }
      
      /* Reducir tamaño de los contenedores de respuesta */
      .response-entry {
        margin-bottom: 0.75rem !important;
        padding: 0.75rem !important;
        border-radius: var(--ai-radius);
        max-height: fit-content;
        overflow: visible;
      }
      
      /* Reducir margen entre elementos */
      .response-content {
        margin: 0.25rem 0 !important;
        line-height: 1.4 !important;
        padding: 0 !important;
      }
      
      /* Ajustar espaciado de cabecera */
      .response-header {
        margin-bottom: 0.25rem !important;
      }
      
      /* Ajustar espaciado de pie */
      .response-footer {
        padding-top: 0.5rem !important;
        margin-top: 0.25rem !important;
      }
      
      /* Optimizar espaciado de párrafos */
      .response-content p,
      .response-content ul,
      .response-content ol {
        margin: 0.25em 0 !important;
      }
      
      /* Reducir margen en listas */
      .response-content ul, 
      .response-content ol {
        padding-left: 1.25em !important;
      }
      
      /* Optimizar tamaño de imágenes */
      .question-image img {
        width: 80px !important;
        height: 80px !important;
      }
      
      /* Ajustar espaciado de preguntas con imágenes */
      .question-container {
        gap: 0.5rem !important;
      }
      
      /* Optimizar tamaño de botones */
      .response-action {
        padding: 0.35rem !important;
      }
      
      .tool-button {
        padding: 0.35rem 0.75rem !important;
      }
      
      /* Optimizar indicadores de escritura */
      .typing-indicator {
        padding: 0.125rem 0 !important;
      }
    `;
    const container = document.createElement("div");
    container.className = "response-container";
    this.responses.forEach((response) => {
      container.appendChild(this.createResponseEntry(response));
    });
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
    if (this.responses.length > 0) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }
  formatTimestamp(timestamp) {
    if (!timestamp) return "";
    try {
      console.log("[ResponseHistory] Formatting timestamp:", timestamp);
      return new Date(timestamp).toLocaleTimeString(this.language || "en", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("[ResponseHistory] Error formatting timestamp:", error);
      return "";
    }
  }
}
customElements.define("response-history", ResponseHistory);
const chatStyles = `

  .chat-form {
    display: flex;
    gap: 0.5rem;
  }

  .chat-container {
  border: 1px solid var(--ai-border);
    border-radius: 8px;
    background: white;
  }

  .chat-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    font-family: var(--ai-font-sans);
    transition: border-color 0.2s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--ai-primary);
  }

  .chat-submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--ai-primary);
    color: white;
    border: none;
    border-radius: var(--ai-radius);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .chat-submit:hover {
    background: var(--ai-primary-hover);
  }
`;
const imagePreviewStyles = `
  .image-preview-card {
    background: var(--ai-background);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    padding: 1rem;
    margin-bottom: 1rem;
    animation: fadeIn 0.3s ease forwards;
  }

  .image-preview-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .image-preview-thumbnail {
    width: 96px;
    height: 96px;
    position: relative;
    border-radius: var(--ai-radius);
    overflow: hidden;
    background: var(--ai-background-light);
  }

  .image-preview-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-preview-info {
    flex: 1;
  }

  .image-preview-label {
    font-size: 0.875rem;
    color: var(--ai-text-light);
    margin-bottom: 0.25rem;
  }

  .image-preview-filename {
    font-size: 0.875rem;
    color: var(--ai-text);
  }

  .image-preview-remove {
    padding: 0.25rem;
    border: none;
    background: none;
    color: var(--ai-text-light);
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
  }

  .image-preview-remove:hover {
    opacity: 1;
    color: var(--ai-text);
  }

  /* Estilos para el botón de upload en el chat */
  .chat-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .chat-upload-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--ai-background-light);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius);
    color: var(--ai-text);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .chat-upload-button:hover {
    background: var(--ai-secondary);
    border-color: var(--ai-border);
  }

  .chat-upload-button svg {
    width: 16px;
    height: 16px;
  }

  /* Ocultar input de archivo */
  .hidden {
    display: none !important;
  }
`;
class ChatWithImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.tempImage = null;
  }
  static get observedAttributes() {
    return [
      "language",
      "image-url",
      "initial-prompt",
      "has-content",
      "has-context",
      "supports-images",
      "apiProvider",
      "apiModel",
      "temperature"
    ];
  }
  get apiProvider() {
    return this.getAttribute("apiProvider") || "";
  }
  get apiModel() {
    return this.getAttribute("apiModel") || "gpt-3.5-turbo";
  }
  get temperature() {
    return this.getAttribute("temperature") || "";
  }
  get supportsImages() {
    return this.getAttribute("supports-images") === "true";
  }
  get language() {
    return this.getAttribute("language") || "en";
  }
  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }
  get imageUrl() {
    return this.getAttribute("image-url");
  }
  get initialPrompt() {
    return this.getAttribute("initial-prompt") || "";
  }
  async connectedCallback() {
    console.log(
      "[ChatWithImage] connectedCallback: imageUrl=",
      this.imageUrl,
      "content=",
      this.getAttribute("content"),
      "context=",
      this.getAttribute("context")
    );
    this.render();
    this.setupEventListeners();
    if (this.imageUrl) {
      await this.handleImageUrl(this.imageUrl);
    }
    this.setInitialPrompt();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    console.log(
      `[ChatWithImage] attributeChangedCallback: ${name} from`,
      oldValue,
      "to",
      newValue,
      {
        content: this.getAttribute("content"),
        context: this.getAttribute("context"),
        initialPrompt: this.getAttribute("initial-prompt")
      }
    );
    switch (name) {
      case "language":
        this.updateTranslations();
        break;
      case "image-url":
        if (newValue) {
          this.handleImageUrl(newValue);
        }
        break;
      case "apiProvider":
        this.updateUploadVisibility();
        break;
      case "initial-prompt":
      case "has-content":
      case "has-context":
      case "content":
      case "context":
        this.updateInitialPrompt();
        break;
    }
  }
  // Helper to extract visible text from HTML
  htmlToText(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return tmp.textContent || tmp.innerText || "";
  }
  async setInitialPrompt() {
    if (!this.shadowRoot) return;
    const chatInput = this.shadowRoot.querySelector(".chat-input");
    if (!chatInput) return;
    let prompt = "";
    const contentHtml = this.getAttribute("content") || this.currentContent || "";
    const content = this.htmlToText(contentHtml);
    const context = this.getAttribute("context") || "";
    const hasContent = !!content.trim();
    const hasContext = !!context.trim();
    if (hasContent) {
      prompt = "Ayúdame a mejorar el contenido de mi editor";
    } else if (hasContext) {
      prompt = "Ayúdame a crear un contenido basado en el contexto.";
    } else {
      prompt = "Ayúdame a crear una descripción atractiva para...";
    }
    if (prompt && chatInput.innerText.trim() === "") {
      chatInput.innerText = prompt;
      if (document.activeElement === chatInput) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(chatInput);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
  async updateInitialPrompt() {
    var _a;
    const chatInput = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".chat-input");
    if (chatInput && chatInput.innerText.trim() === "") {
      this.setInitialPrompt();
    }
  }
  updateImagePreview() {
    const existingPreview = this.shadowRoot.querySelector(
      ".image-preview-container"
    );
    if (existingPreview) {
      existingPreview.remove();
    }
  }
  render() {
    var _a, _b;
    const style = document.createElement("style");
    style.textContent = `
      ${variables}
      ${animations}
      ${chatStyles}
      
      .chat-form {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        padding: 8px;
      }
      
      .chat-input-container {
        position: relative;
        flex: 1;
        display: flex;
        align-items: flex-end;
      }
      
      .chat-submit {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .chat-input {
        flex: 1;
        min-height: 24px;
        max-height: 150px;
        padding: 12px;
        padding-right: 40px;
        background: var(--ai-background);
        color: var(--ai-text);
        font-size: 14px;
        line-height: 1.5;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      .chat-input:empty::before {
        content: attr(data-placeholder);
        color: var(--ai-text-light);
      }
      
      .chat-input:focus {
        outline: none;
      }
      
      .chat-upload-button {
        display: inline-flex;
        cursor: pointer;
        color: var(--ai-text-light);
        width: 32px;
        height: 32px;
        background: lightgray;
        padding: 0;
        align-items: center;
        justify-content: center;
        border-radius: var(--ai-radius);
        border: 0;
        flex-shrink: 0;
      }
      
      .chat-upload-button:hover {
        color: var(--ai-text);
      }
      
      .hidden {
        display: none !important;
      }
    `;
    const template = `
      <div class="chat-container">
        <form class="chat-form">
          <div class="chat-input-container">
            <div class="chat-input" 
                 contenteditable="true" 
                 data-placeholder="${((_b = (_a = this.translations) == null ? void 0 : _a.chat) == null ? void 0 : _b.placeholder) || "Ask a question..."}"
                 role="textbox"
                 aria-multiline="true"></div>
          </div>
          ${this.supportsImages ? `
            <label class="chat-upload-button" title="Upload image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <input type="file" accept="image/*" class="hidden" id="imageInput">
            </label>
          ` : ""}
          <button type="submit" class="chat-submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    `;
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(
      document.createRange().createContextualFragment(template)
    );
    this.setupEventListeners();
  }
  setupEventListeners() {
    const form = this.shadowRoot.querySelector(".chat-form");
    const input = this.shadowRoot.querySelector(".chat-input");
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    const imageInput = this.shadowRoot.querySelector("#imageInput");
    if (!form) {
      console.warn(
        "[ChatWithImage] No se encontró el formulario .chat-form en el shadowRoot."
      );
      return;
    }
    form.addEventListener("submit", this.handleSubmit.bind(this));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });
    input.addEventListener("focus", () => {
      if (input.innerText.trim() === "") {
        this.setInitialPrompt();
      }
    });
    if (uploadButton && imageInput) {
      uploadButton.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      imageInput.addEventListener("change", (e) => {
        this.handleFileSelect(e);
        e.target.value = "";
      });
    }
  }
  // Dummy method to avoid fatal error if translations are missing
  updateTranslations() {
  }
  /**
   * Método handleSubmit actualizado para manejar mensajes y base64 de imágenes.
   * Envía content/context solo en el primer mensaje como adjunto.
   */
  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const input = this.shadowRoot.querySelector(".chat-input");
    const message = input.innerText.trim();
    if (typeof this.isFirstMessage === "undefined") {
      this.isFirstMessage = true;
    }
    let imageBase64 = null;
    if (this.tempImage instanceof File) {
      imageBase64 = await this.fileToBase64(this.tempImage);
    } else if (typeof this.tempImage === "string") {
      imageBase64 = this.tempImage;
    }
    const payload = {
      message,
      image: imageBase64,
      apiProvider: this.apiProvider,
      apiModel: this.apiModel,
      temperature: this.temperature
    };
    if (this.isFirstMessage) {
      payload.content = this.getAttribute("content");
      payload.context = this.getAttribute("context");
      this.isFirstMessage = false;
    }
    if (message || imageBase64) {
      this.dispatchEvent(
        new CustomEvent("chatMessage", {
          detail: payload,
          bubbles: true,
          composed: true
        })
      );
      input.innerText = "";
      this.tempImage = null;
      const container = this.shadowRoot.querySelector(
        ".image-preview-container"
      );
      if (container) {
        container.remove();
      }
    }
  }
  // Utilidad para convertir archivo a base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.tempImage = file;
    }
  }
  updateUploadVisibility() {
    const uploadButton = this.shadowRoot.querySelector(".chat-upload-button");
    if (uploadButton) {
      uploadButton.style.display = this.supportsImages ? "inline-flex" : "none";
    }
  }
  /**
   * Maneja una URL de imagen, con soporte para URLs con restricciones CORS
   * @param {string} url - URL de la imagen
   * @returns {Promise<void>}
   */
  /**
   * Método actualizado para manejar imageUrl
   * Con soporte para URLs con restricciones CORS
   */
  async handleImageUrl(url) {
    if (!url) return;
    console.log("[ChatWithImage] Processing image URL:", url);
    try {
      try {
        const response = await fetch(url, {
          mode: "cors",
          credentials: "omit",
          // Evitar cookies para reducir problemas CORS
          cache: "no-store"
          // Evitar problemas de caché
        });
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        this.tempImage = file;
        console.log("[ChatWithImage] Successfully loaded image via fetch");
        this.updateImagePreview();
        return;
      } catch (fetchError) {
        console.warn("[ChatWithImage] Error fetching image:", fetchError);
        this.tempImage = url;
        console.log(
          "[ChatWithImage] Using URL directly due to CORS restrictions"
        );
        this.updateImagePreviewForURL(url);
      }
    } catch (error) {
      console.error("[ChatWithImage] Error loading image:", error);
    }
  }
  /**
   * Nuevo método para actualizar la vista previa usando una URL
   */
  updateImagePreviewForURL(url) {
    if (!url) return;
    let filename = "image";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart) {
          filename = lastPart;
        }
      }
    } catch (e) {
      console.warn("[ChatWithImage] Error parsing image URL for filename");
    }
    const container = document.createElement("div");
    container.className = "image-preview-container";
    container.innerHTML = `
    <div class="image-preview-card">
      <div class="image-preview-content">
        <div class="image-preview-thumbnail">
          <img src="${url}" alt="Preview" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMWYxZjEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNDQ0IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='"/>
        </div>
        <div class="image-preview-info">
          <div class="image-preview-filename">
            ${filename} (External URL)
          </div>
          <button class="image-preview-remove" title="Remove image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
    const existingContainer = this.shadowRoot.querySelector(
      ".image-preview-container"
    );
    if (existingContainer) {
      existingContainer.remove();
    }
    this.shadowRoot.querySelector(".chat-form").parentNode.insertBefore(
      container,
      this.shadowRoot.querySelector(".chat-form")
    );
    const removeButton = container.querySelector(".image-preview-remove");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        this.tempImage = null;
        container.remove();
      });
    }
  }
}
customElements.define("chat-with-image", ChatWithImage);
class ToolBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentAction = "improve";
  }
  static get observedAttributes() {
    return ["has-content", "language"];
  }
  get hasContent() {
    return this.getAttribute("has-content") === "true";
  }
  get language() {
    return this.getAttribute("language") || "en";
  }
  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }
  connectedCallback() {
    this.render();
    this.bindEvents();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "language") {
      this.render();
    } else if (name === "has-content") {
      this.updateVisibleTools();
    }
  }
  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
      }

      .tools {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .tool-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #e5e7eb;
        cursor: pointer;
        font-family: inherit;
      }

      .tool-button:hover {
        background: #d1d5db;
      }

      .tool-button.active {
        background: #3b82f6;
        color: white;
      }

      .tool-button svg {
        width: 16px;
        height: 16px;
      }
    `;
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.createToolbar());
    requestAnimationFrame(() => {
      this.updateVisibleTools();
    });
  }
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "tools";
    const tools = [
      { action: "improve", label: this.translations.tools.improve },
      { action: "summarize", label: this.translations.tools.summarize },
      { action: "expand", label: this.translations.tools.expand },
      { action: "paraphrase", label: this.translations.tools.paraphrase },
      { action: "more-formal", label: this.translations.tools["more-formal"] || this.translations.tools.formal },
      { action: "more-casual", label: this.translations.tools["more-casual"] || this.translations.tools.casual }
    ];
    tools.forEach((tool) => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.dataset.action = tool.action;
      const label = tool.label || tool.action;
      button.innerHTML = `${getToolIcon(tool.action)}${label}`;
      toolbar.appendChild(button);
    });
    return toolbar;
  }
  bindEvents() {
    this.shadowRoot.querySelectorAll(".tool-button").forEach((button) => {
      button.onclick = () => {
        this.setActiveAction(button.dataset.action);
        this.dispatchEvent(
          new CustomEvent("toolaction", {
            detail: { action: button.dataset.action },
            bubbles: true,
            composed: true
          })
        );
      };
    });
  }
  setActiveAction(action) {
    this.currentAction = action;
    this.shadowRoot.querySelectorAll(".tool-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.action === action);
    });
  }
  updateVisibleTools() {
    const hasContent = this.hasContent;
    const improveButton = this.shadowRoot.querySelector('[data-action="improve"]');
    const tools = this.shadowRoot.querySelectorAll(".tool-button");
    if (!hasContent) {
      improveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
        ${this.translations.tools.generate || "Generate"}
      `;
    } else {
      improveButton.innerHTML = `${getToolIcon("improve")}${this.translations.tools.improve}`;
    }
    tools.forEach((tool) => {
      const action = tool.dataset.action;
      if (hasContent) {
        tool.style.display = "inline-flex";
      } else {
        tool.style.display = action === "improve" ? "inline-flex" : "none";
      }
    });
  }
  getCurrentAction() {
    return this.currentAction;
  }
}
customElements.define("ai-toolbar", ToolBar);
class TokenManager {
  constructor() {
    this.tokensPerChar = {
      en: 0.25,
      // English: ~4 chars per token
      es: 0.28,
      // Spanish: ~3.6 chars per token
      fr: 0.28,
      // French: ~3.6 chars per token
      de: 0.3,
      // German: ~3.3 chars per token (compound words)
      zh: 0.5,
      // Chinese: ~2 chars per token
      ja: 0.5
      // Japanese: ~2 chars per token
    };
    this.defaultTokensPerChar = 0.25;
  }
}
class MarkdownHandler {
  constructor() {
    this.marked = null;
  }
  async initialize() {
    try {
      const { marked } = await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js");
      this.marked = marked;
      this.marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: false
      });
    } catch (error) {
      console.error("Error initializing markdown handler:", error);
      throw error;
    }
  }
  convert(text) {
    if (!text || !this.marked) return text;
    return this.marked(text);
  }
}
class APIClient {
  constructor(config = {}) {
    this.config = {
      proxyEndpoint: config.proxyEndpoint || "https://llmproxy.mitienda.host/index.php/api/llm-proxy",
      temperature: config.temperature || 0.7,
      sessionToken: config.sessionToken || "",
      systemPrompt: config.systemPrompt || "Actúa como un experto en redacción de descripciones de productos para tiendas en línea.\n\nTu tarea es generar o mejorar la descripción de un producto con un enfoque atractivo y persuasivo, destacando sus características principales, beneficios y posibles usos.\n\nSi el usuario ya ha escrito una descripción: Mejórala manteniendo su esencia, pero haciéndola más clara, persuasiva y optimizada para ventas.\n\nSi la descripción está vacía: Genera una nueva descripción atractiva, destacando características y beneficios. Usa un tono profesional y cercano, adaptado a una tienda en línea.\n\nSi hay una imagen del producto, aprovecha los detalles visuales para enriquecer la descripción.\n\nSi aplica, menciona información relevante del comercio para reforzar la confianza del comprador (envíos, garantía, atención al cliente, etc.).\n\nMantén el texto claro, sin repeticiones innecesarias, y optimizado para SEO si es posible.",
      tenantId: config.tenantId || "",
      userId: config.userId || "",
      componentId: config.componentId || "",
      debugMode: config.debugMode || false
    };
    this._streamCounter = 0;
  }
  setSessionToken(token) {
    this.config.sessionToken = token;
  }
  // Métodos de provider y modelo eliminados. Solo se permite actualizar el proxyEndpoint y parámetros seguros.
  updateConfig(config) {
    if (config.sessionToken) {
      this.setSessionToken(config.sessionToken);
    }
    if (config.tenantId) {
      this.config.tenantId = config.tenantId;
    }
    if (config.userId) {
      this.config.userId = config.userId;
    }
    if (config.componentId) {
      this.config.componentId = config.componentId;
    }
    if (config.proxyEndpoint) {
      this.config.proxyEndpoint = config.proxyEndpoint;
    }
    if (config.debugMode !== void 0) {
      this.config.debugMode = config.debugMode;
    }
  }
  // Método mejorado para processStream
  async processStream(response, onProgress) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completeText = "";
    let accumulatedChunks = [];
    let streamedChars = 0;
    let chunkCounter = 0;
    try {
      console.log("[APIClient] Iniciando procesamiento de stream");
      const extractContentFromJSON = (data) => {
        let content = "";
        if (data.choices && data.choices.length > 0 && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content !== void 0) {
          content = data.choices[0].delta.content;
        } else if (data.text !== void 0) {
          content = data.text;
        } else if (data.content !== void 0) {
          content = data.content;
        } else if (data.delta && data.delta.text !== void 0) {
          content = data.delta.text;
        }
        return content;
      };
      let isFirstContentChunk = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(
            "[APIClient] Stream completado con",
            streamedChars,
            "caracteres procesados"
          );
          if (buffer.trim()) {
            try {
              const jsonMatch = buffer.match(/data: ({.*})/);
              if (jsonMatch) {
                try {
                  const data = JSON.parse(jsonMatch[1]);
                  const content = extractContentFromJSON(data);
                  if (content) {
                    completeText += content;
                    onProgress(content);
                  }
                } catch (e) {
                  completeText += buffer.trim();
                  onProgress(buffer.trim());
                }
              } else {
                const cleanBuffer = buffer.replace(/^data:\s*/, "").trim();
                if (cleanBuffer && cleanBuffer !== "[DONE]") {
                  completeText += cleanBuffer;
                  onProgress(cleanBuffer);
                }
              }
            } catch (e) {
              console.warn("[APIClient] Error procesando buffer final:", e);
            }
          }
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        chunkCounter++;
        if (this.config.debugMode) {
          console.log(
            `[APIClient] Chunk #${chunkCounter} recibido:`,
            chunk.length > 100 ? `${chunk.substring(0, 100)}... (${chunk.length} chars)` : chunk
          );
          accumulatedChunks.push(chunk);
        }
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        let foundContent = false;
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(5).trim();
            if (content === "[DONE]") continue;
            let jsonData;
            try {
              jsonData = JSON.parse(content);
            } catch (e) {
              if (content.trim()) {
                foundContent = true;
                completeText += content;
                onProgress(content);
              }
              continue;
            }
            const extractedContent = extractContentFromJSON(jsonData);
            if (extractedContent) {
              foundContent = true;
              completeText += extractedContent;
              streamedChars += extractedContent.length;
              onProgress(extractedContent);
            }
          }
        }
        if (!foundContent && buffer.includes("data: {")) {
          try {
            const parts = buffer.split("data: ");
            for (let i = 1; i < parts.length; i++) {
              if (parts[i].trim() && parts[i].includes('"delta":{"content":')) {
                try {
                  const match = parts[i].match(/"content":"([^"]*)"/);
                  if (match && match[1]) {
                    const content = match[1];
                    completeText += content;
                    streamedChars += content.length;
                    onProgress(content);
                    const processed = parts[i].substring(
                      0,
                      match.index + match[0].length
                    );
                    buffer = buffer.replace(processed, "");
                    if (isFirstContentChunk) {
                      isFirstContentChunk = false;
                      if (this.config.debugMode) {
                        console.log(
                          `[APIClient] Primer fragmento (buffer): "${content}"`
                        );
                      }
                    }
                  }
                } catch (e) {
                  console.warn(
                    "[APIClient] Error procesando buffer parcial:",
                    e
                  );
                }
              }
            }
          } catch (e) {
            console.warn("[APIClient] Error analizando buffer:", e);
          }
        }
      }
      if (this.config.debugMode) {
        console.log(
          `[APIClient] Texto completo (${completeText.length} chars):`,
          completeText.substring(0, 50) + (completeText.length > 50 ? "..." : "")
        );
        if (completeText.startsWith("aro,") && accumulatedChunks.length > 0) {
          console.warn(
            "[APIClient] Posible pérdida del inicio. Primeros chunks:",
            accumulatedChunks.slice(0, 3)
          );
        }
      }
      return completeText;
    } catch (error) {
      console.error("[APIClient] Error en procesamiento de stream:", error);
      throw error;
    }
  }
  async makeRequest(prompt, content, onProgress = () => {
  }) {
    var _a;
    try {
      if (!this.config) {
        throw new Error("APIClient config is not initialized");
      }
      const progressHandler = this.config.debugMode ? this._createDebugProgressHandler(onProgress) : onProgress;
      const payload = {
        messages: [
          {
            role: "system",
            content: this.config.systemPrompt
          },
          {
            role: "user",
            content: `${prompt}

${content || "Crea una nueva descripción."}`
          }
        ],
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        buttonId: this.config.componentId,
        // Cambiado de componentId a buttonId
        debugMode: this.config.debugMode
      };
      console.log(
        "[APIClient] Enviando solicitud al proxy:",
        this.config.proxyEndpoint
      );
      console.log(
        "[APIClient] JSON exacto de la solicitud:",
        JSON.stringify(
          {
            endpoint: this.config.proxyEndpoint,
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          },
          null,
          2
        )
      );
      if (this.config.debugMode) {
        console.log("[APIClient] Payload:", JSON.stringify(payload, null, 2));
      }
      this._streamCounter = 0;
      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      console.log("[APIClient] Respuesta del proxy:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries([...response.headers.entries()])
      });
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = ((_a = errorData.error) == null ? void 0 : _a.message) || `API Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          errorMessage = `API Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return await this.processStream(response, progressHandler);
    } catch (error) {
      console.error("[APIClient] Error al hacer la solicitud:", error);
      throw new APIError(error.message, error);
    }
  }
  /**
   * Versión actualizada de makeRequestWithImage que maneja URLs con CORS
   * @param {string} prompt - El prompt para la IA
   * @param {string} content - El contenido a procesar
   * @param {string|File} imageSource - URL de imagen o archivo
   * @param {Function} onProgress - Callback para streaming de respuesta
   * @returns {Promise<string>} El texto generado
   */
  async makeRequestWithImage(prompt, content, imageSource, onProgress = () => {
  }) {
    var _a;
    try {
      let imageData;
      let imageUrl;
      let mimeType = "image/jpeg";
      let isExternalUrl = false;
      if (typeof imageSource === "string") {
        imageUrl = imageSource;
        isExternalUrl = true;
        console.log("[APIClient] Using external image URL:", imageUrl);
      } else if (imageSource instanceof File) {
        imageData = await this.imageToBase64(imageSource);
        mimeType = imageSource.type || mimeType;
        console.log("[APIClient] Image file processed, type:", mimeType);
      } else {
        throw new Error("Invalid image source");
      }
      const progressHandler = this.config.debugMode ? this._createDebugProgressHandler(onProgress) : onProgress;
      const messages = [];
      if (this.config.provider === "openai") {
        messages.push({
          role: "system",
          content: this.config.systemPrompt
        });
        const userContent = [
          {
            type: "text",
            text: `${prompt}

${content || "Please create a new description."}`
          }
        ];
        if (isExternalUrl) {
          userContent.push({
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" }
          });
        } else {
          userContent.push({
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageData}`,
              detail: "high"
            }
          });
        }
        messages.push({
          role: "user",
          content: userContent
        });
      } else if (this.config.provider === "anthropic") {
        const userContent = [
          {
            type: "text",
            text: this.config.systemPrompt
          }
        ];
        if (isExternalUrl) {
          userContent.push({
            type: "image",
            source: { type: "url", url: imageUrl }
          });
        } else {
          userContent.push({
            type: "image",
            source: { type: "base64", media_type: mimeType, data: imageData }
          });
        }
        userContent.push({
          type: "text",
          text: `${prompt}

${content || "Please create a new description."}`
        });
        messages.push({
          role: "user",
          content: userContent
        });
      } else if (this.config.provider === "google") {
        const userParts = [
          {
            text: `${this.config.systemPrompt}

${prompt}

${content || "Please create a new description."}`
          }
        ];
        if (isExternalUrl) {
          userParts.push({
            externalImageUrl: imageUrl
            // Campo personalizado para el proxy
          });
        } else {
          userParts.push({
            inline_data: {
              mime_type: mimeType,
              data: imageData
            }
          });
        }
        messages.push({
          role: "user",
          parts: userParts
        });
      }
      const payload = {
        messages,
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        buttonId: this.config.componentId,
        // Cambiado de componentId a buttonId
        hasImage: true,
        isExternalImageUrl: isExternalUrl
        // Indicador para el servidor
      };
      console.log("[APIClient] Sending image request to proxy:", {
        endpoint: this.config.proxyEndpoint,
        hasImage: true,
        isExternalUrl
      });
      this._streamCounter = 0;
      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.config.sessionToken && {
            Authorization: `Bearer ${this.config.sessionToken}`
          }
        },
        body: JSON.stringify(payload)
      });
      console.log(
        "[APIClient] Image request response status:",
        response.status,
        response.statusText
      );
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error("[APIClient] Image API Error Response:", errorData);
          throw new Error(
            ((_a = errorData.error) == null ? void 0 : _a.message) || `API Error: ${response.status} ${response.statusText}`
          );
        } catch (parseError) {
          console.error(
            "[APIClient] Failed to parse error response:",
            parseError
          );
          const rawText = await response.text().catch(() => "");
          console.error("[APIClient] Raw error response:", rawText);
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
      }
      return await this.processStream(response, progressHandler);
    } catch (error) {
      console.error("[APIClient] Image processing error:", error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }
  /**
   * Función de ayuda para crear el formato correcto para una imagen según el proveedor
   * @param {string|Object} imageSource - URL de imagen o datos base64
   * @param {string} mimeType - Tipo MIME para imágenes base64
   * @returns {Object} Objeto con el formato correcto para la API
   */
  formatImageForProvider(imageSource, mimeType) {
    const isExternalUrl = typeof imageSource === "string";
    const provider = this.config.provider;
    if (provider === "openai") {
      if (isExternalUrl) {
        return {
          type: "image_url",
          image_url: {
            url: imageSource,
            detail: "high"
          }
        };
      } else {
        return {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${imageSource}`,
            detail: "high"
          }
        };
      }
    } else if (provider === "anthropic") {
      if (isExternalUrl) {
        return {
          type: "image",
          source: {
            type: "url",
            url: imageSource
          }
        };
      } else {
        return {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType,
            data: imageSource
          }
        };
      }
    } else if (provider === "google") {
      if (isExternalUrl) {
        return {
          externalImageUrl: imageSource
          // Campo personalizado para el proxy
        };
      } else {
        return {
          inline_data: {
            mime_type: mimeType,
            data: imageSource
          }
        };
      }
    }
    return isExternalUrl ? { url: imageSource } : { base64: imageSource };
  }
  async imageToBase64(imageFile) {
    if (!imageFile) {
      throw new Error("No image file provided");
    }
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please provide an image file.");
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result.split(",")[1];
          if (!result) {
            reject(new Error("Failed to convert image to base64"));
            return;
          }
          resolve(result);
        } catch (error) {
          reject(new Error("Failed to process image data"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(imageFile);
    });
  }
  async enhanceText(content, action = "improve", imageFile = null, context = "", onProgress = () => {
  }) {
    var _a;
    const safeContext = context || "";
    const contextSection = safeContext.trim() ? `
Considerando estos detalles del producto:
${safeContext}

` : "\n";
    const prompts = {
      improve: `Mejora esta descripción de producto.${contextSection}Descripción actual:`,
      summarize: `Crea un resumen conciso y efectivo de la siguiente descripción.${contextSection}Descripción:`,
      expand: `Expande esta descripción añadiendo más detalles, beneficios y casos de uso.${contextSection}Descripción:`,
      paraphrase: `Reescribe esta descripción manteniendo el mensaje principal pero con un enfoque fresco.${contextSection}Descripción:`,
      "more-formal": `Reescribe esta descripción con un tono más formal, profesional y técnico, manteniendo la información clave pero usando un lenguaje más sofisticado y corporativo.${contextSection}Descripción:`,
      "more-casual": `Reescribe esta descripción con un tono más casual y cercano, como si estuvieras explicándolo a un amigo, manteniendo un lenguaje accesible y conversacional pero sin perder profesionalismo.${contextSection}Descripción:`,
      empty: `Crea una descripción profesional y atractiva que destaque las características principales del producto.${contextSection}Información:`
    };
    const prompt = prompts[action] || prompts.improve;
    console.log("[APIClient] enhanceText called with:", {
      action,
      contentLength: (content == null ? void 0 : content.length) || 0,
      contextLength: (safeContext == null ? void 0 : safeContext.length) || 0,
      hasPrompt: !!prompt
    });
    const progressHandler = ((_a = this.config) == null ? void 0 : _a.debugMode) ? this._createDebugProgressHandler(onProgress) : onProgress;
    try {
      if (imageFile && (this.config.provider === "openai" || this.config.provider === "google" || this.config.provider === "anthropic")) {
        return await this.makeRequestWithImage(
          prompt,
          content,
          imageFile,
          progressHandler
        );
      } else {
        return await this.makeRequest(prompt, content, progressHandler);
      }
    } catch (error) {
      console.error("[APIClient] Error in enhanceText:", error);
      throw new Error(`Error al mejorar el texto: ${error.message}`);
    }
  }
  async chatResponse(content, message, image = null, onProgress = () => {
  }) {
    var _a;
    try {
      const progressHandler = this.config.debugMode ? this._createDebugProgressHandler(onProgress) : onProgress;
      let messages = [
        { role: "system", content: this.config.systemPrompt },
        { role: "user", content }
      ];
      let hasImage = false;
      if (message) {
        if (image && (this.config.provider === "openai" || this.config.provider === "google" || this.config.provider === "anthropic")) {
          try {
            const imageData = await this.imageToBase64(image);
            const mimeType = image.type || "image/jpeg";
            console.log("[APIClient] Chat with image - file type:", mimeType);
            hasImage = true;
            if (this.config.provider === "openai") {
              messages.push({
                role: "user",
                content: [
                  { type: "text", text: message },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${imageData}`,
                      detail: "auto"
                    }
                  }
                ]
              });
            } else if (this.config.provider === "anthropic") {
              messages.push({
                role: "user",
                content: [
                  { type: "text", text: message },
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mimeType,
                      data: imageData
                    }
                  }
                ]
              });
            } else if (this.config.provider === "google") {
              messages.push({
                role: "user",
                parts: [
                  { text: message },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: imageData
                    }
                  }
                ]
              });
            } else {
              messages.push({ role: "user", content: message });
              hasImage = false;
            }
          } catch (imageError) {
            console.error(
              "[APIClient] Failed to process image for chat:",
              imageError
            );
            messages.push({ role: "user", content: message });
            hasImage = false;
          }
        } else {
          messages.push({ role: "user", content: message });
        }
      }
      const payload = {
        messages,
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        buttonId: this.config.componentId,
        // Cambiado de componentId a buttonId
        hasImage
      };
      console.log(
        "[APIClient] Payload completo de la solicitud:",
        JSON.stringify(payload, null, 2)
      );
      console.log("[APIClient] Sending chat request to proxy:", {
        endpoint: this.config.proxyEndpoint,
        hasImage
      });
      this._streamCounter = 0;
      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.config.sessionToken && {
            Authorization: `Bearer ${this.config.sessionToken}`
          }
        },
        body: JSON.stringify(payload)
      });
      console.log(
        "[APIClient] Chat response status:",
        response.status,
        response.statusText
      );
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error("[APIClient] Chat API Error Response:", errorData);
          throw new Error(
            ((_a = errorData.error) == null ? void 0 : _a.message) || `API Error: ${response.status} ${response.statusText}`
          );
        } catch (parseError) {
          console.error(
            "[APIClient] Failed to parse error response:",
            parseError
          );
          const rawText = await response.text().catch(() => "");
          console.error("[APIClient] Raw error response:", rawText);
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
      }
      return await this.processStream(response, progressHandler);
    } catch (error) {
      console.error("[APIClient] Chat response error:", error);
      throw new APIError(`Chat response failed: ${error.message}`, error);
    }
  }
  get supportsImages() {
    return this.config.provider === "openai" || this.config.provider === "google" || this.config.provider === "anthropic";
  }
  // Método auxiliar para crear wrapper de debug para onProgress
  _createDebugProgressHandler(originalHandler) {
    let chunkIndex = 0;
    return (chunk) => {
      console.log(
        `[APIClient] Progress chunk #${chunkIndex}:`,
        chunk.length > 30 ? `${chunk.substring(0, 30)}... (${chunk.length} chars)` : chunk,
        `[${Array.from(chunk.substring(0, 5)).map((c) => c.charCodeAt(0)).join(",")}]`
      );
      if (chunkIndex < 3) {
        if (chunkIndex === 0 && chunk.length < 5) {
          console.warn("[APIClient] ⚠️ Primer fragmento es muy corto:", chunk);
        }
        if (chunkIndex === 0 && chunk === "aro" || chunk === "laro") {
          console.warn(
            "[APIClient] ⚠️ PROBLEMA DETECTADO: Fragmento inicial incompleto:",
            chunk
          );
        }
      }
      if (typeof originalHandler === "function") {
        originalHandler(chunk);
      }
      chunkIndex++;
    };
  }
}
class APIError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "APIError";
    this.originalError = originalError;
  }
}
function createAPIClient(config = {}) {
  return new APIClient(config);
}
class CacheManager {
  constructor(options = {}) {
    this.options = {
      prefix: options.prefix || "ai-text-enhancer-cache",
      maxItems: options.maxItems || 20,
      ttl: options.ttl || 30 * 60 * 1e3,
      // 30 minutes in milliseconds
      storage: options.storage || window.sessionStorage
    };
    this.validateStorage();
  }
  /**
   * Validates that storage is available and working
   * @throws {Error} If storage is not available
   */
  validateStorage() {
    try {
      const testKey = `${this.options.prefix}-test`;
      this.options.storage.setItem(testKey, "test");
      this.options.storage.removeItem(testKey);
    } catch (error) {
      throw new Error("Storage is not available: " + error.message);
    }
  }
  /**
   * Generates a cache key for a given action and content
   * @param {string} action - The action being performed
   * @param {string} content - The content being processed
   * @returns {string} The generated cache key
   */
  generateKey(action, content) {
    const hash = this.hashString(content);
    return `${this.options.prefix}-${action}-${hash}`;
  }
  /**
   * Creates a hash from a string
   * @param {string} str - The string to hash
   * @returns {string} The hashed string
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  /**
   * Gets a value from cache
   * @param {string} action - The action associated with the cached content
   * @param {string} content - The original content
   * @returns {string|null} The cached value or null if not found/expired
   */
  get(action, content) {
    try {
      const key = this.generateKey(action, content);
      const cachedItem = this.options.storage.getItem(key);
      if (!cachedItem) return null;
      const item = JSON.parse(cachedItem);
      if (Date.now() - item.timestamp > this.options.ttl) {
        this.delete(action, content);
        return null;
      }
      return item.value;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }
  /**
   * Stores a value in cache
   * @param {string} action - The action associated with the content
   * @param {string} content - The original content
   * @param {string} value - The value to cache
   */
  set(action, content, value) {
    try {
      const key = this.generateKey(action, content);
      const item = {
        value,
        timestamp: Date.now()
      };
      this.enforceSizeLimit();
      this.options.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Error writing to cache:", error);
      this.cleanup();
    }
  }
  /**
   * Deletes a specific item from cache
   * @param {string} action - The action associated with the content
   * @param {string} content - The original content
   */
  delete(action, content) {
    const key = this.generateKey(action, content);
    this.options.storage.removeItem(key);
  }
  /**
   * Enforces the cache size limit
   */
  enforceSizeLimit() {
    try {
      const keys = this.getCacheKeys();
      if (keys.length >= this.options.maxItems) {
        const itemsToRemove = keys.map((key) => ({
          key,
          timestamp: JSON.parse(this.options.storage.getItem(key)).timestamp
        })).sort((a, b) => a.timestamp - b.timestamp).slice(0, keys.length - this.options.maxItems + 1);
        itemsToRemove.forEach((item) => {
          this.options.storage.removeItem(item.key);
        });
      }
    } catch (error) {
      console.error("Error enforcing cache size limit:", error);
    }
  }
  /**
   * Gets all cache keys for this instance
   * @returns {string[]} Array of cache keys
   */
  getCacheKeys() {
    const keys = [];
    for (let i = 0; i < this.options.storage.length; i++) {
      const key = this.options.storage.key(i);
      if (key.startsWith(this.options.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }
  /**
   * Cleans up expired items
   */
  cleanup() {
    try {
      const now = Date.now();
      const keys = this.getCacheKeys();
      keys.forEach((key) => {
        const item = JSON.parse(this.options.storage.getItem(key));
        if (now - item.timestamp > this.options.ttl) {
          this.options.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error during cache cleanup:", error);
    }
  }
  /**
   * Clears all cached items for this instance
   */
  clear() {
    const keys = this.getCacheKeys();
    keys.forEach((key) => {
      this.options.storage.removeItem(key);
    });
  }
  /**
   * Gets cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    try {
      const keys = this.getCacheKeys();
      const now = Date.now();
      let totalSize = 0;
      let expiredCount = 0;
      keys.forEach((key) => {
        const item = JSON.parse(this.options.storage.getItem(key));
        totalSize += JSON.stringify(item).length;
        if (now - item.timestamp > this.options.ttl) {
          expiredCount++;
        }
      });
      return {
        totalItems: keys.length,
        expiredItems: expiredCount,
        totalSize,
        maxItems: this.options.maxItems
      };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return null;
    }
  }
}
function createCacheManager(options = {}) {
  return new CacheManager(options);
}
class TinyMCEAdapter {
  /**
   * Crea un nuevo adaptador para TinyMCE
   * @param {string} editorId - ID del elemento contenedor de TinyMCE
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, options = {}) {
    this.editorId = editorId;
    this.options = {
      debug: options.debug || false,
      waitTimeout: options.waitTimeout || 2e3,
      useGlobalReference: options.useGlobalReference !== false,
      // Por defecto usa referencias globales
      ...options
    };
    this.editorInstance = null;
    this._initialized = false;
    this.tmceVersion = null;
    this._findEditorInstance();
  }
  /**
   * Detecta la versión de TinyMCE
   * @private
   * @returns {number|null} Versión principal de TinyMCE (3, 4, 5 o 6) o null si no se puede detectar
   */
  _detectTinyMCEVersion() {
    var _a, _b, _c;
    try {
      if (typeof window.tinymce === "undefined") {
        return null;
      }
      if (window.tinymce.majorVersion) {
        return parseInt(window.tinymce.majorVersion, 10);
      }
      if (typeof window.tinymce.createEditor === "function") {
        return 6;
      } else if (typeof ((_a = window.tinymce.dom) == null ? void 0 : _a.TreeWalker) === "function") {
        return 5;
      } else if (typeof ((_b = window.tinymce.dom) == null ? void 0 : _b.EventUtils) === "function") {
        return 4;
      } else if (typeof ((_c = window.tinymce.dom) == null ? void 0 : _c.Event) === "function") {
        return 3;
      }
      return 4;
    } catch (error) {
      console.error("[TinyMCEAdapter] Error detecting TinyMCE version:", error);
      return null;
    }
  }
  /**
   * Busca la instancia de TinyMCE ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      this.tmceVersion = this._detectTinyMCEVersion();
      if (this.options.debug) {
        console.log(
          `[TinyMCEAdapter] Detected TinyMCE version: ${this.tmceVersion || "unknown"}`
        );
      }
      if (typeof window.tinymce !== "undefined") {
        let instance = null;
        if (this.tmceVersion >= 3) {
          instance = window.tinymce.get(this.editorId);
        }
        if (!instance && this.options.useGlobalReference) {
          const globalInstanceKey = `tinyMCE_${this.editorId}`;
          if (window[globalInstanceKey]) {
            instance = window[globalInstanceKey];
          }
          if (window.tinyMCEInstance) {
            instance = window.tinyMCEInstance;
          }
        }
        if (instance) {
          this.editorInstance = instance;
          this._initialized = true;
          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Found editor instance for "${this.editorId}"`,
              instance
            );
          }
          return true;
        }
      }
      if (this.options.debug) {
        console.warn(
          `[TinyMCEAdapter] TinyMCE instance not found for "${this.editorId}"`
        );
      }
      return false;
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error finding TinyMCE instance:`, error);
      return false;
    }
  }
  /**
   * Espera a que TinyMCE esté inicializado
   * @returns {Promise<boolean>} Promesa que se resuelve cuando el editor está listo
   */
  async waitForEditor() {
    if (this._initialized && this.editorInstance) {
      return true;
    }
    return new Promise((resolve) => {
      if (this._findEditorInstance()) {
        resolve(true);
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this._findEditorInstance()) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }
        if (Date.now() - startTime > this.options.waitTimeout) {
          clearInterval(checkInterval);
          console.warn(
            `[TinyMCEAdapter] Timeout waiting for TinyMCE to initialize`
          );
          resolve(false);
        }
      }, 100);
    });
  }
  /**
   * Verifica si el método existe en la instancia del editor y es una función
   * @param {string} methodName - Nombre del método a verificar
   * @returns {boolean} true si el método existe y es una función
   */
  _hasMethod(methodName) {
    return this.editorInstance && typeof this.editorInstance[methodName] === "function";
  }
  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    var _a;
    await this.waitForEditor();
    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }
      if (this._hasMethod("getContent")) {
        try {
          if (!this.editorInstance || typeof this.editorInstance.getContent !== "function") {
            console.warn("[TinyMCEAdapter] getContent no es una función en la instancia de TinyMCE:", this.editorInstance);
            return "";
          }
          const content = this.editorInstance.getContent({ format: "html" });
          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Retrieved content using getContent() (${(content == null ? void 0 : content.length) || 0} chars)`
            );
          }
          return content || "";
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using getContent():", err);
        }
      }
      if (this.editorInstance.getBody) {
        try {
          const body = this.editorInstance.getBody();
          if (body) {
            const content = body.innerHTML;
            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Retrieved content from body (${(content == null ? void 0 : content.length) || 0} chars)`
              );
            }
            return content || "";
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error accessing body content:", err);
        }
      }
      if (this.editorInstance.contentDocument) {
        try {
          const doc = this.editorInstance.contentDocument;
          if (doc && doc.body) {
            const content = doc.body.innerHTML;
            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Retrieved content from contentDocument (${(content == null ? void 0 : content.length) || 0} chars)`
              );
            }
            return content || "";
          }
        } catch (err) {
          console.warn(
            "[TinyMCEAdapter] Error accessing contentDocument:",
            err
          );
        }
      }
      const textareaElement = document.getElementById(this.editorId);
      if (textareaElement && textareaElement.value) {
        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Retrieved content from textarea (${((_a = textareaElement.value) == null ? void 0 : _a.length) || 0} chars)`
          );
        }
        return textareaElement.value;
      }
      console.error("[TinyMCEAdapter] All content retrieval methods failed");
      return "";
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error getting content:`, error);
      return "";
    }
  }
  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();
    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }
      if (this._hasMethod("setContent")) {
        try {
          this.editorInstance.setContent(content);
          if (this._hasMethod("undoManager") && this.editorInstance.undoManager && this._hasMethod("undoManager.add")) {
            this.editorInstance.undoManager.add();
          }
          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Content set successfully using setContent (${(content == null ? void 0 : content.length) || 0} chars)`
            );
          }
          return true;
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using setContent():", err);
        }
      }
      if (this.editorInstance.getBody) {
        try {
          const body = this.editorInstance.getBody();
          if (body) {
            body.innerHTML = content;
            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content set successfully using body (${(content == null ? void 0 : content.length) || 0} chars)`
              );
            }
            return true;
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error setting body content:", err);
        }
      }
      if (this.editorInstance.contentDocument) {
        try {
          const doc = this.editorInstance.contentDocument;
          if (doc && doc.body) {
            doc.body.innerHTML = content;
            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content set successfully using contentDocument (${(content == null ? void 0 : content.length) || 0} chars)`
              );
            }
            return true;
          }
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error setting contentDocument:", err);
        }
      }
      const textareaElement = document.getElementById(this.editorId);
      if (textareaElement) {
        textareaElement.value = content;
        if (this._hasMethod("load")) {
          this.editorInstance.load();
        }
        if (this.options.debug) {
          console.log(
            `[TinyMCEAdapter] Content set using textarea (${(content == null ? void 0 : content.length) || 0} chars)`
          );
        }
        return true;
      }
      console.error("[TinyMCEAdapter] All content setting methods failed");
      return false;
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error setting content:`, error);
      return false;
    }
  }
  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();
    try {
      if (!this.editorInstance) {
        throw new Error("No editor instance available");
      }
      if (this._hasMethod("execCommand")) {
        try {
          this.editorInstance.execCommand("mceInsertContent", false, content);
          if (this._hasMethod("undoManager") && this.editorInstance.undoManager && this._hasMethod("undoManager.add")) {
            this.editorInstance.undoManager.add();
          }
          if (this.options.debug) {
            console.log(
              `[TinyMCEAdapter] Content inserted successfully using execCommand`
            );
          }
          return true;
        } catch (err) {
          console.warn("[TinyMCEAdapter] Error using execCommand():", err);
        }
      }
      if (this._hasMethod("selection") && this.editorInstance.selection) {
        try {
          const selection = this.editorInstance.selection;
          if (this._hasMethod("selection.setContent")) {
            selection.setContent(content);
            if (this.options.debug) {
              console.log(
                `[TinyMCEAdapter] Content inserted successfully using selection.setContent`
              );
            }
            return true;
          }
        } catch (err) {
          console.warn(
            "[TinyMCEAdapter] Error using selection.setContent():",
            err
          );
        }
      }
      return await this.setContent(content);
    } catch (error) {
      console.error(`[TinyMCEAdapter] Error inserting content:`, error);
      return false;
    }
  }
  /**
   * Verifica si el editor está inicializado
   * @returns {boolean} true si el editor está inicializado, false en caso contrario
   */
  isInitialized() {
    return this._initialized && this.editorInstance !== null;
  }
  /**
   * Obtiene la versión detectada de TinyMCE
   * @returns {number|null} Versión principal de TinyMCE (3, 4, 5, 6) o null si no se detectó
   */
  getVersion() {
    return this.tmceVersion;
  }
}
function createTinyMCEAdapter(editorId, options = {}) {
  return new TinyMCEAdapter(editorId, options);
}
class CKEditorAdapter {
  /**
   * Crea un nuevo adaptador para CKEditor
   * @param {string} editorId - ID del elemento contenedor de CKEditor
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, options = {}) {
    this.editorId = editorId;
    this.options = {
      debug: options.debug || false,
      waitTimeout: options.waitTimeout || 2e3,
      ...options
    };
    this.editorInstance = null;
    this._initialized = false;
    this._findEditorInstance();
  }
  /**
   * Busca la instancia de CKEditor ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      if (typeof window.ckeditorInstance !== "undefined") {
        this.editorInstance = window.ckeditorInstance;
        this._initialized = true;
        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Found editor instance from global variable`
          );
        }
        return true;
      }
      const editorElement = document.getElementById(this.editorId);
      if (editorElement && editorElement.ckeditorInstance) {
        this.editorInstance = editorElement.ckeditorInstance;
        this._initialized = true;
        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Found editor instance from element property`
          );
        }
        return true;
      }
      if (this.options.debug) {
        console.warn(
          `[CKEditorAdapter] CKEditor instance not found for "${this.editorId}"`
        );
      }
      return false;
    } catch (error) {
      console.error(
        `[CKEditorAdapter] Error finding CKEditor instance:`,
        error
      );
      return false;
    }
  }
  /**
   * Espera a que CKEditor esté inicializado
   * @returns {Promise<boolean>} Promesa que se resuelve cuando el editor está listo
   */
  async waitForEditor() {
    if (this._initialized && this.editorInstance) {
      return true;
    }
    return new Promise((resolve) => {
      if (this._findEditorInstance()) {
        resolve(true);
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this._findEditorInstance()) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }
        if (Date.now() - startTime > this.options.waitTimeout) {
          clearInterval(checkInterval);
          console.warn(
            `[CKEditorAdapter] Timeout waiting for CKEditor to initialize`
          );
          resolve(false);
        }
      }, 100);
    });
  }
  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        const content = this.editorInstance.getData();
        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Retrieved content (${content.length} chars)`
          );
        }
        return content;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error getting content:`, error);
    }
    return "";
  }
  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        this.editorInstance.setData(content);
        if (this.options.debug) {
          console.log(
            `[CKEditorAdapter] Content set successfully (${content.length} chars)`
          );
        }
        return true;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error setting content:`, error);
    }
    return false;
  }
  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        const viewFragment = this.editorInstance.data.processor.toView(content);
        const modelFragment = this.editorInstance.data.toModel(viewFragment);
        this.editorInstance.model.insertContent(modelFragment);
        if (this.options.debug) {
          console.log(`[CKEditorAdapter] Content inserted successfully`);
        }
        return true;
      }
    } catch (error) {
      console.error(`[CKEditorAdapter] Error inserting content:`, error);
    }
    return false;
  }
  /**
   * Verifica si el editor está inicializado
   * @returns {boolean} true si el editor está inicializado, false en caso contrario
   */
  isInitialized() {
    return this._initialized && this.editorInstance !== null;
  }
}
function createCKEditorAdapter(editorId, options = {}) {
  return new CKEditorAdapter(editorId, options);
}
class QuillAdapter {
  /**
   * Crea un nuevo adaptador para Quill
   * @param {string} editorId - ID del elemento contenedor de Quill
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, options = {}) {
    this.editorId = editorId;
    this.options = {
      debug: options.debug || false,
      waitTimeout: options.waitTimeout || 2e3,
      ...options
    };
    this.editorInstance = null;
    this._initialized = false;
    this._findEditorInstance();
  }
  /**
   * Busca la instancia de Quill ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      if (typeof window.quillInstance !== "undefined") {
        this.editorInstance = window.quillInstance;
        this._initialized = true;
        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Found editor instance from global variable`
          );
        }
        return true;
      }
      const editorElement = document.getElementById(this.editorId);
      if (editorElement) {
        const quillContainer = editorElement;
        if (quillContainer && quillContainer.__quill) {
          this.editorInstance = quillContainer.__quill;
          this._initialized = true;
          if (this.options.debug) {
            console.log(
              `[QuillAdapter] Found editor instance from element __quill property`
            );
          }
          return true;
        }
        const editor = quillContainer.querySelector(".ql-editor");
        if (editor && editor.__quill) {
          this.editorInstance = editor.__quill;
          this._initialized = true;
          if (this.options.debug) {
            console.log(
              `[QuillAdapter] Found editor instance from ql-editor element`
            );
          }
          return true;
        }
      }
      if (this.options.debug) {
        console.warn(
          `[QuillAdapter] Quill instance not found for "${this.editorId}"`
        );
      }
      return false;
    } catch (error) {
      console.error(`[QuillAdapter] Error finding Quill instance:`, error);
      return false;
    }
  }
  /**
   * Espera a que Quill esté inicializado
   * @returns {Promise<boolean>} Promesa que se resuelve cuando el editor está listo
   */
  async waitForEditor() {
    if (this._initialized && this.editorInstance) {
      return true;
    }
    return new Promise((resolve) => {
      if (this._findEditorInstance()) {
        resolve(true);
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this._findEditorInstance()) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }
        if (Date.now() - startTime > this.options.waitTimeout) {
          clearInterval(checkInterval);
          console.warn(
            `[QuillAdapter] Timeout waiting for Quill to initialize`
          );
          resolve(false);
        }
      }, 100);
    });
  }
  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        const content = this.editorInstance.root.innerHTML;
        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Retrieved content (${content.length} chars)`
          );
        }
        return content;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error getting content:`, error);
    }
    return "";
  }
  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        this.editorInstance.clipboard.dangerouslyPasteHTML(content);
        if (this.options.debug) {
          console.log(
            `[QuillAdapter] Content set successfully (${content.length} chars)`
          );
        }
        return true;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error setting content:`, error);
    }
    return false;
  }
  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        const range = this.editorInstance.getSelection();
        if (range) {
          this.editorInstance.clipboard.dangerouslyPasteHTML(
            range.index,
            content,
            "user"
          );
        } else {
          const length = this.editorInstance.getLength();
          this.editorInstance.clipboard.dangerouslyPasteHTML(
            length,
            content,
            "user"
          );
        }
        if (this.options.debug) {
          console.log(`[QuillAdapter] Content inserted successfully`);
        }
        return true;
      }
    } catch (error) {
      console.error(`[QuillAdapter] Error inserting content:`, error);
    }
    return false;
  }
  /**
   * Verifica si el editor está inicializado
   * @returns {boolean} true si el editor está inicializado, false en caso contrario
   */
  isInitialized() {
    return this._initialized && this.editorInstance !== null;
  }
}
function createQuillAdapter(editorId, options = {}) {
  return new QuillAdapter(editorId, options);
}
class FroalaAdapter {
  /**
   * Crea un nuevo adaptador para Froala
   * @param {string} editorId - ID del elemento contenedor de Froala
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, options = {}) {
    this.editorId = editorId;
    this.options = {
      debug: options.debug || false,
      waitTimeout: options.waitTimeout || 2e3,
      ...options
    };
    this.editorInstance = null;
    this._initialized = false;
    this._findEditorInstance();
  }
  /**
   * Busca la instancia de Froala ya sea por ID o en el objeto global
   * @private
   */
  _findEditorInstance() {
    try {
      if (typeof window.froalaInstance !== "undefined") {
        this.editorInstance = window.froalaInstance;
        this._initialized = true;
        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Found editor instance from global variable`
          );
        }
        return true;
      }
      const editorElement = document.getElementById(this.editorId);
      if (editorElement && editorElement.froalaEditor) {
        this.editorInstance = editorElement.froalaEditor;
        this._initialized = true;
        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Found editor instance from element property`
          );
        }
        return true;
      }
      const froalaContainer = document.querySelector(
        `.fr-box[id^="${this.editorId}"]`
      );
      if (froalaContainer) {
        const editorElement2 = froalaContainer.querySelector(
          "[contenteditable=true]"
        );
        if (editorElement2 && editorElement2.parentNode.querySelector(".fr-element")) {
          const instanceKey = Object.keys(window).find(
            (key) => key.startsWith("FE_") && window[key] && typeof window[key] === "object" && window[key].$
          );
          if (instanceKey) {
            this.editorInstance = window[instanceKey];
            this._initialized = true;
            if (this.options.debug) {
              console.log(
                `[FroalaAdapter] Found editor instance from global FE key`
              );
            }
            return true;
          }
        }
      }
      if (this.options.debug) {
        console.warn(
          `[FroalaAdapter] Froala instance not found for "${this.editorId}"`
        );
      }
      return false;
    } catch (error) {
      console.error(`[FroalaAdapter] Error finding Froala instance:`, error);
      return false;
    }
  }
  /**
   * Espera a que Froala esté inicializado
   * @returns {Promise<boolean>} Promesa que se resuelve cuando el editor está listo
   */
  async waitForEditor() {
    if (this._initialized && this.editorInstance) {
      return true;
    }
    return new Promise((resolve) => {
      if (this._findEditorInstance()) {
        resolve(true);
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this._findEditorInstance()) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }
        if (Date.now() - startTime > this.options.waitTimeout) {
          clearInterval(checkInterval);
          console.warn(
            `[FroalaAdapter] Timeout waiting for Froala to initialize`
          );
          resolve(false);
        }
      }, 100);
    });
  }
  /**
   * Obtiene el contenido del editor
   * @returns {string} El contenido HTML del editor o cadena vacía si no está disponible
   */
  async getContent() {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        const content = this.editorInstance.html.get();
        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Retrieved content (${(content == null ? void 0 : content.length) || 0} chars)`
          );
        }
        return content || "";
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error getting content:`, error);
    }
    try {
      const element = document.querySelector(
        `#${this.editorId} div.fr-element`
      );
      if (element) {
        return element.innerHTML || "";
      }
    } catch (e) {
      console.error(`[FroalaAdapter] Error in fallback content retrieval:`, e);
    }
    return "";
  }
  /**
   * Establece el contenido del editor
   * @param {string} content - El contenido HTML a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  async setContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        this.editorInstance.html.set(content);
        this.editorInstance.events.trigger("contentChanged");
        if (this.options.debug) {
          console.log(
            `[FroalaAdapter] Content set successfully (${content.length} chars)`
          );
        }
        return true;
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error setting content:`, error);
    }
    try {
      const element = document.querySelector(
        `#${this.editorId} div.fr-element`
      );
      if (element) {
        element.innerHTML = content;
        return true;
      }
    } catch (e) {
      console.error(`[FroalaAdapter] Error in fallback content setting:`, e);
    }
    return false;
  }
  /**
   * Inserta contenido en la posición actual del cursor
   * @param {string} content - El contenido HTML a insertar
   * @returns {boolean} true si se insertó correctamente, false en caso contrario
   */
  async insertContent(content) {
    await this.waitForEditor();
    try {
      if (this.editorInstance) {
        this.editorInstance.html.insert(content, true);
        this.editorInstance.events.trigger("contentChanged");
        if (this.options.debug) {
          console.log(`[FroalaAdapter] Content inserted successfully`);
        }
        return true;
      }
    } catch (error) {
      console.error(`[FroalaAdapter] Error inserting content:`, error);
    }
    return false;
  }
  /**
   * Verifica si el editor está inicializado
   * @returns {boolean} true si el editor está inicializado, false en caso contrario
   */
  isInitialized() {
    return this._initialized && this.editorInstance !== null;
  }
}
function createFroalaAdapter(editorId, options = {}) {
  return new FroalaAdapter(editorId, options);
}
class EditorAdapter {
  /**
   * Constructor del adaptador de editor
   * @param {string} editorId - ID del elemento editor
   * @param {string} editorType - Tipo de editor ('textarea', 'tinymce', 'ckeditor', 'froala', etc.)
   * @param {Object} options - Opciones adicionales
   */
  constructor(editorId, editorType = "textarea", options = {}) {
    this.editorId = editorId;
    this.editorType = editorType.toLowerCase();
    this.options = {
      debug: options.debug || false,
      ...options
    };
    this.specificAdapters = {};
    this._initializeSpecificAdapter();
  }
  /**
   * Inicializa el adaptador específico según el tipo de editor
   * @private
   */
  _initializeSpecificAdapter() {
    switch (this.editorType) {
      case "tinymce":
        try {
          this.specificAdapters.tinymce = createTinyMCEAdapter(this.editorId, {
            debug: this.options.debug
          });
          if (this.options.debug) {
            console.log("[EditorAdapter] TinyMCE adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize TinyMCE adapter:",
            error
          );
        }
        break;
      case "ckeditor":
        try {
          this.specificAdapters.ckeditor = createCKEditorAdapter(this.editorId, {
            debug: this.options.debug
          });
          if (this.options.debug) {
            console.log("[EditorAdapter] CKEditor adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize CKEditor adapter:",
            error
          );
        }
        break;
      case "quill":
        try {
          this.specificAdapters.quill = createQuillAdapter(this.editorId, {
            debug: this.options.debug
          });
          if (this.options.debug) {
            console.log("[EditorAdapter] Quill adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize Quill adapter:",
            error
          );
        }
        break;
      case "froala":
        try {
          this.specificAdapters.froala = createFroalaAdapter(this.editorId, {
            debug: this.options.debug
          });
          if (this.options.debug) {
            console.log("[EditorAdapter] Froala adapter initialized");
          }
        } catch (error) {
          console.error(
            "[EditorAdapter] Failed to initialize Froala adapter:",
            error
          );
        }
        break;
      // Aquí se pueden agregar más adaptadores específicos para otros editores
      default:
        if (this.options.debug) {
          console.log(
            `[EditorAdapter] Using default textarea adapter for type: ${this.editorType}`
          );
        }
        break;
    }
  }
  /**
   * Obtiene el contenido del editor
   * @returns {string} Contenido del editor
   */
  getContent() {
    try {
      switch (this.editorType) {
        case "tinymce":
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.getContent() || "";
          }
          if (typeof tinymce !== "undefined") {
            const editor = tinymce.get(this.editorId);
            if (editor) {
              return editor.getContent() || "";
            }
          }
          console.warn("[EditorAdapter] TinyMCE not initialized properly");
          return "";
        case "ckeditor":
          if (this.specificAdapters.ckeditor) {
            return this.specificAdapters.ckeditor.getContent() || "";
          }
          if (typeof CKEDITOR !== "undefined") {
            const editor = CKEDITOR.instances[this.editorId];
            if (editor) {
              return editor.getData() || "";
            }
          }
          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return "";
        case "quill":
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.getContent() || "";
          }
          const quillElement = document.querySelector(`#${this.editorId}`);
          if (quillElement && quillElement.__quill) {
            return quillElement.__quill.root.innerHTML || "";
          }
          console.warn("[EditorAdapter] Quill not initialized properly");
          return "";
        case "froala":
          if (this.specificAdapters.froala) {
            return this.specificAdapters.froala.getContent() || "";
          }
          if (typeof window.froalaInstance !== "undefined") {
            return window.froalaInstance.html.get() || "";
          }
          const froalaElement = document.querySelector(
            `#${this.editorId} div.fr-element`
          );
          if (froalaElement) {
            return froalaElement.innerHTML || "";
          }
          console.warn("[EditorAdapter] Froala not initialized properly");
          return "";
        case "textarea":
        default:
          const element = document.getElementById(this.editorId);
          if (element) {
            if (element.tagName.toLowerCase() === "textarea") {
              return element.value || "";
            } else {
              return element.innerHTML || "";
            }
          }
          console.warn("[EditorAdapter] Element not found:", this.editorId);
          return "";
      }
    } catch (error) {
      console.error("[EditorAdapter] Error getting content:", error);
      return "";
    }
  }
  /**
   * Establece el contenido del editor
   * @param {string} content - Contenido a establecer
   * @returns {boolean} true si se estableció correctamente, false en caso contrario
   */
  setContent(content) {
    try {
      switch (this.editorType) {
        case "tinymce":
          if (this.specificAdapters.tinymce) {
            return this.specificAdapters.tinymce.setContent(content);
          }
          if (typeof tinymce !== "undefined") {
            const editor = tinymce.get(this.editorId);
            if (editor) {
              editor.setContent(content);
              return true;
            }
          }
          console.warn("[EditorAdapter] TinyMCE not initialized properly");
          return false;
        case "ckeditor":
          if (this.specificAdapters.ckeditor) {
            return this.specificAdapters.ckeditor.setContent(content);
          }
          if (typeof CKEDITOR !== "undefined") {
            const editor = CKEDITOR.instances[this.editorId];
            if (editor) {
              editor.setData(content);
              return true;
            }
          }
          console.warn("[EditorAdapter] CKEditor not initialized properly");
          return false;
        case "quill":
          if (this.specificAdapters.quill) {
            return this.specificAdapters.quill.setContent(content);
          }
          const quillElement = document.querySelector(`#${this.editorId}`);
          if (quillElement && quillElement.__quill) {
            quillElement.__quill.root.innerHTML = content;
            return true;
          }
          console.warn("[EditorAdapter] Quill not initialized properly");
          return false;
        case "froala":
          if (this.specificAdapters.froala) {
            return this.specificAdapters.froala.setContent(content);
          }
          if (typeof window.froalaInstance !== "undefined") {
            window.froalaInstance.html.set(content);
            window.froalaInstance.events.trigger("contentChanged");
            return true;
          }
          const froalaElement = document.querySelector(
            `#${this.editorId} div.fr-element`
          );
          if (froalaElement) {
            froalaElement.innerHTML = content;
            return true;
          }
          console.warn("[EditorAdapter] Froala not initialized properly");
          return false;
        case "textarea":
        default:
          const element = document.getElementById(this.editorId);
          if (element) {
            if (element.tagName.toLowerCase() === "textarea") {
              element.value = content;
            } else {
              element.innerHTML = content;
            }
            return true;
          }
          console.warn("[EditorAdapter] Element not found:", this.editorId);
          return false;
      }
    } catch (error) {
      console.error("[EditorAdapter] Error setting content:", error);
      return false;
    }
  }
}
const createEventEmitter = (element) => {
  return {
    emit: (eventName, detail) => {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
      });
      element.dispatchEvent(event);
    },
    on: (eventName, handler) => {
      element.addEventListener(eventName, handler);
      return () => element.removeEventListener(eventName, handler);
    },
    off: (eventName, handler) => {
      element.removeEventListener(eventName, handler);
    }
  };
};
function attachShadowTemplate(component, templateContent) {
  if (!component) {
    console.error(
      "Error: No se proporcionó un componente para attachShadowTemplate"
    );
    return null;
  }
  if (!templateContent) {
    console.error(
      "Error: No se proporcionó contenido de plantilla para attachShadowTemplate"
    );
    return null;
  }
  console.log("Attaching shadow template to component:", {
    componentTagName: component.tagName,
    templateContentLength: templateContent.length
  });
  if (component.shadowRoot) {
    console.log("El componente ya tiene un shadowRoot, no se creará uno nuevo");
    while (component.shadowRoot.firstChild) {
      component.shadowRoot.removeChild(component.shadowRoot.firstChild);
    }
  } else {
    try {
      component.attachShadow({ mode: "open" });
      console.log("Shadow root creado:", !!component.shadowRoot);
    } catch (error) {
      console.error("Error creando shadow root:", error);
      return null;
    }
  }
  try {
    const template = document.createElement("template");
    template.innerHTML = templateContent;
    console.log(
      "Template element creado con contenido de longitud:",
      template.innerHTML.length
    );
    const content = template.content.cloneNode(true);
    console.log("Contenido clonado:", {
      hasContent: !!content,
      childNodes: content.childNodes.length
    });
    component.shadowRoot.appendChild(content);
    console.log("Contenido agregado al shadow root");
    const elements = {
      modalTrigger: component.shadowRoot.querySelector(".modal-trigger"),
      modal: component.shadowRoot.querySelector(".modal"),
      aiToolbar: component.shadowRoot.querySelector("ai-toolbar"),
      chatWithImage: component.shadowRoot.querySelector("chat-with-image"),
      responseHistory: component.shadowRoot.querySelector("response-history")
    };
    console.log("Elementos renderizados:", {
      hasModalTrigger: !!elements.modalTrigger,
      hasModal: !!elements.modal,
      hasAiToolbar: !!elements.aiToolbar,
      hasChatWithImage: !!elements.chatWithImage,
      hasResponseHistory: !!elements.responseHistory
    });
    return component.shadowRoot;
  } catch (error) {
    console.error("Error procesando template:", error);
    return null;
  }
}
class NotificationManager {
  constructor(container) {
    if (!container) {
      console.error("[NotificationManager] No se proporcionó un contenedor");
      this.container = null;
      return;
    }
    if (container.shadowRoot) {
      this.container = container.shadowRoot.querySelector(
        ".notifications-container"
      );
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.className = "notifications-container";
        container.shadowRoot.appendChild(this.container);
      }
    } else {
      this.container = container;
    }
    this.notifications = /* @__PURE__ */ new Set();
    console.log(
      "[NotificationManager] Inicializado con contenedor:",
      this.container
    );
  }
  show(message, type = "info", duration = 5e3) {
    if (!this.container) {
      console.error(
        "[NotificationManager] No hay contenedor de notificaciones disponible"
      );
      console.log(`[${type.toUpperCase()}] ${message}`);
      return null;
    }
    try {
      const notification = document.createElement("div");
      notification.className = `ai-notification ${type}`;
      notification.setAttribute("role", "alert");
      const icon = this.getIconForType(type);
      notification.innerHTML = `
        ${icon}
        <div class="notification-content">${message}</div>
        <button class="notification-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      `;
      const close = () => {
        notification.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
          this.notifications.delete(notification);
        }, 300);
      };
      const closeButton = notification.querySelector(".notification-close");
      if (closeButton) {
        closeButton.onclick = close;
      }
      if (duration > 0) {
        setTimeout(close, duration);
      }
      this.container.appendChild(notification);
      this.notifications.add(notification);
      console.log(`[NotificationManager] Notificación mostrada: ${type}`);
      this.cleanupOldNotifications();
      return notification;
    } catch (error) {
      console.error(
        "[NotificationManager] Error al mostrar notificación:",
        error
      );
      return null;
    }
  }
  // Métodos de conveniencia para diferentes tipos de notificaciones
  error(message, duration = 7e3) {
    return this.show(message, "error", duration);
  }
  warning(message, duration = 5e3) {
    return this.show(message, "warning", duration);
  }
  info(message, duration = 4e3) {
    return this.show(message, "info", duration);
  }
  success(message, duration = 3e3) {
    return this.show(message, "success", duration);
  }
  // Limitar el número de notificaciones simultáneas
  cleanupOldNotifications(maxNotifications = 3) {
    const notificationsArray = Array.from(this.notifications);
    if (notificationsArray.length > maxNotifications) {
      const oldNotifications = notificationsArray.slice(
        0,
        notificationsArray.length - maxNotifications
      );
      oldNotifications.forEach((notification) => {
        if (notification.parentNode) {
          notification.remove();
        }
        this.notifications.delete(notification);
      });
    }
  }
  // Obtener un ícono SVG según el tipo de notificación
  getIconForType(type) {
    switch (type) {
      case "error":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        `;
      case "warning":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        `;
      case "success":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        `;
      case "info":
      default:
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        `;
    }
  }
  // Limpiar todas las notificaciones
  clearAll() {
    this.notifications.forEach((notification) => {
      if (notification.parentNode) {
        notification.remove();
      }
    });
    this.notifications.clear();
  }
}
function createNotificationManager(container) {
  return new NotificationManager(container);
}
function setupKeyboardNavigation(component) {
  document.addEventListener("keydown", component.handleKeyboard.bind(component));
  const modal = component.shadowRoot.querySelector(".modal");
  if (modal) {
    modal.addEventListener("keydown", component.handleModalKeyboard.bind(component));
  }
}
const keyboardNavigationMixin = {
  handleKeyboard(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case "e":
          event.preventDefault();
          this.shadowRoot.querySelector(".modal-trigger").click();
          break;
        case "i":
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction("improve");
          }
          break;
        case "s":
          event.preventDefault();
          if (this.isModalOpen()) {
            this.handleToolAction("summarize");
          }
          break;
      }
    }
  },
  handleModalKeyboard(event) {
    if (!this.isModalOpen()) return;
    switch (event.key) {
      case "Escape":
        this.shadowRoot.querySelector(".close-button").click();
        break;
      case "Tab":
        this.handleTabNavigation(event);
        break;
      case "ArrowRight":
      case "ArrowLeft":
        if (event.target.closest(".tools-container")) {
          this.handleToolNavigation(event);
        }
        break;
    }
  },
  handleTabNavigation(event) {
    const modal = this.shadowRoot.querySelector(".modal");
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  },
  handleToolNavigation(event) {
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    const tools = toolbar.shadowRoot.querySelectorAll(".tool-button");
    const currentTool = toolbar.shadowRoot.querySelector(".tool-button:focus");
    if (!currentTool) return;
    const currentIndex = Array.from(tools).indexOf(currentTool);
    let nextIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tools.length;
    } else {
      nextIndex = (currentIndex - 1 + tools.length) % tools.length;
    }
    tools[nextIndex].focus();
    event.preventDefault();
  }
};
const responseHandlerMixin = {
  /**
   * Maneja el evento responseCopy para copiar el contenido al portapapeles
   * @param {CustomEvent} event - El evento con el ID de la respuesta
   */
  handleResponseCopy(event) {
    var _a;
    console.log("[ResponseHandlers] Copy event received:", event.detail);
    const { responseId } = event.detail;
    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in copy event");
      return;
    }
    const response = (_a = this.responseHistory) == null ? void 0 : _a.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }
    navigator.clipboard.writeText(response.content).then(() => {
      console.log("[ResponseHandlers] Content copied to clipboard");
      if (this.notificationManager) {
        this.notificationManager.success("Content copied to clipboard", 2e3);
      }
    }).catch((err) => {
      console.error("[ResponseHandlers] Copy failed:", err);
      if (this.notificationManager) {
        this.notificationManager.error("Failed to copy to clipboard");
      }
    });
  },
  /**
   * Maneja el evento responseUse para utilizar una respuesta generada
   * Versión mejorada con mejor manejo de errores y diagnóstico
   * @param {CustomEvent} event - El evento con la respuesta
   */
  handleResponseUse(event) {
    var _a;
    try {
      console.log("[ResponseHandlers] Use event received:", event.detail);
      if (!event.detail || !event.detail.responseId) {
        console.warn("[ResponseHandlers] Invalid event data:", event.detail);
        throw new Error("Invalid response data");
      }
      const { responseId } = event.detail;
      if (!this.responseHistory) {
        console.error("[ResponseHandlers] No response history available");
        throw new Error("Response history not available");
      }
      const response = this.responseHistory.getResponse(responseId);
      if (!response) {
        console.warn("[ResponseHandlers] No response found for ID:", responseId);
        throw new Error("Response not found");
      }
      if (!response.content || typeof response.content !== "string" || response.content.trim() === "") {
        console.warn("[ResponseHandlers] Empty content in response:", responseId);
        throw new Error("Response content is empty");
      }
      let contentToInsert = response.content;
      if (this.markdownHandler && ["tinymce", "ckeditor", "froala"].includes((_a = this.editorAdapter) == null ? void 0 : _a.editorType)) {
        contentToInsert = this.markdownHandler.convert(response.content);
        console.log("[ResponseHandlers] Content converted to HTML for WYSIWYG editor");
      }
      if (window.tinymce && this.editorId && tinymce.get(this.editorId)) {
        const editor = tinymce.get(this.editorId);
        if (editor && editor.initialized) {
          editor.setContent(contentToInsert);
          editor.undoManager.add();
          console.log("[ResponseHandlers] Content applied directly to TinyMCE");
          setTimeout(() => {
            const modal = this.shadowRoot.querySelector(".modal");
            if (modal) {
              modal.classList.remove("open");
            }
          }, 100);
          return true;
        }
      }
      if (this.editorAdapter) {
        console.log("[ResponseHandlers] Applying content via editor adapter");
        const success = this.editorAdapter.setContent(contentToInsert);
        if (success) {
          console.log("[ResponseHandlers] Response content applied to editor");
          this.dispatchEvent(
            new CustomEvent("ai-content-generated", {
              detail: { content: contentToInsert },
              bubbles: true,
              composed: true
            })
          );
          const modal = this.shadowRoot.querySelector(".modal");
          if (modal) {
            modal.classList.remove("open");
          }
          if (this.notificationManager) {
            this.notificationManager.success("Content applied successfully");
          }
          return true;
        } else {
          console.error("[ResponseHandlers] Failed to apply content to editor");
          throw new Error("Failed to apply content to editor");
        }
      } else {
        console.error("[ResponseHandlers] No editor adapter available");
        throw new Error("No editor connected");
      }
    } catch (error) {
      console.error("[ResponseHandlers] Error in handleResponseUse:", error);
      if (this.notificationManager) {
        this.notificationManager.error(`Error: ${error.message}`);
      }
      return false;
    }
  },
  /**
   * Maneja el evento responseRetry para volver a ejecutar una acción
   * @param {CustomEvent} event - El evento con la información de la acción a reintentar
   */
  handleResponseRetry(event) {
    var _a;
    console.log("[ResponseHandlers] Retry event received:", event.detail);
    const { responseId, action } = event.detail;
    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in retry event");
      return;
    }
    const response = (_a = this.responseHistory) == null ? void 0 : _a.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }
    console.log("[ResponseHandlers] Retrying action:", response.action);
    const syntheticEvent = {
      detail: {
        action: action || response.action,
        responseId,
        content: response.content
      }
    };
    this.handleToolAction(syntheticEvent);
  },
  /**
   * Maneja el evento responseEdit para editar una respuesta
   * @param {CustomEvent} event - El evento con el ID de la respuesta a editar
   */
  handleResponseEdit(event) {
    var _a;
    console.log("[ResponseHandlers] Edit event received:", event.detail);
    const { responseId } = event.detail;
    if (!responseId) {
      console.warn("[ResponseHandlers] No responseId provided in edit event");
      return;
    }
    const response = (_a = this.responseHistory) == null ? void 0 : _a.getResponse(responseId);
    if (!response) {
      console.warn("[ResponseHandlers] No response found for ID:", responseId);
      return;
    }
    console.log("[ResponseHandlers] Edit functionality not fully implemented");
    if (this.notificationManager) {
      this.notificationManager.info("Edit functionality coming soon");
    }
  }
};
const imageHandlerMixin = {
  isImageUsed(image) {
    if (!this.responseHistory) return false;
    const imageId = image instanceof File ? image.name : image;
    return this.responseHistory.responses.some(
      (response) => response.action !== "image-upload" && response.imageUsed === imageId
    );
  },
  handleImageChange(file) {
    if (file) {
      this.productImage = file;
      this.productImageUrl = null;
      const lastQuestion = this.responseHistory.responses.findLast(
        (response) => response.action === "chat-question"
      );
      if (lastQuestion) {
        const imagePreviewHTML = this.renderImagePreview(file);
        const questionEntry = this.shadowRoot.querySelector(
          `.response-entry[data-response-id="${lastQuestion.id}"]`
        );
        if (questionEntry) {
          const responseContent = questionEntry.querySelector(".response-content");
          if (responseContent) {
            responseContent.insertAdjacentHTML("beforeend", imagePreviewHTML);
          }
        }
        const imageUploadEntries = this.shadowRoot.querySelectorAll(
          '.response-entry[data-action="image-upload"]'
        );
        imageUploadEntries.forEach((entry) => entry.remove());
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
      const lastQuestion = this.responseHistory.responses.findLast(
        (response) => response.action === "chat-question"
      );
      if (lastQuestion) {
        lastQuestion.content = lastQuestion.content.replace(
          /<div class="image-preview-card"[\s\S]*?<\/div><\/div><\/div>/g,
          ""
        );
        if (this.responseHistory) {
          this.responseHistory.render();
        }
      }
    }
  },
  renderImagePreview(image = null, isInitial = false) {
    const imageToRender = image || this.productImage || this.productImageUrl;
    if (!imageToRender) return "";
    const imageUrl = imageToRender instanceof File ? URL.createObjectURL(imageToRender) : imageToRender;
    const filename = imageToRender instanceof File ? imageToRender.name : new URL(imageToRender).pathname.split("/").pop() || "From URL";
    return `
      <div class="image-preview-card" 
           data-image-id="${Date.now()}"
           role="figure"
           aria-label="${isInitial ? "Initial product image" : "Uploaded product image"}">
        <div class="image-preview-content">
          <div class="image-preview-thumbnail">
            <img src="${imageUrl}" alt="Product preview - ${filename}">
          </div>
        </div>
      </div>
    `;
  }
};
const createStateManager = (component) => {
  const _state = {};
  return {
    /**
     * Actualiza una propiedad de estado y opcionalmente vuelve a renderizar partes del componente
     *
     * @param {string} propName - Nombre de la propiedad a actualizar
     * @param {any} value - Nuevo valor
     * @param {Object} options - Opciones de actualización
     * @param {Boolean} options.rerender - Si se debe volver a renderizar después de la actualización
     * @param {String} options.targetSelector - Selector CSS del elemento que debería actualizarse
     */
    updateState(propName, value, options = {}) {
      const oldValue = _state[propName];
      _state[propName] = value;
      component.dispatchEvent(
        new CustomEvent("stateChange", {
          detail: { property: propName, oldValue, newValue: value },
          bubbles: false
        })
      );
      if (options.rerender && component.shadowRoot) {
        if (options.targetSelector) {
          const target = component.shadowRoot.querySelector(
            options.targetSelector
          );
          if (target && typeof component.renderPart === "function") {
            component.renderPart(target, propName);
          }
        } else if (typeof component.render === "function") {
          component.render();
        }
      }
      return value;
    },
    /**
     * Obtiene el valor actual de una propiedad de estado
     *
     * @param {string} propName - Nombre de la propiedad
     * @param {any} defaultValue - Valor por defecto si la propiedad no existe
     * @returns {any} - Valor actual de la propiedad
     */
    getState(propName, defaultValue = null) {
      return propName in _state ? _state[propName] : defaultValue;
    },
    /**
     * Devuelve una copia de todo el estado actual
     *
     * @returns {Object} - Copia del estado actual
     */
    getAllState() {
      return { ..._state };
    },
    /**
     * Actualiza múltiples propiedades de estado a la vez
     *
     * @param {Object} stateUpdates - Objeto con las actualizaciones {propiedad: nuevoValor}
     * @param {Object} options - Opciones de actualización (igual que updateState)
     */
    batchUpdate(stateUpdates, options = {}) {
      const changedProps = [];
      for (const [propName, value] of Object.entries(stateUpdates)) {
        const oldValue = _state[propName];
        if (oldValue !== value) {
          _state[propName] = value;
          changedProps.push({ property: propName, oldValue, newValue: value });
        }
      }
      if (changedProps.length > 0) {
        component.dispatchEvent(
          new CustomEvent("stateBatchChange", {
            detail: { changes: changedProps },
            bubbles: false
          })
        );
        if (options.rerender && component.shadowRoot) {
          if (options.targetSelector && typeof component.renderPart === "function") {
            const target = component.shadowRoot.querySelector(
              options.targetSelector
            );
            if (target) {
              component.renderPart(
                target,
                changedProps.map((c) => c.property)
              );
            }
          } else if (typeof component.render === "function") {
            component.render();
          }
        }
      }
      return changedProps.length > 0;
    }
  };
};
const stateManagementMixin = {
  initializeStateManager() {
    this.stateManager = createStateManager(this);
    this.addEventListener("stateChange", this.handleStateChange.bind(this));
    this.addEventListener(
      "stateBatchChange",
      this.handleStateBatchChange.bind(this)
    );
  },
  handleStateChange(event) {
    const { property, oldValue, newValue } = event.detail;
    console.log(
      `[StateManager] Property '${property}' changed:`,
      oldValue,
      "->",
      newValue
    );
    switch (property) {
      case "productImage":
        this.handleProductImageChange(oldValue, newValue);
        break;
      case "enhancedText":
        this.handleEnhancedTextChange(oldValue, newValue);
        break;
    }
  },
  handleStateBatchChange(event) {
    console.log("[StateManager] Batch state change:", event.detail.changes);
    const changedProps = event.detail.changes.map((c) => c.property);
    if (changedProps.includes("productImage")) {
      const change = event.detail.changes.find(
        (c) => c.property === "productImage"
      );
      this.handleProductImageChange(change.oldValue, change.newValue);
    }
  },
  handleProductImageChange(oldImage, newImage) {
    if (newImage) {
      console.log("[StateManager] New product image set:", newImage.name);
      if (this.responseHistory) {
        const lastQuestion = this.responseHistory.responses.findLast(
          (response) => response.action === "chat-question"
        );
        if (lastQuestion) {
          this.responseHistory.render();
        }
      }
    } else if (oldImage) {
      console.log("[StateManager] Product image removed");
    }
  },
  handleEnhancedTextChange(oldText, newText) {
    console.log("[StateManager] Enhanced text updated");
  },
  // Método para solicitar una actualización de la interfaz de usuario
  requestUpdate(target = null) {
    console.log(
      "[StateManager] Update requested for:",
      target || "entire component"
    );
    if (!target) {
      if (this.responseHistory) {
        this.responseHistory.render();
      }
      this.updateVisibleTools();
      return;
    }
    switch (target) {
      case "responseHistory":
        if (this.responseHistory) {
          this.responseHistory.render();
        }
        break;
      case "toolbar":
        this.updateVisibleTools();
        break;
    }
  }
};
const modalTriggerStyles = `
  .modal-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(to right, var(--ai-gradient-start) 0%, var(--ai-gradient-middle) 51%, var(--ai-gradient-end) 100%);
    background-size: 200% auto;
    border: 0;
    border-radius: 2em;
    color: white;
    font-family: var(--ai-font-sans);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    box-shadow: var(--ai-shadow);
    margin-top: 15px;
  }

  .modal-trigger::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
    background-size: 400%;
    border-radius: 2em;
    z-index: -1;
    transition: opacity 0.3s ease;
    animation: glow 5s linear infinite;
  }

  .modal-trigger:hover {
    background-position: right center;
    box-shadow: var(--ai-shadow-md);
    transform: translateY(-1px);
  }

  .modal-trigger:hover::before {
    opacity: 0.7;
    filter: blur(8px);
  }

  .modal-trigger svg {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.5em;
    transition: transform 0.3s ease;
  }

  .modal-trigger:hover svg {
    animation: shake 0.5s ease-in-out;
  }

  .modal-trigger span {
    font-size: 0.9375rem;
    letter-spacing: 0.025em;
  }
`;
const modalStyles = `
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--ai-z-modal);
  }

  .modal.open {
    display: block;
  }

  .modal-content {
    position: relative;
    background: var(--ai-background);
    width: 95%;
    max-width: 1200px;
    height: 85vh;
    margin: 5vh auto;
    padding: 1.5rem;
    border-radius: var(--ai-radius-lg);
    box-shadow: var(--ai-shadow-md);
    display: flex;
    flex-direction: column;
    z-index: var(--ai-z-content);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ai-text);
  }

  .version-info {
    background: var(--ai-secondary);
    color: var(--ai-text-light);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: var(--ai-radius-sm);
    cursor: help;
    user-select: none;
    transition: all 0.2s ease;
  }

  .version-info:hover {
    background: var(--ai-secondary-hover);
    color: var(--ai-text);
  }

  .modal-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }

  .editor-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .image-upload-section {
    margin-bottom: 1rem;
  }

  .tools-container {
    margin-bottom: 1rem;
  }

  .chat-section {
    flex-shrink: 0;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--ai-text-light);
    transition: color 0.2s ease;
    z-index: 1;
  }

  .close-button:hover {
    color: var(--ai-text);
  }
`;
const notificationStyles = `
  .ai-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem;
    border-radius: var(--ai-radius);
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
    max-width: 300px;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ai-notification.info {
    background: var(--ai-info-bg, #e3f2fd);
    color: var(--ai-info-text, #0d47a1);
    border: 1px solid var(--ai-info-border, #90caf9);
  }

  .ai-notification.warning {
    background: var(--ai-warning-bg);
    color: var(--ai-warning-text);
    border: 1px solid var(--ai-warning-border);
  }

  .ai-notification.error {
    background: var(--ai-error-bg);
    color: var(--ai-error-text);
    border: 1px solid var(--ai-error-border);
  }

  .ai-notification.success {
    background: var(--ai-success-bg, #e8f5e9);
    color: var(--ai-success-text, #1b5e20);
    border: 1px solid var(--ai-success-border, #a5d6a7);
  }

  .notification-close {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: currentColor;
    opacity: 0.7;
  }

  .notification-close:hover {
    opacity: 1;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
function createTemplate(component) {
  if (!component) {
    console.error("[createTemplate] Error: No se proporcionó un componente");
    return "";
  }
  try {
    console.log(
      "[createTemplate] Creando template para el componente",
      component.tagName
    );
    const t = component.translations || {};
    const currentContent = typeof component.currentContent === "function" ? component.currentContent() : component.currentContent || "";
    const context = component.context || "";
    const hasContent = Boolean((currentContent == null ? void 0 : currentContent.trim) && currentContent.trim());
    const hasContext = Boolean((context == null ? void 0 : context.trim) && context.trim());
    const showTrigger = !component.hideTrigger;
    console.log("[createTemplate] Estado del componente:", {
      hasContent,
      hasContext,
      language: component.language || "en",
      showTrigger
      // Añadir esta línea para mostrar el estado en logs
    });
    return `
    <!-- Estilos del componente -->
    <style>
      ${variables}
      ${animations}
      ${modalTriggerStyles}
      ${modalStyles}
      ${previewStyles}
      ${imagePreviewStyles}
      ${notificationStyles}
      
      /* Estilos específicos del componente */
      :host {
        display: inline-block;
        font-family: var(--ai-font-sans);
        position: relative;
      }

      .editor-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .chat-section {
        position: relative;
        width: 100%;
        bottom: 0;
        left: 0;
      }

      .tools-container {
        margin-bottom: 1rem;
      }

      response-history {
        flex: 1;
        min-height: 0;
        max-height: calc(85vh - 120px);
        background: var(--ai-background);
        border-radius: var(--ai-radius);
        margin-bottom: 1rem;
        overflow: auto;
        display: block;
      }
      
      /* Contenedor de notificaciones */
      .notifications-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: var(--ai-z-notification, 100001);
        pointer-events: none;
      }
      
      .notifications-container > * {
        pointer-events: auto;
      }
      
      /* Estilos de ayuda y depuración */
      .debug-info {
        display: none;
        padding: 10px;
        margin: 10px 0;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 12px;
      }
      
      /* Mostrar en modo depuración */
      :host([debug]) .debug-info {
        display: block;
      }
    </style>

    <!-- Botón para abrir el modal (CONDICIONAL) -->
    ${showTrigger ? `
    <button class="modal-trigger" id="modal-trigger-button">
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" fill-opacity="0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
                        <path d="m14 7 3 3"/>
                        <path d="M5 6v4"/>
                        <path d="M19 14v4"/>
                        <path d="M10 2v2"/>
                        <path d="M7 8H3"/>
                        <path d="M21 16h-4"/>
                        <path d="M11 3H9"/>
                      </svg>
      <span>${(t == null ? void 0 : t.modalTrigger) || "Enhance with AI"}</span>
    </button>
    ` : ""}
    
    <!-- Modal principal -->
    <div class="modal" id="ai-enhancer-modal">
      <div class="modal-content">
        <button class="close-button" aria-label="Close modal">×</button>
        <div class="modal-header">
          <h2>${(t == null ? void 0 : t.modalTitle) || "Enhance Text"}</h2>
          <div class="version-info" title="Version ${component.version || "1.0.0"} - ${component.buildDate || "Development"}">
            v${component.version || "1.0.0"}
          </div>
        </div>
        
        <div class="modal-body">
          <!-- Historial de respuestas -->
          <div class="editor-section">
            <response-history language="${component.language || "en"}"></response-history>
          </div>
          
          <!-- Sección de chat -->
          <div class="chat-section">
            <!-- LOG: supports-images = "${component.getAttribute && component.getAttribute("supports-images")}" -->
            <chat-with-image
              language="${component.language || "en"}"
              image-url="${component.imageUrl || ""}"
              apiProvider="${component.apiProvider || "openai"}"
              ${component.hasAttribute && component.hasAttribute("supports-images") ? `supports-images="${component.getAttribute("supports-images")}"` : ""}
            >
            </chat-with-image>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contenedor de notificaciones -->
    <div class="notifications-container"></div>`;
  } catch (error) {
    console.error("[createTemplate] Error creando template:", error);
    return `
    <div style="color: red; padding: 10px; border: 1px solid red;">
      Error creating component template: ${error.message}
    </div>
    <button class="modal-trigger">Enhance Text</button>
    <div class="modal">
      <div class="modal-content">
        <button class="close-button">×</button>
        <div class="modal-header">
          <h2>Enhance Text</h2>
        </div>
        <div class="modal-body">
          <p>Error loading component. Please try refreshing the page.</p>
        </div>
      </div>
    </div>`;
  }
}
class AITextEnhancer extends HTMLElement {
  constructor() {
    super();
    Object.assign(
      this,
      keyboardNavigationMixin,
      responseHandlerMixin,
      imageHandlerMixin,
      stateManagementMixin
    );
    if (!customElements.get("ai-toolbar")) {
      customElements.define("ai-toolbar", ToolBar);
    }
    if (!customElements.get("chat-with-image")) {
      customElements.define("chat-with-image", ChatWithImage);
    }
    if (!customElements.get("response-history")) {
      customElements.define("response-history", ResponseHistory);
    }
    this.eventEmitter = createEventEmitter(this);
    this.responseHistory = null;
    this.editorAdapter = null;
    this.currentAction = "improve";
    this.markdownHandler = new MarkdownHandler();
    this.tokenManager = new TokenManager();
    this.initializeStateManager();
    this.cacheManager = createCacheManager({
      prefix: "ai-text-enhancer",
      maxItems: 20,
      ttl: 30 * 60 * 1e3
    });
    this.stateManager.batchUpdate({
      enhancedText: "",
      chatMessages: [],
      isInitialized: false,
      productImage: null,
      usageControl: null
    });
    this.bindMethods();
    this.version = VERSION;
    this.buildDate = BUILD_DATE;
    console.log(`[AITextEnhancer] Version ${VERSION} (${BUILD_DATE})`);
  }
  bindMethods() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    this.handleToolAction = (_a = this.handleToolAction) == null ? void 0 : _a.bind(this);
    this.handleChatMessage = (_b = this.handleChatMessage) == null ? void 0 : _b.bind(this);
    this.handleResponseCopy = (_c = this.handleResponseCopy) == null ? void 0 : _c.bind(this);
    this.handleResponseUse = (_d = this.handleResponseUse) == null ? void 0 : _d.bind(this);
    this.handleResponseRetry = (_e = this.handleResponseRetry) == null ? void 0 : _e.bind(this);
    this.handleResponseEdit = (_f = this.handleResponseEdit) == null ? void 0 : _f.bind(this);
    this.handleKeyboard = (_g = this.handleKeyboard) == null ? void 0 : _g.bind(this);
    this.handleModalKeyboard = (_h = this.handleModalKeyboard) == null ? void 0 : _h.bind(this);
    this.modalTriggerHandler = (_i = this.modalTriggerHandler) == null ? void 0 : _i.bind(this);
  }
  // Getters
  static get observedAttributes() {
    return [
      "editor-id",
      "api-key",
      "api-provider",
      "api-model",
      "language",
      "prompt",
      "context",
      "image-url",
      "tenant-id",
      "user-id",
      "quota-endpoint",
      "proxy-endpoint",
      "editor-type",
      "hide-trigger",
      "id"
      // Añadido el atributo id
    ];
  }
  get language() {
    return this.getAttribute("language") || "en";
  }
  get translations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }
  get editorId() {
    return this.getAttribute("editor-id");
  }
  get editorType() {
    return this.getAttribute("editor-type") || "textarea";
  }
  get apiKey() {
    return this.getAttribute("api-key");
  }
  get prompt() {
    return this.getAttribute("prompt") || "You are a professional content enhancer. Improve the text while maintaining its core message and intent.";
  }
  get currentContent() {
    var _a;
    return ((_a = this.editorAdapter) == null ? void 0 : _a.getContent()) || "";
  }
  get apiProvider() {
    return this.getAttribute("api-provider") || "openai";
  }
  get apiModel() {
    return this.getAttribute("api-model") || "gpt-3.5-turbo";
  }
  get imageUrl() {
    return this.getAttribute("image-url");
  }
  get context() {
    return this.getAttribute("context") || "";
  }
  get proxyEndpoint() {
    return this.getAttribute("proxy-endpoint");
  }
  get hideTrigger() {
    return this.hasAttribute("hide-trigger");
  }
  get componentId() {
    return this.getAttribute("id");
  }
  // Método mejorado para connectedCallback
  async connectedCallback() {
    try {
      console.log("[AITextEnhancer] Component connected, initializing...");
      const template = createTemplate(this);
      attachShadowTemplate(this, template);
      console.log("[AITextEnhancer] Shadow DOM created");
      const notificationsContainer = this.shadowRoot.querySelector(
        ".notifications-container"
      );
      if (notificationsContainer) {
        this.notificationManager = createNotificationManager(
          notificationsContainer
        );
        console.log("[AITextEnhancer] Notification manager initialized");
      }
      this.ensureModalExists();
      this.updateLanguageForChildren(this.language);
      this.setupEventListeners();
      setupKeyboardNavigation(this);
      await this.initializeComponents();
      console.log("[AITextEnhancer] Components initialized");
      this.setupEditorListener();
      this.editorReady = false;
      if (window.tinymce && this.editorId && tinymce.get(this.editorId)) {
        const editorInstance = tinymce.get(this.editorId);
        if (editorInstance.initialized) {
          this.editorReady = true;
        } else {
          editorInstance.on("init", () => {
            this.editorReady = true;
            this.updateChatState();
          });
        }
      } else {
        this.editorReady = true;
      }
      if (this.editorReady) {
        this.updateChatState();
      }
      setTimeout(() => {
        console.log("[AITextEnhancer] Re-binding events after initialization");
        this.bindEvents();
        const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");
        if (modalTrigger) {
          console.log("[AITextEnhancer] Modal trigger element:", modalTrigger);
        } else {
          console.warn(
            "[AITextEnhancer] Modal trigger still not found after initialization"
          );
        }
      }, 200);
      console.log("[AITextEnhancer] Component fully initialized");
    } catch (error) {
      console.error("[AITextEnhancer] Error initializing component:", error);
      try {
        if (this.notificationManager) {
          this.notificationManager.error(
            `Initialization error: ${error.message}`
          );
        } else {
          if (this.shadowRoot) {
            const errorElement = document.createElement("div");
            errorElement.style.color = "red";
            errorElement.style.padding = "10px";
            errorElement.style.margin = "10px 0";
            errorElement.style.border = "1px solid red";
            errorElement.textContent = `Error initializing component: ${error.message}`;
            this.shadowRoot.appendChild(errorElement);
          }
        }
      } catch (notifError) {
        console.error(
          "[AITextEnhancer] Error showing notification:",
          notifError
        );
      }
    }
  }
  // Método mejorado para attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "[AITextEnhancer] Attribute changed:",
      name,
      "from",
      oldValue,
      "to",
      newValue
    );
    if (oldValue === newValue) return;
    switch (name) {
      case "api-key":
        if (this.apiClient) {
          this.apiClient.setApiKey(newValue);
        } else if (!this.isInitialized) {
          this.initializeComponents();
        }
        break;
      case "language":
        this.updateLanguageForChildren(newValue);
        break;
      case "context":
        setTimeout(() => this.updateChatState(), 100);
        break;
      case "api-provider":
      case "api-model":
      case "proxy-endpoint":
        if (this.isInitialized && this.apiClient) {
          this.apiClient.updateConfig({
            provider: this.apiProvider,
            model: this.apiModel,
            proxyEndpoint: this.proxyEndpoint
          });
        }
        break;
      case "image-url":
        if (this.isInitialized) {
          const chatComponent = this.shadowRoot.querySelector("chat-with-image");
          if (chatComponent) {
            chatComponent.setAttribute("image-url", newValue || "");
          }
        }
        break;
    }
  }
  // Método mejorado para setupEditorListener
  setupEditorListener() {
    if (!this.editorId) {
      console.warn("[AITextEnhancer] No editor ID provided");
      return;
    }
    const editorElement = document.getElementById(this.editorId);
    if (!editorElement) {
      console.warn(
        `[AITextEnhancer] Editor element with ID "${this.editorId}" not found`
      );
      if (this.notificationManager) {
        this.notificationManager.warning(
          `Editor element "${this.editorId}" not found. Text enhancement functionality may be limited.`
        );
      }
      return;
    }
    const updateChatOnChange = () => {
      if (this.isModalOpen()) {
        this.updateChatState();
        this.updateVisibleTools();
      }
    };
    if (this._editorChangeListener) {
      editorElement.removeEventListener("input", this._editorChangeListener);
      editorElement.removeEventListener("change", this._editorChangeListener);
    }
    this._editorChangeListener = updateChatOnChange;
    editorElement.addEventListener("input", this._editorChangeListener);
    editorElement.addEventListener("change", this._editorChangeListener);
    console.log(
      `[AITextEnhancer] Editor listener set up for "${this.editorId}"`
    );
  }
  // Método mejorado para updateLanguageForChildren
  updateLanguageForChildren(language) {
    console.log("[AITextEnhancer] Updating language for children:", language);
    if (!this.shadowRoot) {
      console.warn("[AITextEnhancer] No shadowRoot available yet");
      return;
    }
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger span");
    const modalTitle = this.shadowRoot.querySelector(".modal-header h2");
    if (modalTrigger) {
      modalTrigger.textContent = this.translations.modalTrigger || "Enhance Text";
      console.log(
        "[AITextEnhancer] Updated modal trigger text:",
        modalTrigger.textContent
      );
    }
    if (modalTitle) {
      modalTitle.textContent = this.translations.modalTitle || "Enhance Text";
      console.log(
        "[AITextEnhancer] Updated modal title text:",
        modalTitle.textContent
      );
    }
    if (this.modalTriggerHandler) {
      const trigger = this.shadowRoot.querySelector(".modal-trigger");
      if (trigger) {
        trigger.removeEventListener("click", this.modalTriggerHandler);
        trigger.addEventListener("click", this.modalTriggerHandler);
      }
    }
    const components = this.shadowRoot.querySelectorAll("[language]");
    console.log(
      "[AITextEnhancer] Found components to update:",
      components.length
    );
    components.forEach((component) => {
      const oldLang = component.getAttribute("language");
      component.setAttribute("language", language);
      console.log("[AITextEnhancer] Updated component language:", {
        component: component.tagName,
        from: oldLang,
        to: language
      });
    });
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    const responseHistory = this.shadowRoot.querySelector("response-history");
    [toolbar, chatComponent, responseHistory].forEach((component) => {
      if (component) {
        component.setAttribute("language", language);
        console.log(
          "[AITextEnhancer] Forced language update on:",
          component.tagName
        );
      }
    });
  }
  // Método mejorado para modalTriggerHandler
  modalTriggerHandler() {
    var _a, _b, _c, _d;
    console.log("[AITextEnhancer] Modal trigger clicked, checking shadowRoot");
    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] Shadow root not available");
      return;
    }
    const modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.error("[AITextEnhancer] Modal element not found in shadowRoot");
      if (this.notificationManager) {
        this.notificationManager.warning(
          "Modal not found, trying to recreate it..."
        );
      }
      if (this.ensureModalExists()) {
        const newModal = this.shadowRoot.querySelector(".modal");
        if (newModal) {
          modal = newModal;
        } else {
          if (this.notificationManager) {
            this.notificationManager.error("Failed to recreate modal");
          }
          return;
        }
      } else {
        return;
      }
    }
    console.log("[AITextEnhancer] Opening modal with current state:", {
      apiProvider: this.apiProvider,
      model: this.apiModel,
      language: this.language,
      context: ((_a = this.context) == null ? void 0 : _a.substring(0, 50)) + (((_b = this.context) == null ? void 0 : _b.length) > 50 ? "..." : ""),
      imageUrl: this.imageUrl,
      hasContent: this.editorReady ? Boolean((_c = this.currentContent) == null ? void 0 : _c.trim()) : false,
      hasContext: Boolean((_d = this.context) == null ? void 0 : _d.trim()),
      editorReady: this.editorReady
    });
    modal.classList.add("open");
    setTimeout(() => {
      this.updateVisibleTools();
      this.updateChatState();
      const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);
  }
  // Método público para abrir el modal programáticamente
  openModal() {
    const modal = this.shadowRoot.querySelector(".modal");
    if (modal) {
      modal.classList.add("open");
      setTimeout(() => {
        this.updateVisibleTools();
        this.updateChatState();
        const firstFocusable = modal.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);
    }
  }
  // Función para asegurar que el modal exista
  ensureModalExists() {
    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] No shadowRoot available for modal check");
      return false;
    }
    let modal = this.shadowRoot.querySelector(".modal");
    if (!modal) {
      console.warn("[AITextEnhancer] Modal not found, attempting to recreate");
      const template = createTemplate(this);
      const fragment = document.createRange().createContextualFragment(template);
      const newModal = fragment.querySelector(".modal");
      if (newModal) {
        this.shadowRoot.appendChild(newModal);
        console.log("[AITextEnhancer] Modal recreated successfully");
        const closeButton = newModal.querySelector(".close-button");
        if (closeButton) {
          closeButton.onclick = () => newModal.classList.remove("open");
        }
        newModal.onclick = (e) => {
          if (e.target === newModal) {
            newModal.classList.remove("open");
          }
        };
        modal = newModal;
      } else {
        console.error("[AITextEnhancer] Failed to recreate modal");
        return false;
      }
    }
    return true;
  }
  // Método mejorado para setupEventListeners
  setupEventListeners() {
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      chatComponent.removeEventListener("chatMessage", this.handleChatMessage);
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
      console.log("[AITextEnhancer] Chat message event listener set up");
    } else {
      console.warn("[AITextEnhancer] Chat component not found");
    }
    this.responseHistory = this.shadowRoot.querySelector("response-history");
    if (this.responseHistory) {
      if (this.markdownHandler) {
        this.responseHistory.markdownHandler = this.markdownHandler;
      }
      this.responseHistory.addEventListener(
        "responseCopy",
        this.handleResponseCopy
      );
      this.responseHistory.addEventListener(
        "responseUse",
        this.handleResponseUse
      );
      this.responseHistory.addEventListener(
        "responseRetry",
        this.handleResponseRetry
      );
      this.responseHistory.addEventListener(
        "responseEdit",
        this.handleResponseEdit
      );
      this.responseHistory.addEventListener(
        "toolaction",
        this.handleToolAction
      );
      console.log("[AITextEnhancer] Response history events set up");
    } else {
      console.warn("[AITextEnhancer] Response history component not found");
    }
    this.addEventListener("configurationUpdated", (event) => {
      console.log("[AITextEnhancer] Configuration updated:", event.detail);
      if (this.isInitialized) {
        this.initializeComponents().catch((error) => {
          console.error("Error reinitializing components:", error);
          if (this.notificationManager) {
            this.notificationManager.error(
              `Failed to update configuration: ${error.message}`
            );
          }
        });
      }
    });
    this.bindEvents();
  }
  // Método mejorado para bindEvents
  bindEvents() {
    if (!this.shadowRoot) {
      console.error("[AITextEnhancer] No shadowRoot available in bindEvents");
      return;
    }
    const modal = this.shadowRoot.querySelector(".modal");
    const modalTrigger = this.shadowRoot.querySelector(".modal-trigger");
    if (modalTrigger) {
      if (!this.modalTriggerHandler) {
        this.modalTriggerHandler = this.modalTriggerHandler.bind(this);
      }
      modalTrigger.removeEventListener("click", this.modalTriggerHandler);
      modalTrigger.addEventListener("click", this.modalTriggerHandler);
      console.log("[AITextEnhancer] Modal trigger event bound");
    } else {
      console.warn("[AITextEnhancer] Modal trigger not found in bindEvents");
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
        }
      };
      const closeButton = modal.querySelector(".close-button");
      if (closeButton) {
        closeButton.onclick = () => modal.classList.remove("open");
        console.log("[AITextEnhancer] Close button event bound");
      } else {
        console.warn("[AITextEnhancer] Close button not found in modal");
      }
    } else {
      console.warn("[AITextEnhancer] Modal element not found in bindEvents");
    }
    const toolbar = this.shadowRoot.querySelector("ai-toolbar");
    if (toolbar) {
      toolbar.removeEventListener("toolaction", this.handleToolAction);
      toolbar.addEventListener("toolaction", this.handleToolAction);
      console.log("[AITextEnhancer] Toolbar events bound");
    } else {
      console.warn("[AITextEnhancer] Toolbar not found in bindEvents");
    }
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (chatComponent) {
      chatComponent.removeEventListener("chatMessage", this.handleChatMessage);
      chatComponent.addEventListener("chatMessage", this.handleChatMessage);
      console.log("[AITextEnhancer] Chat component events bound");
    }
    if (this.responseHistory) {
      this.responseHistory.removeEventListener(
        "responseCopy",
        this.handleResponseCopy
      );
      this.responseHistory.removeEventListener(
        "responseUse",
        this.handleResponseUse
      );
      this.responseHistory.removeEventListener(
        "responseRetry",
        this.handleResponseRetry
      );
      this.responseHistory.removeEventListener(
        "responseEdit",
        this.handleResponseEdit
      );
      this.responseHistory.removeEventListener(
        "toolaction",
        this.handleToolAction
      );
      this.responseHistory.addEventListener(
        "responseCopy",
        this.handleResponseCopy
      );
      this.responseHistory.addEventListener(
        "responseUse",
        this.handleResponseUse
      );
      this.responseHistory.addEventListener(
        "responseRetry",
        this.handleResponseRetry
      );
      this.responseHistory.addEventListener(
        "responseEdit",
        this.handleResponseEdit
      );
      this.responseHistory.addEventListener(
        "toolaction",
        this.handleToolAction
      );
      console.log("[AITextEnhancer] Response history events bound");
    }
    this.setupEditorListener();
    console.log("[AITextEnhancer] All events bound successfully");
  }
  setupTinyMCEIntegration(editorInstance) {
    if (this.responseHistory) {
      this.responseHistory.addEventListener("responseUse", (event) => {
        try {
          const { responseId } = event.detail || {};
          if (!responseId) return;
          const response = this.responseHistory.getResponse(responseId);
          if (response && response.content) {
            if (editorInstance && editorInstance.initialized) {
              editorInstance.setContent(response.content);
              editorInstance.undoManager.add();
              setTimeout(() => {
                const modal = this.shadowRoot.querySelector(".modal");
                if (modal) {
                  modal.classList.remove("open");
                }
              }, 100);
            }
          }
        } catch (error) {
          console.error(
            "[AITextEnhancer] Error in direct responseUse handler:",
            error
          );
        }
      });
    }
  }
  // Método actualizado para initializeComponents
  async initializeComponents() {
    if (this.isInitialized) {
      console.log("[AITextEnhancer] Components already initialized, skipping");
      return;
    }
    if (this.editorType === "tinymce" && window.tinymce) {
      try {
        const tinyMceInstance = window.tinymce.get(this.editorId);
        if (tinyMceInstance) {
          console.log(
            "[AITextEnhancer] TinyMCE detected, configuring special handling"
          );
          this.setupTinyMCEIntegration(tinyMceInstance);
        }
      } catch (error) {
        console.warn(
          "[AITextEnhancer] Error setting up TinyMCE integration:",
          error
        );
      }
    }
    try {
      console.log("[AITextEnhancer] Initializing components...");
      await this.markdownHandler.initialize();
      console.log("[AITextEnhancer] Markdown handler initialized");
      const proxyEndpoint = this.proxyEndpoint || "https://llmproxy.mitienda.host/index.php/api/llm-proxy";
      this.apiClient = createAPIClient({
        provider: this.apiProvider,
        model: this.apiModel,
        systemPrompt: this.prompt,
        temperature: 0.7,
        proxyEndpoint,
        tenantId: this.getAttribute("tenant-id") || "default",
        userId: this.getAttribute("user-id") || "default",
        componentId: this.componentId,
        // Añadido componentId
        debugMode: false
      });
      console.log(
        "[AITextEnhancer] API client initialized with provider",
        this.apiProvider
      );
      if (this.editorId) {
        this.editorAdapter = new EditorAdapter(this.editorId, this.editorType);
        console.log(
          "[AITextEnhancer] Editor adapter initialized for",
          this.editorId,
          "with type",
          this.editorType
        );
      } else {
        console.warn(
          "[AITextEnhancer] No editor ID provided, editor adapter not initialized"
        );
      }
      const responseHistory = this.shadowRoot.querySelector("response-history");
      if (responseHistory) {
        responseHistory.markdownHandler = this.markdownHandler;
        console.log(
          "[AITextEnhancer] Markdown handler passed to response history"
        );
      }
      this.isInitialized = true;
      if (this.notificationManager) {
        this.notificationManager.success(
          "AI Text Enhancer initialized successfully"
        );
      }
      this.updateVisibleTools();
      return true;
    } catch (error) {
      console.error("Error in initializeComponents:", error);
      if (this.notificationManager) {
        this.notificationManager.error(
          `Initialization error: ${error.message}`
        );
      }
      this.addResponseToHistory(
        "error",
        `Initialization error: ${error.message}`
      );
      throw error;
    }
  }
  isModalOpen() {
    var _a;
    const modal = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".modal");
    return modal ? modal.classList.contains("open") : false;
  }
  // Método mejorado de updateVisibleTools
  updateVisibleTools() {
    var _a;
    try {
      let content = "";
      if (this.editorAdapter && typeof this.editorAdapter.getContent === "function") {
        try {
          const rawContent = this.editorAdapter.getContent();
          content = typeof rawContent === "string" ? rawContent : "";
        } catch (error) {
          console.warn(
            "[AITextEnhancer] Error obteniendo contenido del editor:",
            error
          );
        }
      }
      const hasContent = content.trim().length > 0;
      const toolbar = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector("ai-toolbar");
      if (toolbar) {
        toolbar.setAttribute("has-content", hasContent.toString());
      }
    } catch (error) {
      console.warn("[AITextEnhancer] Error en updateVisibleTools:", error);
    }
  }
  // Getter mejorado de currentContent
  get currentContent() {
    try {
      if (this.editorAdapter && typeof this.editorAdapter.getContent === "function") {
        const content = this.editorAdapter.getContent();
        if (typeof content === "string") {
          return content;
        }
        if (content && typeof content.then === "function") {
          console.warn("[AITextEnhancer] editorAdapter.getContent() devolvió una promesa. Debes usar await para obtener el contenido real.");
          return "";
        }
        console.warn("[AITextEnhancer] editorAdapter.getContent() no devolvió un string", content);
        return "";
      }
      if (window.tinymce && this.editorId && tinymce.get(this.editorId)) {
        const editorInstance = tinymce.get(this.editorId);
        if (editorInstance && typeof editorInstance.getContent === "function") {
          const content = editorInstance.getContent();
          if (typeof content === "string") {
            return content;
          } else {
            console.warn("[AITextEnhancer] TinyMCE.getContent() no devolvió un string", content);
            return "";
          }
        } else {
          console.warn("[AITextEnhancer] TinyMCE instance not ready for editorId:", this.editorId);
          return "";
        }
      }
      return "";
    } catch (error) {
      console.warn("[AITextEnhancer] Error en getter currentContent:", error);
      return "";
    }
  }
  /**
   * Manejador mejorado de mensajes de chat para AITextEnhancer
   * con soporte para URLs de imágenes externas afectadas por CORS
   */
  async handleChatMessage(event) {
    const { message, image, content, context } = event.detail;
    try {
      if (!(message == null ? void 0 : message.trim()) && !image) {
        throw new Error("Message cannot be empty");
      }
      const questionResponse = {
        id: Date.now(),
        action: "chat-question",
        content: `**${this.translations.chat.question}:** ${message}`,
        timestamp: /* @__PURE__ */ new Date(),
        image
      };
      this.responseHistory.addResponse(questionResponse);
      const responseId = Date.now() + 1;
      this.responseHistory.addResponse({
        id: responseId,
        action: "chat-response",
        content: "",
        // Empezar con contenido vacío para streaming adecuado
        timestamp: /* @__PURE__ */ new Date()
      });
      const onProgress = (chunk) => {
        this.responseHistory.updateResponse(
          responseId,
          (prevContent) => prevContent + chunk
        );
      };
      let imageParameter = image;
      if (typeof image === "string" && !image.startsWith("data:")) {
        console.log("[AITextEnhancer] Using external image URL:", image);
      } else if (image instanceof File) {
        console.log("[AITextEnhancer] Using image file:", image.name);
      }
      if (typeof this._hasSentContentContext === "undefined") {
        this._hasSentContentContext = false;
      }
      let contentToSend = void 0;
      if (!this._hasSentContentContext && (typeof content === "string" || typeof context === "string")) {
        contentToSend = (content || "") + (content && context ? "\n\n" : "") + (context || "");
        this._hasSentContentContext = true;
      } else {
        contentToSend = "";
      }
      await this.apiClient.chatResponse(
        contentToSend,
        message.trim(),
        imageParameter,
        onProgress
      );
      setTimeout(() => {
        const responseContainer = this.shadowRoot.querySelector(
          ".response-container"
        );
        if (responseContainer) {
          responseContainer.scrollTop = responseContainer.scrollHeight;
        }
      }, 200);
      if (this.notificationManager) {
        this.notificationManager.success("Response received", 2e3);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = this.formatErrorMessage(error);
      this.addResponseToHistory("chat-error", errorMessage);
      if (this.notificationManager) {
        this.notificationManager.error(`Chat error: ${error.message}`);
      }
    }
  }
  // Agrega este método para solicitar actualizaciones explícitas
  requestUpdate(part = null) {
    if (this.stateManager && typeof this.stateManager.triggerUpdate === "function") {
      return this.stateManager.triggerUpdate(part);
    } else {
      console.warn(
        "[AITextEnhancer] StateManager or triggerUpdate method not available"
      );
      return false;
    }
  }
  /**
   * Updates the ChatWithImage component with current content and context state
   * This should be called whenever editor content or context changes
   */
  async updateChatState() {
    var _a;
    if (!this.shadowRoot) return;
    const chatComponent = this.shadowRoot.querySelector("chat-with-image");
    if (!chatComponent) {
      console.warn("[AITextEnhancer] No se encontró el componente chat-with-image en el DOM");
      return;
    }
    if (this.hasAttribute("supports-images")) {
      chatComponent.setAttribute("supports-images", this.getAttribute("supports-images"));
    } else {
      chatComponent.removeAttribute("supports-images");
    }
    if (typeof this.context === "string") {
      chatComponent.setAttribute("context", this.context);
      console.log("[AITextEnhancer] Propagando context al chat:", this.context);
    } else {
      chatComponent.removeAttribute("context");
      console.log("[AITextEnhancer] Context vacío o no string, removido del chat");
    }
    let contentValue = "";
    if (this.editorReady) {
      if (this.editorAdapter && typeof this.editorAdapter.getContent === "function") {
        const maybePromise = this.editorAdapter.getContent();
        if (typeof maybePromise === "string") {
          contentValue = maybePromise;
        } else if (maybePromise && typeof maybePromise.then === "function") {
          contentValue = await maybePromise;
        }
      }
      chatComponent.setAttribute("content", contentValue);
      console.log("[AITextEnhancer] Propagando content al chat:", contentValue);
    } else {
      chatComponent.removeAttribute("content");
      console.log("[AITextEnhancer] Editor NO listo, no se propaga content");
    }
    console.log("[AITextEnhancer] Updated chat state:", {
      contentLength: contentValue.length,
      contextLength: ((_a = this.context) == null ? void 0 : _a.length) || 0,
      supportsImages: chatComponent.getAttribute("supports-images"),
      editorReady: this.editorReady
    });
  }
  /**
   * Override the original handleToolAction method to update chat state after content changes
   */
  /**
   * Improved handleToolAction method for AITextEnhancer
   * This implementation resolves issues with the retry functionality
   * Replace this method in src/index.js
   */
  async handleToolAction(event) {
    var _a, _b, _c;
    const detail = event.detail || {};
    const action = detail.action;
    const responseId = detail.responseId;
    const content = detail.content;
    console.log("[AITextEnhancer] Tool action received:", {
      action,
      responseId,
      contentLength: content ? content.length : 0,
      content: content ? content.substring(0, 100) + "..." : "undefined",
      contextLength: this.context ? this.context.length : 0
    });
    if (!action) {
      console.error("[AITextEnhancer] Tool action missing action parameter");
      if (this.notificationManager) {
        this.notificationManager.error("Invalid action request");
      }
      return;
    }
    let tempResponse = null;
    try {
      const textToProcess = content || this.currentContent;
      const cachedResponse = (_a = this.cacheManager) == null ? void 0 : _a.get(action, textToProcess);
      if (cachedResponse) {
        console.log("[AITextEnhancer] Using cached response for", action);
        this.addResponseToHistory(action, cachedResponse);
        return;
      }
      tempResponse = {
        id: Date.now(),
        action,
        content: "",
        // Empty content to start with
        timestamp: /* @__PURE__ */ new Date()
      };
      if (this.responseHistory) {
        this.responseHistory.addResponse(tempResponse);
      } else {
        console.error("[AITextEnhancer] Response history not available");
        return;
      }
      if (!this.apiClient || !this.isInitialized) {
        console.log(
          "[AITextEnhancer] Components not initialized, initializing now..."
        );
        await this.initializeComponents();
      }
      const onProgress = (chunk) => {
        if (chunk && this.responseHistory) {
          this.responseHistory.updateResponse(
            tempResponse.id,
            (prevContent) => prevContent + chunk
          );
        }
      };
      try {
        console.log("[AITextEnhancer] Making API request for action:", action);
        if (!textToProcess) {
          console.warn(
            "[AITextEnhancer] Processing empty text for action:",
            action
          );
        }
        const completeText = await this.apiClient.enhanceText(
          textToProcess,
          action,
          null,
          // No image for tool actions
          this.context,
          onProgress
        );
        if (this.cacheManager) {
          this.cacheManager.set(action, textToProcess, completeText);
        }
        this.updateChatState();
        if (this.notificationManager) {
          const actionName = ((_c = (_b = this.translations) == null ? void 0 : _b.tools) == null ? void 0 : _c[action]) || action;
          this.notificationManager.success(
            `Text ${actionName} successfully`,
            2e3
          );
        }
      } catch (error) {
        console.error("[AITextEnhancer] API request error:", error);
        if (tempResponse && this.responseHistory) {
          this.responseHistory.removeResponse(tempResponse.id);
        }
        this.addResponseToHistory("error", this.formatErrorMessage(error));
        if (this.notificationManager) {
          this.notificationManager.error(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("[AITextEnhancer] Error in handleToolAction:", error);
      if (tempResponse && this.responseHistory) {
        this.responseHistory.removeResponse(tempResponse.id);
      }
      this.addResponseToHistory("error", `Error: ${error.message}`);
      if (this.notificationManager) {
        this.notificationManager.error(`Error: ${error.message}`);
      }
    }
  }
  /**
   * Helper method to add responses to history
   * Add this if it doesn't exist
   */
  addResponseToHistory(action, content) {
    if (!this.responseHistory) {
      console.error("[AITextEnhancer] No response history available");
      return;
    }
    const response = {
      id: Date.now(),
      action,
      content: content || "",
      timestamp: /* @__PURE__ */ new Date()
    };
    this.responseHistory.addResponse(response);
    return response;
  }
  /**
   * Helper method to format error messages
   * Add this if it doesn't exist
   */
  formatErrorMessage(error) {
    if (!error) return "An unknown error occurred";
    let message = error.message || error.toString();
    if (error.originalError) {
      message += `
${error.originalError.message || error.originalError.toString()}`;
    }
    return message;
  }
}
customElements.define("ai-text-enhancer", AITextEnhancer);
export {
  AITextEnhancer as default
};
//# sourceMappingURL=ai-text-enhancer.es.js.map
