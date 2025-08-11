'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import HeroSearchInput from '../ui/HeroSearchInput';
import HeroGrid from '../ui/HeroGrid';
import { IHero } from '../../types/hero';

interface HeroSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHero: (hero: IHero) => void;
  excludedHeroes: IHero[];
  bannedHeroes: IHero[];
  heroes: IHero[];
  isLoading?: boolean;
}

export default function HeroSelectionModal({
  isOpen,
  onClose,
  onSelectHero,
  excludedHeroes,
  bannedHeroes,
  heroes,
  isLoading = false
}: HeroSelectionModalProps) {
  const [searchValue, setSearchValue] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Filter heroes based on search, excluded heroes, and banned heroes
  const filteredHeroes = useMemo(() => {
    let filtered = heroes;

    // Filter by search query
    if (searchValue.trim()) {
      filtered = filtered.filter(hero =>
        hero.localized_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        hero.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Remove excluded heroes (already picked)
    filtered = filtered.filter(hero =>
      !excludedHeroes.some(excluded => excluded.id === hero.id)
    );

    return filtered;
  }, [heroes, searchValue, excludedHeroes]);

  // Handle hero selection
  const handleHeroSelect = (hero: IHero) => {
    // Don't allow selection of banned heroes
    if (bannedHeroes.some(banned => banned.id === hero.id)) {
      return;
    }
    onSelectHero(hero);
    onClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Focus trap - focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          bg-background 
          border 
          border-gray-700 
          rounded-lg 
          w-full 
          max-w-4xl 
          max-h-[90vh] 
          overflow-hidden
          transform
          transition-all
          duration-200
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        style={{ outline: 'none' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-textLight">
            Select Hero
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 
              text-textSecondary 
              hover:text-textLight 
              hover:bg-gray-700 
              rounded-lg 
              transition-colors 
              duration-200
            "
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-textSecondary border-t-accentPrimary mx-auto mb-4" />
                <p className="text-textSecondary">Loading heroes...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search Input */}
              <HeroSearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search heroes..."
                isLoading={false}
              />

              {/* Hero Grid */}
              <HeroGrid
                heroes={filteredHeroes}
                onHeroSelect={handleHeroSelect}
                selectedHeroes={[]}
                bannedHeroes={bannedHeroes}
              />

              {filteredHeroes.length === 0 && (
                <div className="text-center text-textSecondary py-8">
                  No heroes match your search criteria
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}