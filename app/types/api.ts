export interface IOpenDotaHeroResponse {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_health_regen?: number;
  base_mana: number;
  base_mana_regen?: number;
  base_armor: number;
  base_mr?: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain?: number;
  agi_gain?: number;
  int_gain?: number;
  attack_range?: number;
  projectile_speed?: number;
  attack_rate?: number;
  move_speed?: number;
  turn_rate?: number;
  cm_enabled?: boolean;
  legs?: number;
  day_vision?: number;
  night_vision?: number;
}

export interface IOpenDotaMatchResponse {
  match_id: number;
  barracks_status_dire: number;
  barracks_status_radiant: number;
  cluster: number;
  dire_score: number;
  duration: number;
  engine: number;
  first_blood_time: number;
  game_mode: number;
  human_players: number;
  leagueid: number;
  lobby_type: number;
  match_seq_num: number;
  negative_votes: number;
  positive_votes: number;
  radiant_score: number;
  radiant_win: boolean;
  start_time: number;
  tower_status_dire: number;
  tower_status_radiant: number;
  version: number;
  replay_salt: number;
  series_id: number;
  series_type: number;
  radiant_team?: {
    team_id: number;
    name: string;
    tag: string;
    logo_url: string;
  };
  dire_team?: {
    team_id: number;
    name: string;
    tag: string;
    logo_url: string;
  };
  league?: {
    leagueid: number;
    ticket: string;
    banner: string;
    tier: string;
    name: string;
  };
  picks_bans?: Array<{
    is_pick: boolean;
    hero_id: number;
    team: number;
    order: number;
  }>;
  players: Array<{
    match_id: number;
    player_slot: number;
    ability_upgrades_arr?: number[];
    ability_uses?: Record<string, number>;
    account_id?: number;
    actions?: Record<string, number>;
    additional_units?: any[];
    assists: number;
    backpack_0?: number;
    backpack_1?: number;
    backpack_2?: number;
    buyback_log?: Array<{
      time: number;
      slot: number;
      type: string;
    }>;
    camps_stacked?: number;
    creeps_stacked?: number;
    damage?: Record<string, number>;
    damage_inflictor?: Record<string, number>;
    damage_inflictor_received?: Record<string, number>;
    damage_taken?: Record<string, number>;
    deaths: number;
    denies: number;
    dn_t?: number[];
    gold: number;
    gold_per_min: number;
    gold_reasons?: Record<string, number>;
    gold_spent: number;
    gold_t?: number[];
    hero_damage: number;
    hero_healing: number;
    hero_hits?: Record<string, number>;
    hero_id: number;
    item_0?: number;
    item_1?: number;
    item_2?: number;
    item_3?: number;
    item_4?: number;
    item_5?: number;
    item_neutral?: number;
    item_uses?: Record<string, number>;
    kill_streaks?: Record<string, number>;
    killed?: Record<string, number>;
    killed_by?: Record<string, number>;
    kills: number;
    kills_per_min: number;
    lane?: number;
    lane_pos?: Record<string, number>;
    last_hits: number;
    leaver_status?: number;
    level: number;
    lh_t?: number[];
    life_state?: Record<string, number>;
    max_hero_hit?: {
      type: string;
      time: number;
      max: boolean;
      inflictor?: string;
      unit: string;
      key: string;
      value: number;
      slot: number;
      player_slot: number;
    };
    multi_kills?: Record<string, number>;
    net_worth: number;
    obs_placed?: number;
    party_id?: number;
    party_size?: number;
    performance_others?: any;
    permanent_buffs?: Array<{
      permanent_buff: number;
      stack_count?: number;
    }>;
    pings?: number;
    pred_vict?: boolean;
    purchase?: Record<string, number>;
    purchase_log?: Array<{
      time: number;
      key: string;
      charges?: number;
    }>;
    randomed?: boolean;
    region?: number;
    repicked?: boolean;
    roshans_killed?: number;
    rune_pickups?: number;
    sen_placed?: number;
    stuns?: number;
    teamfight_participation?: number;
    times?: number[];
    tower_damage: number;
    towers_killed?: number;
    xp_per_min: number;
    xp_reasons?: Record<string, number>;
    xp_t?: number[];
    radiant_win: boolean;
    start_time: number;
    duration: number;
    cluster: number;
    lobby_type: number;
    game_mode: number;
    is_contributor?: boolean;
  }>;
}

export interface IApiError {
  message: string;
  code: number;
  details: any;
}

export function isApiError(obj: unknown): obj is IApiError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    'code' in obj &&
    typeof (obj as any).message === 'string' &&
    typeof (obj as any).code === 'number'
  );
}