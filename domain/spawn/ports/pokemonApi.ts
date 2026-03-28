export type PokeApiPokemon = {
    name: string;
    stats: { stat: { name: string }; base_stat: number }[];
    species: { name: string };
    image: string;
};

export interface PokemonApiRepository {
    findById(id: number): Promise<PokeApiPokemon>;
}
