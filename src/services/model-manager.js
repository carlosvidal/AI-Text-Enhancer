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
  
  isProviderSupported(provider) {
    return !!this.config[provider];
  }

  isImageSupportedForProvider(provider) {
    // Check if the provider exists and has vision capabilities
    const providerConfig = this.config[provider];
    if (!providerConfig) return false;
    
    // If provider has explicit vision model defined, it supports images
    if (providerConfig.visionModel) return true;
    
    // These providers are known to support images
    return ["openai", "anthropic", "google"].includes(provider);
  }
  
  getVisionModelForProvider(provider) {
    const providerConfig = this.config[provider];
    if (!providerConfig) return null;
    
    // If there's a specific vision model defined, use it
    if (providerConfig.visionModel) {
      return providerConfig.visionModel;
    }
    
    // Otherwise return the default model (assuming it supports vision)
    return providerConfig.defaultModel;
  }
  
  setProvider(provider) {
    if (this.isProviderSupported(provider)) {
      this.provider = provider;
    } else {
      throw new Error(`Provider ${provider} not supported`);
    }
  }
}
