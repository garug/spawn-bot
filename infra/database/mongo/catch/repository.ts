import type { CatchRepository } from "@domain/catch/ports/catchRepository.ts";
import type { Attributes } from "@domain/catch/generateAttributes.ts";
import OwnedPokemonModel from "@infra/database/mongo/models/OwnedPokemon.model.ts";
import PrestigeModel from "@infra/database/mongo/models/Prestige.model.ts";
import { resolveTierForPokemon } from "@infra/database/mongo/tier/resolverTierForPokemon/query.ts";
import { traced } from "@infra/telemetry.ts";

export function createCatchRepositoryMongo(): CatchRepository {
    return {
        async create({ idDex, name, form, userId, attributes, shiny }) {
            return traced("mongo.catch.create", async () => {
                const doc = await OwnedPokemonModel.create({
                    id_dex: idDex,
                    name,
                    form,
                    user: userId,
                    original_user: userId,
                    attributes,
                    level: 0,
                    moves: ["", "", "", ""],
                    marks: { shiny },
                });

                const base = Object.values(doc.attributes as unknown as Attributes).reduce((a, v) => a + v, 0);
                return { total: base };
            });
        },

        async incrementPrestige(userId, idDex) {
            await traced("mongo.catch.incrementPrestige", () =>
                PrestigeModel.updateOne(
                    { user: userId, id_dex: idDex },
                    { $inc: { value: 200 } },
                    { upsert: true },
                )
            );
        },

        async resolveTier(idDex, total) {
            const tier = await resolveTierForPokemon({ idDex, total });
            return tier.name;
        },
    };
}
