'use client';

import Image from 'next/image';
import { IHero } from '../../types/hero';

export interface HeroPortraitProps {
  hero: IHero | null;
  onClick?: (hero: IHero) => void;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function HeroPortrait({
  hero,
  onClick,
  isSelected = false,
  size = 'medium',
  disabled = false
}: HeroPortraitProps) {
  // Dota 2 hero portraits are typically 16:9 aspect ratio (256x144px original)
  const sizeConfig = {
    small: { class: 'w-12 h-7', width: 48, height: 27 },
    medium: { class: 'w-16 h-9', width: 64, height: 36 },
    large: { class: 'w-24 h-14', width: 96, height: 54 }
  };

  const currentSize = sizeConfig[size];

  const handleClick = () => {
    if (hero && onClick && !disabled) {
      onClick(hero);
    }
  };

  if (!hero) {
    return (
      <div 
        className={`
          ${currentSize.class}
          bg-gray-800 border-2 border-gray-600 rounded-lg 
          flex items-center justify-center
          cursor-pointer hover:bg-gray-700 transition-colors
          flex-shrink-0
        `}
        onClick={handleClick}
      >
        <span className="text-gray-400 text-2xl">+</span>
      </div>
    );
  }

  return (
    <div
      className={`
        ${currentSize.class}
        relative rounded-lg overflow-hidden cursor-pointer
        border-2 transition-all duration-300 ease-out
        flex-shrink-0
        ${isSelected 
          ? 'border-accentPrimary shadow-lg shadow-accentPrimary/50' 
          : 'border-gray-600'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-110 hover:border-textLight hover:shadow-xl hover:shadow-black/50 hover:z-10 transform-gpu'
        }
        group
      `}
      onClick={handleClick}
      title={hero.localized_name}
    >
      <Image
        src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png`}
        alt={hero.localized_name}
        width={currentSize.width}
        height={currentSize.height}
        className="w-full h-full object-cover rounded-lg"
        sizes={`${currentSize.width}px`}
      />
      
      {disabled && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
          <span className="text-red-500 text-lg font-bold">✕</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate rounded-b-lg">
        {hero.localized_name}
      </div>
    </div>
  );
}