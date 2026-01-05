import { model, Schema, type Document } from "mongoose";

import type { BasicTier } from "@domain/tier/tier.types.ts";

export interface PokemonForm {
    id: string;
    id_api: number;
    use_specie_name: boolean;
    name: string;
    image: string;
    chance: number;
}

export interface InfoPokemonDoc extends Document {
    id_dex: number;
    name: string;
    tiers: BasicTier[];
    forms: PokemonForm[];
}

const PokemonFormSchema = new Schema<PokemonForm>(
    {
        id: { type: String, default: crypto.randomUUID },
        id_api: { type: Number, required: true },
        use_specie_name: { type: Boolean, default: false },
        name: { type: String, required: true },
        image: { type: String, required: true },
        chance: { type: Number, default: 1 },
    },
    { _id: false }
);

const TierSchema = new Schema<BasicTier>(
    {
        order: { type: Number, required: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { _id: false }
);

export const InfoPokemonSchema = new Schema<InfoPokemonDoc>(
    {
        id_dex: { type: Number, required: true, index: true, unique: true },
        name: { type: String, required: true },
        forms: { type: [PokemonFormSchema], default: [] },
        tiers: { type: [TierSchema], default: [] },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const InfoPokemonModel = model<InfoPokemonDoc>("InfoPokemon", InfoPokemonSchema);
export default InfoPokemonModel;
