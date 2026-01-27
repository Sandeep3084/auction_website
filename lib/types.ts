export interface Character {
  name: string;
  strength: number;
  stamina: number;
  dexterity: number;
  intelligence: number;
  magic: number;
  anime: string;
  avgRating: number;
}

export type Attribute = 'strength' | 'stamina' | 'dexterity' | 'intelligence' | 'magic';

export interface Team {
  id: string;
  name: string;
  members: Character[];
}

export const TEAMS: Team[] = Array.from({ length: 10 }, (_, i) => ({
  id: `team-${i + 1}`,
  name: `Team ${i + 1}`,
  members: [],
}));
