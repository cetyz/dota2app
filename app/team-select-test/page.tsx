'use client';

import { useState, useEffect } from 'react';
import TeamSelector from '@/app/components/draft/TeamSelector';
import HeroSelectionModal from '@/app/components/draft/HeroSelectionModal';
import { TeamSide } from '@/app/types/draft';
import { IHero } from '@/app/types/hero';
import { fetchAllHeroes } from '@/app/lib/api/opendota';

export default function TeamSelectTestPage() {
  const [teamSide, setTeamSide] = useState<TeamSide>('radiant');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [selectedHeroes, setSelectedHeroes] = useState<IHero[]>([]);
  const [bannedHeroes, setBannedHeroes] = useState<IHero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch heroes data on component mount
  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setIsLoading(true);
        const heroesData = await fetchAllHeroes();
        setHeroes(heroesData);
      } catch (error) {
        console.error('Failed to fetch heroes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHeroes();
  }, []);

  const handleTeamChange = (newTeamSide: TeamSide) => {
    setTeamSide(newTeamSide);
    console.log('Team changed to:', newTeamSide);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleHeroSelect = (hero: IHero) => {
    setSelectedHeroes(prev => [...prev, hero]);
    console.log(`Selected hero for ${teamSide} team:`, hero.localized_name);
  };

  const handleBanHero = () => {
    if (heroes.length > 0) {
      const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
      if (!bannedHeroes.some(banned => banned.id === randomHero.id)) {
        setBannedHeroes(prev => [...prev, randomHero]);
        console.log('Banned hero:', randomHero.localized_name);
      }
    }
  };

  const clearSelections = () => {
    setSelectedHeroes([]);
    setBannedHeroes([]);
  };

  const getTeamInfo = () => {
    if (teamSide === 'radiant') {
      return {
        name: 'Radiant',
        color: 'text-green-400',
        bgColor: 'bg-green-600/20',
        borderColor: 'border-green-500',
        description: 'You are fighting for the forces of light and nature. Radiant heroes typically have advantages in farming and late-game scaling.',
        advantages: ['Better access to Ancient camps', 'Easier Roshan approach', 'Natural high ground advantages']
      };
    } else {
      return {
        name: 'Dire',
        color: 'text-red-400', 
        bgColor: 'bg-red-600/20',
        borderColor: 'border-red-500',
        description: 'You are fighting for the forces of darkness and chaos. Dire heroes often excel in early aggression and map control.',
        advantages: ['Better jungle efficiency', 'Stronger defensive positioning', 'Superior ganking routes']
      };
    }
  };

  const teamInfo = getTeamInfo();

  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Team Selector Test Page</h1>
        
        {/* Current Selection Display */}
        <div className="mb-8 text-center">
          <h2 className="text-xl mb-4">Current Selection:</h2>
          <div className={`inline-block px-6 py-3 rounded-lg ${teamInfo.bgColor} ${teamInfo.borderColor} border-2`}>
            <span className={`text-lg font-semibold ${teamInfo.color}`}>
              {teamInfo.name}
            </span>
          </div>
        </div>

        {/* Team Selector Component */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-center">Team Selector Component</h2>
          <TeamSelector value={teamSide} onChange={handleTeamChange} />
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setTeamSide('radiant')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Force Radiant
          </button>
          <button
            onClick={() => setTeamSide('dire')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Force Dire
          </button>
          <button
            onClick={openModal}
            className="px-6 py-2 bg-accentPrimary hover:bg-accentPrimary/80 text-white rounded-lg transition-colors font-semibold"
          >
            {teamSide === 'radiant' ? 'Select Hero for Radiant' : 'Select Hero for Dire'}
          </button>
          <button
            onClick={handleBanHero}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors"
          >
            Ban Random Hero
          </button>
          <button
            onClick={clearSelections}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Status Display */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Selected Heroes ({selectedHeroes.length})</h3>
              <div className="bg-gray-800 p-3 rounded-lg">
                {selectedHeroes.length === 0 ? (
                  <p className="text-textSecondary">No heroes selected</p>
                ) : (
                  <ul className="text-sm">
                    {selectedHeroes.map((hero, index) => (
                      <li key={hero.id} className="text-textLight">
                        {index + 1}. {hero.localized_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Banned Heroes ({bannedHeroes.length})</h3>
              <div className="bg-gray-800 p-3 rounded-lg">
                {bannedHeroes.length === 0 ? (
                  <p className="text-textSecondary">No heroes banned</p>
                ) : (
                  <ul className="text-sm">
                    {bannedHeroes.map((hero, index) => (
                      <li key={hero.id} className="text-red-400">
                        {index + 1}. {hero.localized_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Display */}
        <div className={`p-6 rounded-lg ${teamInfo.bgColor} ${teamInfo.borderColor} border`}>
          <h3 className={`text-xl font-semibold mb-3 ${teamInfo.color}`}>
            Playing as {teamInfo.name}
          </h3>
          <p className="text-textSecondary mb-4">{teamInfo.description}</p>
          <div>
            <h4 className="font-semibold mb-2">Team Advantages:</h4>
            <ul className="list-disc list-inside text-textSecondary">
              {teamInfo.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hero Selection Modal */}
        <HeroSelectionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectHero={handleHeroSelect}
          excludedHeroes={selectedHeroes}
          bannedHeroes={bannedHeroes}
          heroes={heroes}
          targetTeam={teamSide === 'radiant' ? 'my' : 'enemy'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}