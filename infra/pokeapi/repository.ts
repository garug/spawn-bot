import type { PokemonApiRepository, PokeApiPokemon } from "@domain/spawn/ports/pokemonApi.ts";

const BASE_URL = "https://pokeapi.co/api/v2";
const kv = await Deno.openKv();
const TTL = 7 * 24 * 60 * 60 * 1000;

export function createPokemonApiRepository(): PokemonApiRepository {
    return {
        async findById(id: number): Promise<PokeApiPokemon> {
            const cached = await kv.get<PokeApiPokemon>(["pokeapi", id]);
            if (cached.value) return cached.value;

            const res = await fetch(`${BASE_URL}/pokemon/${id}/`);
            if (!res.ok) throw new Error(`PokeAPI error for id ${id}: ${res.status}`);

            const data = await res.json();

            const pokemon: PokeApiPokemon = {
                name: data.name,
                stats: data.stats,
                species: data.species,
                image: data.sprites.other["official-artwork"].front_default,
            };

            await kv.set(["pokeapi", id], pokemon, { expireIn: TTL });
            return pokemon;
        },
    };
}
