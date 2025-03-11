import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Pokemon, getAll, getByName } from "./api";

import "./index.css";

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0;

const PokemonTable: React.FC<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`tableRender: ${tableRender++}`);

  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(",")}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

let appRender = 0;

const MemoedPokemonTable = React.memo(PokemonTable);

export default function App() {
  console.log(`appRender: ${appRender++}`);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState(200);
  const [search, setSearch] = useState("");

  /*
  Hook Rules:
  * Always use the state setter from (useState)
  * Always put a dependency array on useEffect, useCallback, and useMemo
  * To run useEffect at time of each render, don't provide a dependency array
  * To run useEffect only once use an empty dependency array
  * Don't depend on data you set
  */

  /*
  useCallback Rules:
  * The current value of any state variable used in the function must be considered when the function is executed:
  * Either the callback FUNCTION must 1. BE REGENERATED whenever the state used in the function is updated by providing the state
  * variable in the dependency array:
  * 
  * const [stateVal, setStateVal] = useState();
  * const onAction = useCallback((newVal) => {
  *      setStateVal([ 
  *           ...stateVal,
  *           newVal
  *      ]);
  * }, [stateVal]);
  * 
  * Or, the state setter function can be PASSED a function with the CURRENT VALUE being passed ie.:
  * 
  * const [stateVal, setStateVal] = useState();
  * const onAction = useCallback((newVal) => {
  *      setStateVal((currentVal) => [ 
  *           ...currentVal,
  *           newVal
  *      ]);
  * }, []);
  */

  const onSetThreshold = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setThreshold(parseInt(event.target.value, 10));
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
    getByName(search).then(setPokemon);
  }, [search]);

  const pokemonWithPower = useMemo(
    () =>
      pokemon.map((p) => ({
        ...p,
        power: calculatePower(p),
      })),
    [pokemon]
  );

  /*
  useMemo rules:
  * useMemo should be used when executing potentially computation intensive operations
  * Always add all state read from to dependency array
  */

  const countOverThreshold = useMemo(
    () => pokemonWithPower.filter((p) => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const min = useMemo(
    () => Math.min(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );
  const max = useMemo(
    () => Math.max(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" value={search} onChange={onSetSearch}></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold:{countOverThreshold} </div>
      </div>
      <div className="two-column">
        <MemoedPokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
