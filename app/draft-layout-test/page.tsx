'use client';

import React, { useEffect, useMemo } from 'react';
import DraftLayout from '@/app/components/draft/DraftLayout';
import { DraftProvider, useDraft } from '@/app/contexts/DraftContext';
import { HeroDataProvider, useHeroData } from '@/app/contexts/HeroDataContext';
import { useInitialRecommendations } from '@/app/hooks/useInitialRecommendations';
import { useDraftAutoSave, useTeamSidePersistence } from '@/app/hooks/useLocalStorage';
import { IDraftState, IDraftSlot, TeamSide } from '@/app/types/draft';
import { IHero, HeroRole } from '@/app/types/hero';

// Mock heroes data for testing
const mockHeroes: IHero[] = [
  {
    id: 1,
    name: "pudge",
    localized_name: "Pudge",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Initiator", "Disabler"]
  },
  {
    id: 2,
    name: "invoker",
    localized_name: "Invoker",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Carry", "Nuker"]
  },
  {
    id: 3,
    name: "crystal_maiden",
    localized_name: "Crystal Maiden",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Nuker"]
  },
  {
    id: 4,
    name: "phantom_assassin",
    localized_name: "Phantom Assassin",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Escape"]
  },
  {
    id: 5,
    name: "drow_ranger",
    localized_name: "Drow Ranger",
    primary_attr: "agi",
    attack_type: "Ranged",
    roles: ["Carry", "Pusher"]
  },
  {
    id: 6,
    name: "axe",
    localized_name: "Axe",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Initiator", "Durable"]
  },
  {
    id: 7,
    name: "shadow_fiend",
    localized_name: "Shadow Fiend",
    primary_attr: "agi",
    attack_type: "Ranged",
    roles: ["Carry", "Nuker"]
  },
  {
    id: 8,
    name: "lion",
    localized_name: "Lion",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Disabler"]
  }
];

