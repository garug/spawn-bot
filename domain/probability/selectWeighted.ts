interface WeightedSelection<T> {
    selected: T;
    chance: number;
    total: number;
}

export function selectWeighted<T, K>(
    possibilities: T[],
    getKey: (param: T) => K = (param) => param as unknown as K,
    getWeight: (param: T) => number = () => 1,
): WeightedSelection<T> {
    if (possibilities.length === 0) {
        throw new Error("selectWeighted requires at least one possibility");
    }

    let total = 0;

    const cumulative = possibilities.map((item) => {
        total += getWeight(item);
        return total;
    });

    const randomizedNumber = Math.random() * total;

    const index = cumulative.findIndex((value) => randomizedNumber < value);

    const selected =
        possibilities[index === -1 ? possibilities.length - 1 : index];

    const key = getKey(selected);

    const chance =
        possibilities
            .filter((item) => getKey(item) === key)
            .map(getWeight)
            .reduce((acc, value) => acc + value, 0) / total;

    return {
        selected,
        chance,
        total,
    };
}