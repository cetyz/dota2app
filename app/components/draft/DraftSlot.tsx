'use client';

import React from 'react';
import { IDraftSlot, TeamSide } from '@/app/types/draft';
import { HeroRole } from '@/app/types/hero';
import HeroPortrait from '@/app/components/ui/HeroPortrait';
import RoleSelector from '@/app/components/ui/RoleSelector';

interface DraftSlotProps {
  slot: IDraftSlot;
  onHeroClick: () => void;
  onRoleChange: (role: HeroRole | null) => void;
  slotIndex: number;
  team: TeamSide;
  isActive?: boolean;
}

export default function DraftSlot({
  slot,
  onHeroClick,
  onRoleChange,
  slotIndex,
  team,
  isActive = false
}: DraftSlotProps) {
  const [showEditOptions, setShowEditOptions] = React.useState(false);

  const teamColorClasses = {
    radiant: {
      border: 'border-textSecondary/60',
      background: 'bg-textSecondary/10',
      activeBorder: 'border-accentPrimary',
      indicator: 'bg-accentPrimary'
    },
    dire: {
      border: 'border-textSecondary/60', 
      background: 'bg-textSecondary/10',
      activeBorder: 'border-accentPrimary',
      indicator: 'bg-accentPrimary'
    }
  };

  const colorScheme = teamColorClasses[team];

  const handleRemoveHero = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear both hero and role when removing
    onRoleChange(null);
    // In a real implementation, we'd need an onHeroChange callback too
    // For now, the parent should handle hero clearing when role is set to null
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${colorScheme.background}
        ${isActive && !slot.hero ? colorScheme.activeBorder : colorScheme.border}
        ${isActive && !slot.hero ? 'shadow-lg shadow-textSecondary/50' : 'hover:shadow-xl hover:shadow-textSecondary/40'}
        hover:brightness-110 hover:border-textSecondary
        group
      `}
      onMouseEnter={() => setShowEditOptions(true)}
      onMouseLeave={() => setShowEditOptions(false)}
    >

      {/* Remove hero button (X icon) on hover */}
      {slot.hero && showEditOptions && (
        <button
          onClick={handleRemoveHero}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md transition-colors z-20"
          title="Remove hero"
        >
          ×
        </button>
      )}


      <div className="flex flex-col items-center space-y-3">
        {/* Hero Portrait */}
        <div onClick={onHeroClick} className="cursor-pointer">
          {slot.hero ? (
            <HeroPortrait 
              hero={slot.hero} 
              size="large"
              isSelected={false}
            />
          ) : (
            <div className="w-24 h-14 bg-gray-800 border-2 border-gray-600 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-gray-500 transition-colors">
              <span className="text-gray-400 text-3xl">+</span>
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="w-full">
          <RoleSelector
            value={slot.role}
            onChange={onRoleChange}
            disabled={false}
          />
        </div>

        {/* Hero name if selected */}
        {slot.hero && (
          <div className="text-center">
            <p className="text-textLight text-sm font-medium truncate max-w-full">
              {slot.hero.localized_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}