interface InfoSorted<T> {
    sorted: T;
    chance: number;
    total: number;
}

export function infoSort<T>(
    possibilities: T[],
    mapToPossibility: (item: T) => number = () => 1,
): InfoSorted<T> {
    let total = 0;

    const cumulative = possibilities
        .map(mapToPossibility)
        .map((n) => {
            total += n;
            return total;
        });

    const roll = Math.floor(Math.random() * total) + 1;
    const index = cumulative.findIndex((n) => n >= roll);
    const sorted = possibilities[index];

    const sortedChance = possibilities
        .filter((e) => JSON.stringify(e) === JSON.stringify(sorted))
        .map(mapToPossibility)
        .reduce((acc, e) => acc + e, 0);

    return { sorted, chance: sortedChance / total, total };
}

export function sort<T>(
    possibilities: T[],
    mapToPossibility: (item: T) => number = () => 1,
): T {
    return infoSort(possibilities, mapToPossibility).sorted;
}
