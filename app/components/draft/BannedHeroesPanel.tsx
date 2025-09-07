'use client';

import React from 'react';
import { IHero } from '@/app/types/hero';

interface BannedHeroesPanelProps {
  bannedHeroes: IHero[];
  onUnbanHero: (hero: IHero) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function BannedHeroesPanel({
  bannedHeroes,
  onUnbanHero,
  isCollapsed,
  onToggleCollapse
}: BannedHeroesPanelProps) {
  const handleClearAllBans = () => {
    bannedHeroes.forEach(hero => onUnbanHero(hero));
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-red-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleCollapse}
          className="flex items-center space-x-2 text-lg font-bold text-textLight hover:text-red-400 transition-colors duration-200"
        >
          <span>Banned Heroes ({bannedHeroes.length})</span>
          <span className={`transform transition-transform duration-200 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}>
            ▼
          </span>
        </button>
        {bannedHeroes.length > 0 && (
          <button
            onClick={handleClearAllBans}
            className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Clear All Bans
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-64 opacity-100'
        } overflow-hidden`}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bannedHeroes.length > 0 ? (
              <div className="space-y-2">
                {bannedHeroes.map((hero) => (
                  <div
                    key={hero.id}
                    className="flex items-center justify-between p-2 bg-red-900/20 rounded border border-red-500/30 hover:bg-red-900/30 transition-colors duration-200"
                    title={hero.localized_name}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {hero.localized_name.slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm text-textLight">
                        {hero.localized_name}
                      </span>
                    </div>
                    <button
                      onClick={() => onUnbanHero(hero)}
                      className="text-red-400 hover:text-red-300 text-sm hover:bg-red-700/20 rounded p-1 transition-all duration-200"
                      title="Remove ban"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-textSecondary text-sm">
                  No heroes banned
                </p>
                <p className="text-textSecondary text-xs mt-1">
                  Use the × button on recommendations to ban heroes
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}