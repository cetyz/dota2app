'use client';

import React, { useState } from 'react';
import { IHero, HeroRole } from '@/app/types/hero';
import { TeamSide } from '@/app/types/draft';
import RecommendationCard from './RecommendationCard';

interface RecommendationPanelProps {
  recommendations: IHero[];
  onSelectRecommendation: (hero: IHero) => void;
  onBanRecommendation: (hero: IHero) => void;
  myTeamSide: TeamSide;
  isLoading?: boolean;
  onRefreshRecommendations?: () => void;
}

export default function RecommendationPanel({
  recommendations,
  onSelectRecommendation,
  onBanRecommendation,
  myTeamSide,
  isLoading = false,
  onRefreshRecommendations
}: RecommendationPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefreshRecommendations || isLoading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefreshRecommendations();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Simple role suggestion based on hero roles and team side
  const suggestRoleForHero = (hero: IHero): HeroRole => {
    // Basic logic - can be enhanced with more sophisticated analysis
    if (hero.roles.includes('Carry')) return 'Carry';
    if (hero.roles.includes('Support')) return 'Hard Support';
    if (hero.roles.includes('Nuker') && hero.primary_attr === 'int') return 'Mid';
    if (hero.roles.includes('Initiator')) return 'Offlane';
    if (hero.roles.includes('Disabler')) return 'Support';
    
    // Default fallback
    return 'Support';
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-textSecondary/30 p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-textLight">
            Recommended Heroes
          </h3>
          {onRefreshRecommendations && (
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors duration-200"
              title="Get new recommendations"
            >
              {isLoading || isRefreshing ? '...' : '↻'}
            </button>
          )}
        </div>
        
        {/* Subtitle showing recommendations are for your team */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-textSecondary">
            For your team
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            myTeamSide === 'radiant' 
              ? 'bg-green-400/20 text-green-400' 
              : 'bg-red-400/20 text-red-400'
          }`}>
            {myTeamSide.charAt(0).toUpperCase() + myTeamSide.slice(1)}
          </span>
        </div>
        
        <p className="text-xs text-textSecondary mt-1">
          Auto-updated based on current draft
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recommendations List */}
      {!isLoading && (
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 5).map((hero) => (
              <RecommendationCard
                key={hero.id}
                hero={hero}
                suggestedRole={suggestRoleForHero(hero)}
                onSelect={() => onSelectRecommendation(hero)}
                onBan={() => onBanRecommendation(hero)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-textSecondary text-sm space-y-2">
                <p>No recommendations available</p>
                <p className="text-xs">
                  Select your team side and add some picks to get started
                </p>
              </div>
              {onRefreshRecommendations && (
                <button
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors duration-200"
                >
                  Generate Recommendations
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}