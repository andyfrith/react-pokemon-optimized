import { z } from "zod";

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.array(z.string()),
  hp: z.number(),
  attack: z.number(),
  defense: z.number(),
  special_attack: z.number(),
  special_defense: z.number(),
  speed: z.number(),
  power: z.number().optional(),
});

export interface PokemonWithPower extends Pokemon {
  power: number;
}

export type Pokemon = z.infer<typeof PokemonSchema>;
