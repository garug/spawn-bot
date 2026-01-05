import Prestige from "@infra/database/mongo/models/Prestige.model.ts";
import OwnedPokemon from "@infra/database/mongo/models/OwnedPokemon.model.ts";

export async function updateTrainersPrestige(): Promise<void> {
    const initialPrestige = await OwnedPokemon.aggregate([
        {
            $group: {
                _id: { user: "$original_user", pokemon: "$id_dex" },
                count: { $sum: 1 },
            },
        },
        {
            $addFields: {
                value: { $multiply: ["$count", 200] },
                user: "$_id.user",
                pokemon: "$_id.pokemon",
            },
        },
    ]);

    await Prestige.insertMany(
        initialPrestige.map((p: any) => ({
            value: p.value,
            user: p.user,
            pokemon: p.pokemon,
        }))
    );
}
