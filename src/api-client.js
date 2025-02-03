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
      temperature: config.temperature || 0.7,
      apiKey: config.apiKey || "",
      systemPrompt:
        config.systemPrompt ||
        "Eres un asistente experto en marketing y copywriting, especializado en mejorar descripciones de productos para tiendas online.",
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

  async enhanceText(content, action = "improve") {
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
    return this.makeRequest(prompt, content);
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
