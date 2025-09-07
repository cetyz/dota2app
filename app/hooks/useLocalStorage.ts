import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to the localStorage key from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Specific hook for team side persistence
export function useTeamSidePersistence() {
  return useLocalStorage<'radiant' | 'dire' | null>('dota2-draft-team-side', null);
}

// Specialized hooks for draft data
export function useDraftAutoSave() {
  const [savedDrafts, setSavedDrafts, clearSavedDrafts] = useLocalStorage<any[]>('dota2-draft-history', []);
  const [currentDraft, setCurrentDraft, clearCurrentDraft] = useLocalStorage<any | null>('dota2-current-draft', null);
  const [preferredTeamSide, setPreferredTeamSide] = useLocalStorage<'radiant' | 'dire'>('dota2-preferred-team-side', 'radiant');
  const [persistentBans, setPersistentBans] = useLocalStorage<any[]>('dota2-persistent-bans', []);

  const saveDraft = useCallback((draft: any, debounceMs: number = 1000) => {
    // Debounced save to prevent excessive writes
    const timeoutId = setTimeout(() => {
      setCurrentDraft(draft);
      
      // Add to draft history (keep max 5 drafts)
      setSavedDrafts(prev => {
        const newHistory = [draft, ...prev.filter((_, i) => i < 4)];
        return newHistory;
      });
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [setCurrentDraft, setSavedDrafts]);

  const loadSavedDraft = useCallback((index: number = 0) => {
    if (index === 0 && currentDraft) {
      return currentDraft;
    }
    return savedDrafts[index] || null;
  }, [currentDraft, savedDrafts]);

  const deleteSavedDraft = useCallback((index: number) => {
    setSavedDrafts(prev => prev.filter((_, i) => i !== index));
  }, [setSavedDrafts]);

  const carryOverBans = useCallback(() => {
    return persistentBans;
  }, [persistentBans]);

  const updatePersistentBans = useCallback((bans: any[]) => {
    setPersistentBans(bans);
  }, [setPersistentBans]);

  return {
    savedDrafts,
    currentDraft,
    preferredTeamSide,
    persistentBans,
    saveDraft,
    loadSavedDraft,
    deleteSavedDraft,
    clearSavedDrafts,
    clearCurrentDraft,
    setPreferredTeamSide,
    carryOverBans,
    updatePersistentBans
  };
}