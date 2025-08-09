'use client';

import HeroPortrait from '../components/ui/HeroPortrait';
import { IHero } from '../types/hero';
import { useState } from 'react';

const testHero: IHero = {
  id: 1,
  name: 'npc_dota_hero_pudge',
  localized_name: 'Pudge',
  primary_attr: 'str',
  attack_type: 'Melee',
  roles: ['Support', 'Disabler', 'Initiator', 'Durable']
};

export default function DebugPage() {
  const [selectedHero, setSelectedHero] = useState<IHero | null>(null);

  return (
    <div className="min-h-screen bg-background text-textLight p-8">
      <h1 className="text-2xl font-bold mb-8">Debug Hero Portrait</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg mb-4">Simple Test</h2>
          <div className="flex gap-4 items-center">
            <HeroPortrait
              hero={testHero}
              size="medium"
              onClick={(hero) => {
                console.log('Clicked:', hero.localized_name);
                setSelectedHero(hero);
              }}
            />
            <div className="bg-red-500 w-16 h-16 flex items-center justify-center">
              RED BOX
            </div>
          </div>
        </div>

        {selectedHero && (
          <div className="bg-gray-800 p-4 rounded">
            <p>Selected: {selectedHero.localized_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}