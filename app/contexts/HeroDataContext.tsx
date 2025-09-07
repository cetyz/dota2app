'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { IHero, HeroRole } from '../types/hero';
import { fetchAllHeroes, searchHeroes as apiSearchHeroes, filterHeroesByRole } from '../lib/api/opendota';

interface HeroDataContextType {
  heroes: IHero[];
  loading: boolean;
  error: string | null;
  searchHeroes: (query: string) => IHero[];
  filterByRole: (role: HeroRole) => IHero[];
  filterByAttribute: (attribute: string) => IHero[];
  refresh: () => Promise<void>;
}

const HeroDataContext = createContext<HeroDataContextType | undefined>(undefined);

interface HeroDataProviderProps {
  children: ReactNode;
}

export function HeroDataProvider({ children }: HeroDataProviderProps) {
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const heroData = await fetchAllHeroes();
      setHeroes(heroData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero data';
      setError(errorMessage);
      console.error('Error fetching heroes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const searchHeroes = useCallback((query: string): IHero[] => {
    if (!query.trim()) return heroes;
    return apiSearchHeroes(heroes, query);
  }, [heroes]);

  const filterByRole = useCallback((role: HeroRole): IHero[] => {
    return filterHeroesByRole(heroes, role);
  }, [heroes]);

  const filterByAttribute = useCallback((attribute: string): IHero[] => {
    if (!attribute || attribute === 'all') return heroes;
    return heroes.filter(hero => 
      hero.primary_attr.toLowerCase() === attribute.toLowerCase()
    );
  }, [heroes]);

  const refresh = useCallback(async () => {
    await fetchHeroes();
  }, [fetchHeroes]);

  const value: HeroDataContextType = {
    heroes,
    loading,
    error,
    searchHeroes,
    filterByRole,
    filterByAttribute,
    refresh
  };

  return (
    <HeroDataContext.Provider value={value}>
      {children}
    </HeroDataContext.Provider>
  );
}

export function useHeroData() {
  const context = useContext(HeroDataContext);
  if (context === undefined) {
    throw new Error('useHeroData must be used within a HeroDataProvider');
  }
  return context;
}