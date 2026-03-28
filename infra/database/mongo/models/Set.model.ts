import { model, Schema, type Document } from "mongoose";

export interface SetPokemon {
    chance: number;
    id_dex: number;
}

export interface SetDoc extends Document {
    id: string;
    name: string;
    active: boolean;
    last_active: Date;
    pokemon: SetPokemon[];
}

const SetSchema = new Schema<SetDoc>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    last_active: { type: Date, required: true },
    created_at: { type: Date, required: true },
    pokemon: [
        {
            chance: Number,
            id_dex: Number,
        },
    ],
});

export const SetModel = model<SetDoc>("Set", SetSchema);
export default SetModel;
