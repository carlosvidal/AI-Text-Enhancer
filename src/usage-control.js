// usage-control.js

class UsageControl {
  constructor(config = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || "/api/ai-enhancer/usage",
      quotaCheckEndpoint: config.quotaCheckEndpoint || "/api/ai-enhancer/quota",
      defaultDailyLimit: config.defaultDailyLimit || 100,
      defaultMonthlyLimit: config.defaultMonthlyLimit || 1000,
      checkQuotaBeforeRequest: config.checkQuotaBeforeRequest !== false,
      cacheTimeout: config.cacheTimeout || 5 * 60 * 1000, // 5 minutos
    };

    this.usageCache = new Map();
    this.quotaCache = new Map();
  }

  async checkQuota(tenantId, userId) {
    const cacheKey = `${tenantId}:${userId}`;
    const cachedQuota = this.quotaCache.get(cacheKey);

    if (
      cachedQuota &&
      Date.now() - cachedQuota.timestamp < this.config.cacheTimeout
    ) {
      return cachedQuota.data;
    }

    try {
      const response = await fetch(this.config.quotaCheckEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to check quota");
      }

      const quotaData = await response.json();

      this.quotaCache.set(cacheKey, {
        data: quotaData,
        timestamp: Date.now(),
      });

      return quotaData;
    } catch (error) {
      console.error("Error checking quota:", error);
      throw error;
    }
  }

  async trackUsage(tenantId, userId, action, tokensUsed) {
    try {
      // Si está configurado, verificar cuota antes de proceder
      if (this.config.checkQuotaBeforeRequest) {
        const quota = await this.checkQuota(tenantId, userId);
        if (!quota.hasAvailableQuota) {
          throw new Error("Quota exceeded");
        }
      }

      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          userId,
          action,
          tokensUsed,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track usage");
      }

      return await response.json();
    } catch (error) {
      console.error("Error tracking usage:", error);
      throw error;
    }
  }

  // Devuelve el uso estimado de tokens para un texto
  estimateTokens(text) {
    // Estimación básica: ~4 caracteres por token en promedio
    return Math.ceil(text.length / 4);
  }

  // Limpia las cachés periódicamente
  cleanupCaches() {
    const now = Date.now();
    for (const [key, value] of this.usageCache.entries()) {
      if (now - value.timestamp > this.config.cacheTimeout) {
        this.usageCache.delete(key);
      }
    }
    for (const [key, value] of this.quotaCache.entries()) {
      if (now - value.timestamp > this.config.cacheTimeout) {
        this.quotaCache.delete(key);
      }
    }
  }
}

// Factory function
export function createUsageControl(config = {}) {
  return new UsageControl(config);
}
