'use client';

import { useState, useEffect } from 'react';
import HeroGrid from '../components/ui/HeroGrid';
import { IHero } from '../types/hero';
import { fetchAllHeroes } from '../lib/api/opendota';
import { getCachedHeroes, setCachedHeroes } from '../lib/api/cache';

export default function HeroGridTestPage() {
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [selectedHeroes, setSelectedHeroes] = useState<IHero[]>([]);
  const [bannedHeroes, setBannedHeroes] = useState<IHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setLoading(true);
        
        // Try to get cached heroes first
        const cachedHeroes = getCachedHeroes();
        if (cachedHeroes) {
          setHeroes(cachedHeroes);
          setLoading(false);
          return;
        }
        
        // If no cache, fetch from API
        const heroData = await fetchAllHeroes();
        setCachedHeroes(heroData);
        setHeroes(heroData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load heroes');
      } finally {
        setLoading(false);
      }
    };

    loadHeroes();
  }, []);

  const handleHeroSelect = (hero: IHero) => {
    // If hero is already selected, remove it
    if (selectedHeroes.some(selected => selected.id === hero.id)) {
      setSelectedHeroes(prev => prev.filter(selected => selected.id !== hero.id));
    } else {
      // Add hero to selection (max 5 for demo purposes)
      if (selectedHeroes.length < 5) {
        setSelectedHeroes(prev => [...prev, hero]);
      }
    }
  };

  const handleBanHero = (hero: IHero) => {
    // If hero is already banned, remove from ban list
    if (bannedHeroes.some(banned => banned.id === hero.id)) {
      setBannedHeroes(prev => prev.filter(banned => banned.id !== hero.id));
    } else {
      // Add hero to ban list and remove from selected if present
      setBannedHeroes(prev => [...prev, hero]);
      setSelectedHeroes(prev => prev.filter(selected => selected.id !== hero.id));
    }
  };

  const clearAll = () => {
    setSelectedHeroes([]);
    setBannedHeroes([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-textLight text-xl">Loading heroes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textLight p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Hero Grid Test Page</h1>
          <p className="text-textSecondary text-center mb-6">
            Test the HeroGrid component with filtering, selection, and ban functionality
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accentPrimary">{heroes.length}</div>
              <div className="text-sm text-textSecondary">Total Heroes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{selectedHeroes.length}</div>
              <div className="text-sm text-textSecondary">Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{bannedHeroes.length}</div>
              <div className="text-sm text-textSecondary">Banned</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-accentPrimary text-white rounded hover:bg-opacity-80 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                // Add some random heroes to selection for testing
                const availableHeroes = heroes.filter(hero => 
                  !selectedHeroes.some(selected => selected.id === hero.id) &&
                  !bannedHeroes.some(banned => banned.id === hero.id)
                );
                const randomHeroes = availableHeroes
                  .sort(() => Math.random() - 0.5)
                  .slice(0, Math.min(3, 5 - selectedHeroes.length));
                setSelectedHeroes(prev => [...prev, ...randomHeroes]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Add Random Selection
            </button>
            <button
              onClick={() => {
                // Add some random heroes to ban list for testing
                const availableHeroes = heroes.filter(hero => 
                  !selectedHeroes.some(selected => selected.id === hero.id) &&
                  !bannedHeroes.some(banned => banned.id === hero.id)
                );
                const randomHeroes = availableHeroes
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                setBannedHeroes(prev => [...prev, ...randomHeroes]);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Add Random Bans
            </button>
          </div>
        </div>

        {/* Selected Heroes Display */}
        {selectedHeroes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Selected Heroes ({selectedHeroes.length}/5)</h2>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg">
              {selectedHeroes.map(hero => (
                <div key={hero.id} className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded">
                  <span className="text-sm">{hero.localized_name}</span>
                  <button
                    onClick={() => handleHeroSelect(hero)}
                    className="text-white hover:text-red-200 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banned Heroes Display */}
        {bannedHeroes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Banned Heroes ({bannedHeroes.length})</h2>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg">
              {bannedHeroes.map(hero => (
                <div key={hero.id} className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded">
                  <span className="text-sm">{hero.localized_name}</span>
                  <button
                    onClick={() => handleBanHero(hero)}
                    className="text-white hover:text-red-200 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ul className="text-sm text-textSecondary space-y-1">
            <li>• <strong>Left click</strong> a hero to select/deselect (max 5 selected)</li>
            <li>• <strong>Right click</strong> a hero to ban/unban (disabled heroes cannot be selected)</li>
            <li>• Use the <strong>attribute filters</strong> to filter by Strength, Agility, Intelligence, or Universal</li>
            <li>• Use the <strong>role filters</strong> to filter by hero roles like Carry, Support, etc.</li>
            <li>• Click <strong>"Show All"</strong> to clear all filters</li>
            <li>• The grid will automatically scroll to top when filters change</li>
          </ul>
        </div>

        {/* Hero Grid */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <div 
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              // Handle right-click for banning heroes
              if (e.button === 2) {
                e.preventDefault();
                const heroPortrait = (e.target as HTMLElement).closest('[data-hero-id]');
                if (heroPortrait) {
                  const heroId = parseInt(heroPortrait.getAttribute('data-hero-id') || '0');
                  const hero = heroes.find(h => h.id === heroId);
                  if (hero) {
                    handleBanHero(hero);
                  }
                }
              }
            }}
          >
            <HeroGrid
              heroes={heroes}
              onHeroSelect={handleHeroSelect}
              selectedHeroes={selectedHeroes}
              bannedHeroes={bannedHeroes}
            />
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs">
          <details>
            <summary className="cursor-pointer text-textSecondary hover:text-textLight">
              Debug Info (click to expand)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>Selected Hero IDs:</strong> [{selectedHeroes.map(h => h.id).join(', ')}]
              </div>
              <div>
                <strong>Banned Hero IDs:</strong> [{bannedHeroes.map(h => h.id).join(', ')}]
              </div>
              <div>
                <strong>Total Heroes Loaded:</strong> {heroes.length}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}