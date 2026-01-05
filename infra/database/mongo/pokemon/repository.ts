import type { PokemonRepository } from "@domain/pokemon/PokemonRepository.ts";
import type { Page, Pageable, PokemonFilters } from "@domain/pokemon/pokemon.types.ts";

import { findStrongest } from "./findStrongest/query.ts";
import { uniquePokemonCount } from "./uniquePokemon/query.ts";
import { updateTiers } from "./updateTiers/job.ts";

export function createPokemonRepositoryMongo(deps: {
    ownedPokemonModel: any;
    infoPokemonModel: any;
}): PokemonRepository {
    const { ownedPokemonModel, infoPokemonModel } = deps;

    return {
        find: (filters: PokemonFilters, pageable: Pageable): Promise<Page<any>> =>
            findStrongest({ ownedPokemonModel, filters, pageable }),

        uniquePokemon: (userId?: string) =>
            uniquePokemonCount({ ownedPokemonModel, userId }),

        updateTiers: () =>
            updateTiers({ ownedPokemonModel, infoPokemonModel }),
    };
}
