export function weightedRandom<T extends { chance: number }>(items: T[], random: () => number): T {
    const total = items.reduce((acc, item) => acc + item.chance, 0);
    const target = random() * total;

    let current = 0;
    for (const item of items) {
        current += item.chance;
        if (target <= current) return item;
    }

    return items[items.length - 1]!;
}