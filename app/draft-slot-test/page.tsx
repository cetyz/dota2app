'use client';

import React, { useState } from 'react';
import DraftSlot from '../components/draft/DraftSlot';
import { IDraftSlot } from '../types/draft';
import { IHero, HeroRole } from '../types/hero';

// Mock hero data for testing - need at least 10 heroes for full draft
const mockHeroes: IHero[] = [
  {
    id: 1,
    name: 'npc_dota_hero_antimage',
    localized_name: 'Anti-Mage',
    primary_attr: 'agi',
    attack_type: 'Melee',
    roles: ['Carry']
  },
  {
    id: 2,
    name: 'npc_dota_hero_pudge',
    localized_name: 'Pudge',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator', 'Durable']
  },
  {
    id: 3,
    name: 'npc_dota_hero_invoker',
    localized_name: 'Invoker',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Nuker', 'Pusher']
  },
  {
    id: 4,
    name: 'npc_dota_hero_crystal_maiden',
    localized_name: 'Crystal Maiden',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Nuker']
  },
  {
    id: 5,
    name: 'npc_dota_hero_axe',
    localized_name: 'Axe',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator', 'Durable']
  },
  {
    id: 6,
    name: 'npc_dota_hero_drow_ranger',
    localized_name: 'Drow Ranger',
    primary_attr: 'agi',
    attack_type: 'Ranged',
    roles: ['Carry']
  },
  {
    id: 7,
    name: 'npc_dota_hero_lina',
    localized_name: 'Lina',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Nuker']
  },
  {
    id: 8,
    name: 'npc_dota_hero_juggernaut',
    localized_name: 'Juggernaut',
    primary_attr: 'agi',
    attack_type: 'Melee',
    roles: ['Carry']
  },
  {
    id: 9,
    name: 'npc_dota_hero_shadow_fiend',
    localized_name: 'Shadow Fiend',
    primary_attr: 'agi',
    attack_type: 'Ranged',
    roles: ['Carry']
  },
  {
    id: 10,
    name: 'npc_dota_hero_lion',
    localized_name: 'Lion',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Disabler']
  },
  {
    id: 11,
    name: 'npc_dota_hero_sven',
    localized_name: 'Sven',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Carry', 'Initiator']
  },
  {
    id: 12,
    name: 'npc_dota_hero_mirana',
    localized_name: 'Mirana',
    primary_attr: 'agi',
    attack_type: 'Ranged',
    roles: ['Carry', 'Support']
  }
];

