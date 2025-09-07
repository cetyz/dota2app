'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IDraftState, TeamSide, IDraftSlot } from '@/app/types/draft';
import { IHero } from '@/app/types/hero';
import TeamSelector from './TeamSelector';
import TeamDraftSection from './TeamDraftSection';
import HeroSelectionModal from './HeroSelectionModal';
import BannedHeroesPanel from './BannedHeroesPanel';
import RecommendationPanel from './RecommendationPanel';

interface DraftLayoutProps {
  draftState: IDraftState;
  onDraftUpdate: (updates: Partial<IDraftState>) => void;
  heroes: IHero[];
  isLoadingHeroes?: boolean;
}

export default function DraftLayout({ 
  draftState, 
  onDraftUpdate, 
  heroes, 
  isLoadingHeroes = false 
}: DraftLayoutProps) {
  const [bannedHeroesCollapsed, setBannedHeroesCollapsed] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTargetTeam, setModalTargetTeam] = useState<'my' | 'enemy'>('my');
  const [modalTargetSlot, setModalTargetSlot] = useState<number>(0);

  // Handle team side change
  const handleTeamSideChange = (teamSide: TeamSide) => {
    onDraftUpdate({ myTeamSide: teamSide });
  };

  // Handle my team slot updates
  const handleMyTeamSlotUpdate = (slotIndex: number, updates: Partial<IDraftSlot>) => {
    const updatedMyTeam = [...draftState.myTeam];
    updatedMyTeam[slotIndex] = { ...updatedMyTeam[slotIndex], ...updates };
    onDraftUpdate({ myTeam: updatedMyTeam });
  };

  // Handle enemy team slot updates
  const handleEnemyTeamSlotUpdate = (slotIndex: number, updates: Partial<IDraftSlot>) => {
    const updatedEnemyTeam = [...draftState.enemyTeam];
    updatedEnemyTeam[slotIndex] = { ...updatedEnemyTeam[slotIndex], ...updates };
    onDraftUpdate({ enemyTeam: updatedEnemyTeam });
  };

  // Handle hero selection for my team
  const handleMyTeamHeroClick = (slotIndex: number) => {
    setModalTargetTeam('my');
    setModalTargetSlot(slotIndex);
    setModalOpen(true);
  };

  // Handle hero selection for enemy team
  const handleEnemyTeamHeroClick = (slotIndex: number) => {
    setModalTargetTeam('enemy');
    setModalTargetSlot(slotIndex);
    setModalOpen(true);
  };

  // Handle hero selection from modal
  const handleHeroSelection = (hero: IHero) => {
    if (modalTargetTeam === 'my') {
      handleMyTeamSlotUpdate(modalTargetSlot, { hero });
    } else {
      handleEnemyTeamSlotUpdate(modalTargetSlot, { hero });
    }
    setModalOpen(false);
  };

  // Get all picked heroes for exclusion in modal
  const getAllPickedHeroes = (): IHero[] => {
    const myTeamHeroes = draftState.myTeam
      .map(slot => slot.hero)
      .filter((hero): hero is IHero => hero !== null);
    
    const enemyTeamHeroes = draftState.enemyTeam
      .map(slot => slot.hero)
      .filter((hero): hero is IHero => hero !== null);
    
    return [...myTeamHeroes, ...enemyTeamHeroes];
  };

  // Handle recommendation selection
  const handleRecommendationSelect = (hero: IHero) => {
    // Find first available slot in my team
    const firstAvailableSlot = draftState.myTeam.findIndex(slot => slot.hero === null);
    if (firstAvailableSlot !== -1) {
      handleMyTeamSlotUpdate(firstAvailableSlot, { hero });
    }
  };

  // Handle recommendation ban
  const handleRecommendationBan = (hero: IHero) => {
    const updatedBannedHeroes = [...draftState.bannedHeroes, hero];
    onDraftUpdate({ bannedHeroes: updatedBannedHeroes });
  };

  // Handle unban hero
  const handleUnbanHero = (hero: IHero) => {
    const updatedBannedHeroes = draftState.bannedHeroes.filter(
      banned => banned.id !== hero.id
    );
    onDraftUpdate({ bannedHeroes: updatedBannedHeroes });
  };

  // Clear all draft selections
  const handleClearDraft = () => {
    const emptySlots: IDraftSlot[] = Array(5).fill(null).map(() => ({
      hero: null,
      role: null,
      position: null
    }));
    
    onDraftUpdate({
      myTeam: emptySlots,
      enemyTeam: emptySlots,
      recommendations: []
    });
  };

  // Clear all banned heroes
  const handleClearBans = () => {
    onDraftUpdate({ bannedHeroes: [] });
  };

  // Handle save draft
  const handleSaveDraft = () => {
    // TODO: Implement save functionality
    console.log('Saving draft...');
  };

  // Handle share draft
  const handleShareDraft = () => {
    // TODO: Implement share functionality
    console.log('Sharing draft...');
  };

  // Auto-refresh recommendations when draft state changes
  useEffect(() => {
    generateRecommendations();
  }, [
    // Trigger on any hero changes
    draftState.myTeam,
    draftState.enemyTeam,
    // Trigger on banned heroes changes
    draftState.bannedHeroes,
    // Trigger on team side changes
    draftState.myTeamSide,
    // Trigger when heroes list changes
    heroes
  ]);

  // Generate recommendations based on current draft state
  const generateRecommendations = useCallback(() => {
    if (heroes.length === 0) {
      return;
    }

    // Get all picked heroes
    const pickedHeroes = getAllPickedHeroes();
    
    // Filter out picked and banned heroes
    const availableHeroes = heroes.filter(hero => 
      !pickedHeroes.some(picked => picked.id === hero.id) &&
      !draftState.bannedHeroes.some(banned => banned.id === hero.id)
    );

    // Simple recommendation logic - can be enhanced later
    // For now, just get random available heroes with some preference
    const recommendations = availableHeroes
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, 5); // Take first 5

    // Update recommendations
    onDraftUpdate({ recommendations });
  }, [heroes, draftState.myTeam, draftState.enemyTeam, draftState.bannedHeroes, onDraftUpdate]);

  return (
    <div className="min-h-screen bg-background text-textLight">
      {/* Main container with full height and dark background */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-textLight mb-4">
            Dota 2 Draft Tool - All Pick Mode
          </h1>
          
          {/* Team Selector */}
          <div className="mb-4">
            <TeamSelector
              value={draftState.myTeamSide}
              onChange={handleTeamSideChange}
            />
          </div>

          {/* Info text showing which side user is playing */}
          <p className="text-textSecondary text-sm">
            Playing as: <span className={`font-semibold ${
              draftState.myTeamSide === 'radiant' ? 'text-green-400' : 'text-red-400'
            }`}>
              {draftState.myTeamSide.charAt(0).toUpperCase() + draftState.myTeamSide.slice(1)}
            </span>
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Draft Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* My Team Section */}
            <TeamDraftSection
              teamLabel="My Team"
              slots={draftState.myTeam}
              onSlotUpdate={handleMyTeamSlotUpdate}
              teamSide={draftState.myTeamSide}
              onHeroClick={handleMyTeamHeroClick}
            />

            {/* VS Divider */}
            <div className="flex items-center justify-center py-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-textSecondary to-transparent"></div>
              <div className="px-6">
                <span className="text-2xl font-bold text-textSecondary bg-background px-4 py-2 rounded-full border border-textSecondary/30">
                  VS
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-textSecondary to-transparent"></div>
            </div>

            {/* Enemy Team Section */}
            <TeamDraftSection
              teamLabel="Enemy Team"
              slots={draftState.enemyTeam}
              onSlotUpdate={handleEnemyTeamSlotUpdate}
              teamSide={draftState.myTeamSide}
              onHeroClick={handleEnemyTeamHeroClick}
            />

            {/* Draft Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button
                onClick={handleClearDraft}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-textLight rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Clear Draft
              </button>
              <button
                onClick={handleClearBans}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                disabled={draftState.bannedHeroes.length === 0}
              >
                Clear Bans ({draftState.bannedHeroes.length})
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={handleShareDraft}
                className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Share
              </button>
            </div>
          </div>

          {/* Right Column - Recommendations and Banned Heroes */}
          <div className="xl:col-span-1 space-y-6">
            {/* Recommendations Panel */}
            <RecommendationPanel
              recommendations={draftState.recommendations}
              onSelectRecommendation={handleRecommendationSelect}
              onBanRecommendation={handleRecommendationBan}
              myTeamSide={draftState.myTeamSide}
              isLoading={isLoadingHeroes}
              onRefreshRecommendations={generateRecommendations}
            />

            {/* Banned Heroes Panel */}
            <BannedHeroesPanel
              bannedHeroes={draftState.bannedHeroes}
              onUnbanHero={handleUnbanHero}
              isCollapsed={bannedHeroesCollapsed}
              onToggleCollapse={() => setBannedHeroesCollapsed(!bannedHeroesCollapsed)}
            />

            {/* Keyboard Shortcuts Display */}
            <div className="bg-gray-900/50 rounded-lg border border-textSecondary/30 p-4">
              <button
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                className="flex items-center justify-between w-full text-sm font-medium text-textLight hover:text-white transition-colors duration-200"
              >
                <span>Keyboard Shortcuts</span>
                <span className={`transform transition-transform duration-200 ${
                  showKeyboardShortcuts ? 'rotate-180' : 'rotate-0'
                }`}>
                  ▼
                </span>
              </button>

              {showKeyboardShortcuts && (
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-textSecondary">ESC</span>
                    <span className="text-textLight">Close modal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textSecondary">Ctrl+Z</span>
                    <span className="text-textLight">Undo last pick</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textSecondary">Ctrl+Shift+C</span>
                    <span className="text-textLight">Clear draft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textSecondary">Ctrl+S</span>
                    <span className="text-textLight">Save draft</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Selection Modal */}
      <HeroSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectHero={handleHeroSelection}
        onBanHero={handleRecommendationBan}
        excludedHeroes={getAllPickedHeroes()}
        bannedHeroes={draftState.bannedHeroes}
        heroes={heroes}
        targetTeam={modalTargetTeam}
        myTeamSide={draftState.myTeamSide}
        isLoading={isLoadingHeroes}
      />
    </div>
  );
}