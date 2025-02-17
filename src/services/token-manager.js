// token-manager.js
import { ModelManager } from "./model-manager.js";
import { MODEL_CONFIG } from "../constants/model-config.js";

export class TokenManager {
  constructor() {
    this.modelManager = new ModelManager();
    
    // Average tokens per character for different languages
    this.tokensPerChar = {
      en: 0.25, // English: ~4 chars per token
      es: 0.28, // Spanish: ~3.6 chars per token
      fr: 0.28, // French: ~3.6 chars per token
      de: 0.3, // German: ~3.3 chars per token (compound words)
      zh: 0.5, // Chinese: ~2 chars per token
      ja: 0.5, // Japanese: ~2 chars per token
    };

    this.defaultTokensPerChar = 0.25;
  }
}
