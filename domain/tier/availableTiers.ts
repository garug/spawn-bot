import type { Tier } from "./tier.types.ts";

export const availableTiers: Tier[] = [
    { order: 0, name: "SS", value: 0.01, when: (v) => v >= 0 && v <= 0.01, mod_pokemon: 0.05, mod_trainer: 5 },
    { order: 1, name: "S", value: 0.02, when: (v) => v > 0.01 && v <= 0.03, mod_pokemon: 0.1, mod_trainer: 3 },
    { order: 2, name: "A", value: 0.07, when: (v) => v > 0.03 && v <= 0.1, mod_pokemon: 0.25, mod_trainer: 2 },
    { order: 3, name: "B", value: 0.1, when: (v) => v > 0.1 && v <= 0.2, mod_pokemon: 0.5, mod_trainer: 1.5 },
    { order: 4, name: "C", value: 0.2, when: (v) => v > 0.2 && v <= 0.4, mod_pokemon: 0.8, mod_trainer: 1.25 },
    { order: 5, name: "D", value: 0.25, when: (v) => v > 0.4 && v <= 0.65, mod_pokemon: 1, mod_trainer: 1 },
    { order: 6, name: "E", value: 0.225, when: (v) => v > 0.65 && v <= 0.875, mod_pokemon: 1.25, mod_trainer: 0.8 },
    { order: 7, name: "F", value: 0.125, when: (v) => v > 0.875, mod_pokemon: 1.5, mod_trainer: 0.5 },
];
