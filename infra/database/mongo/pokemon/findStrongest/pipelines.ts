import type { PipelineStage } from "mongoose";

export const withTotalPower: PipelineStage[] = [
    {
        $addFields: {
            training: {
                attack: { $sum: "$trainings.attributes.attack" },
                defense: { $sum: "$trainings.attributes.defense" },
                hp: { $sum: "$trainings.attributes.hp" },
                sp_attack: { $sum: "$trainings.attributes.sp_attack" },
                sp_defense: { $sum: "$trainings.attributes.sp_defense" },
                speed: { $sum: "$trainings.attributes.speed" },
            },
        },
    },
    {
        $project: {
            training: 1,
            total: {
                $add: [
                    "$attributes.attack",
                    "$attributes.defense",
                    "$attributes.hp",
                    "$attributes.sp_attack",
                    "$attributes.sp_defense",
                    "$attributes.speed",
                    "$training.attack",
                    "$training.defense",
                    "$training.hp",
                    "$training.sp_attack",
                    "$training.sp_defense",
                    "$training.speed",
                ],
            },
        },
    },
];

export function paginate(page: number, size: number): PipelineStage[] {
    return [
        { $sort: { total: -1 } },
        { $skip: (page - 1) * size },
        { $limit: size },
    ];
}

export const formatOwnedPokemonResponse: PipelineStage[] = [
    {
        $lookup: {
            from: "ownedpokemons",
            localField: "_id",
            foreignField: "_id",
            as: "original",
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: [{ $arrayElemAt: ["$original", 0] }, "$$ROOT"],
            },
        },
    },
    { $unset: ["trainings", "original", "_id", "__v"] },
];
