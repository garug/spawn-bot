export interface BasicTier {
    order: number;
    name: TierName;
    value: number;
}

export interface Tier extends BasicTier {
    when: (value: number) => boolean;
    mod_pokemon: number;
    mod_trainer: number;
}

export type TierName = "SS" | "S" | "A" | "B" | "C" | "D" | "E" | "F";
