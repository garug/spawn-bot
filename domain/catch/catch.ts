import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import type { CatchRepository } from "@domain/catch/ports/catchRepository.ts";
import { generateAttributes } from "@domain/catch/generateAttributes.ts";

export type CatchResult =
    | { status: "no_spawn" }
    | { status: "missed" }
    | { status: "caught"; pokemon: string; shiny: boolean; tier: string };

type Deps = {
    spawnRepository: SpawnRepository;
    catchRepository: CatchRepository;
};

export async function catchPokemon(
    userId: string,
    guess: string,
    deps: Deps,
): Promise<CatchResult> {
    const current = await deps.spawnRepository.last();

    if (!current.value) return { status: "no_spawn" };

    if (current.value.name.toLowerCase() !== guess.toLowerCase()) {
        return { status: "missed" };
    }

    const { name, id: idDex, form, shiny, stats } = current.value;

    await deps.spawnRepository.save({ date: Temporal.Now.instant(), value: undefined });

    const attributes = generateAttributes(stats);
    const total = Object.values(attributes).reduce((acc, v) => acc + v, 0);

    const [, tier] = await Promise.all([
        deps.catchRepository.incrementPrestige(userId, idDex),
        deps.catchRepository.resolveTier(idDex, total),
    ]);

    await deps.catchRepository.create({ idDex, name, form, userId, attributes, shiny });

    return { status: "caught", pokemon: name, shiny, tier };
}
