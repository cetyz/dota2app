import { useState, useEffect, useCallback, useRef } from 'react';
import { IHero } from '@/app/types/hero';
import { TeamSide } from '@/app/types/draft';
import { fetchAllHeroes } from '@/app/lib/api/opendota';

interface UseInitialRecommendationsProps {
  myTeamSide: TeamSide | null;
  myTeamPicks: IHero[];
  enemyTeamPicks: IHero[];
  bannedHeroes: IHero[];
}

interface RecommendationResult {
  recommendations: IHero[];
  isLoading: boolean;
  error: string | null;
  refreshRecommendations: () => void;
}

function filterAvailableHeroes(
  allHeroes: IHero[],
  pickedHeroes: IHero[],
  bannedHeroes: IHero[]
): IHero[] {
  const pickedIds = new Set(pickedHeroes.map(h => h.id));
  const bannedIds = new Set(bannedHeroes.map(h => h.id));
  
  return allHeroes.filter(hero => 
    !pickedIds.has(hero.id) && !bannedIds.has(hero.id)
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRandomRecommendations(
  allHeroes: IHero[],
  myTeamPicks: IHero[],
  enemyTeamPicks: IHero[],
  bannedHeroes: IHero[]
): IHero[] {
  // Filter out already picked and banned heroes
  const allPickedHeroes = [...myTeamPicks, ...enemyTeamPicks];
  const availableHeroes = filterAvailableHeroes(allHeroes, allPickedHeroes, bannedHeroes);

  if (availableHeroes.length === 0) return [];

  // Shuffle and take first 5 heroes
  const shuffled = shuffleArray(availableHeroes);
  return shuffled.slice(0, Math.min(5, shuffled.length));
}

export function useInitialRecommendations({
  myTeamSide,
  myTeamPicks,
  enemyTeamPicks,
  bannedHeroes
}: UseInitialRecommendationsProps): RecommendationResult {
  const [recommendations, setRecommendations] = useState<IHero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allHeroes, setAllHeroes] = useState<IHero[]>([]);

  // Fetch all heroes on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadHeroes = async () => {
      try {
        setError(null);
        const heroes = await fetchAllHeroes();
        if (isMounted) {
          setAllHeroes(heroes);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load heroes');
        }
      }
    };

    loadHeroes();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateRecommendations = useCallback(() => {
    if (allHeroes.length === 0 || !myTeamSide) return;

    setIsLoading(true);
    setError(null);

    // Add a small delay to simulate processing and create smooth transitions
    const timer = setTimeout(() => {
      try {
        const newRecommendations = generateRandomRecommendations(
          allHeroes, 
          myTeamPicks, 
          enemyTeamPicks, 
          bannedHeroes
        );
        setRecommendations(newRecommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [allHeroes, myTeamSide, myTeamPicks, enemyTeamPicks, bannedHeroes]);

  // Update recommendations when picks or bans change
  useEffect(() => {
    updateRecommendations();
  }, [updateRecommendations]);

  // Generate initial recommendations when heroes are loaded and team side is selected
  useEffect(() => {
    if (allHeroes.length > 0 && myTeamSide) {
      updateRecommendations();
    }
  }, [allHeroes, myTeamSide, updateRecommendations]);

  const refreshRecommendations = useCallback(() => {
    updateRecommendations();
  }, [updateRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    refreshRecommendations
  };
}