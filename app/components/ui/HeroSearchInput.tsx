'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeroSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function HeroSearchInput({
  value,
  onChange,
  placeholder = "Search heroes...",
  isLoading = false
}: HeroSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedOnChange = useCallback((newValue: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-textSecondary border-t-accentPrimary" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-textSecondary" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full 
            pl-10 
            pr-10 
            py-3 
            bg-gray-800 
            border 
            border-gray-700 
            rounded-lg 
            text-textLight 
            placeholder-textSecondary 
            focus:outline-none 
            focus:border-accentPrimary 
            focus:ring-1 
            focus:ring-accentPrimary 
            transition-colors 
            duration-200
          "
          aria-label="Search heroes"
        />
        
        {localValue && (
          <button
            onClick={handleClear}
            className="
              absolute 
              inset-y-0 
              right-0 
              pr-3 
              flex 
              items-center 
              text-textSecondary 
              hover:text-textLight 
              focus:outline-none 
              focus:text-accentPrimary 
              transition-colors 
              duration-200
            "
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}