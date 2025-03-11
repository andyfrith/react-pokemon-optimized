import { Pokemon, PokemonSchema } from "@/lib/types";
import { z } from "zod";

export const PokemonsSchema = z.array(PokemonSchema);

export async function getPokemon(): Promise<Pokemon[]> {
  const res = await fetch("./pokemon.json");
  const data = await res.json();
  return PokemonsSchema.parse(data);
}
