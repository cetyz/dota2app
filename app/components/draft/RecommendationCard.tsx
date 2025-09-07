'use client';

import React, { useState } from 'react';
import { IHero, HeroRole } from '@/app/types/hero';

interface RecommendationCardProps {
  hero: IHero;
  suggestedRole: HeroRole;
  onSelect: () => void;
  onBan: () => void;
}

export default function RecommendationCard({
  hero,
  suggestedRole,
  onSelect,
  onBan
}: RecommendationCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleBan = async () => {
    setIsRemoving(true);
    // Small delay for visual feedback
    setTimeout(() => {
      onBan();
    }, 200);
  };

  const handleSelect = () => {
    if (isRemoving) return;
    onSelect();
  };

  return (
    <div
      className={`flex items-center justify-between p-3 bg-gray-800/50 rounded-lg transition-all duration-200 ${
        isRemoving 
          ? 'opacity-50 scale-95 pointer-events-none' 
          : 'hover:bg-gray-800 cursor-pointer'
      }`}
    >
      {/* Hero Info - Clickable for selection */}
      <div 
        className="flex items-center space-x-3 flex-1 min-w-0"
        onClick={handleSelect}
      >
        {/* Hero Portrait Placeholder */}
        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 hover:bg-gray-600 transition-colors duration-200">
          <span className="text-xs text-textLight font-medium">
            {hero.localized_name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        
        {/* Hero Details */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-textLight truncate">
            {hero.localized_name}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-textSecondary">
              {suggestedRole}
            </p>
            {/* Primary Attribute indicator */}
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              hero.primary_attr === 'str' ? 'bg-red-500/20 text-red-400' :
              hero.primary_attr === 'agi' ? 'bg-green-500/20 text-green-400' :
              hero.primary_attr === 'int' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {hero.primary_attr.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-2 ml-3">
        {/* Select Button */}
        <button
          onClick={handleSelect}
          disabled={isRemoving}
          className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-1 rounded transition-colors duration-200 text-sm font-bold disabled:opacity-50"
          title="Select hero for your team"
        >
          +
        </button>
        
        {/* Ban Button - positioned in top-right corner of card */}
        <button
          onClick={handleBan}
          disabled={isRemoving}
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 rounded transition-colors duration-200 text-sm font-bold disabled:opacity-50"
          title="Mark as banned"
        >
          ×
        </button>
      </div>
    </div>
  );
}