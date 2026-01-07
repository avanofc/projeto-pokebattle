
import { Pokemon, Move, PokemonType } from './types';

export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  Fire: { Grass: 2, Water: 0.5, Fire: 0.5 },
  Water: { Fire: 2, Grass: 0.5, Water: 0.5 },
  Grass: { Water: 2, Fire: 0.5, Grass: 0.5 },
  Electric: { Water: 2, Grass: 0.5 },
  Normal: {},
  Psychic: { Poison: 2 },
  Flying: { Grass: 2 },
  Poison: { Grass: 2 }
};

export const MOVES: Record<string, Move> = {
  THUNDERBOLT: { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, description: 'Um forte choque elétrico.' },
  FLAMETHROWER: { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, description: 'Chamas intensas.' },
  SURF: { name: 'Surf', type: 'Water', power: 90, accuracy: 100, description: 'Uma onda gigante.' },
  RAZOR_LEAF: { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95, description: 'Folhas afiadas.' },
  TACKLE: { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, description: 'Uma investida física.' },
  QUICK_ATTACK: { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, description: 'Ataque veloz.' },
  PSYBEAM: { name: 'Psybeam', type: 'Psychic', power: 65, accuracy: 100, description: 'Raio peculiar.' },
  SLUDGE_BOMB: { name: 'Sludge Bomb', type: 'Poison', power: 90, accuracy: 100, description: 'Lodo tóxico.' }
};

export const POKEMON_DATABASE: Pokemon[] = [
  {
    id: 25, name: 'Pikachu', type: 'Electric', hp: 100, maxHp: 100, level: 25, speed: 90, attack: 55, defense: 40,
    moves: [MOVES.THUNDERBOLT, MOVES.QUICK_ATTACK],
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  },
  {
    id: 4, name: 'Charmander', type: 'Fire', hp: 110, maxHp: 110, level: 25, speed: 65, attack: 52, defense: 43,
    moves: [MOVES.FLAMETHROWER, MOVES.TACKLE],
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
  },
  {
    id: 7, name: 'Squirtle', type: 'Water', hp: 120, maxHp: 120, level: 25, speed: 43, attack: 48, defense: 65,
    moves: [MOVES.SURF, MOVES.TACKLE],
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
  },
  {
    id: 1, name: 'Bulbasaur', type: 'Grass', hp: 115, maxHp: 115, level: 25, speed: 45, attack: 49, defense: 49,
    moves: [MOVES.RAZOR_LEAF, MOVES.TACKLE],
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  },
  {
    id: 150, name: 'Mewtwo', type: 'Psychic', hp: 150, maxHp: 150, level: 50, speed: 130, attack: 110, defense: 90,
    moves: [MOVES.PSYBEAM, MOVES.QUICK_ATTACK],
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png'
  }
];
