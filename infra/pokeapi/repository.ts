import type { PokemonApiRepository, PokeApiPokemon } from "@domain/spawn/ports/pokemonApi.ts";

const BASE_URL = "https://pokeapi.co/api/v2";

export function createPokemonApiRepository(): PokemonApiRepository {
    return {
        async findById(id: number): Promise<PokeApiPokemon> {
            const res = await fetch(`${BASE_URL}/pokemon/${id}/`);
            if (!res.ok) throw new Error(`PokeAPI error for id ${id}: ${res.status}`);

            const data = await res.json();

            return {
                name: data.name,
                stats: data.stats,
                species: data.species,
                image: data.sprites.other["official-artwork"].front_default,
            };
        },
    };
}
