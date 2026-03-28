import { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";
import { shouldResolveSpawn } from "@domain/spawn/shouldSpawn.ts";
import { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import { selectWeighted } from "../probability/selectWeighted.ts";

type Deps = {
    announcer: SpawnAnnouncer,
    repository: SpawnRepository,
    possibilitiesRepository: PossibilitiesRepository,
}

export async function spawn(deps: Deps) {
    const currentSpawn = await deps.repository.last();

    const now = Temporal.Now.instant();

    const announcing = shouldResolveSpawn(now, currentSpawn);

    if (!announcing) { 
        if (currentSpawn.value) {
            deps.announcer.announceRun(currentSpawn);
            return { status: "skipped", reason: "probability" }
        }
        return { status: "skipped", reason: "no active spawn" };
    };

    const possibilities = await deps.possibilitiesRepository.findAll();

    const sorted = selectWeighted(possibilities, p => p.id, p => p.chance)

    const chances = [sorted.chance];

    const coreInfo = await deps.infoRepository.findOne({ id: sorted.selected.id })

    const form = coreInfo?.forms && coreInfo.forms.length > 1 ?
        selectWeighted(coreInfo.forms, p => p.chance) :
        undefined;
}