'use client';

import { useState } from 'react';
import { TeamSide, IDraftSlot } from '@/app/types/draft';
import { IHero, HeroRole } from '@/app/types/hero';
import TeamSelector from '@/app/components/draft/TeamSelector';
import DraftSlot from '@/app/components/draft/DraftSlot';
import HeroSelectionModal from '@/app/components/draft/HeroSelectionModal';

// Mock hero data for testing
const mockHeroes: IHero[] = [
  {
    id: 1,
    name: 'pudge',
    localized_name: 'Pudge',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Support', 'Disabler']
  },
  {
    id: 2,
    name: 'invoker',
    localized_name: 'Invoker',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Carry', 'Nuker']
  },
  {
    id: 3,
    name: 'anti-mage',
    localized_name: 'Anti-Mage',
    primary_attr: 'agi',
    attack_type: 'Melee',
    roles: ['Carry', 'Escape']
  },
  {
    id: 4,
    name: 'crystal_maiden',
    localized_name: 'Crystal Maiden',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Nuker']
  },
  {
    id: 5,
    name: 'axe',
    localized_name: 'Axe',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator', 'Durable']
  }
];

export default function TeamDraftModalTestPage() {
  const [myTeamSide, setMyTeamSide] = useState<TeamSide>('radiant');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTargetTeam, setCurrentTargetTeam] = useState<'my' | 'enemy'>('my');
  
  // Initialize draft slots
  const [myTeamSlot, setMyTeamSlot] = useState<IDraftSlot>({
    hero: null,
    role: null,
    position: null
  });
  
  const [enemyTeamSlot, setEnemyTeamSlot] = useState<IDraftSlot>({
    hero: null,
    role: null,
    position: null
  });

  const handleMyTeamSlotClick = () => {
    setCurrentTargetTeam('my');
    setModalOpen(true);
  };

  const handleEnemyTeamSlotClick = () => {
    setCurrentTargetTeam('enemy');
    setModalOpen(true);
  };

  const handleHeroSelect = (hero: IHero) => {
    if (currentTargetTeam === 'my') {
      setMyTeamSlot(prev => ({ ...prev, hero }));
    } else {
      setEnemyTeamSlot(prev => ({ ...prev, hero }));
    }
    setModalOpen(false);
  };

  const handleMyTeamRoleChange = (role: HeroRole | null) => {
    setMyTeamSlot(prev => ({
      ...prev,
      role,
      // Clear hero if role is null (remove hero functionality)
      hero: role === null ? null : prev.hero
    }));
  };

  const handleEnemyTeamRoleChange = (role: HeroRole | null) => {
    setEnemyTeamSlot(prev => ({
      ...prev,
      role,
      // Clear hero if role is null (remove hero functionality)
      hero: role === null ? null : prev.hero
    }));
  };

  // Get excluded heroes (already picked)
  const excludedHeroes: IHero[] = [
    ...(myTeamSlot.hero ? [myTeamSlot.hero] : []),
    ...(enemyTeamSlot.hero ? [enemyTeamSlot.hero] : [])
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-textLight mb-8 text-center">
          Team Draft Modal Test Page
        </h1>

        {/* Team Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-textLight mb-4 text-center">
            1. Team Selector
          </h2>
          <TeamSelector value={myTeamSide} onChange={setMyTeamSide} />
        </div>

        {/* Draft Slots */}
        <div className="space-y-8">
          {/* My Team Section */}
          <div>
            <h2 className="text-xl font-semibold text-textLight mb-4 text-center">
              2. My Team Slot ({myTeamSide})
            </h2>
            <div className="flex justify-center">
              <div className="w-48">
                <DraftSlot
                  slot={myTeamSlot}
                  onHeroClick={handleMyTeamSlotClick}
                  onRoleChange={handleMyTeamRoleChange}
                  slotIndex={0}
                  teamType="my"
                />
              </div>
            </div>
          </div>

          {/* Enemy Team Section */}
          <div>
            <h2 className="text-xl font-semibold text-textLight mb-4 text-center">
              3. Enemy Team Slot ({myTeamSide === 'radiant' ? 'dire' : 'radiant'})
            </h2>
            <div className="flex justify-center">
              <div className="w-48">
                <DraftSlot
                  slot={enemyTeamSlot}
                  onHeroClick={handleEnemyTeamSlotClick}
                  onRoleChange={handleEnemyTeamRoleChange}
                  slotIndex={0}
                  teamType="enemy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-textLight mb-4">Instructions:</h3>
          <ul className="text-textSecondary space-y-2 list-disc list-inside">
            <li>Use the Team Selector to switch between Radiant and Dire</li>
            <li>Click on the "+" in either draft slot to open the hero selection modal</li>
            <li>Notice how the modal title changes based on which team slot you clicked</li>
            <li>Select a hero from the modal to assign it to the slot</li>
            <li>For "My Team" slot, you can also select a role</li>
            <li>Hover over a selected hero to see the remove (×) button</li>
            <li>Already selected heroes won't appear in the modal for the other team</li>
          </ul>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-6 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold text-textLight mb-4">Current State:</h3>
          <div className="grid grid-cols-2 gap-4 text-textSecondary">
            <div>
              <p><strong>My Team Side:</strong> {myTeamSide}</p>
              <p><strong>My Team Hero:</strong> {myTeamSlot.hero?.localized_name || 'None'}</p>
              <p><strong>My Team Role:</strong> {myTeamSlot.role || 'None'}</p>
            </div>
            <div>
              <p><strong>Enemy Team Side:</strong> {myTeamSide === 'radiant' ? 'dire' : 'radiant'}</p>
              <p><strong>Enemy Team Hero:</strong> {enemyTeamSlot.hero?.localized_name || 'None'}</p>
              <p><strong>Enemy Team Role:</strong> {enemyTeamSlot.role || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Hero Selection Modal */}
        <HeroSelectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelectHero={handleHeroSelect}
          excludedHeroes={excludedHeroes}
          bannedHeroes={[]}
          heroes={mockHeroes}
          targetTeam={currentTargetTeam}
          myTeamSide={myTeamSide}
        />
      </div>
    </div>
  );
}