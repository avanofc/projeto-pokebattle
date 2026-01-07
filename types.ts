
export type PokemonType = 'Electric' | 'Fire' | 'Water' | 'Grass' | 'Normal' | 'Psychic' | 'Flying' | 'Poison';

export interface Move {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  description: string;
}

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType;
  hp: number;
  maxHp: number;
  level: number;
  speed: number;
  attack: number;
  defense: number;
  moves: Move[];
  spriteUrl: string;
}

export interface BattleState {
  playerActive: Pokemon;
  enemyActive: Pokemon;
  turn: 'player' | 'enemy';
  log: string[];
  isGameOver: boolean;
  winner?: 'player' | 'enemy';
}

export enum GameView {
  MENU = 'MENU',
  BATTLE = 'BATTLE',
  PARTY = 'PARTY'
}
