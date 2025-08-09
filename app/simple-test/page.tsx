'use client';

import { useState } from 'react';

// Simple test component without external dependencies
function SimpleHeroPortrait({ hero, onClick, isSelected = false, disabled = false }: any) {
  return (
    <div
      className="w-16 h-9 bg-blue-500 border-2 border-gray-600 rounded cursor-pointer hover:bg-blue-400 hover:border-white hover:scale-110 transition-all duration-300"
      onClick={() => {
        console.log('SimpleHeroPortrait clicked!', hero || 'empty');
        if (onClick) onClick(hero);
      }}
      style={{
        backgroundColor: isSelected ? 'orange' : disabled ? 'gray' : 'blue',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-white text-xs">
        {hero ? hero.name : '+'}
      </div>
    </div>
  );
}

export default function SimpleTestPage() {
  const [selected, setSelected] = useState<string | null>(null);
  
  const testHero = { name: 'Pudge', id: 1 };

  const handleClick = (hero: any) => {
    console.log('Handler called with:', hero);
    setSelected(hero?.name || 'empty');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8">Simple Click Test</h1>
      
      <div className="space-y-4">
        <p>Selected: {selected || 'none'}</p>
        
        <div className="flex gap-4">
          <div>
            <p className="mb-2">Empty (click for console log):</p>
            <SimpleHeroPortrait 
              hero={null} 
              onClick={handleClick}
            />
          </div>
          
          <div>
            <p className="mb-2">With Hero:</p>
            <SimpleHeroPortrait 
              hero={testHero} 
              onClick={handleClick}
              isSelected={selected === 'Pudge'}
            />
          </div>
          
          <div>
            <p className="mb-2">Disabled:</p>
            <SimpleHeroPortrait 
              hero={testHero} 
              onClick={handleClick}
              disabled={true}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg mb-4">Manual Tests:</h2>
          <button 
            className="bg-green-500 px-4 py-2 rounded mr-4 hover:bg-green-400"
            onClick={() => console.log('Manual button clicked!')}
          >
            Test Console Log
          </button>
          
          <button 
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
            onClick={() => alert('Alert test!')}
          >
            Test Alert
          </button>
        </div>
      </div>
    </div>
  );
}