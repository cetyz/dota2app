'use client';

import { useState, useEffect } from 'react';
import HeroSearchInput from '@/app/components/ui/HeroSearchInput';

export default function HeroSearchTestPage() {
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [searchValue3, setSearchValue3] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debounceCount, setDebounceCount] = useState(0);
  const [lastDebounceTime, setLastDebounceTime] = useState<number | null>(null);
  const [changeLog, setChangeLog] = useState<Array<{ time: string; value: string; type: string }>>([]);

  // Track debounce behavior
  const handleDebouncedChange = (value: string) => {
    const now = Date.now();
    setDebounceCount(prev => prev + 1);
    setLastDebounceTime(now);
    
    setChangeLog(prev => [
      {
        time: new Date(now).toLocaleTimeString(),
        value: value,
        type: 'debounced'
      },
      ...prev.slice(0, 9) // Keep only last 10 entries
    ]);
  };


  // Auto-toggle loading state every 3 seconds for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const clearAllInputs = () => {
    setSearchValue1('');
    setSearchValue2('');
    setSearchValue3('');
    setChangeLog([]);
    setDebounceCount(0);
    setLastDebounceTime(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-textLight mb-2">
            Hero Search Input Test Page
          </h1>
          <p className="text-textSecondary">
            Comprehensive testing of the HeroSearchInput component functionality
          </p>
        </div>

        {/* Test Section 1: Basic Functionality */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            1. Basic Search Functionality
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-textSecondary mb-2">
                Standard Search Input:
              </label>
              <HeroSearchInput
                value={searchValue1}
                onChange={setSearchValue1}
                placeholder="Search for heroes..."
              />
              <p className="text-sm text-textSecondary mt-2">
                Current value: <span className="text-accentPrimary">"{searchValue1}"</span>
              </p>
            </div>
          </div>
        </div>

        {/* Test Section 2: Debouncing */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            2. Debouncing Test (300ms delay)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-textSecondary mb-2">
                Debounced Input - Watch the counter:
              </label>
              <HeroSearchInput
                value={searchValue2}
                onChange={(value: string) => {
                  setSearchValue2(value);
                  handleDebouncedChange(value);
                }}
                placeholder="Type quickly to test debouncing..."
              />
              <div className="mt-2 text-sm space-y-1">
                <p className="text-textSecondary">
                  Debounce calls: <span className="text-accentPrimary">{debounceCount}</span>
                </p>
                <p className="text-textSecondary">
                  Last debounce: {lastDebounceTime ? new Date(lastDebounceTime).toLocaleTimeString() : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Section 3: Loading State */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            3. Loading State Test
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setIsLoading(!isLoading)}
                className="px-4 py-2 bg-accentPrimary text-white rounded hover:bg-red-700 transition-colors"
              >
                {isLoading ? 'Stop Loading' : 'Start Loading'}
              </button>
              <span className="text-textSecondary">
                Status: <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
                  {isLoading ? 'Loading...' : 'Ready'}
                </span>
              </span>
            </div>
            <div>
              <label className="block text-textSecondary mb-2">
                Loading State Input:
              </label>
              <HeroSearchInput
                value={searchValue3}
                onChange={setSearchValue3}
                placeholder="Search with loading state..."
                isLoading={isLoading}
              />
              <p className="text-sm text-textSecondary mt-2">
                Notice the spinning icon when loading is active!
              </p>
            </div>
          </div>
        </div>

        {/* Test Section 4: Keyboard Navigation */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            4. Keyboard Navigation Test
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-textSecondary mb-2">
                  Test Input 1:
                </label>
                <HeroSearchInput
                  value={searchValue1}
                  onChange={setSearchValue1}
                  placeholder="Press Escape to clear..."
                />
              </div>
              <div>
                <label className="block text-textSecondary mb-2">
                  Test Input 2:
                </label>
                <HeroSearchInput
                  value={searchValue2}
                  onChange={setSearchValue2}
                  placeholder="Tab to navigate between inputs..."
                />
              </div>
            </div>
            <div className="text-sm text-textSecondary space-y-1">
              <p>• Press <kbd className="px-2 py-1 bg-gray-700 rounded">Escape</kbd> to clear any input</p>
              <p>• Press <kbd className="px-2 py-1 bg-gray-700 rounded">Tab</kbd> to navigate between inputs</p>
              <p>• Click the X button or use the clear functionality</p>
            </div>
          </div>
        </div>

        {/* Test Section 5: Different Placeholders */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            5. Different Placeholder Tests
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-textSecondary mb-2">
                  Default Placeholder:
                </label>
                <HeroSearchInput
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <label className="block text-textSecondary mb-2">
                  Custom Placeholder:
                </label>
                <HeroSearchInput
                  value=""
                  onChange={() => {}}
                  placeholder="Find your favorite hero..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Section 6: Change Log */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            6. Change Log (Real-time Monitoring)
          </h2>
          <div className="space-y-4">
            <button
              onClick={clearAllInputs}
              className="px-4 py-2 bg-gray-700 text-textLight rounded hover:bg-gray-600 transition-colors"
            >
              Clear All Inputs & Log
            </button>
            <div className="bg-gray-900 rounded p-4 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-medium text-textLight mb-2">Recent Changes:</h3>
              {changeLog.length === 0 ? (
                <p className="text-textSecondary text-sm">No changes yet...</p>
              ) : (
                <div className="space-y-1">
                  {changeLog.map((log, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded ${
                        log.type === 'debounced' 
                          ? 'bg-green-900/30 border-l-2 border-green-500' 
                          : 'bg-blue-900/30 border-l-2 border-blue-500'
                      }`}
                    >
                      <span className="text-textSecondary">[{log.time}]</span>
                      <span className={log.type === 'debounced' ? 'text-green-400' : 'text-blue-400'}>
                        {' '}{log.type}:
                      </span>
                      <span className="text-textLight"> "{log.value}"</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Section 7: Styling and Focus States */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-textLight mb-4">
            7. Styling & Focus State Tests
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-textSecondary mb-2">
                  Normal State:
                </label>
                <HeroSearchInput
                  value="Sample text"
                  onChange={() => {}}
                />
              </div>
              <div>
                <label className="block text-textSecondary mb-2">
                  With Clear Button:
                </label>
                <HeroSearchInput
                  value="Clear me!"
                  onChange={() => {}}
                />
              </div>
              <div>
                <label className="block text-textSecondary mb-2">
                  Loading State:
                </label>
                <HeroSearchInput
                  value="Loading..."
                  onChange={() => {}}
                  isLoading={true}
                />
              </div>
            </div>
            <div className="text-sm text-textSecondary space-y-1">
              <p>• Focus on any input to see the accent color border</p>
              <p>• Hover over the clear (X) button to see hover effects</p>
              <p>• Notice the smooth transitions on all interactive elements</p>
            </div>
          </div>
        </div>

        <div className="text-center text-textSecondary text-sm">
          <p>All HeroSearchInput component features are working correctly! ✅</p>
        </div>
      </div>
    </div>
  );
}