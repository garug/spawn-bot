import type { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";
import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import type { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import type { InfoRepository } from "@domain/spawn/ports/infoRepository.ts";
import type { PokemonApiRepository } from "@domain/spawn/ports/pokemonApi.ts";
import { shouldResolveSpawn } from "@domain/spawn/shouldSpawn.ts";
import { selectWeighted } from "../probability/selectWeighted.ts";

const SHINY_RATE = 0.01;
export const RARE_POKEMON_CHANCE = 0.0005;

type Deps = {
    announcer: SpawnAnnouncer;
    repository: SpawnRepository;
    possibilitiesRepository: PossibilitiesRepository;
    infoRepository: InfoRepository;
    pokemonApiRepository: PokemonApiRepository;
};

export type SpawnResult =
    | { status: "skipped"; reason: "probability"; probability: number; elapsedMs: number }
    | { status: "skipped"; reason: "no possibilities" }
    | { status: "ran-away"; pokemon: string }
    | { status: "spawned"; pokemon: string; id_dex: number; shiny: boolean; chance: number; rare: boolean };

export async function spawn(deps: Deps): Promise<SpawnResult> {
    const currentSpawn = await deps.repository.last();
    const now = Temporal.Now.instant();

    const check = shouldResolveSpawn(now, currentSpawn);
    if (!check.should) {
        return { status: "skipped", reason: "probability", probability: check.probability, elapsedMs: check.elapsedMs };
    }

    if (currentSpawn.value) {
        await deps.announcer.announceRun(currentSpawn);
        await deps.repository.save({ date: now, value: undefined });
        return { status: "ran-away", pokemon: currentSpawn.value.name };
    }

    const possibilities = await deps.possibilitiesRepository.findAll();
    if (possibilities.length === 0) return { status: "skipped", reason: "no possibilities" };

    const sorted = selectWeighted(possibilities, (p) => p.id, (p) => p.chance);
    const chances = [sorted.chance];

    const id_dex = sorted.selected.id as number;
    const coreInfo = await deps.infoRepository.findOne(id_dex);

    const form = coreInfo?.forms && coreInfo.forms.length > 1
        ? selectWeighted(coreInfo.forms, (f) => f.id, (f) => f.chance).selected
        : undefined;

    const apiId = form?.id_api ?? id_dex;
    const pokeData = await deps.pokemonApiRepository.findById(apiId);

    const shiny = Math.random() < SHINY_RATE;
    chances.push(shiny ? SHINY_RATE : 1 - SHINY_RATE);

    const chance = chances.reduce((acc, e) => acc * e);
    const name = form?.name ?? (form?.use_specie_name ? pokeData.species.name : pokeData.name);
    const image = form?.image ?? pokeData.image;

    const newSpawn = {
        date: now,
        value: { name, form: form?.id, id: id_dex, shiny, chance, image, stats: pokeData.stats },
    };

    await deps.repository.save(newSpawn);
    await deps.announcer.announceAppear(newSpawn);

    return { status: "spawned", pokemon: name, id_dex, shiny, chance, rare: chance <= RARE_POKEMON_CHANCE };
}
