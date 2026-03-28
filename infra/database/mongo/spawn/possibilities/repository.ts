import type { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";
import type { Possibility } from "@domain/core/possibility.ts";
import { connectDatabase } from "@config/mongo.ts";
import SetModel from "@infra/database/mongo/models/Set.model.ts";
import { traced } from "@infra/telemetry.ts";

const kv = await Deno.openKv();
const TTL = 7 * 24 * 60 * 60 * 1000;

export function createPossibilitiesRepositoryMongo(): PossibilitiesRepository {
    return {
        async findAll(): Promise<Possibility<unknown>[]> {
            return traced("mongo.possibilities.findAll", async () => {
                const cached = await kv.get<Possibility<unknown>[]>(["possibilities"]);
                if (cached.value) return cached.value;

                await connectDatabase();

                const sets = await SetModel.find({ active: true });
                const result = sets
                    .flatMap((set) => set.pokemon)
                    .map((p) => ({ id: p.id_dex, chance: p.chance }));

                await kv.set(["possibilities"], result, { expireIn: TTL });
                return result;
            });
        },
    };
}
