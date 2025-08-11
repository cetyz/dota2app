'use client';

import { useState } from 'react';
import HeroSelectionModal from '../components/draft/HeroSelectionModal';
import { IHero } from '../types/hero';

// Mock hero data for testing
const mockHeroes: IHero[] = [
  { id: 1, name: 'npc_dota_hero_antimage', localized_name: 'Anti-Mage', primary_attr: 'agi', attack_type: 'Melee', roles: ['Carry'] },
  { id: 2, name: 'npc_dota_hero_axe', localized_name: 'Axe', primary_attr: 'str', attack_type: 'Melee', roles: ['Initiator'] },
  { id: 3, name: 'npc_dota_hero_bane', localized_name: 'Bane', primary_attr: 'int', attack_type: 'Ranged', roles: ['Support', 'Disabler'] },
  { id: 4, name: 'npc_dota_hero_bloodseeker', localized_name: 'Bloodseeker', primary_attr: 'agi', attack_type: 'Melee', roles: ['Carry', 'Jungler'] },
  { id: 5, name: 'npc_dota_hero_crystal_maiden', localized_name: 'Crystal Maiden', primary_attr: 'int', attack_type: 'Ranged', roles: ['Support'] },
  { id: 6, name: 'npc_dota_hero_drow_ranger', localized_name: 'Drow Ranger', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Carry'] },
  { id: 7, name: 'npc_dota_hero_earthshaker', localized_name: 'Earthshaker', primary_attr: 'str', attack_type: 'Melee', roles: ['Support', 'Initiator'] },
  { id: 8, name: 'npc_dota_hero_juggernaut', localized_name: 'Juggernaut', primary_attr: 'agi', attack_type: 'Melee', roles: ['Carry'] },
  { id: 9, name: 'npc_dota_hero_mirana', localized_name: 'Mirana', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Carry', 'Support'] },
  { id: 10, name: 'npc_dota_hero_morphling', localized_name: 'Morphling', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Carry', 'Escape'] },
  { id: 11, name: 'npc_dota_hero_nevermore', localized_name: 'Shadow Fiend', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Carry'] },
  { id: 12, name: 'npc_dota_hero_phantom_lancer', localized_name: 'Phantom Lancer', primary_attr: 'agi', attack_type: 'Melee', roles: ['Carry', 'Escape'] },
  { id: 13, name: 'npc_dota_hero_puck', localized_name: 'Puck', primary_attr: 'int', attack_type: 'Ranged', roles: ['Initiator', 'Escape'] },
  { id: 14, name: 'npc_dota_hero_pudge', localized_name: 'Pudge', primary_attr: 'str', attack_type: 'Melee', roles: ['Initiator', 'Durable'] },
  { id: 15, name: 'npc_dota_hero_razor', localized_name: 'Razor', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Carry', 'Durable'] },
  { id: 16, name: 'npc_dota_hero_sand_king', localized_name: 'Sand King', primary_attr: 'str', attack_type: 'Melee', roles: ['Initiator', 'Support'] },
  { id: 17, name: 'npc_dota_hero_storm_spirit', localized_name: 'Storm Spirit', primary_attr: 'int', attack_type: 'Ranged', roles: ['Carry', 'Escape'] },
  { id: 18, name: 'npc_dota_hero_sven', localized_name: 'Sven', primary_attr: 'str', attack_type: 'Melee', roles: ['Carry', 'Initiator'] },
  { id: 19, name: 'npc_dota_hero_tiny', localized_name: 'Tiny', primary_attr: 'str', attack_type: 'Melee', roles: ['Carry', 'Initiator'] },
  { id: 20, name: 'npc_dota_hero_vengefulspirit', localized_name: 'Vengeful Spirit', primary_attr: 'agi', attack_type: 'Ranged', roles: ['Support', 'Initiator'] },
];

export default function ModalTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHeroes, setSelectedHeroes] = useState<IHero[]>([]);
  const [bannedHeroes, setBannedHeroes] = useState<IHero[]>([]);
  const [excludedHeroes, setExcludedHeroes] = useState<IHero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSelectedHero, setLastSelectedHero] = useState<IHero | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectHero = (hero: IHero) => {
    setLastSelectedHero(hero);
    setSelectedHeroes(prev => [...prev, hero]);
    console.log('Selected hero:', hero);
  };

  const handleBanHero = (hero: IHero) => {
    setBannedHeroes(prev => [...prev, hero]);
    console.log('Banned hero:', hero);
  };

  const handleExcludeHero = (hero: IHero) => {
    setExcludedHeroes(prev => [...prev, hero]);
    console.log('Excluded hero:', hero);
  };

  const removeFromList = (hero: IHero, setter: React.Dispatch<React.SetStateAction<IHero[]>>) => {
    setter(prev => prev.filter(h => h.id !== hero.id));
  };

  const clearAll = () => {
    setSelectedHeroes([]);
    setBannedHeroes([]);
    setExcludedHeroes([]);
    setLastSelectedHero(null);
  };

  const toggleLoading = () => {
    setIsLoading(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-textLight mb-8">Hero Selection Modal Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-textLight mb-4">Modal Controls</h2>
              
              <button
                onClick={handleOpenModal}
                className="w-full px-4 py-2 bg-accentPrimary text-white rounded hover:bg-accentPrimary/80 transition-colors"
              >
                Open Hero Selection Modal
              </button>

              <button
                onClick={toggleLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              >
                Toggle Loading State: {isLoading ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={clearAll}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                Clear All Lists
              </button>

              {lastSelectedHero && (
                <div className="p-3 bg-green-900/20 border border-green-500 rounded">
                  <p className="text-green-400 text-sm">Last Selected:</p>
                  <p className="text-textLight">{lastSelectedHero.localized_name}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold text-textLight mb-3">Quick Test Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleBanHero(mockHeroes[0])}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-500 transition-colors"
                >
                  Ban Anti-Mage
                </button>
                <button
                  onClick={() => handleExcludeHero(mockHeroes[1])}
                  className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-500 transition-colors"
                >
                  Exclude Axe
                </button>
                <button
                  onClick={() => handleBanHero(mockHeroes[2])}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-500 transition-colors"
                >
                  Ban Bane
                </button>
              </div>
            </div>
          </div>

          {/* Lists Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Heroes */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-textLight mb-3">
                Selected Heroes ({selectedHeroes.length})
              </h3>
              {selectedHeroes.length === 0 ? (
                <p className="text-textSecondary">No heroes selected</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedHeroes.map(hero => (
                    <div key={hero.id} className="flex items-center justify-between bg-green-900/20 border border-green-500 rounded p-2">
                      <span className="text-textLight">{hero.localized_name}</span>
                      <button
                        onClick={() => removeFromList(hero, setSelectedHeroes)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Banned Heroes */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-textLight mb-3">
                Banned Heroes ({bannedHeroes.length})
              </h3>
              {bannedHeroes.length === 0 ? (
                <p className="text-textSecondary">No heroes banned</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bannedHeroes.map(hero => (
                    <div key={hero.id} className="flex items-center justify-between bg-red-900/20 border border-red-500 rounded p-2">
                      <span className="text-textLight">{hero.localized_name}</span>
                      <button
                        onClick={() => removeFromList(hero, setBannedHeroes)}
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Unban
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Excluded Heroes */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-textLight mb-3">
                Excluded Heroes ({excludedHeroes.length})
              </h3>
              {excludedHeroes.length === 0 ? (
                <p className="text-textSecondary">No heroes excluded</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {excludedHeroes.map(hero => (
                    <div key={hero.id} className="flex items-center justify-between bg-yellow-900/20 border border-yellow-500 rounded p-2">
                      <span className="text-textLight">{hero.localized_name}</span>
                      <button
                        onClick={() => removeFromList(hero, setExcludedHeroes)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Include
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-textLight mb-3">Test Instructions</h3>
          <ul className="text-textSecondary space-y-2 text-sm">
            <li>• <strong className="text-textLight">Open Modal:</strong> Click "Open Hero Selection Modal" to test the modal</li>
            <li>• <strong className="text-textLight">Search:</strong> Use the search input to filter heroes by name</li>
            <li>• <strong className="text-textLight">Filters:</strong> Test attribute and role filters in the hero grid</li>
            <li>• <strong className="text-textLight">Selection:</strong> Click any hero to select it (modal will close)</li>
            <li>• <strong className="text-textLight">Banned Heroes:</strong> Use quick actions to ban heroes, they should appear with red overlay</li>
            <li>• <strong className="text-textLight">Excluded Heroes:</strong> Use quick actions to exclude heroes, they shouldn't appear in modal</li>
            <li>• <strong className="text-textLight">Keyboard:</strong> Press Escape to close modal</li>
            <li>• <strong className="text-textLight">Click Outside:</strong> Click outside modal to close it</li>
            <li>• <strong className="text-textLight">Loading State:</strong> Toggle loading to test spinner</li>
          </ul>
        </div>
      </div>

      {/* Hero Selection Modal */}
      <HeroSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectHero={handleSelectHero}
        excludedHeroes={excludedHeroes}
        bannedHeroes={bannedHeroes}
        heroes={mockHeroes}
        isLoading={isLoading}
      />
    </div>
  );
}