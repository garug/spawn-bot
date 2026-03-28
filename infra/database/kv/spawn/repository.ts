import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import { last, save } from "./last.ts";

export function createSpawnRepository(): SpawnRepository {
    return { last, save };
}
