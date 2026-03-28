export type Attributes = {
    hp: number;
    attack: number;
    defense: number;
    sp_attack: number;
    sp_defense: number;
    speed: number;
};

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function generateAttribute(base: number): number {
    const roll = Math.random();
    if (roll < 0.70) return base * randomBetween(0.80, 1.25);
    if (roll < 0.90) return base * randomBetween(1.25, 1.40);
    if (roll < 0.95) return base * randomBetween(1.40, 1.65);
    if (roll < 0.99) return base * randomBetween(1.75, 2.00);
    return base * 3;
}

const STAT_KEY_MAP: Record<string, keyof Attributes> = {
    "special-attack": "sp_attack",
    "special-defense": "sp_defense",
    "hp": "hp",
    "attack": "attack",
    "defense": "defense",
    "speed": "speed",
};

export function generateAttributes(
    stats: { stat: { name: string }; base_stat: number }[],
): Attributes {
    const attrs = {} as Attributes;
    for (const s of stats) {
        const key = STAT_KEY_MAP[s.stat.name] ?? (s.stat.name as keyof Attributes);
        attrs[key] = generateAttribute(s.base_stat);
    }
    return attrs;
}
