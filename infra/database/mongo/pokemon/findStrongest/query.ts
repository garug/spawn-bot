import type { QueryFilter } from "mongoose";
import type { Page, Pageable, PokemonFilters } from "@domain/pokemon/pokemon.types.ts";

import { withTotalPower, paginate, formatOwnedPokemonResponse } from "./pipelines.ts";
import { traced } from "@infra/telemetry.ts";

type Deps = {
    ownedPokemonModel: any;
    filters: PokemonFilters;
    pageable: Pageable;
};

export async function findStrongest({ ownedPokemonModel, filters, pageable }: Deps): Promise<Page<any>> {
    return traced("mongo.pokemon.findStrongest", async () => {
        const mongoFilter = toMongoFilter(filters);

        const [content, count] = await Promise.all([
            ownedPokemonModel.aggregate([
                { $match: mongoFilter },
                ...withTotalPower,
                ...paginate(pageable.page, pageable.size),
                ...formatOwnedPokemonResponse,
            ]),
            ownedPokemonModel.countDocuments(mongoFilter),
        ]);

        return { content, count, ...pageable };
    });
}

function toMongoFilter(filters: PokemonFilters): QueryFilter<any> {
    const result: QueryFilter<any> = {};

    if (filters.name) {
        result.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.shiny === true) {
        result["marks.shiny"] = true;
    }

    if (filters.userId) {
        result.user = filters.userId;
    }

    return result;
}
