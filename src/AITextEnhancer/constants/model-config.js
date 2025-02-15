export const MODEL_CONFIG = {
  openai: {
    default: "gpt-4",
    models: {
      "gpt-4": { id: "gpt-4", name: "GPT-4" },
      "gpt-3.5-turbo": { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" }
    }
  },
  anthropic: {
    default: "claude-3-opus-20240229",
    models: {
      "claude-3-opus-20240229": { id: "claude-3-opus-20240229", name: "Claude 3 Opus" }
    }
  }
};