// model-config.js
export const MODEL_CONFIGS = {
  openai: {
    models: {
      "gpt-4-turbo-preview": {
        name: "GPT-4 Turbo",
        contextWindow: 128000,
        description: "Latest GPT-4 model with larger context window",
        suggested: true,
        maxTokens: 4096,
        costPer1k: 0.01,
      },
      "gpt-4": {
        name: "GPT-4",
        contextWindow: 8192,
        description: "Most capable GPT-4 model",
        maxTokens: 4096,
        costPer1k: 0.03,
      },
      "gpt-3.5-turbo": {
        name: "GPT-3.5 Turbo",
        contextWindow: 16385,
        description: "Efficient and cost-effective model",
        maxTokens: 4096,
        costPer1k: 0.0015,
      },
    },
    defaultModel: "gpt-4-turbo-preview",
  },
  anthropic: {
    models: {
      "claude-3-opus-20240229": {
        name: "Claude 3 Opus",
        contextWindow: 200000,
        description: "Most capable Claude model",
        suggested: true,
      },
    },
    defaultModel: "claude-3-opus-20240229",
  },

  deepseek: {
    models: {
      "deepseek-chat": {
        name: "DeepSeek Chat",
        contextWindow: 32768,
        description: "General purpose chat model",
        suggested: true,
        maxTokens: 4096,
      },
      "deepseek-coder": {
        name: "DeepSeek Coder",
        contextWindow: 32768,
        description: "Specialized in code generation",
        maxTokens: 4096,
      },
    },
    defaultModel: "deepseek-chat",
  },

  cohere: {
    models: {
      command: {
        name: "Command",
        contextWindow: 4096,
        description: "Latest generation model",
        suggested: true,
        maxTokens: 4096,
      },
      "command-light": {
        name: "Command Light",
        contextWindow: 4096,
        description: "Faster, more efficient model",
        maxTokens: 4096,
      },
      "command-nightly": {
        name: "Command Nightly",
        contextWindow: 4096,
        description: "Experimental features",
        maxTokens: 4096,
      },
    },
    defaultModel: "command",
  },

  google: {
    models: {
      "gemini-pro": {
        name: "Gemini Pro",
        contextWindow: 32768,
        description: "Most capable Gemini model",
        suggested: true,
        maxTokens: 4096,
      },
      "gemini-pro-vision": {
        name: "Gemini Pro Vision",
        contextWindow: 32768,
        description: "Multimodal capabilities",
        maxTokens: 4096,
      },
    },
    defaultModel: "gemini-pro",
  },

  mistral: {
    models: {
      "mistral-large-latest": {
        name: "Mistral Large",
        contextWindow: 32768,
        description: "Most capable Mistral model",
        suggested: true,
        maxTokens: 4096,
      },
      "mistral-medium-latest": {
        name: "Mistral Medium",
        contextWindow: 32768,
        description: "Balanced performance",
        maxTokens: 4096,
      },
      "mistral-small-latest": {
        name: "Mistral Small",
        contextWindow: 32768,
        description: "Fast and efficient",
        maxTokens: 4096,
      },
    },
    defaultModel: "mistral-large-latest",
  },

  ollama: {
    models: {
      llama2: {
        name: "Llama 2",
        contextWindow: 4096,
        description: "Default Llama 2 model",
        suggested: true,
        maxTokens: 4096,
      },
      "llama2:13b": {
        name: "Llama 2 13B",
        contextWindow: 4096,
        description: "Balanced 13B parameter model",
        maxTokens: 4096,
      },
      "llama2:70b": {
        name: "Llama 2 70B",
        contextWindow: 4096,
        description: "Large 70B parameter model",
        maxTokens: 4096,
      },
      mistral: {
        name: "Mistral",
        contextWindow: 8192,
        description: "Mistral base model",
        maxTokens: 4096,
      },
      mixtral: {
        name: "Mixtral",
        contextWindow: 32768,
        description: "Mixtral 8x7B model",
        maxTokens: 4096,
      },
    },
    defaultModel: "llama2",
  },
};
