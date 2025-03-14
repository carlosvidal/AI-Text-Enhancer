// api-client.js - Versión mejorada con corrección del procesamiento de streams
import { ModelManager } from "./model-manager.js";

class APIClient {
  constructor(config = {}) {
    this.modelManager = new ModelManager(config.provider || "openai");

    this.config = {
      provider: config.provider || "openai",
      // Punto de entrada al proxy CodeIgniter 3
      proxyEndpoint:
        config.proxyEndpoint || "http://llmproxy2.test:8080/api/llm-proxy", // Sin "api/"
      models: {
        openai: config.model || "gpt-4-turbo",
        deepseek: "deepseek-chat",
        anthropic: "claude-3-opus-20240229",
        cohere: "command",
        google: "gemini-pro",
        mistral: "mistral-large-latest",
      },
      visionModels: {
        openai: "gpt-4-turbo",
        anthropic: "claude-3-opus-20240229",
      },
      temperature: config.temperature || 0.7,
      // Ya no necesitas almacenar el API key en el cliente
      sessionToken: config.sessionToken || "",
      systemPrompt:
        config.systemPrompt ||
        "Actúa como un experto en redacción de descripciones de productos para tiendas en línea.\n\n" +
          "Tu tarea es generar o mejorar la descripción de un producto con un enfoque atractivo y persuasivo, destacando sus características principales, beneficios y posibles usos.\n\n" +
          "Si el usuario ya ha escrito una descripción: Mejórala manteniendo su esencia, pero haciéndola más clara, persuasiva y optimizada para ventas.\n\n" +
          "Si la descripción está vacía: Genera una nueva descripción atractiva, destacando características y beneficios. Usa un tono profesional y cercano, adaptado a una tienda en línea.\n\n" +
          "Si hay una imagen del producto, aprovecha los detalles visuales para enriquecer la descripción.\n\n" +
          "Si aplica, menciona información relevante del comercio para reforzar la confianza del comprador (envíos, garantía, atención al cliente, etc.).\n\n" +
          "Mantén el texto claro, sin repeticiones innecesarias, y optimizado para SEO si es posible.",
      // Parámetros adicionales para el proxy
      tenantId: config.tenantId || "",
      userId: config.userId || "",
      debugMode: config.debugMode || false,
    };

    // Inicializar contador para logging
    this._streamCounter = 0;
  }

  setSessionToken(token) {
    this.config.sessionToken = token;
  }

  setProvider(provider) {
    if (this.modelManager.isProviderSupported(provider)) {
      this.config.provider = provider;
      this.modelManager.setProvider(provider);
      // Reset to default model for new provider
      this.config.models[provider] = this.modelManager.getDefaultModel();
    } else {
      throw new Error(`Provider ${provider} not supported`);
    }
  }

  setModel(model) {
    if (model) {
      this.config.models[this.config.provider] = model;
    }
  }

