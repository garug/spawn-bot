export interface ActivePokemon {
    name: string;
    form?: string;
    id: number;
    shiny: boolean;
    chance: number;
    stats: { stat: { name: string }; base_stat: number }[];
}

export interface SpawnState {
    date: Date;
    pokemon?: ActivePokemon;
}
