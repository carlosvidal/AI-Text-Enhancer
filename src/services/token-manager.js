// token-manager.js
import { MODEL_CONFIGS } from "../constants/model-config.js";

export class TokenManager {
  constructor() {
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

  estimateTokens(text, language = "en") {
    if (!text) return 0;

    // Basic cleaning
    const cleanText = text.trim();
    const charCount = cleanText.length;

    // Get language-specific token ratio or default
    const tokenRatio =
      this.tokensPerChar[language] || this.defaultTokensPerChar;

    // Calculate estimated tokens
    return Math.ceil(charCount * tokenRatio);
  }

  calculateRequestTokens(prompt, content, language = "en") {
    const systemTokens = this.estimateTokens(prompt, language);
    const contentTokens = this.estimateTokens(content, language);

    // Add overhead for formatting and metadata
    const overheadTokens = 20;

    return {
      systemTokens,
      contentTokens,
      overheadTokens,
      totalTokens: systemTokens + contentTokens + overheadTokens,
    };
  }

  estimateCost(tokens, model = "gpt-4") {
    const modelConfig = MODEL_CONFIGS.openai.models[model];
    if (!modelConfig?.costPer1k) return null;

    return (tokens / 1000) * modelConfig.costPer1k;
  }

  suggestPlanLimits(averageProductLength, productsPerMonth) {
    const avgTokensPerProduct = this.estimateTokens(averageProductLength);
    const monthlyTokens = avgTokensPerProduct * productsPerMonth;

    return {
      basic: Math.ceil(monthlyTokens * 0.5), // 50% of average usage
      standard: Math.ceil(monthlyTokens * 1.2), // 120% of average usage
      premium: Math.ceil(monthlyTokens * 2), // 200% of average usage
      enterprise: Math.ceil(monthlyTokens * 5), // 500% of average usage
    };
  }

  calculateQuotaUsage(tenant) {
    const { totalTokensUsed, quotaLimit, resetDate } = tenant;

    const now = new Date();
    const reset = new Date(resetDate);
    const daysUntilReset = Math.ceil((reset - now) / (1000 * 60 * 60 * 24));

    return {
      used: totalTokensUsed,
      remaining: quotaLimit - totalTokensUsed,
      percentUsed: (totalTokensUsed / quotaLimit) * 100,
      daysUntilReset,
      averageDaily: totalTokensUsed / (30 - daysUntilReset),
      projectedUsage: (totalTokensUsed / (30 - daysUntilReset)) * 30,
    };
  }

  getRecommendedQuota(historicalData) {
    const dailyUsage = historicalData.map((day) => day.tokensUsed);
    const avgDaily = dailyUsage.reduce((a, b) => a + b, 0) / dailyUsage.length;
    const stdDev = this.calculateStdDev(dailyUsage);

    return {
      recommended: Math.ceil(avgDaily * 30 * 1.5), // Monthly quota with 50% buffer
      minimum: Math.ceil(avgDaily * 30), // Minimum based on average
      safe: Math.ceil((avgDaily + 2 * stdDev) * 30), // Safe quota (95% confidence)
    };
  }

  calculateStdDev(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
    const avgSquareDiff =
      squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }
}