// Inner component that uses contexts
function DraftLayoutTestContent() {
  const {
    draftState,
    setMyTeamSide,
    updateMyTeamSlot,
    updateEnemyTeamSlot,
    addHeroToMyTeam,
    addHeroToEnemyTeam,
    updateRole,
    banHero,
    clearDraft,
    clearBans,
    updateRecommendations
  } = useDraft();

  const { heroes, loading: heroesLoading } = useHeroData();
  
  // Memoize the arrays to prevent infinite re-renders
  const myTeamPicks = useMemo(() => 
    draftState.myTeam.filter(slot => slot.hero).map(slot => slot.hero!), 
    [draftState.myTeam]
  );
  
  const enemyTeamPicks = useMemo(() => 
    draftState.enemyTeam.filter(slot => slot.hero).map(slot => slot.hero!), 
    [draftState.enemyTeam]
  );
  
  const bannedHeroes = useMemo(() => 
    draftState.bannedHeroes, 
    [draftState.bannedHeroes]
  );
  
  // Initialize recommendations based on current draft state
  const {
    recommendations,
    isLoading: recommendationsLoading,
    refreshRecommendations
  } = useInitialRecommendations({
    myTeamSide: draftState.myTeamSide,
    myTeamPicks,
    enemyTeamPicks,
    bannedHeroes
  });

  // Auto-save functionality
  const {
    saveDraft,
    loadSavedDraft,
    preferredTeamSide,
    setPreferredTeamSide
  } = useDraftAutoSave();

  // Team side persistence
  const [persistedTeamSide, setPersistedTeamSide] = useTeamSidePersistence();

  // Update recommendations in draft state when they change
  useEffect(() => {
    if (recommendations.length > 0 && 
        JSON.stringify(recommendations) !== JSON.stringify(draftState.recommendations)) {
      updateRecommendations(recommendations);
    }
  }, [recommendations]); // Remove updateRecommendations from dependencies

  // Auto-save draft changes (removed saveDraft from dependencies to prevent loops)
  useEffect(() => {
    const cleanup = saveDraft(draftState, 1000);
    return cleanup;
  }, [draftState]); // Only depend on draftState, not the saveDraft function

  // Load preferred team side on mount (only once)
  useEffect(() => {
    if (preferredTeamSide && draftState.myTeamSide !== preferredTeamSide) {
      setMyTeamSide(preferredTeamSide);
    }
  }, [preferredTeamSide]); // Only run when preferredTeamSide changes, not every time myTeamSide changes

  // Add some sample data for testing
  const addSampleData = () => {
    if (heroes.length === 0) return;
    
    // Add heroes to my team
    addHeroToMyTeam(heroes[1]); // Invoker
    addHeroToMyTeam(heroes[3]); // Phantom Assassin
    addHeroToMyTeam(heroes[2]); // Crystal Maiden
    
    // Add heroes to enemy team
    addHeroToEnemyTeam(heroes[0]); // Pudge
    addHeroToEnemyTeam(heroes[6]); // Shadow Fiend
    
    // Ban some heroes
    if (heroes[7]) banHero(heroes[7]); // Lion
    if (heroes[5]) banHero(heroes[5]); // Axe
  };

  // Switch team side and update preferences  
  const handleSwitchTeamSide = () => {
    const newSide = draftState.myTeamSide === 'radiant' ? 'dire' : 'radiant';
    setMyTeamSide(newSide);
    // Only update localStorage, don't update both systems
    setPreferredTeamSide(newSide);
  };

  // Handle draft updates (bridge between DraftLayout and DraftContext)
  const handleDraftUpdate = (updates: Partial<IDraftState>) => {
    if (updates.myTeamSide) {
      setMyTeamSide(updates.myTeamSide);
    }
    if (updates.recommendations) {
      updateRecommendations(updates.recommendations);
    }
    if (updates.myTeam) {
      // Update each slot in my team
      updates.myTeam.forEach((slot, index) => {
        updateMyTeamSlot(index, slot);
      });
    }
    if (updates.enemyTeam) {
      // Update each slot in enemy team
      updates.enemyTeam.forEach((slot, index) => {
        updateEnemyTeamSlot(index, slot);
      });
    }
    if (updates.bannedHeroes) {
      // Handle banned heroes update properly
      const currentBannedIds = new Set(draftState.bannedHeroes.map(h => h.id));
      const newBannedIds = new Set(updates.bannedHeroes.map(h => h.id));
      
      // Find newly banned heroes
      updates.bannedHeroes.forEach(hero => {
        if (!currentBannedIds.has(hero.id)) {
          banHero(hero);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Test Controls */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-textLight">
                Draft Layout Test Page - Phase 6 State Management
              </h1>
              <p className="text-sm text-textSecondary mt-1">
                Testing DraftContext, HeroDataContext, useLocalStorage, and useInitialRecommendations
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={addSampleData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 text-sm"
                disabled={heroesLoading}
              >
                Add Sample Data
              </button>
              <button
                onClick={() => clearDraft()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Clear Draft
              </button>
              <button
                onClick={() => clearBans()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Clear Bans
              </button>
              <button
                onClick={handleSwitchTeamSide}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Switch Team Side
              </button>
              <button
                onClick={refreshRecommendations}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 text-sm"
                disabled={recommendationsLoading}
              >
                Refresh Recommendations
              </button>
            </div>
          </div>
          
          {/* State Display */}
          <div className="mt-4 text-sm text-textSecondary">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <strong>My Team Side:</strong> {draftState.myTeamSide}
              </div>
              <div>
                <strong>My Team Picks:</strong> {draftState.myTeam.filter(slot => slot.hero).length}/5
              </div>
              <div>
                <strong>Enemy Picks:</strong> {draftState.enemyTeam.filter(slot => slot.hero).length}/5
              </div>
              <div>
                <strong>Banned Heroes:</strong> {draftState.bannedHeroes.length}
              </div>
              <div>
                <strong>Recommendations:</strong> {draftState.recommendations.length} 
                {recommendationsLoading && <span className="ml-1 text-yellow-400">(Loading...)</span>}
              </div>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <strong>Heroes Loaded:</strong> {heroes.length} {heroesLoading && <span className="text-yellow-400">(Loading...)</span>}
                </div>
                <div>
                  <strong>Preferred Team:</strong> {preferredTeamSide}
                </div>
                <div>
                  <strong>Persisted Team:</strong> {persistedTeamSide || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Layout Component */}
      <DraftLayout
        draftState={draftState}
        onDraftUpdate={handleDraftUpdate}
        heroes={heroes.length > 0 ? heroes : mockHeroes}
        isLoadingHeroes={heroesLoading}
      />

      {/* Debug Info */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="container mx-auto max-w-7xl">
          <details className="text-textSecondary">
            <summary className="cursor-pointer text-textLight font-medium mb-2">
              Debug: Current Draft State & Context Info
            </summary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-textLight font-medium mb-2">Draft State</h3>
                <pre className="text-xs bg-gray-800 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(draftState, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-textLight font-medium mb-2">Context Status</h3>
                <pre className="text-xs bg-gray-800 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify({
                    heroesCount: heroes.length,
                    heroesLoading,
                    recommendationsLoading,
                    preferredTeamSide,
                    persistedTeamSide,
                    mockHeroesCount: mockHeroes.length
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

// Main component with providers
export default function DraftLayoutTestPage() {
  return (
    <HeroDataProvider>
      <DraftProvider>
        <DraftLayoutTestContent />
      </DraftProvider>
    </HeroDataProvider>
  );
}