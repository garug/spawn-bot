import { SpawnRepository } from "@domain/spawn/SpawnRepository.ts";

import { last } from "./last.ts";

export function createSpawnRepository(): SpawnRepository {
    return {
        last
    }
}
