import type { InfoRepository, PokemonInfo } from "@domain/spawn/ports/infoRepository.ts";
import { connectDatabase } from "@config/mongo.ts";
import InfoPokemonModel from "@infra/database/mongo/models/InfoPokemon.model.ts";
import { traced } from "@infra/telemetry.ts";

export function createInfoRepositoryMongo(): InfoRepository {
    return {
        async findOne(id_dex: number): Promise<PokemonInfo | null> {
            return traced("mongo.info.findOne", async () => {
                await connectDatabase();

                const doc = await InfoPokemonModel.findOne({ id_dex });
                if (!doc) return null;

                return {
                    id_dex: doc.id_dex,
                    forms: doc.forms.map((f) => ({
                        id: f.id,
                        id_api: f.id_api,
                        use_specie_name: f.use_specie_name,
                        name: f.name,
                        image: f.image,
                        chance: f.chance,
                    })),
                };
            }, { id_dex });
        },
    };
}
