// cache-manager.js

export class CacheManager {
  constructor(options = {}) {
    this.options = {
      prefix: options.prefix || "ai-text-enhancer-cache",
      maxItems: options.maxItems || 20,
      ttl: options.ttl || 30 * 60 * 1000, // 30 minutes in milliseconds
      storage: options.storage || window.sessionStorage,
    };

    // Ensure storage is available
    this.validateStorage();
  }

  /**
   * Validates that storage is available and working
   * @throws {Error} If storage is not available
   */
  validateStorage() {
    try {
      const testKey = `${this.options.prefix}-test`;
      this.options.storage.setItem(testKey, "test");
      this.options.storage.removeItem(testKey);
    } catch (error) {
      throw new Error("Storage is not available: " + error.message);
    }
  }

  /**
   * Generates a cache key for a given action and content
   * @param {string} action - The action being performed
   * @param {string} content - The content being processed
   * @returns {string} The generated cache key
   */
  generateKey(action, content) {
    const hash = this.hashString(content);
    return `${this.options.prefix}-${action}-${hash}`;
  }

  /**
   * Creates a hash from a string
   * @param {string} str - The string to hash
   * @returns {string} The hashed string
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Gets a value from cache
   * @param {string} action - The action associated with the cached content
   * @param {string} content - The original content
   * @returns {string|null} The cached value or null if not found/expired
   */
  get(action, content) {
    try {
      const key = this.generateKey(action, content);
      const cachedItem = this.options.storage.getItem(key);

      if (!cachedItem) return null;

      const item = JSON.parse(cachedItem);

      // Check if item has expired
      if (Date.now() - item.timestamp > this.options.ttl) {
        this.delete(action, content);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  /**
   * Stores a value in cache
   * @param {string} action - The action associated with the content
   * @param {string} content - The original content
   * @param {string} value - The value to cache
   */
  set(action, content, value) {
    try {
      const key = this.generateKey(action, content);
      const item = {
        value,
        timestamp: Date.now(),
      };

      // Ensure we don't exceed max items
      this.enforceSizeLimit();

      this.options.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Error writing to cache:", error);
      this.cleanup(); // Attempt to free up space
    }
  }

  /**
   * Deletes a specific item from cache
   * @param {string} action - The action associated with the content
   * @param {string} content - The original content
   */
  delete(action, content) {
    const key = this.generateKey(action, content);
    this.options.storage.removeItem(key);
  }

  /**
   * Enforces the cache size limit
   */
  enforceSizeLimit() {
    try {
      const keys = this.getCacheKeys();
      if (keys.length >= this.options.maxItems) {
        // Remove oldest items first
        const itemsToRemove = keys
          .map((key) => ({
            key,
            timestamp: JSON.parse(this.options.storage.getItem(key)).timestamp,
          }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, keys.length - this.options.maxItems + 1);

        itemsToRemove.forEach((item) => {
          this.options.storage.removeItem(item.key);
        });
      }
    } catch (error) {
      console.error("Error enforcing cache size limit:", error);
    }
  }

  /**
   * Gets all cache keys for this instance
   * @returns {string[]} Array of cache keys
   */
  getCacheKeys() {
    const keys = [];
    for (let i = 0; i < this.options.storage.length; i++) {
      const key = this.options.storage.key(i);
      if (key.startsWith(this.options.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Cleans up expired items
   */
  cleanup() {
    try {
      const now = Date.now();
      const keys = this.getCacheKeys();

      keys.forEach((key) => {
        const item = JSON.parse(this.options.storage.getItem(key));
        if (now - item.timestamp > this.options.ttl) {
          this.options.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error during cache cleanup:", error);
    }
  }

  /**
   * Clears all cached items for this instance
   */
  clear() {
    const keys = this.getCacheKeys();
    keys.forEach((key) => {
      this.options.storage.removeItem(key);
    });
  }

  /**
   * Gets cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    try {
      const keys = this.getCacheKeys();
      const now = Date.now();
      let totalSize = 0;
      let expiredCount = 0;

      keys.forEach((key) => {
        const item = JSON.parse(this.options.storage.getItem(key));
        totalSize += JSON.stringify(item).length;
        if (now - item.timestamp > this.options.ttl) {
          expiredCount++;
        }
      });

      return {
        totalItems: keys.length,
        expiredItems: expiredCount,
        totalSize: totalSize,
        maxItems: this.options.maxItems,
      };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return null;
    }
  }
}

// Factory function for creating cache managers
export function createCacheManager(options = {}) {
  return new CacheManager(options);
}
