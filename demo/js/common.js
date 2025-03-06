// Función para actualizar API keys
function updateApiKey() {
  console.log("🔄 updateApiKey called");
  const apiKey = document.getElementById("api-key").value;
  console.log("🔑 API Key length:", apiKey.length);

  if (!apiKey) {
    console.error("❌ API Key is empty");
    return;
  }

  // Buscar todos los enhancers en la página
  const enhancers = document.querySelectorAll("ai-text-enhancer");
  console.log(`📝 Found ${enhancers.length} enhancers`);

  try {
    enhancers.forEach(async (enhancer, index) => {
      console.log(`🔄 Processing enhancer ${index + 1}`);

      // Esperar a que el enhancer esté inicializado
      if (!enhancer.isInitialized) {
        console.log(`⏳ Waiting for enhancer ${index + 1} to initialize`);
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (enhancer.isInitialized) {
              clearInterval(checkInterval);
              console.log(`✅ Enhancer ${index + 1} initialized`);
              resolve();
            }
          }, 100);
        });
      }

      // Configurar API key
      console.log(`🔑 Setting API Key for enhancer ${index + 1}`);
      enhancer.setAttribute("api-key", apiKey);
      console.log(`✅ API Key set for enhancer ${index + 1}`);
    });

    // Guardar API key en localStorage para futuros usos
    localStorage.setItem("aiTextEnhancerApiKey", apiKey);
    console.log("✅ API key saved to localStorage");
  } catch (error) {
    console.error("❌ Error updating API keys:", error);
  }
}

// Función para cargar API key guardada
function loadSavedApiKey() {
  const savedApiKey = localStorage.getItem("aiTextEnhancerApiKey");
  if (savedApiKey) {
    const apiKeyInput = document.getElementById("api-key");
    if (apiKeyInput) {
      apiKeyInput.value = savedApiKey;
      console.log("✅ Loaded saved API key from localStorage");
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Cargar API key guardada
  loadSavedApiKey();

  // Configurar evento para el botón de actualización
  const updateButton = document.getElementById("update-api-key");
  if (updateButton) {
    updateButton.addEventListener("click", updateApiKey);
  }
});
