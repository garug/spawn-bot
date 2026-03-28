import type { PokemonRepository } from "@domain/pokemon/PokemonRepository.ts";
import type { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import type { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";
import type { InfoRepository } from "@domain/spawn/ports/infoRepository.ts";
import type { PokemonApiRepository } from "@domain/spawn/ports/pokemonApi.ts";

import { createPokemonRepositoryMongo } from "@infra/database/mongo/pokemon/repository.ts";
import { createSpawnAnnouncerDiscord } from "@infra/discord/announcers/spawn.ts";
import { createSpawnRepository } from "@infra/database/kv/spawn/repository.ts";
import { createPossibilitiesRepositoryMongo } from "@infra/database/mongo/spawn/possibilities/repository.ts";
import { createInfoRepositoryMongo } from "@infra/database/mongo/spawn/info/repository.ts";
import { createPokemonApiRepository } from "@infra/pokeapi/repository.ts";

import OwnedPokemonModel from "@infra/database/mongo/models/OwnedPokemon.model.ts";
import InfoPokemonModel from "@infra/database/mongo/models/InfoPokemon.model.ts";

export function pokemonRepository(): PokemonRepository {
    return createPokemonRepositoryMongo({
        ownedPokemonModel: OwnedPokemonModel,
        infoPokemonModel: InfoPokemonModel,
    });
}

export function possibilitiesRepository(): PossibilitiesRepository {
    return createPossibilitiesRepositoryMongo();
}

export function infoRepository(): InfoRepository {
    return createInfoRepositoryMongo();
}

export function pokemonApiRepository(): PokemonApiRepository {
    return createPokemonApiRepository();
}

export function spawnAnnouncer(): SpawnAnnouncer {
    return createSpawnAnnouncerDiscord();
}

export function spawnRepository(): SpawnRepository {
    return createSpawnRepository();
}

