import { pokemonRepository } from "@config/container.ts";

export async function handleDex(userId: string) {
    const repo = pokemonRepository();

    const [page, uniquePokemon] = await Promise.all([
        repo.find(
            { userId },
            { page: 1, size: 6 }
        ),
        repo.uniquePokemon(userId),
    ]);

    const strongestNames = page.content.map((p) => p.name);

    return {
        uniquePokemon,
        strongestNames,
    }
}
