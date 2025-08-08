import { CacheEntry } from '../types/atlassian-types.js';

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;
  private cleanupInterval: NodeJS.Timeout;
  private maxSize: number;

  constructor(maxSize: number = 10000, cleanupIntervalMs: number = 60000) {
    this.maxSize = maxSize;
    
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.timestamp + entry.ttl * 1000) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }
    
    this.hitCount++;
    return entry.data;
  }

  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    };
    
    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  private evictLRU(): void {
    // Simple LRU: remove oldest entry
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl * 1000) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 Cache cleanup: removed ${expiredKeys.length} expired entries`);
    }
  }

  getStats(): {
    size: number;
    hitCount: number;
    missCount: number;
    hitRate: number;
  } {
    const total = this.hitCount + this.missCount;
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0
    };
  }

  // Advanced cache methods for intelligent caching
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    const data = await fetcher();
    await this.set(key, data, ttlSeconds);
    return data;
  }

  // Hierarchical cache invalidation
  async invalidateHierarchy(baseKey: string): Promise<void> {
    // Invalidate all related entries in hierarchy
    const patterns = [
      `${baseKey}:*`,
      `*:${baseKey}:*`,
      `${baseKey.split(':')[0]}:*`
    ];
    
    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }

  // Warm cache with commonly accessed data
  async warmCache(warmupData: Array<{ key: string; fetcher: () => Promise<any>; ttl: number }>): Promise<void> {
    console.log(`🔥 Warming cache with ${warmupData.length} entries...`);
    
    const promises = warmupData.map(async ({ key, fetcher, ttl }) => {
      try {
        const data = await fetcher();
        await this.set(key, data, ttl);
      } catch (error) {
        console.warn(`Cache warmup failed for ${key}:`, error);
      }
    });
    
    await Promise.allSettled(promises);
    console.log(`✅ Cache warmup completed`);
  }

  // Cache tagging for smart invalidation
  private tags = new Map<string, Set<string>>();

  async setWithTags<T>(key: string, data: T, ttlSeconds: number, tags: string[]): Promise<void> {
    await this.set(key, data, ttlSeconds);
    
    // Associate tags with this cache key
    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(key);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = this.tags.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tags.delete(tag);
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}