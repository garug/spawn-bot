import { ActiveSpawn } from "../spawn.types.ts";

export interface SpawnRepository {
    last(): Promise<ActiveSpawn>
}
