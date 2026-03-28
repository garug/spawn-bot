export type PokemonFormInfo = {
    id: string;
    id_api: number;
    use_specie_name: boolean;
    name: string;
    image: string;
    chance: number;
};

export type PokemonInfo = {
    id_dex: number;
    forms: PokemonFormInfo[];
};

export interface InfoRepository {
    findOne(id_dex: number): Promise<PokemonInfo | null>;
}