export default function DraftSlotTestPage() {
  const [radiantSlots, setRadiantSlots] = useState<IDraftSlot[]>([
    { hero: null, role: null, team: 'radiant', position: 1 },
    { hero: mockHeroes[0], role: 'Carry', team: 'radiant', position: 2 },
    { hero: null, role: 'Mid', team: 'radiant', position: 3 },
    { hero: mockHeroes[2], role: null, team: 'radiant', position: 4 },
    { hero: null, role: null, team: 'radiant', position: 5 }
  ]);

  const [direSlots, setDireSlots] = useState<IDraftSlot[]>([
    { hero: mockHeroes[1], role: 'Support', team: 'dire', position: 1 },
    { hero: null, role: null, team: 'dire', position: 2 },
    { hero: mockHeroes[4], role: 'Offlane', team: 'dire', position: 3 },
    { hero: null, role: 'Hard Support', team: 'dire', position: 4 },
    { hero: mockHeroes[3], role: null, team: 'dire', position: 5 }
  ]);

  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const updateRadiantSlot = (index: number, role: HeroRole | null) => {
    setRadiantSlots(prev => prev.map((slot, i) => 
      i === index ? { 
        ...slot, 
        role,
        // If role is being cleared, also clear the hero (simulating remove button behavior)
        hero: role === null ? null : slot.hero
      } : slot
    ));
  };

  const updateDireSlot = (index: number, role: HeroRole | null) => {
    setDireSlots(prev => prev.map((slot, i) => 
      i === index ? { 
        ...slot, 
        role,
        // If role is being cleared, also clear the hero (simulating remove button behavior)
        hero: role === null ? null : slot.hero
      } : slot
    ));
  };

  const handleHeroClick = (team: 'radiant' | 'dire', index: number) => {
    const slotKey = `${team}-${index}`;
    const currentSlot = team === 'radiant' ? radiantSlots[index] : direSlots[index];
    
    // Toggle active state
    setActiveSlot(activeSlot === slotKey ? null : slotKey);
    
    if (currentSlot.hero) {
      console.log(`Hero click: ${team} slot ${index + 1} - ${currentSlot.hero.localized_name}`);
    } else {
      console.log(`Empty slot click: ${team} slot ${index + 1} - This would open hero selection modal`);
      // In a real app, this would open a hero selection modal
      // For testing, let's assign a random hero after a brief delay to show the click registered
      setTimeout(() => assignRandomHero(team, index), 100);
    }
  };

  const assignRandomHero = (team: 'radiant' | 'dire', index: number) => {
    // Get current state to ensure we have the latest data
    const currentRadiant = radiantSlots;
    const currentDire = direSlots;
    
    const availableHeroes = mockHeroes.filter(hero => 
      !currentRadiant.some(slot => slot.hero?.id === hero.id) &&
      !currentDire.some(slot => slot.hero?.id === hero.id)
    );
    
    if (availableHeroes.length === 0) {
      console.log('No available heroes left!');
      return;
    }
    
    const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
    console.log(`Assigning ${randomHero.localized_name} to ${team} slot ${index + 1}`);
    
    if (team === 'radiant') {
      setRadiantSlots(prev => prev.map((slot, i) => 
        i === index ? { ...slot, hero: randomHero } : slot
      ));
    } else {
      setDireSlots(prev => prev.map((slot, i) => 
        i === index ? { ...slot, hero: randomHero } : slot
      ));
    }
  };

  const clearSlot = (team: 'radiant' | 'dire', index: number) => {
    if (team === 'radiant') {
      setRadiantSlots(prev => prev.map((slot, i) => 
        i === index ? { ...slot, hero: null, role: null } : slot
      ));
    } else {
      setDireSlots(prev => prev.map((slot, i) => 
        i === index ? { ...slot, hero: null, role: null } : slot
      ));
    }
  };

  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-accentPrimary">
          DraftSlot Component Test Page
        </h1>
        
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ul className="space-y-2 text-textSecondary">
            <li>• <strong>Click on empty slots (+ icon)</strong> - Assigns a random hero automatically (simulates hero selection)</li>
            <li>• <strong>Use role dropdowns</strong> - Change hero roles</li>
            <li>• <strong>Hover over slots with heroes</strong> - See the remove button (×)</li>
            <li>• <strong>Click the remove button (×)</strong> - Clears both hero and role</li>
            <li>• <strong>Click any slot</strong> - Toggles active state highlighting</li>
            <li>• <strong>Use control buttons</strong> - Manually add/clear heroes and test various scenarios</li>
            <li>• <strong>Check browser console</strong> - See detailed interaction logs</li>
          </ul>
        </div>

        {/* Radiant Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            🌟 Radiant Team
          </h2>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            {radiantSlots.map((slot, index) => (
              <div key={`radiant-${index}`} className="relative">
                <DraftSlot
                  slot={slot}
                  slotIndex={index}
                  onHeroClick={() => handleHeroClick('radiant', index)}
                  onRoleChange={(role) => updateRadiantSlot(index, role)}
                  isActive={activeSlot === `radiant-${index}`}
                />
                
                {/* Test Controls */}
                <div className="mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => assignRandomHero('radiant', index)}
                    className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded transition-colors"
                    disabled={slot.hero !== null}
                  >
                    Add Hero
                  </button>
                  <button
                    onClick={() => clearSlot('radiant', index)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors"
                    disabled={slot.hero === null}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center mb-12">
          <div className="inline-block px-8 py-4 bg-accentPrimary rounded-full">
            <span className="text-2xl font-bold text-white">VS</span>
          </div>
        </div>

        {/* Dire Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-400">
            ⚡ Dire Team
          </h2>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            {direSlots.map((slot, index) => (
              <div key={`dire-${index}`} className="relative">
                <DraftSlot
                  slot={slot}
                  slotIndex={index}
                  onHeroClick={() => handleHeroClick('dire', index)}
                  onRoleChange={(role) => updateDireSlot(index, role)}
                  isActive={activeSlot === `dire-${index}`}
                />
                
                {/* Test Controls */}
                <div className="mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => assignRandomHero('dire', index)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors"
                    disabled={slot.hero !== null}
                  >
                    Add Hero
                  </button>
                  <button
                    onClick={() => clearSlot('dire', index)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors"
                    disabled={slot.hero === null}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Controls */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Global Test Controls</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setRadiantSlots(slots => slots.map(slot => ({ ...slot, hero: null, role: null })));
                setDireSlots(slots => slots.map(slot => ({ ...slot, hero: null, role: null })));
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Clear All
            </button>
            
            <button
              onClick={() => {
                radiantSlots.forEach((slot, i) => {
                  if (!slot.hero) assignRandomHero('radiant', i);
                });
                direSlots.forEach((slot, i) => {
                  if (!slot.hero) assignRandomHero('dire', i);
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Fill Empty
            </button>
            
            <button
              onClick={() => setActiveSlot(null)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            >
              Clear Active
            </button>
            
            <button
              onClick={() => {
                const allSlots = [...radiantSlots.map((_, i) => `radiant-${i}`), ...direSlots.map((_, i) => `dire-${i}`)];
                const randomSlot = allSlots[Math.floor(Math.random() * allSlots.length)];
                setActiveSlot(randomSlot);
              }}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
            >
              Random Active
            </button>
          </div>
        </div>

        {/* Component State Display */}
        <div className="mt-8 bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Component State (Debug)</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Radiant Slots:</h4>
              <pre className="bg-black p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(radiantSlots, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Dire Slots:</h4>
              <pre className="bg-black p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(direSlots, null, 2)}
              </pre>
            </div>
          </div>
          <div className="mt-4">
            <p><strong>Active Slot:</strong> {activeSlot || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}