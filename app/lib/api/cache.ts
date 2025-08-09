import { IHero } from '../../types/hero';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class HeroCache {
  private cache = new Map<string, CacheEntry<IHero[]>>();
  private defaultTTL = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Returns cached hero data if available and not expired
   */
  getCachedHeroes(key: string = 'heroes'): IHero[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Stores hero data with timestamp and expiration
   */
  setCachedHeroes(data: IHero[], key: string = 'heroes', ttl: number = this.defaultTTL): void {
    const now = Date.now();
    const entry: CacheEntry<IHero[]> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };

    this.cache.set(key, entry);
  }

  /**
   * Invalidates cached hero data
   */
  clearHeroCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Pre-fetches hero data on app start
   */
  async warmCache(fetchHeroes: () => Promise<IHero[]>): Promise<void> {
    try {
      const heroes = await fetchHeroes();
      this.setCachedHeroes(heroes);
    } catch (error) {
      console.error('Failed to warm hero cache:', error);
    }
  }

  /**
   * Returns cache statistics for debugging
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Checks if cache entry exists and is valid
   */
  isCacheValid(key: string = 'heroes'): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() <= entry.expiresAt;
  }
}

// Export singleton instance
export const heroCache = new HeroCache();

// Export functions for easier testing and usage
export const getCachedHeroes = (key?: string) => heroCache.getCachedHeroes(key);
export const setCachedHeroes = (data: IHero[], key?: string, ttl?: number) => 
  heroCache.setCachedHeroes(data, key, ttl);
export const clearHeroCache = (key?: string) => heroCache.clearHeroCache(key);
export const warmCache = (fetchHeroes: () => Promise<IHero[]>) => heroCache.warmCache(fetchHeroes);
export const getCacheStats = () => heroCache.getCacheStats();
export const isCacheValid = (key?: string) => heroCache.isCacheValid(key);