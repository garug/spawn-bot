export type ActiveData = {
    name: string,
    form?: string,
    id: number,
    shiny: boolean,
    chance: number,
    image: string,
    stats: {
        stat: { name: string },
        base_stat: number
    }[]
}

export type ActiveSpawn = {
    date: Temporal.Instant,
    value?: ActiveData,
    prev?: ActiveData
}
