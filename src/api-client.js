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
        openai: config.model || this.modelManager.getDefaultModel(),
        deepseek: "deepseek-chat",
        anthropic: "claude-3-opus-20240229",
        cohere: "command",
        google: "gemini-pro",
        mistral: "mistral-large-latest",
      },
      visionModels: {
        openai: "gpt-4-vision-preview",
        anthropic: "claude-3-opus-20240229", // Claude 3 supports vision
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
    try {
      // Validate if the model exists for current provider
      const modelConfig = this.modelManager.getModelConfig(model);
      this.config.models[this.config.provider] = model;
    } catch (error) {
      // If model doesn't exist, use provider's default
      console.warn(
        `Model ${model} not found for provider ${this.config.provider}, using default`
      );
      this.config.models[this.config.provider] =
        this.modelManager.getDefaultModel();
    }
  }

  async makeRequest(prompt, content, onProgress = () => {}) {
    if (!this.config.apiKey) {
      throw new Error("API key not configured");
    }

    try {
      const response = await fetch(
        this.config.endpoints[this.config.provider],
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.config.models[this.config.provider],
            messages: [
              {
                role: "system",
                content: this.config.systemPrompt,
              },
              {
                role: "user",
                content: `${prompt}\n\n${
                  content || "Crea una nueva descripción."
                }`,
              },
            ],
            temperature: this.config.temperature,
            stream: true, // Habilitar streaming
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialResponse = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(5));
              const newContent = data.choices[0].delta?.content || "";
              partialResponse += newContent;
              onProgress(partialResponse);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      return partialResponse;
    } catch (error) {
      throw new APIError(error.message, error);
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

    let imageData;
    let imageUrl;

    try {
      // Determinar si imageSource es un archivo o una URL
      if (typeof imageSource === "string") {
        // Es una URL
        imageUrl = imageSource;
      } else if (imageSource instanceof File) {
        // Es un archivo
        imageData = await this.imageToBase64(imageSource);
      } else {
        throw new Error("Invalid image source");
      }

      let messages = [];

      // Configure messages based on provider
      if (this.config.provider === "openai") {
        messages = [
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
        messages = [
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
            model: this.config.visionModels[this.config.provider],
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialResponse = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(5));
              const newContent = data.choices[0].delta?.content || "";
              partialResponse += newContent;
              onProgress(partialResponse);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      return partialResponse;
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async enhanceText(content, action = "improve", imageFile = null) {
    const prompts = {
      improve:
        "Mejora esta descripción de producto para hacerla más atractiva y profesional:",
      summarize: "Resume esta descripción manteniendo los puntos clave:",
      expand: "Expande esta descripción añadiendo más detalles y beneficios:",
      paraphrase: "Reescribe esta descripción manteniendo el mensaje:",
      style: "Ajusta el estilo para que sea más profesional y persuasivo:",
      empty: "Crea una descripción profesional para un producto similar:",
    };

    const prompt = prompts[action] || prompts.improve;

    if (imageFile) {
      return this.makeRequestWithImage(prompt, content, imageFile);
    } else {
      return this.makeRequest(prompt, content);
    }
  }

  async chatResponse(content, userMessage) {
    const contextPrompt = `Contexto - Descripción actual del producto: ${content}\n\nPregunta del usuario: ${userMessage}`;
    return this.makeRequest(this.config.systemPrompt, contextPrompt);
  }
}

class APIError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "APIError";
    this.originalError = originalError;
  }
}

// Factory function para crear instancias de APIClient
export function createAPIClient(config = {}) {
  return new APIClient(config);
}
