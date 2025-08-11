import { IHero, HeroRole, Position } from './hero';

export interface IDraftSlot {
  hero: IHero | null;
  role: HeroRole | null;
  position: Position | null;
}

export type TeamSide = 'radiant' | 'dire';

export interface IDraftState {
  myTeam: IDraftSlot[];
  enemyTeam: IDraftSlot[];
  myTeamSide: TeamSide;
  recommendations: IHero[];
  bannedHeroes: IHero[];
}

export interface ITeamComposition {
  slots: IDraftSlot[];
}

export interface IRecommendationContext {
  myTeamSide: TeamSide;
  myTeamPicks: IHero[];
  enemyTeamPicks: IHero[];
  bannedHeroes: IHero[];
}