import { ActiveSpawn } from "../spawn.types.ts";

export interface SpawnAnnouncer {
    announceAppear(spawn: ActiveSpawn): Promise<unknown>;
    announceRun(spawn: ActiveSpawn): Promise<unknown>;
}
