import type { ActiveSpawn } from "./spawn.types.ts";

const maxInterval = 12 * 60 * 1000;

export type SpawnCheck = {
    should: boolean;
    probability: number;
    elapsedMs: number;
};

export function shouldResolveSpawn(on: Temporal.Instant, spawn: ActiveSpawn): SpawnCheck {
    const elapsedMs = on.epochMilliseconds - spawn.date.epochMilliseconds;
    const probability = Math.min(elapsedMs / maxInterval, 1);

    return { should: probability > Math.random(), probability, elapsedMs };
}