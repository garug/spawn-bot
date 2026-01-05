export type PokemonId = string;

export type OwnedPokemon = {
    idDex: number;
    name: string;
    userId: string;
    shiny: boolean;
    totalPower?: number;
};

export type PokemonFilters = {
    userId?: string;
    name?: string;
    shiny?: boolean;
};

export type Pageable = { page: number; size: number };

export type Page<T> = {
    content: T[];
    count: number;
    page: number;
    size: number;
};
