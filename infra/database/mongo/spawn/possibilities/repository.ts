import type { PossibilitiesRepository } from "@domain/core/ports/repositories/possibilities.ts";
import type { Possibility } from "@domain/core/possibility.ts";
import { connectDatabase } from "@config/mongo.ts";
import SetModel from "@infra/database/mongo/models/Set.model.ts";

export function createPossibilitiesRepositoryMongo(): PossibilitiesRepository {
    return {
        async findAll(): Promise<Possibility<unknown>[]> {
            await connectDatabase();

            const sets = await SetModel.find({ active: true });

            return sets
                .flatMap((set) => set.pokemon)
                .map((p) => ({ id: p.id_dex, chance: p.chance }));
        },
    };
}
