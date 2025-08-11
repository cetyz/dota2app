import { IOpenDotaHeroResponse, IApiError, isApiError } from '@/app/types/api';
import { IHero, IHeroStats, HeroRole } from '@/app/types/hero';
import { unstable_cache } from 'next/cache';

export const OPENDOTA_BASE_URL = process.env.NEXT_PUBLIC_OPENDOTA_API_URL || 'https://api.opendota.com/api';

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export function handleApiError(error: unknown): IApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 500,
      details: error.stack || null,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 500,
      details: null,
    };
  }

  return {
    message: 'An unknown error occurred',
    code: 500,
    details: error,
  };
}

export function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, string | number | boolean>): string {
  // Ensure baseUrl ends with a slash and endpoint doesn't start with one for proper joining
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  const url = new URL(normalizedEndpoint, normalizedBase);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  
  return url.toString();
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export function transformHeroData(apiHero: IOpenDotaHeroResponse): IHero {
  return {
    id: apiHero.id,
    name: apiHero.name,
    localized_name: apiHero.localized_name,
    primary_attr: apiHero.primary_attr,
    attack_type: apiHero.attack_type,
    roles: apiHero.roles
  };
}

async function fetchAllHeroesUncached(): Promise<IHero[]> {
  try {
    const url = buildUrl(OPENDOTA_BASE_URL, 'heroes');
    
    const response = await retryWithBackoff(async () => {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res;
    });

    const heroesData: IOpenDotaHeroResponse[] = await response.json();
    return heroesData.map(transformHeroData);
  } catch (error) {
    throw handleApiError(error);
  }
}

// For client-side usage, we'll export the uncached version
// and handle caching at the component level or use the cache.ts utilities
export const fetchAllHeroes = fetchAllHeroesUncached;

// For server-side usage with Next.js caching
export const fetchAllHeroesCached = unstable_cache(
  fetchAllHeroesUncached,
  ['heroes'],
  { revalidate: 3600 }
);

async function fetchHeroStatsUncached(): Promise<IOpenDotaHeroResponse[]> {
  try {
    const url = buildUrl(OPENDOTA_BASE_URL, 'heroStats');
    
    const response = await retryWithBackoff(async () => {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res;
    });

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
}

// For client-side usage, we'll export the uncached version
export const fetchHeroStats = fetchHeroStatsUncached;

// For server-side usage with Next.js caching
export const fetchHeroStatsCached = unstable_cache(
  fetchHeroStatsUncached,
  ['heroStats'],
  { revalidate: 3600 }
);

export function getHeroImageUrl(heroName: string, type: 'img' | 'icon' = 'img'): string {
  const cleanName = heroName.replace('npc_dota_hero_', '');
  const baseUrl = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes';
  
  if (type === 'icon') {
    return `${baseUrl}/${cleanName}_icon.png`;
  }
  
  return `${baseUrl}/${cleanName}.png`;
}

export function filterHeroesByRole(heroes: IHero[], role: HeroRole): IHero[] {
  const roleMapping: Record<HeroRole, string[]> = {
    'Carry': ['Carry'],
    'Mid': ['Mid', 'Nuker'],
    'Offlane': ['Initiator', 'Durable', 'Escape'],
    'Support': ['Support', 'Disabler'],
    'Hard Support': ['Support', 'Disabler']
  };

  const targetRoles = roleMapping[role];
  
  return heroes.filter(hero => 
    hero.roles.some(heroRole => 
      targetRoles.some(targetRole => 
        heroRole.toLowerCase().includes(targetRole.toLowerCase()) ||
        targetRole.toLowerCase().includes(heroRole.toLowerCase())
      )
    )
  );
}

export function searchHeroes(heroes: IHero[], query: string): IHero[] {
  if (!query.trim()) {
    return heroes;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return heroes.filter(hero => 
    hero.localized_name.toLowerCase().includes(normalizedQuery) ||
    hero.name.toLowerCase().includes(normalizedQuery)
  ).sort((a, b) => {
    const aLocalizedMatch = a.localized_name.toLowerCase().startsWith(normalizedQuery);
    const bLocalizedMatch = b.localized_name.toLowerCase().startsWith(normalizedQuery);
    
    if (aLocalizedMatch && !bLocalizedMatch) return -1;
    if (!aLocalizedMatch && bLocalizedMatch) return 1;
    
    return a.localized_name.localeCompare(b.localized_name);
  });
}