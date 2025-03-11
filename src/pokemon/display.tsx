import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemon } from "@/api/pokemon";
import { PokemonTable } from "@/pokemon/table";
import { Pokemon } from "@/lib/types";
import { calculatePower } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const MemoedPokemonTable = memo(PokemonTable);

export function Display() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState<number | string>(200);
  const [search, setSearch] = useState("");

  const { data, isFetching, error } = useQuery({
    queryKey: ["pokemon"],
    queryFn: async () => {
      const initialData = await getPokemon();
      const data = initialData.map((p) => ({
        ...p,
        power: calculatePower(p),
      }));
      setPokemon(data);
      return data;
    },
  });

  const onSetThreshold = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setThreshold(
        event.target.value && parseInt(event.target.value, 10)
          ? parseInt(event.target.value, 10)
          : ""
      );
    },
    []
  );

  const onSetSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    []
  );

  useEffect(() => {
    if (data) {
      const filteredPokemon = data.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
      );
      setPokemon(filteredPokemon);
    }
  }, [data, search]);

  const countOverThreshold = useMemo(
    () =>
      pokemon.filter(
        (p) => p.power && typeof threshold === "number" && p.power > threshold
      ).length,
    [pokemon, threshold]
  );

  const min = useMemo(
    () => Math.min(...pokemon.map((p) => p.power || 0)),
    [pokemon]
  );

  const max = useMemo(
    () => Math.max(...pokemon.map((p) => p.power || 0)),
    [pokemon]
  );

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {pokemon && (
        <div>
          <div className="top-bar">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              value={search}
              onChange={onSetSearch}
            />
            <Separator orientation="vertical" />
            <Label htmlFor="threshold">Power threshold</Label>
            <Input
              id="threshold"
              type="text"
              value={threshold}
              onChange={onSetThreshold}
            />
            <Separator orientation="vertical" />
            <Label>Count over threshold:{countOverThreshold}</Label>
            <Separator orientation="vertical" />
            <div>
              <Label>Min: {min}</Label>
              <Label>Max: {max}</Label>
            </div>
          </div>
          <div>
            <MemoedPokemonTable pokemon={pokemon} />
          </div>
        </div>
      )}
    </>
  );
}
