import { 
  getCachedHeroes, 
  setCachedHeroes, 
  clearHeroCache, 
  warmCache,
  getCacheStats,
  isCacheValid
} from '../cache';
import { IHero } from '../../../types/hero';

// Mock hero data for testing
const mockHeroes: IHero[] = [
  {
    id: 1,
    name: 'antimage',
    localized_name: 'Anti-Mage',
    primary_attr: 'agi',
    attack_type: 'Melee',
    roles: ['Carry', 'Escape', 'Nuker']
  },
  {
    id: 2,
    name: 'axe',
    localized_name: 'Axe',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator', 'Durable', 'Disabler']
  }
];

// Mock fetch function for warmCache tests
const mockFetchHeroes = jest.fn();

describe('Data Caching Layer', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearHeroCache();
    mockFetchHeroes.mockClear();
  });

  describe('setCachedHeroes', () => {
    it('should store hero data in cache', () => {
      setCachedHeroes(mockHeroes);
      
      const cached = getCachedHeroes();
      expect(cached).toEqual(mockHeroes);
    });

    it('should store hero data with custom key', () => {
      const customKey = 'custom-heroes';
      setCachedHeroes(mockHeroes, customKey);
      
      const cached = getCachedHeroes(customKey);
      expect(cached).toEqual(mockHeroes);
    });

    it('should store hero data with custom TTL', () => {
      const shortTTL = 100; // 100ms
      setCachedHeroes(mockHeroes, 'heroes', shortTTL);
      
      // Should be valid immediately
      expect(isCacheValid()).toBe(true);
      
      // Should expire after TTL
      return new Promise(resolve => {
        setTimeout(() => {
          expect(isCacheValid()).toBe(false);
          resolve(undefined);
        }, 150);
      });
    });
  });

  describe('getCachedHeroes', () => {
    it('should return null when cache is empty', () => {
      const cached = getCachedHeroes();
      expect(cached).toBeNull();
    });

    it('should return cached data when available and not expired', () => {
      setCachedHeroes(mockHeroes);
      
      const cached = getCachedHeroes();
      expect(cached).toEqual(mockHeroes);
    });

    it('should return null when data has expired', () => {
      const shortTTL = 50; // 50ms
      setCachedHeroes(mockHeroes, 'heroes', shortTTL);
      
      return new Promise(resolve => {
        setTimeout(() => {
          const cached = getCachedHeroes();
          expect(cached).toBeNull();
          resolve(undefined);
        }, 100);
      });
    });

    it('should return null for non-existent key', () => {
      setCachedHeroes(mockHeroes, 'heroes');
      
      const cached = getCachedHeroes('non-existent');
      expect(cached).toBeNull();
    });

    it('should clean up expired entries automatically', () => {
      const shortTTL = 50;
      setCachedHeroes(mockHeroes, 'heroes', shortTTL);
      
      return new Promise(resolve => {
        setTimeout(() => {
          getCachedHeroes(); // This should clean up the expired entry
          const stats = getCacheStats();
          expect(stats.size).toBe(0);
          resolve(undefined);
        }, 100);
      });
    });
  });

  describe('clearHeroCache', () => {
    beforeEach(() => {
      setCachedHeroes(mockHeroes, 'heroes1');
      setCachedHeroes(mockHeroes, 'heroes2');
    });

    it('should clear specific cache entry when key is provided', () => {
      clearHeroCache('heroes1');
      
      expect(getCachedHeroes('heroes1')).toBeNull();
      expect(getCachedHeroes('heroes2')).toEqual(mockHeroes);
    });

    it('should clear all cache entries when no key is provided', () => {
      clearHeroCache();
      
      expect(getCachedHeroes('heroes1')).toBeNull();
      expect(getCachedHeroes('heroes2')).toBeNull();
      
      const stats = getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('warmCache', () => {
    it('should successfully pre-fetch and cache hero data', async () => {
      mockFetchHeroes.mockResolvedValue(mockHeroes);
      
      await warmCache(mockFetchHeroes);
      
      expect(mockFetchHeroes).toHaveBeenCalledTimes(1);
      expect(getCachedHeroes()).toEqual(mockHeroes);
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockFetchHeroes.mockRejectedValue(new Error('API Error'));
      
      await warmCache(mockFetchHeroes);
      
      expect(mockFetchHeroes).toHaveBeenCalledTimes(1);
      expect(getCachedHeroes()).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to warm hero cache:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('cache expiration logic', () => {
    it('should respect default TTL of 1 hour', () => {
      setCachedHeroes(mockHeroes);
      
      // Mock current time to be 30 minutes later
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 30 * 60 * 1000); // 30 minutes
      
      expect(isCacheValid()).toBe(true);
      expect(getCachedHeroes()).toEqual(mockHeroes);
      
      // Mock current time to be 2 hours later
      Date.now = jest.fn(() => originalNow() + 2 * 60 * 60 * 1000); // 2 hours
      
      expect(isCacheValid()).toBe(false);
      expect(getCachedHeroes()).toBeNull();
      
      // Restore original Date.now
      Date.now = originalNow;
    });

    it('should handle multiple cache entries with different expiration times', () => {
      const shortTTL = 100;
      const longTTL = 500;
      
      setCachedHeroes(mockHeroes, 'short', shortTTL);
      setCachedHeroes(mockHeroes, 'long', longTTL);
      
      return new Promise(resolve => {
        setTimeout(() => {
          // Short TTL should be expired
          expect(getCachedHeroes('short')).toBeNull();
          // Long TTL should still be valid
          expect(getCachedHeroes('long')).toEqual(mockHeroes);
          resolve(undefined);
        }, 200);
      });
    });
  });

  describe('cache utilities', () => {
    it('should return accurate cache statistics', () => {
      expect(getCacheStats()).toEqual({ size: 0, keys: [] });
      
      setCachedHeroes(mockHeroes, 'heroes1');
      setCachedHeroes(mockHeroes, 'heroes2');
      
      const stats = getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toEqual(expect.arrayContaining(['heroes1', 'heroes2']));
    });

    it('should correctly validate cache entries', () => {
      expect(isCacheValid()).toBe(false);
      
      setCachedHeroes(mockHeroes);
      expect(isCacheValid()).toBe(true);
      
      const shortTTL = 50;
      setCachedHeroes(mockHeroes, 'short', shortTTL);
      expect(isCacheValid('short')).toBe(true);
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(isCacheValid('short')).toBe(false);
          resolve(undefined);
        }, 100);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty hero arrays', () => {
      setCachedHeroes([]);
      expect(getCachedHeroes()).toEqual([]);
    });

    it('should handle very short TTL values', () => {
      setCachedHeroes(mockHeroes, 'heroes', 1); // 1ms
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(getCachedHeroes()).toBeNull();
          resolve(undefined);
        }, 10);
      });
    });

    it('should handle very long TTL values', () => {
      const longTTL = 24 * 60 * 60 * 1000; // 24 hours
      setCachedHeroes(mockHeroes, 'heroes', longTTL);
      
      expect(isCacheValid()).toBe(true);
      expect(getCachedHeroes()).toEqual(mockHeroes);
    });
  });
});