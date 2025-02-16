// api-client.js
import { ModelManager } from "./model-manager.js";

class APIClient {
  constructor(config = {}) {
    this.modelManager = new ModelManager(config.provider || "openai");
  
    this.config = {
      provider: config.provider || "openai",
      endpoints: {
        openai: "https://api.openai.com/v1/chat/completions",
        deepseek: "https://api.deepseek.com/v1/chat/completions",
        anthropic: "https://api.anthropic.com/v1/messages",
        cohere: "https://api.cohere.ai/v1/generate",
        google:
          "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText",
        mistral: "https://api.mistral.ai/v1/chat/completions",
      },
      models: {
        openai: config.model || "gpt-4-turbo", // Set a specific default model instead of using ModelManager
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
      apiKey: config.apiKey || "",
      systemPrompt: config.systemPrompt,
    };
  }

  setApiKey(apiKey) {
    this.config.apiKey = apiKey;
  }

  setProvider(provider) {
    if (this.config.endpoints[provider]) {
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

  prepareMessagesWithImage(prompt, content, imageUrl, imageData) {
    if (this.config.provider === "openai") {
      return [
        {
          role: "system",
          content: this.config.systemPrompt,
        },
        {
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
                ? {
                    url: imageUrl,
                    detail: "high",
                  }
                : {
                    url: `data:image/jpeg;base64,${imageData}`,
                    detail: "high",
                  },
            },
          ],
        },
      ];
    } else if (this.config.provider === "anthropic") {
      return [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: this.config.systemPrompt,
            },
            {
              type: "image",
              source: imageUrl
                ? {
                    type: "url",
                    url: imageUrl,
                  }
                : {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: imageData,
                  },
            },
            {
              type: "text",
              text: `${prompt}\n\n${
                content || "Please create a new description."
              }`,
            },
          ],
        },
      ];
    }

    throw new Error(
      `Provider ${this.config.provider} not supported for image requests`
    );
  }

  async makeRequest(prompt, content, onProgress = () => {}) {
    if (!this.config.apiKey) {
      throw new Error("API key not configured");
    }
  
    try {
      const model = this.config.models[this.config.provider];
      if (!model) {
        throw new Error("Model not configured for provider");
      }

      const response = await fetch(
        this.config.endpoints[this.config.provider],
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: model, // Use the model from config
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
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }
  
      return await this.processStream(response, onProgress);
    } catch (error) {
      throw new APIError(error.message, error);
    }
  }

  async makeRequestWithImage(
    prompt,
    content,
    imageSource,
    onProgress = () => {}
  ) {
    if (!this.config.apiKey) {
      throw new Error("API key not configured");
    }

    if (!this.config.visionModels[this.config.provider]) {
      throw new Error(
        `Provider ${this.config.provider} does not support image analysis`
      );
    }

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

      const messages = this.prepareMessagesWithImage(
        prompt,
        content,
        imageUrl,
        imageData
      );

      const response = await fetch(
        this.config.endpoints[this.config.provider],
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
            ...(this.config.provider === "anthropic"
              ? { "anthropic-version": "2023-06-01" }
              : {}),
          },
          body: JSON.stringify({
            model:
              this.config.provider === "anthropic"
                ? this.config.visionModels[this.config.provider]
                : "gpt-4-turbo",
            messages: messages,
            temperature: this.config.temperature,
            stream: true,
          }),
        }
      );

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

  async enhanceText(content, action = "improve", imageFile = null, context = "", onProgress = () => {}) {
    const prompts = {
      improve: `Mejora esta descripción considerando estos detalles del producto:\n${context}\n\nDescripción actual:`,
      summarize: `Teniendo en cuenta estos detalles del producto:\n${context}\n\nCrea un resumen conciso y efectivo de la siguiente descripción:`,
      expand: `Basándote en estos detalles del producto:\n${context}\n\nExpande esta descripción añadiendo más detalles, beneficios y casos de uso:`,
      paraphrase: `Considerando estos detalles del producto:\n${context}\n\nReescribe esta descripción manteniendo el mensaje principal pero con un enfoque fresco:`,
      formal: `Usando estos detalles del producto:\n${context}\n\nReescribe esta descripción con un tono más formal, profesional y técnico, manteniendo la información clave pero usando un lenguaje más sofisticado y corporativo:`,
      casual: `Usando estos detalles del producto:\n${context}\n\nReescribe esta descripción con un tono más casual y cercano, como si estuvieras explicándolo a un amigo, manteniendo un lenguaje accesible y conversacional pero sin perder profesionalismo:`,
      empty: `Usando estos detalles del producto:\n${context}\n\nCrea una descripción profesional y atractiva que destaque sus características principales:`,
    };

    const prompt = prompts[action] || prompts.improve;

    if (imageFile && this.config.visionModels[this.config.provider]) {
      try {
        return await this.makeRequestWithImage(prompt, content, imageFile, onProgress);
      } catch (error) {
        console.warn("Image analysis failed, falling back to text-only analysis:", error);
        return await this.makeRequest(prompt, content, onProgress);
      }
    } else {
      return await this.makeRequest(prompt, content, onProgress);
    }
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
