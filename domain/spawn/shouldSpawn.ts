import type { ActiveSpawn } from "./spawn.types.ts";

const maxInterval = 12 * 60 * 1000;

export function shouldResolveSpawn(on: Temporal.Instant, spawn: ActiveSpawn) {
    const timeDifference =
        on.epochMilliseconds - spawn.date.epochMilliseconds;

    const probability = timeDifference / maxInterval;

    return probability > Math.random();
}