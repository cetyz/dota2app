'use client';

import React from 'react';
import { IDraftSlot, TeamSide } from '@/app/types/draft';
import { HeroRole } from '@/app/types/hero';
import DraftSlot from './DraftSlot';

interface TeamDraftSectionProps {
  teamLabel: 'My Team' | 'Enemy Team';
  slots: IDraftSlot[];
  onSlotUpdate: (slotIndex: number, updates: Partial<IDraftSlot>) => void;
  teamSide: TeamSide | null;
  onHeroClick: (slotIndex: number) => void;
}

export default function TeamDraftSection({
  teamLabel,
  slots,
  onSlotUpdate,
  teamSide,
  onHeroClick
}: TeamDraftSectionProps) {

  // Handle role change for a specific slot
  const handleRoleChange = (slotIndex: number, role: HeroRole | null) => {
    onSlotUpdate(slotIndex, { role });
  };

  // Handle hero click for a specific slot
  const handleHeroClick = (slotIndex: number) => {
    onHeroClick(slotIndex);
  };

  // Determine team type for DraftSlot component
  const teamType: 'my' | 'enemy' = teamLabel === 'My Team' ? 'my' : 'enemy';

  // Team colors based on side
  const getTeamColors = () => {
    if (teamLabel === 'My Team' && teamSide) {
      return teamSide === 'radiant' 
        ? 'border-green-500/30 bg-green-500/5' 
        : 'border-red-500/30 bg-red-500/5';
    }
    // Enemy team gets opposite colors
    if (teamLabel === 'Enemy Team' && teamSide) {
      return teamSide === 'radiant' 
        ? 'border-red-500/30 bg-red-500/5' 
        : 'border-green-500/30 bg-green-500/5';
    }
    return 'border-textSecondary/30 bg-textSecondary/5';
  };

  return (
    <div className={`
      p-6 rounded-lg border-2 transition-all duration-500 animate-slide-in-up
      ${getTeamColors()} 
      hover:shadow-lg hover:shadow-black/20
    `}>
      {/* Team Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-textLight mb-1">
          {teamLabel}
        </h2>
        {teamLabel === 'My Team' && teamSide && (
          <p className="text-textSecondary text-sm">
            Playing as {teamSide.charAt(0).toUpperCase() + teamSide.slice(1)}
          </p>
        )}
      </div>

      {/* Draft Slots - Horizontal layout with responsive stacking */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
        {slots.map((slot, index) => (
          <div
            key={`slot-${index}`}
            className="animate-slide-in-up group"
            style={{ 
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className={`
              transform transition-all duration-300 ease-out
              ${slot.hero 
                ? 'animate-hero-added hover:scale-105' 
                : 'hover:scale-105'
              }
            `}>
              <DraftSlot
                slot={slot}
                onHeroClick={() => handleHeroClick(index)}
                onRoleChange={(role) => handleRoleChange(index, role)}
                slotIndex={index}
                teamType={teamType}
              />
              
              {/* Position label */}
              <div className="text-center mt-2 transition-all duration-300">
                <span className="text-xs text-textSecondary font-medium group-hover:text-textLight">
                  Position {index + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team composition summary */}
      <div className="mt-4 text-center transition-all duration-300">
        <p className={`
          text-xs transition-colors duration-300
          ${slots.filter(slot => slot.hero).length > 0 
            ? 'text-textLight font-medium' 
            : 'text-textSecondary'
          }
        `}>
          {slots.filter(slot => slot.hero).length}/5 heroes selected
          {slots.filter(slot => slot.hero).length === 5 && (
            <span className="ml-2 text-green-400 animate-pulse">✓ Complete</span>
          )}
        </p>
      </div>
    </div>
  );
}