import InfoPokemon from "@infra/database/mongo/models/InfoPokemon.model.ts";
import { availableTiers } from "@domain/tier/availableTiers.ts";
import type { Tier } from "@domain/tier/tier.types.ts";

export async function resolveTierForPokemon(deps: {
    idDex: number;
    total: number;
}): Promise<Tier> {
    const infoPokemon = await InfoPokemon.findOne({ id_dex: deps.idDex });

    const valid = infoPokemon?.tiers?.find((t: any) => deps.total >= t.value);

    if (valid) {
        const tier = availableTiers.find((t) => t.name === valid.name);
        if (!tier) throw new Error("Tier not found for valid info");
        return tier;
    }

    if (!infoPokemon) return availableTiers[0];

    const last = infoPokemon.tiers?.[infoPokemon.tiers.length - 1];
    if (last) {
        const tier = availableTiers.find((t) => t.name === last.name);
        return tier ?? availableTiers[0];
    }

    return availableTiers[0];
}
