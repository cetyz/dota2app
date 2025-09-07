'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { IDraftState, IDraftSlot, TeamSide, IRecommendationContext } from '../types/draft';
import { IHero, HeroRole } from '../types/hero';

interface DraftContextType {
  draftState: IDraftState;
  setMyTeamSide: (side: TeamSide) => void;
  updateMyTeamSlot: (slotIndex: number, slot: IDraftSlot) => void;
  updateEnemyTeamSlot: (slotIndex: number, slot: IDraftSlot) => void;
  addHeroToMyTeam: (hero: IHero, slotIndex?: number) => void;
  addHeroToEnemyTeam: (hero: IHero, slotIndex?: number) => void;
  removeHeroFromMyTeam: (slotIndex: number) => void;
  removeHeroFromEnemyTeam: (slotIndex: number) => void;
  updateRole: (team: 'my' | 'enemy', slotIndex: number, role: HeroRole) => void;
  banHero: (hero: IHero) => void;
  unbanHero: (heroId: number) => void;
  isBanned: (heroId: number) => boolean;
  clearBans: () => void;
  clearDraft: () => void;
  swapSlots: (team: 'my' | 'enemy', fromIndex: number, toIndex: number) => void;
  getAllPickedHeroes: () => IHero[];
  getRecommendationContext: () => IRecommendationContext;
  updateRecommendations: (recommendations: IHero[]) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

interface DraftProviderProps {
  children: ReactNode;
}

const createEmptySlot = (): IDraftSlot => ({
  hero: null,
  role: null,
  position: null
});

const createInitialDraftState = (): IDraftState => ({
  myTeam: Array(5).fill(null).map(() => createEmptySlot()),
  enemyTeam: Array(5).fill(null).map(() => createEmptySlot()),
  myTeamSide: 'radiant',
  recommendations: [],
  bannedHeroes: []
});

export function DraftProvider({ children }: DraftProviderProps) {
  const [draftState, setDraftState] = useState<IDraftState>(createInitialDraftState);

  const setMyTeamSide = useCallback((side: TeamSide) => {
    setDraftState(prev => ({
      ...prev,
      myTeamSide: side
    }));
  }, []);

  const updateMyTeamSlot = useCallback((slotIndex: number, slot: IDraftSlot) => {
    setDraftState(prev => ({
      ...prev,
      myTeam: prev.myTeam.map((s, i) => i === slotIndex ? slot : s)
    }));
  }, []);

  const updateEnemyTeamSlot = useCallback((slotIndex: number, slot: IDraftSlot) => {
    setDraftState(prev => ({
      ...prev,
      enemyTeam: prev.enemyTeam.map((s, i) => i === slotIndex ? slot : s)
    }));
  }, []);

  const addHeroToMyTeam = useCallback((hero: IHero, slotIndex?: number) => {
    setDraftState(prev => {
      const targetIndex = slotIndex ?? prev.myTeam.findIndex(slot => !slot.hero);
      if (targetIndex === -1) return prev;

      return {
        ...prev,
        myTeam: prev.myTeam.map((slot, i) => 
          i === targetIndex ? { ...slot, hero } : slot
        )
      };
    });
  }, []);

  const addHeroToEnemyTeam = useCallback((hero: IHero, slotIndex?: number) => {
    setDraftState(prev => {
      const targetIndex = slotIndex ?? prev.enemyTeam.findIndex(slot => !slot.hero);
      if (targetIndex === -1) return prev;

      return {
        ...prev,
        enemyTeam: prev.enemyTeam.map((slot, i) => 
          i === targetIndex ? { ...slot, hero } : slot
        )
      };
    });
  }, []);

  const removeHeroFromMyTeam = useCallback((slotIndex: number) => {
    setDraftState(prev => ({
      ...prev,
      myTeam: prev.myTeam.map((slot, i) => 
        i === slotIndex ? createEmptySlot() : slot
      )
    }));
  }, []);

  const removeHeroFromEnemyTeam = useCallback((slotIndex: number) => {
    setDraftState(prev => ({
      ...prev,
      enemyTeam: prev.enemyTeam.map((slot, i) => 
        i === slotIndex ? createEmptySlot() : slot
      )
    }));
  }, []);

  const updateRole = useCallback((team: 'my' | 'enemy', slotIndex: number, role: HeroRole) => {
    if (team === 'my') {
      setDraftState(prev => ({
        ...prev,
        myTeam: prev.myTeam.map((slot, i) => 
          i === slotIndex ? { ...slot, role } : slot
        )
      }));
    } else {
      setDraftState(prev => ({
        ...prev,
        enemyTeam: prev.enemyTeam.map((slot, i) => 
          i === slotIndex ? { ...slot, role } : slot
        )
      }));
    }
  }, []);

  const banHero = useCallback((hero: IHero) => {
    setDraftState(prev => {
      if (prev.bannedHeroes.some(banned => banned.id === hero.id)) {
        return prev;
      }
      return {
        ...prev,
        bannedHeroes: [...prev.bannedHeroes, hero]
      };
    });
  }, []);

  const unbanHero = useCallback((heroId: number) => {
    setDraftState(prev => ({
      ...prev,
      bannedHeroes: prev.bannedHeroes.filter(hero => hero.id !== heroId)
    }));
  }, []);

  const isBanned = useCallback((heroId: number) => {
    return draftState.bannedHeroes.some(hero => hero.id === heroId);
  }, [draftState.bannedHeroes]);

  const clearBans = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      bannedHeroes: []
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      myTeam: Array(5).fill(null).map(() => createEmptySlot()),
      enemyTeam: Array(5).fill(null).map(() => createEmptySlot()),
      bannedHeroes: []
    }));
  }, []);

  const swapSlots = useCallback((team: 'my' | 'enemy', fromIndex: number, toIndex: number) => {
    if (team === 'my') {
      setDraftState(prev => {
        const newMyTeam = [...prev.myTeam];
        [newMyTeam[fromIndex], newMyTeam[toIndex]] = [newMyTeam[toIndex], newMyTeam[fromIndex]];
        return {
          ...prev,
          myTeam: newMyTeam
        };
      });
    } else {
      setDraftState(prev => {
        const newEnemyTeam = [...prev.enemyTeam];
        [newEnemyTeam[fromIndex], newEnemyTeam[toIndex]] = [newEnemyTeam[toIndex], newEnemyTeam[fromIndex]];
        return {
          ...prev,
          enemyTeam: newEnemyTeam
        };
      });
    }
  }, []);

  const getAllPickedHeroes = useCallback((): IHero[] => {
    const myTeamHeroes = draftState.myTeam.map(slot => slot.hero).filter(Boolean) as IHero[];
    const enemyTeamHeroes = draftState.enemyTeam.map(slot => slot.hero).filter(Boolean) as IHero[];
    return [...myTeamHeroes, ...enemyTeamHeroes];
  }, [draftState.myTeam, draftState.enemyTeam]);

  const getRecommendationContext = useCallback((): IRecommendationContext => {
    const myTeamPicks = draftState.myTeam.map(slot => slot.hero).filter(Boolean) as IHero[];
    const enemyTeamPicks = draftState.enemyTeam.map(slot => slot.hero).filter(Boolean) as IHero[];
    
    return {
      myTeamSide: draftState.myTeamSide,
      myTeamPicks,
      enemyTeamPicks,
      bannedHeroes: draftState.bannedHeroes
    };
  }, [draftState.myTeamSide, draftState.myTeam, draftState.enemyTeam, draftState.bannedHeroes]);

  const updateRecommendations = useCallback((recommendations: IHero[]) => {
    setDraftState(prev => ({
      ...prev,
      recommendations
    }));
  }, []);

  const value: DraftContextType = {
    draftState,
    setMyTeamSide,
    updateMyTeamSlot,
    updateEnemyTeamSlot,
    addHeroToMyTeam,
    addHeroToEnemyTeam,
    removeHeroFromMyTeam,
    removeHeroFromEnemyTeam,
    updateRole,
    banHero,
    unbanHero,
    isBanned,
    clearBans,
    clearDraft,
    swapSlots,
    getAllPickedHeroes,
    getRecommendationContext,
    updateRecommendations
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
}