import { IHero, HeroRole, Position } from './hero';

export interface IDraftSlot {
  hero: IHero | null;
  role: HeroRole | null;
  team: 'radiant' | 'dire';
  position: Position | null;
}

export interface IDraftState {
  radiantPicks: IDraftSlot[];
  direPicks: IDraftSlot[];
  recommendations: IHero[];
  bannedHeroes: IHero[];
}

export interface ITeamComposition {
  team: 'radiant' | 'dire';
  slots: IDraftSlot[];
}