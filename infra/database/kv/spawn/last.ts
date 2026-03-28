import { ActiveSpawn } from "@domain/spawn/spawn.types.ts";

const kv = await Deno.openKv();

export async function last() {
    const entry = await kv.get<ActiveSpawn>(["lastPokemon"]);

    if (entry.value) return entry.value;

    const newEntry = {
        date: Temporal.Now.instant(),
        pokemon: undefined,
        prev: undefined
    };

    kv.set(["lastPokemon"], newEntry);

    return newEntry;
}
