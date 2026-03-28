import type { PokemonRepository } from "@domain/pokemon/PokemonRepository.ts";
import type { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import { createPokemonRepositoryMongo } from "@infra/database/mongo/pokemon/repository.ts";
import { createSpawnAnnouncerDiscord } from "@infra/discord/announcers/spawn.ts";
import { createSpawnRepository } from "@infra/database/kv/spawn/repository.ts";

import OwnedPokemonModel from "@infra/database/mongo/models/OwnedPokemon.model.ts";
import InfoPokemonModel from "@infra/database/mongo/models/InfoPokemon.model.ts";
import { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";

export function pokemonRepository(): PokemonRepository {
    return createPokemonRepositoryMongo({
        ownedPokemonModel: OwnedPokemonModel,
        infoPokemonModel: InfoPokemonModel,
    });
}

export function possibilitiesRepository(): PossibilitiesRepository {
    throw new Error("Not implemented");
}

export function spawnAnnouncer(): SpawnAnnouncer {
    return createSpawnAnnouncerDiscord();
}

export function spawnRepository(): SpawnRepository {
    return createSpawnRepository();
}