  updateConfig(config) {
    if (config.provider) {
      this.setProvider(config.provider);
    }
    if (config.model) {
      this.setModel(config.model);
    }
    if (config.sessionToken) {
      this.setSessionToken(config.sessionToken);
    }
    if (config.tenantId) {
      this.config.tenantId = config.tenantId;
    }
    if (config.userId) {
      this.config.userId = config.userId;
    }
    if (config.proxyEndpoint) {
      this.config.proxyEndpoint = config.proxyEndpoint;
    }
    if (config.debugMode !== undefined) {
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

      // Función para procesar JSON y extraer contenido
      const extractContentFromJSON = (data) => {
        let content = "";

        if (
          data.choices &&
          data.choices[0].delta &&
          data.choices[0].delta.content !== undefined
        ) {
          // Formato OpenAI
          content = data.choices[0].delta.content;
        } else if (data.text !== undefined) {
          // Formato común alternativo
          content = data.text;
        } else if (data.content !== undefined) {
          // Otro formato común
          content = data.content;
        } else if (data.delta && data.delta.text !== undefined) {
          // Formato específico de algunos modelos
          content = data.delta.text;
        }

        return content;
      };

      // Verificar si es el inicio de la respuesta
      let isFirstContentChunk = true;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log(
            "[APIClient] Stream completado con",
            streamedChars,
            "caracteres procesados"
          );

          // Procesar cualquier contenido pendiente en el buffer
          if (buffer.trim()) {
            try {
              // Intento final de extraer contenido estructurado
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
                  // Si falla, usar el buffer como texto plano
                  completeText += buffer.trim();
                  onProgress(buffer.trim());
                }
              } else {
                // Usar como texto plano
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

        // Decodificar el chunk recibido y añadirlo al buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        chunkCounter++;

        if (this.config.debugMode) {
          console.log(
            `[APIClient] Chunk #${chunkCounter} recibido:`,
            chunk.length > 100
              ? `${chunk.substring(0, 100)}... (${chunk.length} chars)`
              : chunk
          );
          // Guardar para análisis
          accumulatedChunks.push(chunk);
        }

        // Procesamos líneas completas
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // El último elemento puede estar incompleto

        let foundContent = false;

        for (const line of lines) {
          // Filtrar líneas que son datos de la API
          if (line.startsWith("data: ")) {
            const content = line.slice(5).trim();

            // Ignorar marcador de fin de stream
            if (content === "[DONE]") continue;

            try {
              // Intentar parsear como JSON
              const data = JSON.parse(content);
              const textContent = extractContentFromJSON(data);

              if (textContent !== undefined) {
                // Si es el primer fragmento, verificar que esté completo
                if (isFirstContentChunk) {
                  isFirstContentChunk = false;

                  // Logging para depuración
                  if (this.config.debugMode) {
                    console.log(
                      `[APIClient] Primer fragmento de respuesta: "${textContent}"`
                    );
                  }
                }

                completeText += textContent;
                streamedChars += textContent.length;
                onProgress(textContent);
                foundContent = true;
              }
            } catch (e) {
              console.warn("[APIClient] Error procesando JSON:", e);

              // Intentar extraer usando expresiones regulares si el JSON falla
              if (
                content.includes('"text":"') ||
                content.includes('"content":"')
              ) {
                try {
                  const textMatch = content.match(/"(text|content)":"([^"]*)"/);
                  if (textMatch && textMatch[2]) {
                    const textContent = textMatch[2];
                    completeText += textContent;
                    streamedChars += textContent.length;
                    onProgress(textContent);
                    foundContent = true;

                    if (isFirstContentChunk) {
                      isFirstContentChunk = false;
                      if (this.config.debugMode) {
                        console.log(
                          `[APIClient] Primer fragmento (regex): "${textContent}"`
                        );
                      }
                    }
                  }
                } catch (extractError) {
                  console.warn(
                    "[APIClient] Error extrayendo texto con regex:",
                    extractError
                  );
                }
              }
            }
          }
        }

        // Si no hemos encontrado contenido en las líneas pero tenemos datos
        // en el buffer, intentamos verificar si hay datos parciales
        if (!foundContent && buffer.includes("data: {")) {
          try {
            const parts = buffer.split("data: ");
            for (let i = 1; i < parts.length; i++) {
              if (parts[i].trim() && parts[i].includes('"delta":{"content":')) {
                try {
                  // Intentar extraer contenido de delta
                  const match = parts[i].match(/"content":"([^"]*)"/);
                  if (match && match[1]) {
                    const content = match[1];
                    completeText += content;
                    streamedChars += content.length;
                    onProgress(content);

                    // Limpiar la parte procesada del buffer
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

      // Verificación final del resultado
      if (this.config.debugMode) {
        console.log(
          `[APIClient] Texto completo (${completeText.length} chars):`,
          completeText.substring(0, 50) +
            (completeText.length > 50 ? "..." : "")
        );

        // Verificar si hay problemas con el inicio
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

  async makeRequest(prompt, content, onProgress = () => {}) {
    try {
      const model = this.config.models[this.config.provider];
      if (!model) {
        throw new Error("Model not configured for provider");
      }

      // Crear wrapper para onProgress que nos permita debugging
      const progressHandler = this.config.debugMode
        ? this._createDebugProgressHandler(onProgress)
        : onProgress;

      // Preparar el payload para el proxy
      const payload = {
        provider: this.config.provider,
        model: model,
        messages: [
          {
            role: "system",
            content: this.config.systemPrompt,
          },
          {
            role: "user",
            content: `${prompt}\n\n${content || "Crea una nueva descripción."}`,
          },
        ],
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
      };

      console.log(
        "[APIClient] Enviando solicitud al proxy:",
        this.config.proxyEndpoint
      );
      if (this.config.debugMode) {
        console.log("[APIClient] Payload:", JSON.stringify(payload, null, 2));
      }

      // Reset stream counter for each request
      this._streamCounter = 0;

      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[APIClient] Respuesta del proxy:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries([...response.headers.entries()]),
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error?.message ||
            `API Error: ${response.status} ${response.statusText}`;
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

  async makeRequestWithImage(
    prompt,
    content,
    imageSource,
    onProgress = () => {}
  ) {
    try {
      let imageData;
      let imageUrl;
      let mimeType = "image/jpeg"; // Default mime type

      if (typeof imageSource === "string") {
        imageUrl = imageSource;
      } else if (imageSource instanceof File) {
        imageData = await this.imageToBase64(imageSource);
        mimeType = imageSource.type || mimeType; // Use the actual file type if available
        console.log("[APIClient] Image file type:", mimeType);
      } else {
        throw new Error("Invalid image source");
      }

      // Crear wrapper para onProgress con debugging
      const progressHandler = this.config.debugMode
        ? this._createDebugProgressHandler(onProgress)
        : onProgress;

      // Construir el mensaje con la imagen
      const messages = [];
      if (this.config.provider === "openai") {
        messages.push({
          role: "system",
          content: this.config.systemPrompt,
        });
        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\n${
                content || "Please create a new description."
              }`,
            },
            {
              type: "image_url",
              image_url: imageUrl
                ? { url: imageUrl, detail: "high" }
                : {
                    url: `data:${mimeType};base64,${imageData}`,
                    detail: "high",
                  },
            },
          ],
        });
      } else if (this.config.provider === "anthropic") {
        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: this.config.systemPrompt,
            },
            {
              type: "image",
              source: imageUrl
                ? { type: "url", url: imageUrl }
                : { type: "base64", media_type: mimeType, data: imageData },
            },
            {
              type: "text",
              text: `${prompt}\n\n${
                content || "Please create a new description."
              }`,
            },
          ],
        });
      } else if (this.config.provider === "google") {
        // Google Gemini format
        messages.push({
          role: "user",
          parts: [
            {
              text: `${this.config.systemPrompt}\n\n${prompt}\n\n${
                content || "Please create a new description."
              }`,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageData,
              },
            },
          ],
        });
      }

      // Get the appropriate vision model
      const visionModel = this.modelManager.getVisionModelForProvider(
        this.config.provider
      );

      const payload = {
        provider: this.config.provider,
        model: visionModel || this.config.models[this.config.provider],
        messages: messages,
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        hasImage: true,
      };

      console.log("[APIClient] Sending image request to proxy:", {
        endpoint: this.config.proxyEndpoint,
        provider: this.config.provider,
        model: payload.model,
        hasImage: true,
        imageType: mimeType,
      });

      // Reset stream counter for each request
      this._streamCounter = 0;

      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.sessionToken && {
            Authorization: `Bearer ${this.config.sessionToken}`,
          }),
        },
        body: JSON.stringify(payload),
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
            errorData.error?.message ||
              `API Error: ${response.status} ${response.statusText}`
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

  async enhanceText(
    content,
    action = "improve",
    imageFile = null,
    context = "",
    onProgress = () => {}
  ) {
    const prompts = {
      improve: `Mejora esta descripción considerando estos detalles del producto:\n${context}\n\nDescripción actual:`,
      summarize: `Teniendo en cuenta estos detalles del producto:\n${context}\n\nCrea un resumen conciso y efectivo de la siguiente descripción:`,
      expand: `Basándote en estos detalles del producto:\n${context}\n\nExpande esta descripción añadiendo más detalles, beneficios y casos de uso:`,
      paraphrase: `Considerando estos detalles del producto:\n${context}\n\nReescribe esta descripción manteniendo el mensaje principal pero con un enfoque fresco:`,
      "more-formal": `Usando estos detalles del producto:\n${context}\n\nReescribe esta descripción con un tono más formal, profesional y técnico, manteniendo la información clave pero usando un lenguaje más sofisticado y corporativo:`,
      "more-casual": `Usando estos detalles del producto:\n${context}\n\nReescribe esta descripción con un tono más casual y cercano, como si estuvieras explicándolo a un amigo, manteniendo un lenguaje accesible y conversacional pero sin perder profesionalismo:`,
      empty: `Usando estos detalles del producto:\n${context}\n\nCrea una descripción profesional y atractiva que destaque sus características principales:`,
    };

    const prompt = prompts[action] || prompts.improve;

    // Función wrapper para el manejo de progreso
    const progressHandler = this.config.debugMode
      ? this._createDebugProgressHandler(onProgress)
      : onProgress;

    try {
      if (
        imageFile &&
        this.modelManager.isImageSupportedForProvider(this.config.provider)
      ) {
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

  async chatResponse(content, message, image = null, onProgress = () => {}) {
    try {
      // Wrapper para debugging de progreso
      const progressHandler = this.config.debugMode
        ? this._createDebugProgressHandler(onProgress)
        : onProgress;

      // Preparamos los mensajes para enviar al proxy
      let messages = [
        { role: "system", content: this.config.systemPrompt },
        { role: "user", content: content },
      ];

      let hasImage = false;

      if (message) {
        // Si hay imagen y el proveedor la soporta, formatear adecuadamente
        if (
          image &&
          this.modelManager.isImageSupportedForProvider(this.config.provider)
        ) {
          try {
            const imageData = await this.imageToBase64(image);
            const mimeType = image.type || "image/jpeg"; // Default to jpeg if type is not available
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
                      detail: "auto",
                    },
                  },
                ],
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
                      data: imageData,
                    },
                  },
                ],
              });
            } else if (this.config.provider === "google") {
              // Google Gemini format
              messages.push({
                role: "user",
                parts: [
                  { text: message },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: imageData,
                    },
                  },
                ],
              });
            } else {
              // Para proveedores que no soportan imágenes, enviar solo texto
              messages.push({ role: "user", content: message });
              hasImage = false;
            }
          } catch (imageError) {
            console.error(
              "[APIClient] Failed to process image for chat:",
              imageError
            );
            // Fallback to text-only message
            messages.push({ role: "user", content: message });
            hasImage = false;
          }
        } else {
          // Sin imagen, solo añadir el mensaje normal
          messages.push({ role: "user", content: message });
        }
      }

      // Select the appropriate model based on whether we're sending an image
      const model = hasImage
        ? this.modelManager.getVisionModelForProvider(this.config.provider)
        : this.config.models[this.config.provider];

      const payload = {
        provider: this.config.provider,
        model: model,
        messages: messages,
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        hasImage: hasImage,
      };

      console.log("[APIClient] Sending chat request to proxy:", {
        endpoint: this.config.proxyEndpoint,
        provider: this.config.provider,
        model: payload.model,
        hasImage: hasImage,
      });

      // Reset stream counter for each request
      this._streamCounter = 0;

      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.sessionToken && {
            Authorization: `Bearer ${this.config.sessionToken}`,
          }),
        },
        body: JSON.stringify(payload),
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
            errorData.error?.message ||
              `API Error: ${response.status} ${response.statusText}`
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
    return this.modelManager.isImageSupportedForProvider(this.config.provider);
  }

  // Método auxiliar para crear wrapper de debug para onProgress
  _createDebugProgressHandler(originalHandler) {
    let chunkIndex = 0;

    return (chunk) => {
      // Log del chunk recibido
      console.log(
        `[APIClient] Progress chunk #${chunkIndex}:`,
        chunk.length > 30
          ? `${chunk.substring(0, 30)}... (${chunk.length} chars)`
          : chunk,
        `[${Array.from(chunk.substring(0, 5))
          .map((c) => c.charCodeAt(0))
          .join(",")}]`
      );

      // Verificar primeros chunks con cuidado
      if (chunkIndex < 3) {
        // Análisis específico para los primeros fragmentos
        if (chunkIndex === 0 && chunk.length < 5) {
          console.warn("[APIClient] ⚠️ Primer fragmento es muy corto:", chunk);
        }

        // Verificar si parece un fragmento incompleto
        if ((chunkIndex === 0 && chunk === "aro") || chunk === "laro") {
          console.warn(
            "[APIClient] ⚠️ PROBLEMA DETECTADO: Fragmento inicial incompleto:",
            chunk
          );
        }
      }

      // Llamar al manejador original
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

export function createAPIClient(config = {}) {
  return new APIClient(config);
}
