'use client';

import { TeamSide } from '@/app/types/draft';

interface TeamSelectorProps {
  value: TeamSide;
  onChange: (teamSide: TeamSide) => void;
}

export default function TeamSelector({ value, onChange }: TeamSelectorProps) {
  return (
    <div 
      className="flex bg-gray-800 rounded-lg p-1 gap-1 w-fit mx-auto"
      role="radiogroup"
      aria-label="Select your team side"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'radiant'}
        onClick={() => onChange('radiant')}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out
          ${value === 'radiant' 
            ? 'bg-green-600 text-white shadow-lg transform scale-[1.02]' 
            : 'text-gray-300 hover:bg-green-600/20 hover:text-green-400 hover:scale-[1.01]'
          }
        `}
      >
        <div className="w-5 h-5 rounded-full bg-green-500 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 bg-green-200 rounded-full"></div>
        </div>
        Radiant
      </button>
      
      <button
        type="button"
        role="radio"
        aria-checked={value === 'dire'}
        onClick={() => onChange('dire')}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out
          ${value === 'dire' 
            ? 'bg-red-600 text-white shadow-lg transform scale-[1.02]' 
            : 'text-gray-300 hover:bg-red-600/20 hover:text-red-400 hover:scale-[1.01]'
          }
        `}
      >
        <div className="w-5 h-5 rounded-full bg-red-500 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 bg-red-200 rounded-full"></div>
        </div>
        Dire
      </button>
    </div>
  );
}