export interface IHero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
}

export interface IHeroStats {
  base_health: number;
  base_mana: number;
  base_armor: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
}

export type HeroRole = 'Carry' | 'Mid' | 'Offlane' | 'Support' | 'Hard Support';

export type Position = 1 | 2 | 3 | 4 | 5;

export const ROLE_TO_POSITION: Record<HeroRole, Position> = {
  'Carry': 1,
  'Mid': 2,
  'Offlane': 3,
  'Support': 4,
  'Hard Support': 5
};