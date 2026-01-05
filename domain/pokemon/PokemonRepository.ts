import type { Page, Pageable, PokemonFilters, OwnedPokemon } from "./pokemon.types.ts";

export interface PokemonRepository {
    find(filters: PokemonFilters, pageable: Pageable): Promise<Page<OwnedPokemon>>;
    uniquePokemon(userId?: string): Promise<number>;
    updateTiers(): Promise<void>;
}
