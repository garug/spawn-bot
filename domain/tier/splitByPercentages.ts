function isDefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

export function splitByPercentages<T>(list: T[], percentages: number[]): T[][] {
    if (list.length === 0) return [];
    if (percentages.length === 0) return [list];

    if (list.length < percentages.length) {
        return percentages
            .map((_, i) => (i < list.length ? [list[i]] : undefined))
            .filter(isDefined);
    }

    const chunks = percentages.map((p) => Math.max(1, Math.round(list.length * p)));

    let total = chunks.reduce((a, b) => a + b, 0);

    let pointer = 0;
    while (total > list.length) {
        if (chunks[pointer] > 1) {
            chunks[pointer]--;
            total--;
        }
        pointer = (pointer + 1) % chunks.length;
    }

    const out: T[][] = [];
    let idx = 0;
    for (const size of chunks) out.push(list.slice(idx, (idx += size)));
    return out;
}
