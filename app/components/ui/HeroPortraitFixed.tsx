'use client';

import Image from 'next/image';
import { IHero } from '../../types/hero';
import { useState } from 'react';

export interface HeroPortraitProps {
  hero: IHero | null;
  onClick?: (hero: IHero) => void;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function HeroPortraitFixed({
  hero,
  onClick,
  isSelected = false,
  size = 'medium',
  disabled = false
}: HeroPortraitProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeConfig = {
    small: { width: 48, height: 27 },
    medium: { width: 64, height: 36 },
    large: { width: 96, height: 54 }
  };

  const currentSize = sizeConfig[size];

  const handleClick = () => {
    if (hero && onClick && !disabled) {
      onClick(hero);
    } else if (!hero && onClick) {
      console.log('Empty slot clicked');
    }
  };

  const baseStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: isSelected ? '2px solid #ad3f21' : '2px solid #666',
    transition: 'all 0.3s ease',
    transform: !disabled && isHovered ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isSelected 
      ? '0 10px 25px rgba(173, 63, 33, 0.5)' 
      : isHovered && !disabled 
        ? '0 10px 25px rgba(0, 0, 0, 0.5)' 
        : 'none',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0
  };

  const emptyStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    fontSize: '24px'
  };

  if (!hero) {
    return (
      <div
        style={emptyStyle}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        +
      </div>
    );
  }

  return (
    <div
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={hero.localized_name}
    >
      <Image
        src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png`}
        alt={hero.localized_name}
        width={currentSize.width}
        height={currentSize.height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '6px'
        }}
      />
      
      {disabled && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px'
        }}>
          <span style={{ color: '#EF4444', fontSize: '18px', fontWeight: 'bold' }}>✕</span>
        </div>
      )}

      {isHovered && !disabled && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: 'white',
          fontSize: '12px',
          padding: '4px',
          textAlign: 'center',
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px'
        }}>
          {hero.localized_name}
        </div>
      )}
    </div>
  );
}