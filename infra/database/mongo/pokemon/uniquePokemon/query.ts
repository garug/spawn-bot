import type { PipelineStage } from "mongoose";

export async function uniquePokemonCount(deps: {
    ownedPokemonModel: any;
    userId?: string;
}): Promise<number> {
    const pipeline: PipelineStage[] = [];

    if (deps.userId) pipeline.push({ $match: { user: deps.userId } });

    pipeline.push({ $group: { _id: "$id_dex" } }, { $count: "total" });

    const result = await deps.ownedPokemonModel.aggregate(pipeline);
    return result[0]?.total ?? 0;
}
