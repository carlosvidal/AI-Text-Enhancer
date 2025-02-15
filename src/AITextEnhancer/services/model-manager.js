import { MODEL_CONFIG } from "../constants/model-config.js";

export class ModelManager {
  constructor(provider = "openai") {
    this.provider = provider;
    this.config = MODEL_CONFIG;
  }

  getModelConfig(modelId) {
    const providerConfig = this.config[this.provider];
    if (!providerConfig) {
      throw new Error(`Provider ${this.provider} not supported`);
    }

    if (modelId && providerConfig.models[modelId]) {
      return providerConfig.models[modelId];
    }

    return providerConfig.models[providerConfig.default];
  }

  getDefaultModel() {
    const providerConfig = this.config[this.provider];
    if (!providerConfig) {
      throw new Error(`Provider ${this.provider} not supported`);
    }
    return providerConfig.default;
  }

  getAllModels() {
    const providerConfig = this.config[this.provider];
    if (!providerConfig) {
      throw new Error(`Provider ${this.provider} not supported`);
    }
    return Object.values(providerConfig.models);
  }
}
