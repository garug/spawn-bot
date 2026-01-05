import { tiersSourceAggregate } from "./pipelines.ts";
import { calculateTiersFromTotals } from "@domain/tier/calculateTiers.ts";

type DexGroup = { _id: number; arr: Array<{ total: number }> };

export async function updateTiers(deps: {
    ownedPokemonModel: any;
    infoPokemonModel: any;
}): Promise<void> {
    const allByDex: DexGroup[] = await deps.ownedPokemonModel.aggregate(tiersSourceAggregate);

    const updates = allByDex.map((dexGroup) => {
        const totalsDesc = dexGroup.arr.map((x) => x.total);
        const tiers = calculateTiersFromTotals(totalsDesc);

        return deps.infoPokemonModel.updateOne(
            { id_dex: dexGroup._id },
            { $set: { tiers } },
            { upsert: true }
        );
    });

    await Promise.all(updates);
}
