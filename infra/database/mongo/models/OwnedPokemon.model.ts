import { model, Schema, type Document } from "mongoose";

export interface Attributes {
    hp: number;
    attack: number;
    defense: number;
    sp_attack: number;
    sp_defense: number;
    speed: number;
}

export interface OwnedPokemonDoc extends Document {
    id: string;
    name: string;
    id_dex: number;
    form?: string;
    user: string;
    original_user: string;
    created_at: Date;
    level: number;
    moves: [string, string, string, string];
    marks: {
        tradable: boolean;
        shiny: boolean;
    };
    attributes: Attributes;
    trainings: Array<{
        user: string;
        mod: number;
        attributes: Attributes;
        created_at: Date;
    }>;
    total: number; // virtual
}

const AttributesSchemaDef = {
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    sp_attack: { type: Number, required: true },
    sp_defense: { type: Number, required: true },
    speed: { type: Number, required: true },
} as const;

const TrainingSchema = new Schema(
    {
        user: { type: String, required: true },
        mod: { type: Number, required: true },
        attributes: { type: AttributesSchemaDef, required: true },
        created_at: { type: Date, default: Date.now },
    },
    { _id: false }
);

export const OwnedPokemonSchema = new Schema<OwnedPokemonDoc>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: () => crypto.randomUUID(), // Deno-friendly
        },
        id_dex: { type: Number, required: true, index: true },
        name: { type: String, required: true },
        form: { type: String },
        user: { type: String, required: true, index: true },
        original_user: { type: String, required: true, index: true },
        created_at: { type: Date, required: true, default: Date.now },
        level: { type: Number, required: true },

        // array com exatamente 4 moves
        moves: {
            type: [String],
            required: true,
            validate: {
                validator: (val: string[]) => Array.isArray(val) && val.length === 4,
                message: "moves needs four elements",
            },
        },

        marks: {
            tradable: { type: Boolean, default: false },
            shiny: { type: Boolean, default: false },
        },

        attributes: { type: AttributesSchemaDef, required: true },
        trainings: { type: [TrainingSchema], default: [] },
    },
    {
        timestamps: false, // você já tem created_at próprio
        versionKey: false,
    }
);

OwnedPokemonSchema.virtual("total").get(function (this: OwnedPokemonDoc) {
    const base = Object.values(this.attributes);
    const training = this.trainings.flatMap((t) => Object.values(t.attributes));
    return [...base, ...training].reduce((acc, n) => acc + n, 0);
});

export const OwnedPokemonModel = model<OwnedPokemonDoc>("OwnedPokemon", OwnedPokemonSchema);
export default OwnedPokemonModel;
