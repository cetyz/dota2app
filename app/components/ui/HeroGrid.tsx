'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import HeroPortrait from './HeroPortrait';
import { IHero } from '../../types/hero';

export interface HeroGridProps {
  heroes: IHero[];
  onHeroSelect: (hero: IHero) => void;
  selectedHeroes: IHero[];
  bannedHeroes: IHero[];
}

type AttributeFilter = 'str' | 'agi' | 'int' | 'all' | null;
type RoleFilter = string | null;

export default function HeroGrid({
  heroes,
  onHeroSelect,
  selectedHeroes,
  bannedHeroes
}: HeroGridProps) {
  const [attributeFilter, setAttributeFilter] = useState<AttributeFilter>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Memoized filtering for performance
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => {
      if (attributeFilter && hero.primary_attr !== attributeFilter) {
        return false;
      }
      if (roleFilter && !hero.roles.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [heroes, attributeFilter, roleFilter]);

  // Memoized unique roles for filter chips
  const allRoles = useMemo(() => {
    return Array.from(new Set(heroes.flatMap(hero => hero.roles))).sort();
  }, [heroes]);

  // Smooth scroll to top when filters change
  useEffect(() => {
    if (gridRef.current && typeof gridRef.current.scrollTo === 'function') {
      gridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [attributeFilter, roleFilter]);

  // Memoized callback functions for performance
  const handleHeroClick = useCallback((hero: IHero) => {
    // Don't allow selection of banned heroes
    if (bannedHeroes.some(banned => banned.id === hero.id)) {
      return;
    }
    onHeroSelect(hero);
  }, [bannedHeroes, onHeroSelect]);

  const clearFilters = useCallback(() => {
    setAttributeFilter(null);
    setRoleFilter(null);
  }, []);

  // Memoized helper functions for performance
  const selectedHeroIds = useMemo(() => {
    return new Set(selectedHeroes.map(hero => hero.id));
  }, [selectedHeroes]);

  const bannedHeroIds = useMemo(() => {
    return new Set(bannedHeroes.map(hero => hero.id));
  }, [bannedHeroes]);

  const isHeroSelected = useCallback((hero: IHero) => {
    return selectedHeroIds.has(hero.id);
  }, [selectedHeroIds]);

  const isHeroBanned = useCallback((hero: IHero) => {
    return bannedHeroIds.has(hero.id);
  }, [bannedHeroIds]);

  // Memoized filter handlers
  const handleAttributeFilter = useCallback((attr: AttributeFilter) => {
    setAttributeFilter(current => current === attr ? null : attr);
  }, []);

  const handleRoleFilter = useCallback((role: RoleFilter) => {
    setRoleFilter(current => current === role ? null : role);
  }, []);

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Attribute Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-textSecondary text-sm font-medium mr-2">Attribute:</span>
          <button
            onClick={() => handleAttributeFilter('str')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              attributeFilter === 'str'
                ? 'bg-accentPrimary text-white'
                : 'bg-gray-700 text-textLight hover:bg-gray-600'
            }`}
          >
            Strength
          </button>
          <button
            onClick={() => handleAttributeFilter('agi')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              attributeFilter === 'agi'
                ? 'bg-accentPrimary text-white'
                : 'bg-gray-700 text-textLight hover:bg-gray-600'
            }`}
          >
            Agility
          </button>
          <button
            onClick={() => handleAttributeFilter('int')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              attributeFilter === 'int'
                ? 'bg-accentPrimary text-white'
                : 'bg-gray-700 text-textLight hover:bg-gray-600'
            }`}
          >
            Intelligence
          </button>
          <button
            onClick={() => handleAttributeFilter('all')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              attributeFilter === 'all'
                ? 'bg-accentPrimary text-white'
                : 'bg-gray-700 text-textLight hover:bg-gray-600'
            }`}
          >
            Universal
          </button>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-textSecondary text-sm font-medium mr-2">Role:</span>
          {allRoles.map(role => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-accentPrimary text-white'
                  : 'bg-gray-700 text-textLight hover:bg-gray-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Clear Filters Button */}
        <div className="flex">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-textLight rounded hover:bg-gray-500 transition-colors text-sm font-medium"
          >
            Show All
          </button>
        </div>
      </div>

      {/* Hero Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 max-h-96 overflow-y-auto"
      >
        {filteredHeroes.map(hero => (
          <div key={hero.id} className="relative" data-hero-id={hero.id}>
            <HeroPortrait
              hero={hero}
              onClick={handleHeroClick}
              isSelected={isHeroSelected(hero)}
              disabled={isHeroBanned(hero)}
              size="medium"
            />
            
            {/* Visual indicator for selected heroes */}
            {isHeroSelected(hero) && !isHeroBanned(hero) && (
              <div className="absolute inset-0 bg-accentPrimary/20 pointer-events-none rounded-lg" />
            )}
            
            {/* Visual indicator for banned heroes */}
            {isHeroBanned(hero) && (
              <div 
                className="absolute inset-0 bg-red-600/60 flex items-center justify-center pointer-events-none rounded-lg"
                title="This hero has been banned"
              >
                <span className="text-white text-2xl font-bold">✕</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredHeroes.length === 0 && (
        <div className="text-center text-textSecondary py-8">
          No heroes match the current filters
        </div>
      )}
    </div>
  );
}