import type { PokemonRepository } from "@domain/pokemon/PokemonRepository.ts";
import { createPokemonRepositoryMongo } from "@infra/database/mongo/pokemon/repository.ts";

import OwnedPokemonModel from "@infra/database/mongo/models/OwnedPokemon.model.ts";
import InfoPokemonModel from "@infra/database/mongo/models/InfoPokemon.model.ts";

export function pokemonRepository(): PokemonRepository {
    return createPokemonRepositoryMongo({
        ownedPokemonModel: OwnedPokemonModel,
        infoPokemonModel: InfoPokemonModel,
    });
}
