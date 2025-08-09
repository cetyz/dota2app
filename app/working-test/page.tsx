'use client';

import HeroPortraitFixed from '../components/ui/HeroPortraitFixed';
import { IHero } from '../types/hero';
import { useState } from 'react';

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
  }
];

export default function WorkingTestPage() {
  const [selectedHero, setSelectedHero] = useState<IHero | null>(null);

  const handleHeroClick = (hero: IHero) => {
    setSelectedHero(selectedHero?.id === hero.id ? null : hero);
    console.log('Hero clicked:', hero.localized_name);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#121315', 
      color: '#d1d1c6', 
      padding: '32px' 
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px' }}>
        Hero Portrait Working Test
      </h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Size variants */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid #666', paddingBottom: '8px' }}>
            Size Variants
          </h2>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'end', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={sampleHeroes[0]} 
                size="small" 
                onClick={handleHeroClick}
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece' }}>Small</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={sampleHeroes[0]} 
                size="medium" 
                onClick={handleHeroClick}
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece' }}>Medium</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={sampleHeroes[0]} 
                size="large" 
                onClick={handleHeroClick}
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece' }}>Large</p>
            </div>
          </div>
        </div>

        {/* Interactive selection */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid #666', paddingBottom: '8px' }}>
            Interactive Selection
          </h2>
          <p style={{ color: '#cecece', marginBottom: '16px' }}>Click heroes to select/deselect. Check console for click events.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {sampleHeroes.map((hero) => (
              <div key={hero.id} style={{ textAlign: 'center' }}>
                <HeroPortraitFixed
                  hero={hero}
                  onClick={handleHeroClick}
                  isSelected={selectedHero?.id === hero.id}
                  size="medium"
                />
                <p style={{ fontSize: '12px', marginTop: '4px', color: '#cecece' }}>{hero.localized_name}</p>
              </div>
            ))}
          </div>
          {selectedHero && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: '#374151', 
              borderRadius: '8px', 
              textAlign: 'center' 
            }}>
              <p style={{ color: '#ad3f21', fontWeight: '600' }}>
                Selected: {selectedHero.localized_name}
              </p>
            </div>
          )}
        </div>

        {/* Component states */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid #666', paddingBottom: '8px' }}>
            Component States
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', justifyItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={null} 
                onClick={() => console.log('Empty slot clicked')}
                size="medium"
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece', fontWeight: '600' }}>Empty State</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Click to test empty slot</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={sampleHeroes[1]} 
                onClick={handleHeroClick}
                isSelected={true}
                size="medium"
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece', fontWeight: '600' }}>Selected</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Orange border & shadow</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <HeroPortraitFixed 
                hero={sampleHeroes[2]} 
                onClick={(hero) => console.log('Tried to click disabled hero:', hero.localized_name)}
                disabled={true}
                size="medium"
              />
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#cecece', fontWeight: '600' }}>Disabled</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Click should NOT work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}