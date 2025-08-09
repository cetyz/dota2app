'use client';

import HeroPortrait from '../components/ui/HeroPortrait';
import { IHero } from '../types/hero';
import { useState } from 'react';

// Sample hero data for testing
const sampleHeroes: IHero[] = [
  {
    id: 1,
    name: 'npc_dota_hero_pudge',
    localized_name: 'Pudge',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Support', 'Disabler', 'Initiator', 'Durable']
  },
  {
    id: 2,
    name: 'npc_dota_hero_invoker',
    localized_name: 'Invoker',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Carry', 'Nuker', 'Pusher', 'Escape']
  },
  {
    id: 3,
    name: 'npc_dota_hero_drow_ranger',
    localized_name: 'Drow Ranger',
    primary_attr: 'agi',
    attack_type: 'Ranged',
    roles: ['Carry', 'Pusher']
  },
  {
    id: 4,
    name: 'npc_dota_hero_crystal_maiden',
    localized_name: 'Crystal Maiden',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Disabler', 'Nuker', 'Jungler']
  },
  {
    id: 5,
    name: 'npc_dota_hero_axe',
    localized_name: 'Axe',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator', 'Durable', 'Disabler', 'Jungler']
  }
];

export default function TestPage() {
  const [selectedHero, setSelectedHero] = useState<IHero | null>(null);

  const handleHeroClick = (hero: IHero) => {
    setSelectedHero(selectedHero?.id === hero.id ? null : hero);
    console.log('Hero clicked:', hero.localized_name);
  };

  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Hero Portrait Component Test</h1>
        <p className="text-center text-textSecondary mb-8">Testing all states and interactions</p>
        
        {/* Different sizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Size Variants</h2>
          <div className="flex gap-8 items-end justify-center">
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[0]} 
                size="small" 
                onClick={handleHeroClick}
              />
              <p className="text-sm mt-2 text-textSecondary">Small (48px)</p>
            </div>
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[0]} 
                size="medium" 
                onClick={handleHeroClick}
              />
              <p className="text-sm mt-2 text-textSecondary">Medium (64px)</p>
            </div>
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[0]} 
                size="large" 
                onClick={handleHeroClick}
              />
              <p className="text-sm mt-2 text-textSecondary">Large (96px)</p>
            </div>
          </div>
        </div>

        {/* Interactive selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Interactive Selection</h2>
          <p className="text-textSecondary mb-4">Click heroes to select/deselect. Check console for click events.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {sampleHeroes.map((hero) => (
              <div key={hero.id} className="text-center">
                <HeroPortrait
                  hero={hero}
                  onClick={handleHeroClick}
                  isSelected={selectedHero?.id === hero.id}
                  size="medium"
                />
                <p className="text-xs mt-1 text-textSecondary">{hero.localized_name}</p>
              </div>
            ))}
          </div>
          {selectedHero && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
              <p className="text-accentPrimary font-semibold">
                Selected: {selectedHero.localized_name}
              </p>
              <p className="text-sm text-textSecondary mt-1">
                Primary Attribute: {selectedHero.primary_attr} | Attack Type: {selectedHero.attack_type}
              </p>
              <p className="text-sm text-textSecondary">
                Roles: {selectedHero.roles.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Different states */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Component States</h2>
          <p className="text-textSecondary mb-4">Test different component states and interactions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="text-center">
              <HeroPortrait 
                hero={null} 
                onClick={() => console.log('Empty slot clicked')}
                size="medium"
              />
              <p className="text-sm mt-2 text-textSecondary font-semibold">Empty State</p>
              <p className="text-xs text-gray-500">Click to test empty slot interaction</p>
            </div>
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[1]} 
                onClick={handleHeroClick}
                isSelected={true}
                size="medium"
              />
              <p className="text-sm mt-2 text-textSecondary font-semibold">Selected</p>
              <p className="text-xs text-gray-500">Orange border & shadow when selected</p>
            </div>
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[2]} 
                onClick={(hero) => console.log('Tried to click disabled hero:', hero.localized_name)}
                disabled={true}
                size="medium"
              />
              <p className="text-sm mt-2 text-textSecondary font-semibold">Disabled</p>
              <p className="text-xs text-gray-500">Click should NOT work, no hover effects</p>
            </div>
            <div className="text-center">
              <HeroPortrait 
                hero={sampleHeroes[3]} 
                onClick={handleHeroClick}
                size="medium"
              />
              <p className="text-sm mt-2 text-textSecondary font-semibold">Normal</p>
              <p className="text-xs text-gray-500">Hover for effects & tooltip</p>
            </div>
          </div>
        </div>

        {/* Hover effects demonstration */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Hover Effects</h2>
          <p className="text-textSecondary mb-4">Hover over heroes to see scale animation, border highlight, and name tooltip</p>
          <div className="flex gap-6 justify-center">
            {sampleHeroes.slice(0, 3).map((hero) => (
              <HeroPortrait
                key={hero.id}
                hero={hero}
                onClick={handleHeroClick}
                size="large"
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ul className="space-y-2 text-textSecondary">
            <li>• <strong>Click</strong> any hero to select/deselect</li>
            <li>• <strong>Hover</strong> over heroes to see scale animation and name tooltip</li>
            <li>• Check browser <strong>console</strong> for click event logs</li>
            <li>• <strong>Empty state</strong> shows clickable + placeholder</li>
            <li>• <strong>Selected state</strong> shows orange accent border and shadow</li>
            <li>• <strong>Disabled state</strong> shows reduced opacity with X overlay</li>
            <li>• Hero images load from Dota 2 CDN</li>
          </ul>
        </div>
      </div>
    </div>
  );
}