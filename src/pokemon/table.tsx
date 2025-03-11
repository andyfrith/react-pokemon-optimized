import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pokemon } from "@/lib/types";

export function PokemonTable({ pokemon }: { pokemon: Array<Pokemon> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead colSpan={6}>Stats</TableHead>
          <TableHead>Power</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pokemon.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.type.join(", ")}</TableCell>
            <TableCell>{p.hp}</TableCell>
            <TableCell>{p.attack}</TableCell>
            <TableCell>{p.defense}</TableCell>
            <TableCell>{p.special_attack}</TableCell>
            <TableCell>{p.special_defense}</TableCell>
            <TableCell>{p.speed}</TableCell>
            <TableCell>{p.power}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
