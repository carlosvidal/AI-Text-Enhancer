import { MODEL_CONFIGS } from '../constants/model-config.js';

export class ModelManager {
  constructor(provider = "openai") {
    this.setProvider(provider);
  }

  setProvider(provider) {
    if (!MODEL_CONFIGS[provider]) {
      throw new Error(`Provider ${provider} not supported`);
    }
    this.provider = provider;
    this.config = MODEL_CONFIGS[provider];
  }

  getAvailableModels() {
    return Object.entries(this.config.models).map(([id, model]) => ({
      id,
      ...model,
    }));
  }

  getDefaultModel() {
    return this.config.defaultModel;
  }

  getModelConfig(modelId) {
    const model = this.config.models[modelId];
    if (!model) {
      throw new Error(
        `Model ${modelId} not found for provider ${this.provider}`
      );
    }
    return { id: modelId, ...model };
  }

  getSuggestedModel() {
    return (
      Object.entries(this.config.models).find(
        ([, model]) => model.suggested
      )?.[0] || this.getDefaultModel()
    );
  }

  validateModelCompatibility(modelId, textLength) {
    const model = this.getModelConfig(modelId);
    return textLength <= model.contextWindow;
  }

  estimateCost(modelId, tokens) {
    const model = this.getModelConfig(modelId);
    if (!model.costPer1k) return null;
    return (tokens / 1000) * model.costPer1k;
  }
}
