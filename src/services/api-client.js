// api-client.js
import { ModelManager } from "./model-manager.js";

class APIClient {
  constructor(config = {}) {
    this.modelManager = new ModelManager(config.provider || "openai");

    this.config = {
      provider: config.provider || "openai",
      // Punto de entrada al proxy CodeIgniter 3
      proxyEndpoint:
        config.proxyEndpoint || "http://llmproxy.test:8080/api/llm-proxy", // Sin "api/"
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
      systemPrompt: config.systemPrompt,
      // Parámetros adicionales para el proxy
      tenantId: config.tenantId || "",
      userId: config.userId || "",
    };
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
  }

  async processStream(response, onProgress) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completeText = "";

    const processChunk = (chunk) => {
      try {
        const data = JSON.parse(chunk);
        if (
          data.choices &&
          data.choices[0].delta &&
          data.choices[0].delta.content
        ) {
          const newContent = data.choices[0].delta.content;
          completeText += newContent;
          onProgress(newContent); // Enviamos solo el nuevo fragmento
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const chunk = line.slice(5);
            if (chunk === "[DONE]") continue;
            processChunk(chunk);
          }
        }
      }

      // Procesar cualquier contenido restante en el buffer
      if (buffer) {
        const lines = buffer.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            processChunk(line.slice(5));
          }
        }
      }

      return completeText;
    } catch (error) {
      console.error("Error processing stream:", error);
      throw error;
    }
  }

  async makeRequest(prompt, content, onProgress = () => {}) {
    try {
      const model = this.config.models[this.config.provider];
      if (!model) {
        throw new Error("Model not configured for provider");
      }

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

      console.log("Enviando solicitud al proxy:", this.config.proxyEndpoint);
      console.log("Payload:", payload);

      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del proxy:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries([...response.headers.entries()]),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await this.processStream(response, onProgress);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
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

      if (typeof imageSource === "string") {
        imageUrl = imageSource;
      } else if (imageSource instanceof File) {
        imageData = await this.imageToBase64(imageSource);
      } else {
        throw new Error("Invalid image source");
      }

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
                    url: `data:image/jpeg;base64,${imageData}`,
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
                : { type: "base64", media_type: "image/jpeg", data: imageData },
            },
            {
              type: "text",
              text: `${prompt}\n\n${
                content || "Please create a new description."
              }`,
            },
          ],
        });
      }

      const response = await fetch(this.config.proxyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.sessionToken && {
            Authorization: `Bearer ${this.config.sessionToken}`,
          }),
        },
        body: JSON.stringify({
          provider: this.config.provider,
          model:
            this.config.visionModels[this.config.provider] ||
            this.config.models[this.config.provider],
          messages: messages,
          temperature: this.config.temperature,
          stream: true,
          tenantId: this.config.tenantId,
          userId: this.config.userId,
          hasImage: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await this.processStream(response, onProgress);
    } catch (error) {
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

    if (
      imageFile &&
      this.modelManager.isImageSupportedForProvider(this.config.provider)
    ) {
      try {
        return await this.makeRequestWithImage(
          prompt,
          content,
          imageFile,
          onProgress
        );
      } catch (error) {
        console.warn(
          "Image analysis failed, falling back to text-only analysis:",
          error
        );
        return await this.makeRequest(prompt, content, onProgress);
      }
    } else {
      return await this.makeRequest(prompt, content, onProgress);
    }
  }

  async chatResponse(content, message, image = null, onProgress = () => {}) {
    try {
      // Preparamos los mensajes para enviar al proxy
      let messages = [
        { role: "system", content: this.config.systemPrompt },
        { role: "user", content: content },
      ];

      if (message) {
        // Si hay imagen y el proveedor la soporta, formatear adecuadamente
        if (
          image &&
          this.modelManager.isImageSupportedForProvider(this.config.provider)
        ) {
          const imageData = await this.imageToBase64(image);

          if (this.config.provider === "openai") {
            messages.push({
              role: "user",
              content: [
                { type: "text", text: message },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${image.type};base64,${imageData}`,
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
                    media_type: image.type,
                    data: imageData,
                  },
                },
              ],
            });
          } else {
            // Para proveedores que no soportan imágenes, enviar solo texto
            messages.push({ role: "user", content: message });
          }
        } else {
          // Sin imagen, solo añadir el mensaje normal
          messages.push({ role: "user", content: message });
        }
      }

      const payload = {
        provider: this.config.provider,
        model: this.config.models[this.config.provider],
        messages: messages,
        temperature: this.config.temperature,
        stream: true,
        tenantId: this.config.tenantId,
        userId: this.config.userId,
        hasImage:
          !!image &&
          this.modelManager.isImageSupportedForProvider(this.config.provider),
      };

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await this.processStream(response, onProgress);
    } catch (error) {
      throw new APIError(`Chat response failed: ${error.message}`, error);
    }
  }

  get supportsImages() {
    return this.modelManager.isImageSupportedForProvider(this.config.provider);
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
