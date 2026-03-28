import { catchPokemon } from "@domain/catch/catch.ts";
import type { SpawnRepository } from "@domain/spawn/ports/repository.ts";
import type { CatchRepository } from "@domain/catch/ports/catchRepository.ts";

type Deps = {
    spawnRepository: SpawnRepository;
    catchRepository: CatchRepository;
};

export async function handleCatch(
    userId: string,
    guess: string,
    deps: Deps,
): Promise<{ description: string }> {
    const result = await catchPokemon(userId, guess, deps);

    switch (result.status) {
        case "no_spawn":
            return { description: "There is no wild pokemon right now." };

        case "missed":
            return { description: "That's not the right pokemon name!" };

        case "caught": {
            const shinyMark = result.shiny ? "✨ " : "";
            return {
                description: `<@${userId}> caught a ${shinyMark}**${result.pokemon}**! Class **${result.tier}**!`,
            };
        }
    }
}
