import type { ActivePokemon, SpawnState } from "./spawn.types.ts";

let state: SpawnState = {
    date: new Date(),
    pokemon: undefined,
};

export function getSpawnState(): SpawnState {
    return state;
}

export function setActivePokemon(pokemon: ActivePokemon): void {
    state = { date: new Date(), pokemon };
}

export function clearActivePokemon(): void {
    state = { date: new Date(), pokemon: undefined };
}
