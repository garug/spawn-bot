import { availableTiers } from "./availableTiers.ts";
import type { BasicTier } from "./tier.types.ts";
import { splitByPercentages } from "./splitByPercentages.ts";

export function calculateTiersFromTotals(totalsDesc: number[]): BasicTier[] {
    if (totalsDesc.length === 0) return [];

    const percentages = availableTiers.map((t) => t.value);
    const buckets = splitByPercentages(
        totalsDesc.map((total) => ({ total })),
        percentages
    );

    return availableTiers
        .map((t, index) => {
            const bucket = buckets[index];
            if (!bucket || bucket.length === 0) return undefined;

            const last = bucket[bucket.length - 1];
            return {
                order: index,
                name: t.name,
                value: last.total,
            };
        })
        .filter((x): x is BasicTier => x !== undefined);
}
