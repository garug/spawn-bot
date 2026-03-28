import type { ActiveSpawn } from "@domain/spawn/spawn.types.ts";

const kv = await Deno.openKv();

// Temporal.Instant não é serializável nativamente no KV, então guardamos como epochMs
type StoredSpawn = Omit<ActiveSpawn, "date"> & { dateMs: number };

export async function last(): Promise<ActiveSpawn> {
    const entry = await kv.get<StoredSpawn>(["lastPokemon"]);

    if (entry.value) {
        return {
            ...entry.value,
            date: Temporal.Instant.fromEpochMilliseconds(entry.value.dateMs),
        };
    }

    const initial: ActiveSpawn = { date: Temporal.Now.instant(), value: undefined };
    await save(initial);
    return initial;
}

export async function save(spawn: ActiveSpawn): Promise<void> {
    const { date, ...rest } = spawn;
    const stored: StoredSpawn = { ...rest, dateMs: date.epochMilliseconds };
    await kv.set(["lastPokemon"], stored);
}
