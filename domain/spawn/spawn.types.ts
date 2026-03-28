export type ActiveData = {
    name: string,
    form?: string,
    id: number,
    shiny: boolean,
    chance: number,
    stats: {
        name: string,
        value: number
    }[]
}

export type ActiveSpawn = {
    date: Temporal.Instant,
    value?: ActiveData,
    prev?: ActiveData
}
